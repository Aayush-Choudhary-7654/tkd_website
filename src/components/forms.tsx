"use client";

import { useState } from "react";
import type { Program } from "@/lib/types";

type Status = {
  type: "idle" | "success" | "error";
  message: string;
};

async function submitJson(url: string, form: HTMLFormElement) {
  const payload = Object.fromEntries(new FormData(form).entries());
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || "Submission failed.");
  }
}

export function StudentRegistrationForm({ programs }: { programs: Program[] }) {
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus({ type: "idle", message: "" });

    try {
      await submitJson("/api/v1/students", event.currentTarget);
      event.currentTarget.reset();
      setStatus({
        type: "success",
        message: "Registration received. The academy team will contact you soon."
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Could not submit registration."
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="form-panel form-grid" onSubmit={onSubmit}>
      <div className="form-grid two">
        <label>
          Full Name
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          Age
          <input name="age" type="number" min="3" max="80" required />
        </label>
      </div>
      <div className="form-grid two">
        <label>
          Phone Number
          <input name="phone" autoComplete="tel" required />
        </label>
        <label>
          Parent Name
          <input name="parentName" autoComplete="name" />
        </label>
      </div>
      <div className="form-grid two">
        <label>
          Experience Level
          <select name="level" defaultValue="Beginner" required>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </label>
        <label>
          Program Enrolled
          <select name="program" defaultValue={programs[0]?.name || "Beginner"} required>
            {programs.length ? (
              programs.map((program) => <option key={program.id}>{program.name}</option>)
            ) : (
              <option>Beginner</option>
            )}
          </select>
        </label>
      </div>
      <button className="button" type="submit" disabled={pending}>
        {pending ? "Submitting..." : "Submit Registration"}
      </button>
      <p className={`form-status ${status.type}`}>{status.message}</p>
    </form>
  );
}

export function ContactForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus({ type: "idle", message: "" });

    try {
      await submitJson("/api/v1/contact", event.currentTarget);
      event.currentTarget.reset();
      setStatus({
        type: "success",
        message: "Inquiry received. We will call you back shortly."
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Could not submit inquiry."
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="form-panel form-grid" onSubmit={onSubmit}>
      <div className={compact ? "form-grid" : "form-grid two"}>
        <label>
          Name
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          Phone
          <input name="phone" autoComplete="tel" required />
        </label>
      </div>
      <label>
        Message
        <textarea
          name="message"
          defaultValue={compact ? "I want to book a free trial class." : ""}
          required
        />
      </label>
      <button className="button" type="submit" disabled={pending}>
        {pending ? "Sending..." : compact ? "Book Free Trial" : "Send Inquiry"}
      </button>
      <p className={`form-status ${status.type}`}>{status.message}</p>
    </form>
  );
}
