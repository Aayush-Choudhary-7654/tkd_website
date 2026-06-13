import { requireAdminRequest } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";
import { deleteDocument, updateDocument } from "@/lib/repository";
import { readJson, scheduleSchema } from "@/lib/validation";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const payload = await readJson(request, scheduleSchema);
    const scheduleItem = await updateDocument("schedule", id, {
      ...payload,
      updatedAt: new Date()
    });
    return jsonOk({ scheduleItem });
  } catch (error) {
    return jsonError(error, "Could not update schedule item.");
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
    return jsonOk({ deleted: await deleteDocument("schedule", id) });
  } catch (error) {
    return jsonError(error, "Could not delete schedule item.");
  }
}
