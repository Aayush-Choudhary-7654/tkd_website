import Link from "next/link";
import { Facebook, Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import { navLinks } from "@/lib/site-config";
import type { SiteContent } from "@/lib/types";

export function Footer({ site }: { site: SiteContent }) {
  return (
    <>
      <a
        className="whatsapp-float"
        href={`https://wa.me/${site.whatsapp}`}
        aria-label="Chat on WhatsApp"
        target="_blank"
        rel="noreferrer"
      >
        <MessageCircle size={25} />
      </a>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <Link className="brand" href="/">
              <span className="brand-mark">AT</span>
              <span>{site.name}</span>
            </Link>
            <p>{site.tagline}</p>
          </div>
          <div className="footer-links">
            <strong>Quick Links</strong>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="footer-links">
            <strong>Contact</strong>
            <span>
              <Phone size={15} /> {site.phone}
            </span>
            <span>
              <MapPin size={15} /> {site.address}
            </span>
            <Link href={site.instagram} target="_blank">
              <Instagram size={15} /> Instagram
            </Link>
            <Link href={site.facebook} target="_blank">
              <Facebook size={15} /> Facebook
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
