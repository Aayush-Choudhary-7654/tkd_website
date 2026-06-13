import { requireAdminRequest } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";
import { getStudents, insertDocument } from "@/lib/repository";
import { readJson, studentSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  return jsonOk({ students: await getStudents() });
}

export async function POST(request: Request) {
  try {
    const payload = await readJson(request, studentSchema);
    const student = await insertDocument("students", {
      ...payload,
      parentName: payload.parentName || "",
      createdAt: new Date()
    });
    return jsonOk({ student }, { status: 201 });
  } catch (error) {
    return jsonError(error, "Could not register student.");
  }
}
