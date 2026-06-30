"use client";

import { CreditCard, ImageUp, LogOut, ReceiptText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Student, StudentFeePayment } from "@/lib/types";

type Status = {
  type: "idle" | "success" | "error";
  message: string;
};

const paymentMethods = ["UPI", "Card", "Net Banking", "Cash"] as const;

export function StudentDashboard({
  initialStudent,
  initialFeePayments
}: {
  initialStudent: Student;
  initialFeePayments: StudentFeePayment[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [student, setStudent] = useState(initialStudent);
  const [feePayments, setFeePayments] = useState(initialFeePayments);
  const [uploading, setUploading] = useState(false);
  const [photoStatus, setPhotoStatus] = useState<Status>({ type: "idle", message: "" });
  const [feeStatus, setFeeStatus] = useState<Status>({ type: "idle", message: "" });
  const [feeForm, setFeeForm] = useState({
    method: "UPI",
    amount: "",
    note: ""
  });

  async function logout() {
    await fetch("/api/v1/students/logout", { method: "POST" });
    router.push("/students/login");
    router.refresh();
  }

  async function uploadPhoto(file?: File) {
    if (!file) return;

    setPhotoStatus({ type: "idle", message: "" });
    setUploading(true);

    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/v1/students/photo", {
        method: "POST",
        body
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Could not update photo.");
      }

      setStudent(data.student);
      setPhotoStatus({ type: "success", message: "Photo updated successfully." });
    } catch (error) {
      setPhotoStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Could not update photo."
      });
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  async function saveFeeOption(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeeStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/v1/students/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feeForm)
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Could not save payment option.");
      }

      setFeePayments((value) => [data.feePayment, ...value]);
      setFeeStatus({
        type: "success",
        message: data.message || "Payment option saved."
      });
      setFeeForm({ method: feeForm.method, amount: "", note: "" });
    } catch (error) {
      setFeeStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Could not save payment option."
      });
    }
  }

  return (
    <div className="container student-dashboard">
      <section className="page-card student-welcome">
        <div>
          <p className="eyebrow">Student Portal</p>
          <h1>{student.name}</h1>
          <p>
            {student.program} | {student.level}
          </p>
        </div>
        <button className="ghost-button" type="button" onClick={logout}>
          <LogOut size={17} /> Log Out
        </button>
      </section>

      <div className="student-dashboard-grid">
        <section className="form-panel student-panel">
          <div className="student-panel-heading">
            <ImageUp size={22} />
            <div>
              <h2>Photos</h2>
              <p>Update the photo connected to your student profile.</p>
            </div>
          </div>

          {student.profilePhotoUrl ? (
            <img className="student-photo-preview" src={student.profilePhotoUrl} alt="" />
          ) : (
            <div className="student-photo-empty">No student photo uploaded yet.</div>
          )}

          <div
            className="drop-zone"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              void uploadPhoto(event.dataTransfer.files[0]);
            }}
          >
            <ImageUp size={18} />
            <span>{uploading ? "Uploading..." : "Drop your latest photo here"}</span>
            <button className="ghost-button" type="button" onClick={() => inputRef.current?.click()}>
              Choose Photo
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              hidden
              onChange={(event) => void uploadPhoto(event.target.files?.[0])}
            />
          </div>
          <p className={`form-status ${photoStatus.type}`}>{photoStatus.message}</p>
        </section>

        <section className="form-panel student-panel">
          <div className="student-panel-heading">
            <CreditCard size={22} />
            <div>
              <h2>Fees</h2>
              <p>Choose a preferred payment method. Gateway setup will be connected later.</p>
            </div>
          </div>

          <form className="form-grid" onSubmit={saveFeeOption}>
            <label>
              Payment Method
              <select
                value={feeForm.method}
                onChange={(event) =>
                  setFeeForm((value) => ({ ...value, method: event.target.value }))
                }
                required
              >
                {paymentMethods.map((method) => (
                  <option key={method}>{method}</option>
                ))}
              </select>
            </label>
            <label>
              Amount
              <input
                value={feeForm.amount}
                onChange={(event) =>
                  setFeeForm((value) => ({ ...value, amount: event.target.value }))
                }
                placeholder="Example: 1500"
              />
            </label>
            <label>
              Note
              <textarea
                value={feeForm.note}
                onChange={(event) =>
                  setFeeForm((value) => ({ ...value, note: event.target.value }))
                }
                placeholder="Example: July monthly fees"
              />
            </label>
            <button className="button" type="submit">
              Save Payment Option
            </button>
            <p className={`form-status ${feeStatus.type}`}>{feeStatus.message}</p>
          </form>

          {feePayments.length ? (
            <div className="student-payment-history">
              <h3>
                <ReceiptText size={18} /> Saved fee options
              </h3>
              {feePayments.map((payment) => (
                <div className="payment-history-row" key={payment.id}>
                  <strong>{payment.method}</strong>
                  <span>{payment.amount ? `Rs. ${payment.amount}` : "Amount not entered"}</span>
                  <small>{payment.status.replace("_", " ")}</small>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
