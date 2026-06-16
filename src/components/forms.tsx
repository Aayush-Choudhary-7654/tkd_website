"use client";

import { useState } from "react";
import type { Program } from "@/lib/types";

type Status = {
  type: "idle" | "success" | "error";
  message: string;
};

async function submitJson(url: string, payload: Record<string, string>) {
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

export function StudentRegistrationForm({
  programs,
  submitLabel = "Submit Registration"
}: {
  programs: Program[];
  submitLabel?: string;
}) {
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [pending, setPending] = useState(false);
  const defaultProgram = programs[0]?.name || "Beginner";
  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    parentName: "",
    level: "Beginner",
    program: defaultProgram
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus({ type: "idle", message: "" });

    try {
      await submitJson("/api/v1/students", form);
      setForm({
        name: "",
        age: "",
        phone: "",
        parentName: "",
        level: "Beginner",
        program: defaultProgram
      });
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
          <input
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))}
            required
          />
        </label>
        <label>
          Age
          <input
            name="age"
            type="number"
            min="3"
            max="80"
            value={form.age}
            onChange={(event) => setForm((value) => ({ ...value, age: event.target.value }))}
            required
          />
        </label>
      </div>
      <div className="form-grid two">
        <label>
          Phone Number
          <input
            name="phone"
            autoComplete="tel"
            value={form.phone}
            onChange={(event) => setForm((value) => ({ ...value, phone: event.target.value }))}
            required
          />
        </label>
        <label>
          Parent Name
          <input
            name="parentName"
            autoComplete="name"
            value={form.parentName}
            onChange={(event) =>
              setForm((value) => ({ ...value, parentName: event.target.value }))
            }
          />
        </label>
      </div>
      <div className="form-grid two">
        <label>
          Experience Level
          <select
            name="level"
            value={form.level}
            onChange={(event) => setForm((value) => ({ ...value, level: event.target.value }))}
            required
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </label>
        <label>
          Program Enrolled
          <select
            name="program"
            value={form.program}
            onChange={(event) => setForm((value) => ({ ...value, program: event.target.value }))}
            required
          >
            {programs.length ? (
              programs.map((program) => <option key={program.id}>{program.name}</option>)
            ) : (
              <option>Beginner</option>
            )}
          </select>
        </label>
      </div>
      <button className="button" type="submit" disabled={pending}>
        {pending ? "Submitting..." : submitLabel}
      </button>
      <p className={`form-status ${status.type}`}>{status.message}</p>
    </form>
  );
}

export function ContactForm({
  compact = false,
  submitLabel
}: {
  compact?: boolean;
  submitLabel?: string;
}) {
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [pending, setPending] = useState(false);
  const defaultMessage = compact ? "I want to book a free trial class." : "";
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: defaultMessage
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus({ type: "idle", message: "" });

    try {
      await submitJson("/api/v1/contact", form);
      setForm({
        name: "",
        phone: "",
        message: defaultMessage
      });
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
          <input
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))}
            required
          />
        </label>
        <label>
          Phone
          <input
            name="phone"
            autoComplete="tel"
            value={form.phone}
            onChange={(event) => setForm((value) => ({ ...value, phone: event.target.value }))}
            required
          />
        </label>
      </div>
      <label>
        Message
        <textarea
          name="message"
          value={form.message}
          onChange={(event) => setForm((value) => ({ ...value, message: event.target.value }))}
          required
        />
      </label>
      <button className="button" type="submit" disabled={pending}>
        {pending ? "Sending..." : submitLabel || (compact ? "Book Free Trial" : "Send Inquiry")}
      </button>
      <p className={`form-status ${status.type}`}>{status.message}</p>
    </form>
  );
}
