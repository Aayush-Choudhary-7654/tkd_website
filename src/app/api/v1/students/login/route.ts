import { createStudentToken, studentCookie } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";
import { getStudentByLogin } from "@/lib/repository";
import { rateLimit, requireJsonRequest, requireSameOrigin } from "@/lib/security";
import { readJson, studentLoginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const originError = requireSameOrigin(request);
  if (originError) return originError;

  const contentTypeError = requireJsonRequest(request);
  if (contentTypeError) return contentTypeError;

  const limited = rateLimit(request, {
    key: "student-login",
    limit: 12,
    windowMs: 10 * 60 * 1000
  });
  if (limited) return limited;

  try {
    const payload = await readJson(request, studentLoginSchema);
    const student = await getStudentByLogin(payload.email, payload.phone);

    if (!student) {
      return Response.json({ error: "No student registration matched those details." }, { status: 401 });
    }

    const token = await createStudentToken(student.id, student.email);
    return jsonOk(
      {
        student: {
          id: student.id,
          name: student.name,
          email: student.email,
          program: student.program,
          profilePhotoUrl: student.profilePhotoUrl || ""
        }
      },
      {
        headers: {
          "Set-Cookie": studentCookie(token, 60 * 60 * 24 * 7)
        }
      }
    );
  } catch (error) {
    return jsonError(error, "Could not log in student.");
  }
}
