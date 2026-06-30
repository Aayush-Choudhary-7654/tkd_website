import { requireStudentRequest } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";
import { createStudentFeePayment, getStudentById, getStudentFeePayments } from "@/lib/repository";
import { rateLimit, requireJsonRequest, requireSameOrigin } from "@/lib/security";
import { readJson, studentFeePaymentSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const auth = await requireStudentRequest(request);
  if (auth.response) return auth.response;

  return jsonOk({ feePayments: await getStudentFeePayments(auth.session.studentId) });
}

export async function POST(request: Request) {
  const originError = requireSameOrigin(request);
  if (originError) return originError;

  const contentTypeError = requireJsonRequest(request);
  if (contentTypeError) return contentTypeError;

  const limited = rateLimit(request, {
    key: "student-fees",
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

    const payload = await readJson(request, studentFeePaymentSchema);
    const feePayment = await createStudentFeePayment({
      studentId: student.id,
      studentName: student.name,
      method: payload.method,
      amount: payload.amount,
      note: payload.note
    });

    return jsonOk(
      {
        feePayment,
        message: "Payment option saved. Gateway connection will be configured next."
      },
      { status: 201 }
    );
  } catch (error) {
    return jsonError(error, "Could not save fee payment option.");
  }
}
