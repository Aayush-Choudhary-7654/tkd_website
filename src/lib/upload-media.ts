import { Buffer } from "buffer";
import { GridFSBucket } from "mongodb";
import { getDb } from "./mongodb";

export const allowedImageTypes = new Set(["image/gif", "image/jpeg", "image/png", "image/webp"]);

export function hasValidImageSignature(bytes: Buffer, contentType: string) {
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

  return false;
}

export async function uploadImageToGridFs(file: File, bytes: Buffer, metadata = {}) {
  const db = await getDb();
  const bucket = new GridFSBucket(db, { bucketName: "uploads" });

  return new Promise<string>((resolve, reject) => {
    const upload = bucket.openUploadStream(file.name || "student-photo", {
      metadata: {
        contentType: file.type,
        originalName: file.name || "student-photo",
        size: file.size,
        uploadedAt: new Date(),
        ...metadata
      }
    });

    upload.on("error", reject);
    upload.on("finish", () => resolve(upload.id.toString()));
    upload.end(bytes);
  });
}
