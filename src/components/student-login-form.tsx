"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Status = {
  type: "idle" | "error";
  message: string;
};

export function StudentLoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [form, setForm] = useState({
    email: "",
    phone: ""
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/v1/students/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Could not log in.");
      }

      router.push("/students");
      router.refresh();
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Could not log in."
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="form-panel form-grid" onSubmit={onSubmit}>
      <label>
        Registered Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))}
          required
        />
      </label>
      <label>
        Registered Phone Number
        <input
          name="phone"
          autoComplete="tel"
          value={form.phone}
          onChange={(event) => setForm((value) => ({ ...value, phone: event.target.value }))}
          required
        />
      </label>
      <button className="button" type="submit" disabled={pending}>
        {pending ? "Logging in..." : "Student Login"}
      </button>
      <p className={`form-status ${status.type}`}>{status.message}</p>
    </form>
  );
}
