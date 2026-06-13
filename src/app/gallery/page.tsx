import { PublicShell } from "@/components/public-shell";
import { SectionHeading } from "@/components/section-heading";
import { getPublicContent } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const { gallery, achievements } = await getPublicContent();

  return (
    <PublicShell>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Gallery</p>
          <h1>Training, events, competition</h1>
          <p>
            A visual record of academy energy, student milestones, and competition
            preparation.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading title="Photo gallery">
            Admin-managed image URLs keep the gallery simple for v1.
          </SectionHeading>
          {gallery.length ? (
            <div className="gallery-grid">
              {gallery.map((item) => (
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

      <section className="section alt">
        <div className="container">
          <SectionHeading title="Achievements">
            Highlights from belt promotions, tournament results, and student growth.
          </SectionHeading>
          {achievements.length ? (
            <div className="grid grid-3">
              {achievements.map((achievement) => (
                <article className="achievement-card" key={achievement.id}>
                  <img className="media" src={achievement.image} alt="" />
                  <div className="achievement-body">
                    <h3>{achievement.title}</h3>
                    <p>{achievement.description}</p>
                    <div className="meta-list">
                      <span className="pill">
                        {new Date(achievement.date).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">Achievements will appear here after admin setup.</div>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
