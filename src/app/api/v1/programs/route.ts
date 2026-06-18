import { jsonError, jsonOk } from "@/lib/api";
import { insertDocument, listDocuments } from "@/lib/repository";
import { requireSecureAdminJsonMutation } from "@/lib/security";
import { defaultPrograms } from "@/lib/seed-data";
import type { Program } from "@/lib/types";
import { programSchema, readJson } from "@/lib/validation";

export async function GET() {
  const programs = await listDocuments<Program>("programs", {
    fallback: defaultPrograms,
    sort: { name: 1 }
  });
  return jsonOk({ programs });
}

export async function POST(request: Request) {
  const unauthorized = await requireSecureAdminJsonMutation(request, "admin-programs");
  if (unauthorized) return unauthorized;

  try {
    const payload = await readJson(request, programSchema);
    const program = await insertDocument("programs", {
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return jsonOk({ program }, { status: 201 });
  } catch (error) {
    return jsonError(error, "Could not create program.");
  }
}
