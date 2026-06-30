import { StudentRegistrationForm } from "@/components/forms";
import { PublicShell } from "@/components/public-shell";
import { SectionHeading } from "@/components/section-heading";
import { getPublicContent, getSiteContent } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function JoinPage() {
  const [site, { programs }] = await Promise.all([getSiteContent(), getPublicContent()]);

  return (
    <PublicShell site={site}>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">{site.joinHeroEyebrow}</p>
          <h1>{site.joinHeroTitle}</h1>
          <p>{site.joinHeroBody}</p>
          <div className="hero-actions">
            <a className="button" href="#registration">
              {site.studentSubmitLabel}
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="registration">
        <div className="container grid grid-2">
          <div>
            <SectionHeading title={site.joinSectionTitle}>
              {site.joinSectionBody}
            </SectionHeading>
            <div className="page-card">
              <h3>{site.joinInfoTitle}</h3>
              <p>{site.joinInfoBody}</p>
            </div>
          </div>
          <StudentRegistrationForm programs={programs} submitLabel={site.studentSubmitLabel} />
        </div>
      </section>
    </PublicShell>
  );
}
