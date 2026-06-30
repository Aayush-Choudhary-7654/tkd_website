import Link from "next/link";
import { Award, HeartHandshake, Shield, Target } from "lucide-react";
import { MediaRenderer } from "@/components/media-renderer";
import { PublicShell } from "@/components/public-shell";
import { SectionHeading } from "@/components/section-heading";
import { getSiteContent } from "@/lib/repository";

export const dynamic = "force-dynamic";

const valueIcons = [Shield, Target, HeartHandshake, Award];

export default async function AboutPage() {
  const site = await getSiteContent();
  const values = [
    { title: site.valueOneTitle, text: site.valueOneText },
    { title: site.valueTwoTitle, text: site.valueTwoText },
    { title: site.valueThreeTitle, text: site.valueThreeText },
    { title: site.valueFourTitle, text: site.valueFourText }
  ];

  return (
    <PublicShell site={site}>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">{site.aboutHeroEyebrow}</p>
          <h1>{site.aboutHeroTitle}</h1>
          <p>{site.aboutHeroBody}</p>
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
            <SectionHeading eyebrow={site.aboutAcademyEyebrow} title={site.aboutAcademyTitle}>
              {site.aboutAcademyBody}
            </SectionHeading>
          </div>
          <MediaRenderer className="media" src={site.aboutAcademyImage} />
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <SectionHeading eyebrow={site.aboutValuesEyebrow} title={site.aboutValuesTitle}>
            {site.aboutValuesBody}
          </SectionHeading>
          <div className="grid grid-4">
            {values.map((value, index) => {
              const Icon = valueIcons[index];
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
