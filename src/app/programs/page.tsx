import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { SectionHeading } from "@/components/section-heading";
import { getPublicContent, getSiteContent } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function ProgramsPage() {
  const [site, { programs }] = await Promise.all([getSiteContent(), getPublicContent()]);

  return (
    <PublicShell site={site}>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">{site.programsHeroEyebrow}</p>
          <h1>{site.programsHeroTitle}</h1>
          <p>{site.programsHeroBody}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading title={site.programsSectionTitle}>
            {site.programsSectionBody}
          </SectionHeading>
          {programs.length ? (
            <div className="grid grid-2">
              {programs.map((program) => (
                <article className="program-card" key={program.id}>
                  <img className="media" src={program.image} alt="" />
                  <div className="program-body">
                    <h3>{program.name}</h3>
                    <p>{program.description}</p>
                    <div className="meta-list">
                      <span className="pill">{program.ageGroup}</span>
                      <span className="pill">{program.schedule}</span>
                      {program.fees ? <span className="pill">{program.fees}</span> : null}
                    </div>
                    <div className="hero-actions">
                      <Link className="button" href="/join">
                        {site.primaryCtaLabel}
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">Programs will appear here after admin setup.</div>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
