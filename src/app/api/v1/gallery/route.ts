import { jsonError, jsonOk } from "@/lib/api";
import { insertDocument, listDocuments } from "@/lib/repository";
import { requireSecureAdminJsonMutation } from "@/lib/security";
import { defaultGallery } from "@/lib/seed-data";
import type { GalleryItem } from "@/lib/types";
import { gallerySchema, readJson } from "@/lib/validation";

export async function GET() {
  const gallery = await listDocuments<GalleryItem>("gallery", {
    fallback: defaultGallery,
    sort: { createdAt: -1 }
  });
  return jsonOk({ gallery });
}

export async function POST(request: Request) {
  const unauthorized = await requireSecureAdminJsonMutation(request, "admin-gallery");
  if (unauthorized) return unauthorized;

  try {
    const payload = await readJson(request, gallerySchema);
    const galleryItem = await insertDocument("gallery", {
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return jsonOk({ galleryItem }, { status: 201 });
  } catch (error) {
    return jsonError(error, "Could not create gallery item.");
  }
}
