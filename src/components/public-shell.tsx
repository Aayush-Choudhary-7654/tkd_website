import { Footer } from "./footer";
import { Header } from "./header";
import { PublicAnimations } from "./public-animations";
import { PublicCursor } from "./public-cursor";
import { getSiteContent } from "@/lib/repository";
import type { SiteContent } from "@/lib/types";

export async function PublicShell({
  children,
  site
}: {
  children: React.ReactNode;
  site?: SiteContent;
}) {
  const siteContent = site || (await getSiteContent());

  return (
    <div className="page-shell">
      <PublicCursor />
      <Header site={siteContent} />
      <PublicAnimations>
        <main>{children}</main>
        <Footer site={siteContent} />
      </PublicAnimations>
    </div>
  );
}
