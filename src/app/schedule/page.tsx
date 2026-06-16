import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { SectionHeading } from "@/components/section-heading";
import { getPublicContent, getSiteContent } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const [site, { schedule }] = await Promise.all([getSiteContent(), getPublicContent()]);

  return (
    <PublicShell site={site}>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">{site.scheduleHeroEyebrow}</p>
          <h1>{site.scheduleHeroTitle}</h1>
          <p>{site.scheduleHeroBody}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading title={site.scheduleSectionTitle}>
            {site.scheduleSectionBody}
          </SectionHeading>
          <div className="schedule-table">
            {schedule.map((item) => (
              <div className="schedule-row" key={item.id}>
                <strong>{item.day}</strong>
                <span>{item.time}</span>
                <span>{item.program}</span>
              </div>
            ))}
            {!schedule.length ? (
              <div className="empty-state">Schedule rows will appear here after admin setup.</div>
            ) : null}
          </div>
          <div className="hero-actions">
            <Link className="button" href="/contact#free-trial">
              {site.secondaryCtaLabel}
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
