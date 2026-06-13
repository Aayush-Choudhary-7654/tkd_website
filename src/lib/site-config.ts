export const siteConfig = {
  name: "ACTIVE TAEKWONDO",
  tagline: "Discipline. Strength. Respect.",
  phone: process.env.NEXT_PUBLIC_SITE_PHONE || "+91 00000 00000",
  whatsapp: process.env.NEXT_PUBLIC_SITE_WHATSAPP || "910000000000",
  address: process.env.NEXT_PUBLIC_SITE_ADDRESS || "Durg, Chhattisgarh",
  mapUrl:
    process.env.NEXT_PUBLIC_SITE_MAP_URL ||
    "https://maps.google.com/?q=Durg%20Chhattisgarh",
  instagram: process.env.NEXT_PUBLIC_SITE_INSTAGRAM || "https://instagram.com/",
  facebook: process.env.NEXT_PUBLIC_SITE_FACEBOOK || "https://facebook.com/"
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/schedule", label: "Schedule" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" }
];
