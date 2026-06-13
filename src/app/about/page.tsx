import { Award, HeartHandshake, Shield, Target } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { SectionHeading } from "@/components/section-heading";

const values = [
  {
    icon: Shield,
    title: "Discipline",
    text: "Students train with clear expectations, respectful routines, and steady progression."
  },
  {
    icon: Target,
    title: "Technique",
    text: "Classes focus on clean fundamentals, safe movement, speed, and controlled power."
  },
  {
    icon: HeartHandshake,
    title: "Respect",
    text: "Every session reinforces confidence, humility, teamwork, and responsibility."
  },
  {
    icon: Award,
    title: "Achievement",
    text: "The academy supports belt goals, demonstrations, competition preparation, and fitness."
  }
];

export default function AboutPage() {
  return (
    <PublicShell>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">About Active Taekwondo</p>
          <h1>Built for disciplined growth</h1>
          <p>
            ACTIVE TAEKWONDO helps students build strength, focus, flexibility,
            self-control, and confidence through structured martial arts training.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2">
          <div>
            <SectionHeading eyebrow="Academy" title="More than a workout">
              Taekwondo gives students a complete training environment: movement,
              mindset, respect, goal-setting, and the confidence to keep improving.
            </SectionHeading>
          </div>
          <img
            className="media"
            src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1200&q=80"
            alt=""
          />
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <SectionHeading eyebrow="Values" title="What students practice">
            Each class is designed to develop both martial arts ability and everyday
            character.
          </SectionHeading>
          <div className="grid grid-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article className="feature-card" key={value.title}>
                  <div className="feature-icon">
                    <Icon size={25} />
                  </div>
                  <h3>{value.title}</h3>
                  <p>{value.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
