"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navLinks, siteConfig } from "@/lib/site-config";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link className="brand" href="/" aria-label="ACTIVE TAEKWONDO home">
          <span className="brand-mark">AT</span>
          <span>{siteConfig.name}</span>
        </Link>

        <nav className={`nav-links ${open ? "open" : ""}`} aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <Link className="button desktop-only" href="/join">
            Join Now
          </Link>
          <button
            className="mobile-toggle"
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
    </header>
  );
}
