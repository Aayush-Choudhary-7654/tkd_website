import { jsonError, jsonOk } from "@/lib/api";
import { deleteDocument, updateDocument } from "@/lib/repository";
import { requireSecureAdminJsonMutation, requireSecureAdminMutation } from "@/lib/security";
import { gallerySchema, readJson } from "@/lib/validation";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireSecureAdminJsonMutation(request, "admin-gallery");
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const payload = await readJson(request, gallerySchema);
    const galleryItem = await updateDocument("gallery", id, {
      ...payload,
      updatedAt: new Date()
    });
    return jsonOk({ galleryItem });
  } catch (error) {
    return jsonError(error, "Could not update gallery item.");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireSecureAdminMutation(request, "admin-gallery");
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    return jsonOk({ deleted: await deleteDocument("gallery", id) });
  } catch (error) {
    return jsonError(error, "Could not delete gallery item.");
  }
}
