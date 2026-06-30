import { requireAdminRequest } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";
import { sendEmailLeadNotification } from "@/lib/email";
import { getStudents, insertDocument } from "@/lib/repository";
import { rateLimit, requireJsonRequest, requireSameOrigin } from "@/lib/security";
import { readJson, studentSchema } from "@/lib/validation";
import { sendWhatsAppLeadNotification } from "@/lib/whatsapp";

export async function GET(request: Request) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  return jsonOk({ students: await getStudents() });
}

export async function POST(request: Request) {
  const originError = requireSameOrigin(request);
  if (originError) return originError;

  const contentTypeError = requireJsonRequest(request);
  if (contentTypeError) return contentTypeError;

  const limited = rateLimit(request, {
    key: "student-registration",
    limit: 8,
    windowMs: 10 * 60 * 1000
  });
  if (limited) return limited;

  try {
    const payload = await readJson(request, studentSchema);
    const student = await insertDocument("students", {
      ...payload,
      parentName: payload.parentName || "",
      createdAt: new Date()
    });
    await Promise.all([
      sendWhatsAppLeadNotification({
        type: "New student booking",
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        age: payload.age,
        program: payload.program,
        level: payload.level,
        message: payload.parentName ? `Parent/guardian: ${payload.parentName}` : undefined
      }),
      sendEmailLeadNotification({
        type: "New student joining",
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        age: payload.age,
        program: payload.program,
        level: payload.level,
        message: payload.parentName ? `Parent/guardian: ${payload.parentName}` : undefined
      })
    ]);
    return jsonOk({ student }, { status: 201 });
  } catch (error) {
    return jsonError(error, "Could not register student.");
  }
}
