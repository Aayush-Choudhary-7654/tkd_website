import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { SectionHeading } from "@/components/section-heading";
import { getPublicContent } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const { schedule } = await getPublicContent();

  return (
    <PublicShell>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Schedule</p>
          <h1>Find your class time</h1>
          <p>
            Training runs across the week for kids, beginners, advanced students, and
            competition-focused athletes.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading title="Weekly class schedule">
            Class availability can change during events or tournaments, so contact
            the academy before your first visit.
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
              Book Free Trial
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
