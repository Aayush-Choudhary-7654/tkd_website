import { requireAdminRequest } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";
import { sendEmailLeadNotification } from "@/lib/email";
import { getContacts, insertDocument } from "@/lib/repository";
import { rateLimit, requireJsonRequest, requireSameOrigin } from "@/lib/security";
import { contactSchema, readJson } from "@/lib/validation";
import { sendWhatsAppLeadNotification } from "@/lib/whatsapp";

export async function GET(request: Request) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  return jsonOk({ contacts: await getContacts() });
}

export async function POST(request: Request) {
  const originError = requireSameOrigin(request);
  if (originError) return originError;

  const contentTypeError = requireJsonRequest(request);
  if (contentTypeError) return contentTypeError;

  const limited = rateLimit(request, {
    key: "contact-inquiry",
    limit: 10,
    windowMs: 10 * 60 * 1000
  });
  if (limited) return limited;

  try {
    const payload = await readJson(request, contactSchema);
    const contact = await insertDocument("contacts", {
      ...payload,
      createdAt: new Date()
    });
    const emailType = /trial/i.test(payload.message) ? "New free trial" : "New inquiry";
    await Promise.all([
      sendWhatsAppLeadNotification({
        type: "New inquiry",
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        message: payload.message
      }),
      sendEmailLeadNotification({
        type: emailType,
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        message: payload.message
      })
    ]);
    return jsonOk({ contact }, { status: 201 });
  } catch (error) {
    return jsonError(error, "Could not submit inquiry.");
  }
}
