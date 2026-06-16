import { Footer } from "./footer";
import { Header } from "./header";
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
      <Header site={siteContent} />
      <main>{children}</main>
      <Footer site={siteContent} />
    </div>
  );
}
