"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus("");

    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/v1/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setPending(false);

    if (!response.ok) {
      setStatus("Invalid admin credentials.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Password
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      <button className="button" type="submit" disabled={pending}>
        {pending ? "Signing in..." : "Sign In"}
      </button>
      <p className={`form-status ${status ? "error" : ""}`}>{status}</p>
    </form>
  );
}
