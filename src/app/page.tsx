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
import { getPublicContent, getSiteContent } from "@/lib/repository";

export const dynamic = "force-dynamic";

const featureIcons = [ShieldCheck, Dumbbell, Trophy, Sparkles];

export default async function HomePage() {
  const [site, { programs, schedule, gallery, achievements }] = await Promise.all([
    getSiteContent(),
    getPublicContent()
  ]);

  const features = [
    { title: site.featureOneTitle, text: site.featureOneText },
    { title: site.featureTwoTitle, text: site.featureTwoText },
    { title: site.featureThreeTitle, text: site.featureThreeText },
    { title: site.featureFourTitle, text: site.featureFourText }
  ];

  const stats = [
    { value: site.statOneValue, label: site.statOneLabel },
    { value: site.statTwoValue, label: site.statTwoLabel },
    { value: site.statThreeValue, label: site.statThreeLabel }
  ];

  return (
    <PublicShell site={site}>
      <section className="hero">
        <div className="container hero-content">
          <p className="eyebrow">
            <Medal size={18} /> {site.homeHeroEyebrow}
          </p>
          <h1>{site.homeHeroTitle}</h1>
          <p>{site.homeHeroBody}</p>
          <div className="hero-actions">
            <Link className="button" href="/join">
              {site.primaryCtaLabel}
            </Link>
            <Link className="ghost-button" href="/contact#free-trial">
              {site.secondaryCtaLabel}
            </Link>
          </div>
        </div>
      </section>

      <div className="container stat-strip" aria-label="Academy highlights">
        {stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      <section className="section" id="why">
        <div className="container">
          <SectionHeading eyebrow={site.homeWhyEyebrow} title={site.homeWhyTitle}>
            {site.homeWhyBody}
          </SectionHeading>
          <div className="grid grid-4">
            {features.map((feature, index) => {
              const Icon = featureIcons[index];
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
          <SectionHeading eyebrow={site.homeProgramsEyebrow} title={site.homeProgramsTitle}>
            {site.homeProgramsBody}
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
          <SectionHeading eyebrow={site.homeScheduleEyebrow} title={site.homeScheduleTitle}>
            {site.homeScheduleBody}
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
          <SectionHeading
            eyebrow={site.homeAchievementsEyebrow}
            title={site.homeAchievementsTitle}
          >
            {site.homeAchievementsBody}
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
          <SectionHeading eyebrow={site.homeGalleryEyebrow} title={site.homeGalleryTitle}>
            {site.homeGalleryBody}
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
            <Award size={18} /> {site.homeCtaEyebrow}
          </p>
          <h2>{site.homeCtaTitle}</h2>
          <p>{site.homeCtaBody}</p>
          <div className="hero-actions">
            <Link className="button" href="/join">
              {site.primaryCtaLabel}
            </Link>
            <Link className="ghost-button" href="/contact#free-trial">
              {site.secondaryCtaLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2">
          <div>
            <SectionHeading eyebrow={site.homeTrialEyebrow} title={site.homeTrialTitle}>
              {site.homeTrialBody}
            </SectionHeading>
          </div>
          <ContactForm compact submitLabel={site.trialSubmitLabel} />
        </div>
      </section>
    </PublicShell>
  );
}
