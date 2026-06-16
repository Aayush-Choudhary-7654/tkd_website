import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid image id." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const image = await db.collection("uploads").findOne({ _id: new ObjectId(id) });

    if (!image) {
      return Response.json({ error: "Image not found." }, { status: 404 });
    }

    const bytes = image.data?.buffer;
    if (!bytes) {
      return Response.json({ error: "Image data is missing." }, { status: 404 });
    }

    return new Response(bytes, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(image.size || bytes.length),
        "Content-Type": image.contentType || "application/octet-stream"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ error: `Could not read image from MongoDB. ${message}` }, { status: 503 });
  }
}
