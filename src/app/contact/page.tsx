import { MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms";
import { PublicShell } from "@/components/public-shell";
import { SectionHeading } from "@/components/section-heading";
import { getMapEmbedUrl } from "@/lib/maps";
import { getSiteContent } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const site = await getSiteContent();
  const mapEmbedUrl = getMapEmbedUrl(site.address, site.mapUrl);

  return (
    <PublicShell site={site}>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">{site.contactHeroEyebrow}</p>
          <h1>{site.contactHeroTitle}</h1>
          <p>{site.contactHeroBody}</p>
        </div>
      </section>

      <section className="section" id="free-trial">
        <div className="container grid grid-2">
          <div>
            <SectionHeading title={site.contactSectionTitle}>
              {site.contactSectionBody}
            </SectionHeading>
            <div className="contact-list">
              <a className="contact-item" href={`tel:${site.phone}`}>
                <Phone size={20} />
                <span>{site.phone}</span>
              </a>
              <a
                className="contact-item"
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={20} />
                <span>WhatsApp</span>
              </a>
              <a
                className="contact-item"
                href={site.mapUrl}
                target="_blank"
                rel="noreferrer"
              >
                <MapPin size={20} />
                <span>{site.address}</span>
              </a>
            </div>
          </div>
          <ContactForm submitLabel={site.contactSubmitLabel} />
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <SectionHeading title={site.contactMapTitle} />
          <iframe
            className="map-frame"
            src={mapEmbedUrl}
            loading="lazy"
            title={`${site.name} location map`}
          />
        </div>
      </section>
    </PublicShell>
  );
}
