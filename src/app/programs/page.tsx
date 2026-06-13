import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { SectionHeading } from "@/components/section-heading";
import { getPublicContent } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function ProgramsPage() {
  const { programs } = await getPublicContent();

  return (
    <PublicShell>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Programs</p>
          <h1>Training for every level</h1>
          <p>
            Choose the right path for your age, ability, and goals. The academy can
            recommend a class after your first conversation or trial.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading title="Available programs">
            All program details are managed from the admin dashboard.
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
                        Join Now
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
