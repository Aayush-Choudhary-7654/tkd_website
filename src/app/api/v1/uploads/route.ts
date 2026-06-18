import { getDb } from "@/lib/mongodb";
import { jsonOk } from "@/lib/api";
import { requireSecureAdminMutation } from "@/lib/security";
import { GridFSBucket } from "mongodb";
import { Buffer } from "buffer";

const maxBytes = 50 * 1024 * 1024;
const allowedTypes = new Set([
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "video/webm"
]);

function hasValidSignature(bytes: Buffer, contentType: string) {
  if (contentType === "image/png") {
    return bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }

  if (contentType === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (contentType === "image/gif") {
    const signature = bytes.subarray(0, 6).toString("ascii");
    return signature === "GIF87a" || signature === "GIF89a";
  }

  if (contentType === "image/webp") {
    return bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  }

  if (contentType === "video/mp4" || contentType === "video/quicktime") {
    return bytes.length > 12 && bytes.subarray(4, 8).toString("ascii") === "ftyp";
  }

  if (contentType === "video/webm") {
    return bytes.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]));
  }

  return false;
}

async function uploadToGridFs(file: File, bytes: Buffer) {
  const db = await getDb();
  const bucket = new GridFSBucket(db, { bucketName: "uploads" });

  return new Promise<string>((resolve, reject) => {
    const upload = bucket.openUploadStream(file.name || "upload", {
      metadata: {
        contentType: file.type,
        originalName: file.name || "upload",
        size: file.size,
        uploadedAt: new Date()
      }
    });

    upload.on("error", reject);
    upload.on("finish", () => resolve(upload.id.toString()));
    upload.end(bytes);
  });
}

export async function POST(request: Request) {
  const unauthorized = await requireSecureAdminMutation(request, "admin-upload");
  if (unauthorized) return unauthorized;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return Response.json({ error: "Photo or video file is required." }, { status: 400 });
    }

    if (!allowedTypes.has(file.type)) {
      return Response.json(
        { error: "Only PNG, JPG, WebP, GIF, MP4, MOV, and WebM files are allowed." },
        { status: 400 }
      );
    }

    if (file.size > maxBytes) {
      return Response.json({ error: "File must be 50MB or smaller." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    if (!hasValidSignature(bytes, file.type)) {
      return Response.json(
        { error: "File content does not match the selected media type." },
        { status: 400 }
      );
    }

    const id = await uploadToGridFs(file, bytes);
    const kind = file.type.startsWith("video/") ? "video" : "image";

    return jsonOk(
      {
        id,
        url: `/api/v1/uploads/${id}?kind=${kind}`,
        contentType: file.type,
        kind
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      { error: `Could not upload file to MongoDB. ${message}` },
      { status: 503 }
    );
  }
}
