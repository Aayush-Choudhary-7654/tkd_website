import { requireAdminRequest } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";
import { getContacts, insertDocument } from "@/lib/repository";
import { contactSchema, readJson } from "@/lib/validation";

export async function GET(request: Request) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  return jsonOk({ contacts: await getContacts() });
}

export async function POST(request: Request) {
  try {
    const payload = await readJson(request, contactSchema);
    const contact = await insertDocument("contacts", {
      ...payload,
      createdAt: new Date()
    });
    return jsonOk({ contact }, { status: 201 });
  } catch (error) {
    return jsonError(error, "Could not submit inquiry.");
  }
}
