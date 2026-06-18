import type { Metadata } from "next";
import { getSiteContent } from "@/lib/repository";
import "locomotive-scroll/dist/locomotive-scroll.css";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();

  return {
    title: site.name,
    description: site.metaDescription
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
