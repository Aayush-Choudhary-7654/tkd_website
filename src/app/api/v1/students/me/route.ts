import { requireStudentRequest } from "@/lib/auth";
import { jsonOk } from "@/lib/api";
import { getStudentById, getStudentFeePayments } from "@/lib/repository";

export async function GET(request: Request) {
  const auth = await requireStudentRequest(request);
  if (auth.response) return auth.response;

  const student = await getStudentById(auth.session.studentId);
  if (!student) {
    return Response.json({ error: "Student record was not found." }, { status: 404 });
  }

  const feePayments = await getStudentFeePayments(student.id);
  return jsonOk({ student, feePayments });
}
