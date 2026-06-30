import { redirect } from "next/navigation";
import { StudentDashboard } from "@/components/student-dashboard";
import { PublicShell } from "@/components/public-shell";
import { requireStudentPage } from "@/lib/auth";
import { getSiteContent, getStudentById, getStudentFeePayments } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const session = await requireStudentPage();
  const [site, student] = await Promise.all([
    getSiteContent(),
    getStudentById(session.studentId)
  ]);

  if (!student) {
    redirect("/students/login");
  }

  const feePayments = await getStudentFeePayments(student.id);

  return (
    <PublicShell site={site}>
      <section className="section">
        <StudentDashboard initialStudent={student} initialFeePayments={feePayments} />
      </section>
    </PublicShell>
  );
}
