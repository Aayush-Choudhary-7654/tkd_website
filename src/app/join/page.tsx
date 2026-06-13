import { StudentRegistrationForm } from "@/components/forms";
import { PublicShell } from "@/components/public-shell";
import { SectionHeading } from "@/components/section-heading";
import { getPublicContent } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function JoinPage() {
  const { programs } = await getPublicContent();

  return (
    <PublicShell>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Join Now</p>
          <h1>Register for training</h1>
          <p>
            Submit student details and the academy team will contact you to confirm
            class timing, program fit, and next steps.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2">
          <div>
            <SectionHeading title="Student registration">
              This creates a real student lead in the backend for the admin team.
            </SectionHeading>
            <div className="page-card" style={{ padding: 24 }}>
              <h3>Before your first class</h3>
              <p>
                Wear comfortable sports clothing, carry water, and arrive a little
                early so the coach can understand your level.
              </p>
            </div>
          </div>
          <StudentRegistrationForm programs={programs} />
        </div>
      </section>
    </PublicShell>
  );
}
