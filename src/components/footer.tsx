import Link from "next/link";
import { Facebook, Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import { navLinks, siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <>
      <a
        className="whatsapp-float"
        href={`https://wa.me/${siteConfig.whatsapp}`}
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
              <span>{siteConfig.name}</span>
            </Link>
            <p>{siteConfig.tagline}</p>
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
              <Phone size={15} /> {siteConfig.phone}
            </span>
            <span>
              <MapPin size={15} /> {siteConfig.address}
            </span>
            <Link href={siteConfig.instagram} target="_blank">
              <Instagram size={15} /> Instagram
            </Link>
            <Link href={siteConfig.facebook} target="_blank">
              <Facebook size={15} /> Facebook
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
