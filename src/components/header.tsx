"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navLinks } from "@/lib/site-config";
import type { SiteContent } from "@/lib/types";

export function Header({ site }: { site: SiteContent }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link className="brand" href="/" aria-label={`${site.name} home`}>
          <span className="brand-mark" aria-hidden="true">
            <svg className="brand-logo" viewBox="0 0 64 64" focusable="false">
              <defs>
                <linearGradient id="active-tkd-logo-gradient" x1="10" x2="54" y1="8" y2="58">
                  <stop offset="0" stopColor="#f5b942" />
                  <stop offset="0.48" stopColor="#d71920" />
                  <stop offset="1" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
              <rect width="64" height="64" rx="10" fill="#090909" />
              <path
                d="M12 46 30 10h8l14 36h-9l-3-8H27l-4 8h-11Z"
                fill="none"
                stroke="url(#active-tkd-logo-gradient)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
              />
              <path
                d="M20 52c12-9 25-9 36-1"
                fill="none"
                stroke="#d71920"
                strokeLinecap="round"
                strokeWidth="4"
              />
              <text
                x="32"
                y="39"
                fill="#ffffff"
                fontFamily="Arial, sans-serif"
                fontSize="18"
                fontWeight="900"
                textAnchor="middle"
              >
                AT
              </text>
            </svg>
          </span>
          <span>{site.name}</span>
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
            {site.navJoinLabel}
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
