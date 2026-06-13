import { MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms";
import { PublicShell } from "@/components/public-shell";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/lib/site-config";

export default function ContactPage() {
  return (
    <PublicShell>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Contact</p>
          <h1>Book a visit</h1>
          <p>
            Ask a question, schedule a free trial, or confirm the best program before
            joining.
          </p>
        </div>
      </section>

      <section className="section" id="free-trial">
        <div className="container grid grid-2">
          <div>
            <SectionHeading title="Send an inquiry">
              Share your details and the academy team will follow up.
            </SectionHeading>
            <div className="contact-list">
              <a className="contact-item" href={`tel:${siteConfig.phone}`}>
                <Phone size={20} />
                <span>{siteConfig.phone}</span>
              </a>
              <a
                className="contact-item"
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={20} />
                <span>WhatsApp</span>
              </a>
              <a
                className="contact-item"
                href={siteConfig.mapUrl}
                target="_blank"
                rel="noreferrer"
              >
                <MapPin size={20} />
                <span>{siteConfig.address}</span>
              </a>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <SectionHeading title="Location">
            The exact Google Maps link can be configured before launch.
          </SectionHeading>
          <iframe
            className="map-frame"
            src={siteConfig.mapUrl}
            loading="lazy"
            title="ACTIVE TAEKWONDO location map"
          />
        </div>
      </section>
    </PublicShell>
  );
}
