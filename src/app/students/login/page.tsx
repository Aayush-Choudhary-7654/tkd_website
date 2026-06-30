import { StudentLoginForm } from "@/components/student-login-form";
import { PublicShell } from "@/components/public-shell";
import { getSiteContent } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function StudentLoginPage() {
  const site = await getSiteContent();

  return (
    <PublicShell site={site}>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Student Portal</p>
          <h1>Student Login</h1>
          <p>Log in with your registered email and phone number to manage photos and fee options.</p>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2">
          <StudentLoginForm />
          <div className="page-card">
            <h3>Need access?</h3>
            <p>
              Use the same email and phone number submitted during student registration. If your
              details are not matching, contact the academy team to update your record.
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
