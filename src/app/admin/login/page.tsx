import { AdminLoginForm } from "@/components/admin-login-form";

export default function AdminLoginPage() {
  return (
    <main className="login-shell">
      <section className="login-card">
        <p className="eyebrow">ACTIVE TAEKWONDO</p>
        <h1>Admin Login</h1>
        <p>Sign in to manage registrations, inquiries, and public site content.</p>
        <AdminLoginForm />
      </section>
    </main>
  );
}
