import { requireAdminRequest } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";
import { updateStudentProfilePhoto } from "@/lib/repository";
import { requireJsonRequest, requireSameOrigin } from "@/lib/security";
import { readJson, studentAdminUpdateSchema } from "@/lib/validation";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  const originError = requireSameOrigin(request);
  if (originError) return originError;

  const contentTypeError = requireJsonRequest(request);
  if (contentTypeError) return contentTypeError;

  try {
    const { id } = await params;
    const payload = await readJson(request, studentAdminUpdateSchema);
    const student = await updateStudentProfilePhoto(id, payload.profilePhotoUrl || "");

    if (!student) {
      return Response.json({ error: "Student was not found." }, { status: 404 });
    }

    return jsonOk({ student });
  } catch (error) {
    return jsonError(error, "Could not update student.");
  }
}
