import Link from "next/link";
import {
  Award,
  Dumbbell,
  Medal,
  ShieldCheck,
  Sparkles,
  Trophy
} from "lucide-react";
import { ContactForm } from "@/components/forms";
import { PublicShell } from "@/components/public-shell";
import { SectionHeading } from "@/components/section-heading";
import { getPublicContent } from "@/lib/repository";

export const dynamic = "force-dynamic";

const features = [
  {
    icon: ShieldCheck,
    title: "Certified Coaches",
    text: "Structured classes led with safety, discipline, and student progression in mind."
  },
  {
    icon: Dumbbell,
    title: "Professional Training",
    text: "Technical drills, flexibility, stamina, and sparring practice for real improvement."
  },
  {
    icon: Trophy,
    title: "Competition Preparation",
    text: "Focused coaching for tournament rules, poomsae, scoring, and match confidence."
  },
  {
    icon: Sparkles,
    title: "Fitness & Discipline",
    text: "A positive routine that builds respect, resilience, coordination, and strength."
  }
];

export default async function HomePage() {
  const { programs, schedule, gallery, achievements } = await getPublicContent();

  return (
    <PublicShell>
      <section className="hero">
        <div className="container hero-content">
          <p className="eyebrow">
            <Medal size={18} /> Active Taekwondo Academy
          </p>
          <h1>Train Like a Champion</h1>
          <p>
            Build discipline, strength, focus, and respect through modern Taekwondo
            training for kids, beginners, advanced students, and competitors.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/join">
              Join Now
            </Link>
            <Link className="ghost-button" href="/contact#free-trial">
              Book Free Trial
            </Link>
          </div>
        </div>
      </section>

      <div className="container stat-strip" aria-label="Academy highlights">
        <div className="stat">
          <strong>4</strong>
          <span>Focused training programs</span>
        </div>
        <div className="stat">
          <strong>6</strong>
          <span>Class days every week</span>
        </div>
        <div className="stat">
          <strong>100%</strong>
          <span>Discipline-led coaching</span>
        </div>
      </div>

      <section className="section" id="why">
        <div className="container">
          <SectionHeading eyebrow="Why Choose Us" title="Train with purpose">
            Students learn more than kicks. Every class reinforces focus, confidence,
            athletic ability, and respect.
          </SectionHeading>
          <div className="grid grid-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article className="feature-card" key={feature.title}>
                  <div className="feature-icon">
                    <Icon size={25} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <SectionHeading eyebrow="Programs" title="Choose your path">
            From first class to competition readiness, each program has a clear training
            rhythm and progression.
          </SectionHeading>
          {programs.length ? (
            <div className="grid grid-4">
              {programs.slice(0, 4).map((program) => (
                <article className="program-card" key={program.id}>
                  <img className="media" src={program.image} alt="" />
                  <div className="program-body">
                    <h3>{program.name}</h3>
                    <p>{program.description}</p>
                    <div className="meta-list">
                      <span className="pill">{program.ageGroup}</span>
                      <span className="pill">{program.schedule}</span>
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

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Schedule" title="Weekly training rhythm">
            Pick a class time that fits your routine, then start with a trial session.
          </SectionHeading>
          <div className="schedule-table">
            {schedule.slice(0, 6).map((item) => (
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
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <SectionHeading eyebrow="Achievements" title="Progress worth celebrating">
            Belt promotions, competitions, and academy milestones keep students motivated.
          </SectionHeading>
          {achievements.length ? (
            <div className="grid grid-3">
              {achievements.slice(0, 3).map((achievement) => (
                <article className="achievement-card" key={achievement.id}>
                  <img className="media" src={achievement.image} alt="" />
                  <div className="achievement-body">
                    <h3>{achievement.title}</h3>
                    <p>{achievement.description}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">Achievements will appear here after admin setup.</div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Gallery" title="Inside the academy">
            A look at training energy, events, and competition preparation.
          </SectionHeading>
          {gallery.length ? (
            <div className="gallery-grid">
              {gallery.slice(0, 5).map((item) => (
                <figure className="gallery-tile" key={item.id}>
                  <img src={item.imageUrl} alt="" />
                  <figcaption className="gallery-label">{item.category}</figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="empty-state">Gallery images will appear here after admin setup.</div>
          )}
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <p className="eyebrow">
            <Award size={18} /> Start Today
          </p>
          <h2>Start Your Taekwondo Journey Today</h2>
          <p>
            Register for a program or book a free trial class and let the academy
            team guide the next step.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/join">
              Join Now
            </Link>
            <Link className="ghost-button" href="/contact#free-trial">
              Book Free Trial
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2">
          <div>
            <SectionHeading eyebrow="Free Trial" title="Visit the mat">
              Share your details and the team will help you choose the right class.
            </SectionHeading>
          </div>
          <ContactForm compact />
        </div>
      </section>
    </PublicShell>
  );
}
