import { requireAdminRequest } from "@/lib/auth";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { jsonOk } from "@/lib/api";

const maxBytes = 5 * 1024 * 1024;
const allowedTypes = new Set(["image/gif", "image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return Response.json({ error: "Image file is required." }, { status: 400 });
    }

    if (!allowedTypes.has(file.type)) {
      return Response.json({ error: "Only PNG, JPG, WebP, and GIF images are allowed." }, { status: 400 });
    }

    if (file.size > maxBytes) {
      return Response.json({ error: "Image must be 5MB or smaller." }, { status: 400 });
    }

    const uploaded = await uploadImageToCloudinary(file);

    return jsonOk(uploaded, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      { error: `Could not upload image to Cloudinary. ${message}` },
      { status: 503 }
    );
  }
}
