import { Buffer } from "buffer";
import { requireStudentRequest } from "@/lib/auth";
import { jsonOk } from "@/lib/api";
import { getStudentById, updateStudentProfilePhoto } from "@/lib/repository";
import { requireSameOrigin, rateLimit } from "@/lib/security";
import { allowedImageTypes, hasValidImageSignature, uploadImageToGridFs } from "@/lib/upload-media";

const maxBytes = 8 * 1024 * 1024;

export async function POST(request: Request) {
  const originError = requireSameOrigin(request);
  if (originError) return originError;

  const limited = rateLimit(request, {
    key: "student-photo",
    limit: 20,
    windowMs: 10 * 60 * 1000
  });
  if (limited) return limited;

  const auth = await requireStudentRequest(request);
  if (auth.response) return auth.response;

  try {
    const student = await getStudentById(auth.session.studentId);
    if (!student) {
      return Response.json({ error: "Student record was not found." }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return Response.json({ error: "Photo file is required." }, { status: 400 });
    }

    if (!allowedImageTypes.has(file.type)) {
      return Response.json({ error: "Only PNG, JPG, WebP, and GIF photos are allowed." }, { status: 400 });
    }

    if (file.size > maxBytes) {
      return Response.json({ error: "Photo must be 8MB or smaller." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    if (!hasValidImageSignature(bytes, file.type)) {
      return Response.json({ error: "Photo content does not match the selected file type." }, { status: 400 });
    }

    const id = await uploadImageToGridFs(file, bytes, {
      ownerType: "student",
      studentId: student.id
    });
    const profilePhotoUrl = `/api/v1/uploads/${id}?kind=image`;
    const updatedStudent = await updateStudentProfilePhoto(student.id, profilePhotoUrl);

    return jsonOk({ student: updatedStudent, url: profilePhotoUrl }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ error: `Could not upload student photo. ${message}` }, { status: 503 });
  }
}
