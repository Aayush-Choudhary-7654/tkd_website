import { Footer } from "./footer";
import { Header } from "./header";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-shell">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
