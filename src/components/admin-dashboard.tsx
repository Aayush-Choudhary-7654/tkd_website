"use client";

import { LogOut, Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type {
  Achievement,
  ContactInquiry,
  GalleryItem,
  Program,
  ScheduleItem,
  Student
} from "@/lib/types";

type ContentMap = {
  programs: Program[];
  schedule: ScheduleItem[];
  gallery: GalleryItem[];
  achievements: Achievement[];
};

type Field = {
  name: string;
  label: string;
  type?: "text" | "url" | "textarea" | "select" | "date";
  options?: string[];
  full?: boolean;
};

type Config = {
  key: keyof ContentMap;
  title: string;
  endpoint: string;
  responseKey: string;
  fields: Field[];
};

const configs: Config[] = [
  {
    key: "programs",
    title: "Programs",
    endpoint: "/api/v1/programs",
    responseKey: "programs",
    fields: [
      { name: "name", label: "Program Name" },
      { name: "ageGroup", label: "Age Group" },
      { name: "schedule", label: "Schedule" },
      { name: "fees", label: "Fees" },
      { name: "image", label: "Image URL", type: "url", full: true },
      { name: "description", label: "Description", type: "textarea", full: true }
    ]
  },
  {
    key: "schedule",
    title: "Schedule",
    endpoint: "/api/v1/schedule",
    responseKey: "schedule",
    fields: [
      { name: "day", label: "Day" },
      { name: "time", label: "Time Slot" },
      { name: "program", label: "Program Type" }
    ]
  },
  {
    key: "gallery",
    title: "Gallery",
    endpoint: "/api/v1/gallery",
    responseKey: "gallery",
    fields: [
      { name: "imageUrl", label: "Image URL", type: "url", full: true },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: ["Training", "Events", "Competition"]
      }
    ]
  },
  {
    key: "achievements",
    title: "Achievements",
    endpoint: "/api/v1/achievements",
    responseKey: "achievements",
    fields: [
      { name: "title", label: "Title" },
      { name: "date", label: "Date", type: "date" },
      { name: "image", label: "Image URL", type: "url", full: true },
      { name: "description", label: "Description", type: "textarea", full: true }
    ]
  }
];

function dateInputValue(value: unknown) {
  if (!value) return "";
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? String(value).slice(0, 10) : date.toISOString().slice(0, 10);
}

function itemLabel(item: Record<string, unknown>) {
  return String(item.name || item.title || item.program || item.category || item.id);
}

function emptyForm(fields: Field[]) {
  return fields.reduce<Record<string, string>>((acc, field) => {
    acc[field.name] = field.type === "date" ? new Date().toISOString().slice(0, 10) : "";
    if (field.type === "select" && field.options?.[0]) {
      acc[field.name] = field.options[0];
    }
    return acc;
  }, {});
}

function LeadTables({
  students,
  contacts
}: {
  students: Student[];
  contacts: ContactInquiry[];
}) {
  return (
    <div className="admin-grid">
      <section className="admin-panel">
        <h2>Student Registrations</h2>
        {students.length ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Phone</th>
                <th>Parent</th>
                <th>Level</th>
                <th>Program</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.age}</td>
                  <td>{student.phone}</td>
                  <td>{student.parentName || "-"}</td>
                  <td>{student.level}</td>
                  <td>{student.program}</td>
                  <td>{new Date(student.createdAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">No student registrations yet.</div>
        )}
      </section>

      <section className="admin-panel">
        <h2>Contact Inquiries</h2>
        {contacts.length ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td>{contact.name}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.message}</td>
                  <td>{new Date(contact.createdAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">No contact inquiries yet.</div>
        )}
      </section>
    </div>
  );
}

function CrudPanel({
  config,
  items,
  setItems
}: {
  config: Config;
  items: Record<string, unknown>[];
  setItems: (items: Record<string, unknown>[]) => void;
}) {
  const [form, setForm] = useState(() => emptyForm(config.fields));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);

  async function refresh() {
    const response = await fetch(config.endpoint);
    const data = await response.json();
    setItems(data[config.responseKey] || []);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus("");

    const response = await fetch(
      editingId ? `${config.endpoint}/${editingId}` : config.endpoint,
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      }
    );

    setPending(false);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setStatus(data?.error || "Save failed.");
      return;
    }

    setStatus(editingId ? "Updated." : "Created.");
    setEditingId(null);
    setForm(emptyForm(config.fields));
    await refresh();
  }

  async function onDelete(id: string) {
    setPending(true);
    setStatus("");

    const response = await fetch(`${config.endpoint}/${id}`, { method: "DELETE" });
    setPending(false);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setStatus(data?.error || "Delete failed.");
      return;
    }

    setStatus("Deleted.");
    await refresh();
  }

  function startEdit(item: Record<string, unknown>) {
    const next = emptyForm(config.fields);
    for (const field of config.fields) {
      next[field.name] =
        field.type === "date" ? dateInputValue(item[field.name]) : String(item[field.name] || "");
    }
    setEditingId(String(item.id));
    setForm(next);
    setStatus("");
  }

  return (
    <section className="admin-panel">
      <h2>{config.title}</h2>
      <form className="admin-form" onSubmit={onSubmit}>
        {config.fields.map((field) => (
          <label key={field.name} className={field.full ? "full" : undefined}>
            {field.label}
            {field.type === "textarea" ? (
              <textarea
                value={form[field.name] || ""}
                onChange={(event) =>
                  setForm((value) => ({ ...value, [field.name]: event.target.value }))
                }
                required
              />
            ) : field.type === "select" ? (
              <select
                value={form[field.name] || field.options?.[0] || ""}
                onChange={(event) =>
                  setForm((value) => ({ ...value, [field.name]: event.target.value }))
                }
                required
              >
                {field.options?.map((option) => <option key={option}>{option}</option>)}
              </select>
            ) : (
              <input
                type={field.type || "text"}
                value={form[field.name] || ""}
                onChange={(event) =>
                  setForm((value) => ({ ...value, [field.name]: event.target.value }))
                }
                required={field.name !== "fees"}
              />
            )}
          </label>
        ))}
        <div className="admin-actions">
          <button className="button" type="submit" disabled={pending}>
            {editingId ? <Pencil size={17} /> : <Plus size={17} />}
            {editingId ? "Update" : "Create"}
          </button>
          {editingId ? (
            <button
              className="ghost-button"
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm(config.fields));
              }}
            >
              <X size={17} /> Cancel
            </button>
          ) : null}
          <button className="ghost-button" type="button" onClick={refresh}>
            <RefreshCw size={17} /> Refresh
          </button>
        </div>
        <p className={`form-status ${status.includes("failed") ? "error" : "success"}`}>
          {status}
        </p>
      </form>

      {items.length ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={String(item.id)}>
                <td>{itemLabel(item)}</td>
                <td>{config.fields.map((field) => String(item[field.name] || "")).join(" | ")}</td>
                <td>
                  <div className="admin-actions">
                    <button className="ghost-button" type="button" onClick={() => startEdit(item)}>
                      <Pencil size={16} /> Edit
                    </button>
                    <button
                      className="danger-button"
                      type="button"
                      onClick={() => onDelete(String(item.id))}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">No {config.title.toLowerCase()} yet.</div>
      )}
    </section>
  );
}

export function AdminDashboard({
  students,
  contacts,
  content
}: {
  students: Student[];
  contacts: ContactInquiry[];
  content: ContentMap;
}) {
  const router = useRouter();
  const [contentState, setContentState] = useState<ContentMap>(content);
  const counts = useMemo(
    () => [
      ["Students", students.length],
      ["Inquiries", contacts.length],
      ["Programs", contentState.programs.length],
      ["Gallery", contentState.gallery.length]
    ],
    [students.length, contacts.length, contentState.programs.length, contentState.gallery.length]
  );

  async function logout() {
    await fetch("/api/v1/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="container">
          <Link className="brand" href="/">
            <span className="brand-mark">AT</span>
            <span>Admin Dashboard</span>
          </Link>
          <button className="ghost-button" type="button" onClick={logout}>
            <LogOut size={17} /> Log Out
          </button>
        </div>
      </header>

      <main className="container admin-main">
        <div className="admin-hero">
          <div>
            <h1>Academy Control Center</h1>
            <p>Manage leads, programs, schedule rows, gallery URLs, and achievements.</p>
          </div>
        </div>

        <div className="admin-stats">
          {counts.map(([label, count]) => (
            <div className="admin-stat" key={label}>
              <strong>{count}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <LeadTables students={students} contacts={contacts} />

        <div className="section-heading" style={{ marginTop: 34 }}>
          <div>
            <p className="eyebrow">Public Content</p>
            <h2>Content CRUD</h2>
          </div>
          <p>These editors update the data used by the public pages.</p>
        </div>

        <div className="admin-grid">
          {configs.map((config) => (
            <CrudPanel
              key={config.key}
              config={config}
              items={contentState[config.key] as unknown as Record<string, unknown>[]}
              setItems={(items) =>
                setContentState((value) => ({ ...value, [config.key]: items }))
              }
            />
          ))}
        </div>
      </main>
    </div>
  );
}
