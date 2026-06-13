import { requireAdminRequest } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";
import { deleteDocument, updateDocument } from "@/lib/repository";
import { achievementSchema, readJson } from "@/lib/validation";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const payload = await readJson(request, achievementSchema);
    const achievement = await updateDocument("achievements", id, {
      ...payload,
      date: new Date(payload.date),
      updatedAt: new Date()
    });
    return jsonOk({ achievement });
  } catch (error) {
    return jsonError(error, "Could not update achievement.");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    return jsonOk({ deleted: await deleteDocument("achievements", id) });
  } catch (error) {
    return jsonError(error, "Could not delete achievement.");
  }
}
