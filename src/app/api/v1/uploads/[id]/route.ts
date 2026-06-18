import { GridFSBucket, ObjectId } from "mongodb";
import { Readable } from "stream";
import { getDb } from "@/lib/mongodb";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid upload id." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const objectId = new ObjectId(id);
    const file = await db.collection("uploads.files").findOne({ _id: objectId });

    if (!file) {
      return Response.json({ error: "Upload not found." }, { status: 404 });
    }

    const bucket = new GridFSBucket(db, { bucketName: "uploads" });
    const stream = Readable.toWeb(bucket.openDownloadStream(objectId)) as ReadableStream;
    const contentType =
      typeof file.contentType === "string"
        ? file.contentType
        : typeof file.metadata?.contentType === "string"
          ? file.metadata.contentType
          : "application/octet-stream";

    return new Response(stream, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(file.length || ""),
        "Content-Type": contentType
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      { error: `Could not read upload from MongoDB. ${message}` },
      { status: 503 }
    );
  }
}
