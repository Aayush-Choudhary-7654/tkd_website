import Link from "next/link";
import {
  Award,
  Dumbbell,
  Medal,
  ShieldCheck,
  Sparkles,
  Trophy
} from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { SectionHeading } from "@/components/section-heading";
import { getSiteContent } from "@/lib/repository";

export const dynamic = "force-dynamic";

const featureIcons = [ShieldCheck, Dumbbell, Trophy, Sparkles];

export default async function HomePage() {
  const site = await getSiteContent();

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
    </PublicShell>
  );
}
