import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ACTIVE TAEKWONDO",
  description:
    "Taekwondo training for discipline, strength, respect, fitness, and competition readiness."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
