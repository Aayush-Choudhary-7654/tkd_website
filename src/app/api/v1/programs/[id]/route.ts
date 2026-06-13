import { requireAdminRequest } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";
import { deleteDocument, updateDocument } from "@/lib/repository";
import { programSchema, readJson } from "@/lib/validation";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const payload = await readJson(request, programSchema);
    const program = await updateDocument("programs", id, {
      ...payload,
      updatedAt: new Date()
    });
    return jsonOk({ program });
  } catch (error) {
    return jsonError(error, "Could not update program.");
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
    return jsonOk({ deleted: await deleteDocument("programs", id) });
  } catch (error) {
    return jsonError(error, "Could not delete program.");
  }
}
