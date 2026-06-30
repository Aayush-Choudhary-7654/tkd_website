type EmailLeadNotification = {
  type: "New inquiry" | "New free trial" | "New student joining";
  name: string;
  phone: string;
  email?: string;
  message?: string;
  program?: string;
  level?: string;
  age?: number;
};

type EmailConfig = {
  apiKey: string;
  from: string;
  replyTo?: string;
  subjectPrefix: string;
  to: string[];
};

function cleanEnvValue(value: string | undefined) {
  return (value || "").trim().replace(/^['"]|['"]$/g, "");
}

function isEmail(value: string) {
  return /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(value);
}

function isSender(value: string) {
  const senderMatch = value.match(/^.+<([^<>]+)>$/);
  return senderMatch ? isEmail(senderMatch[1].trim()) : isEmail(value);
}

function getConfig(): EmailConfig | null {
  if (process.env.EMAIL_NOTIFICATIONS_ENABLED === "false") {
    return null;
  }

  const apiKey = cleanEnvValue(process.env.RESEND_API_KEY);
  const from = cleanEnvValue(process.env.EMAIL_FROM);
  const to = cleanEnvValue(process.env.EMAIL_NOTIFY_TO)
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean)
    .filter(isEmail);

  if (!apiKey || !from || !isSender(from) || !to.length) {
    return null;
  }

  return {
    apiKey,
    from,
    replyTo: cleanEnvValue(process.env.EMAIL_REPLY_TO) || undefined,
    subjectPrefix: cleanEnvValue(process.env.EMAIL_SUBJECT_PREFIX) || "ACTIVE TAEKWONDO",
    to
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildRows(lead: EmailLeadNotification) {
  const rows = [
    ["Lead Type", lead.type],
    ["Name", lead.name],
    ["Phone", lead.phone]
  ];

  if (lead.email) rows.push(["Email", lead.email]);
  if (typeof lead.age === "number") rows.push(["Age", String(lead.age)]);
  if (lead.program) rows.push(["Program", lead.program]);
  if (lead.level) rows.push(["Level", lead.level]);
  if (lead.message) rows.push(["Message", lead.message]);

  rows.push([
    "Received",
    new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
  ]);

  return rows;
}

function buildText(lead: EmailLeadNotification) {
  return buildRows(lead)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

function buildHtml(lead: EmailLeadNotification) {
  const rows = buildRows(lead)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:700;background:#f9fafb;">${escapeHtml(label)}</td>
          <td style="padding:10px 12px;border:1px solid #e5e7eb;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.5;">
      <h2 style="margin:0 0 14px;">${escapeHtml(lead.type)}</h2>
      <p style="margin:0 0 18px;">A new website lead was saved successfully.</p>
      <table style="border-collapse:collapse;width:100%;max-width:680px;">${rows}</table>
    </div>`;
}

export function getEmailNotificationStatus() {
  const config = getConfig();

  return {
    enabled: process.env.EMAIL_NOTIFICATIONS_ENABLED !== "false",
    configured: Boolean(config),
    apiKey: Boolean(process.env.RESEND_API_KEY?.trim()),
    from: Boolean(process.env.EMAIL_FROM?.trim()),
    validFrom: isSender(cleanEnvValue(process.env.EMAIL_FROM)),
    notifyTo: Boolean(process.env.EMAIL_NOTIFY_TO?.trim()),
    validNotifyTo: cleanEnvValue(process.env.EMAIL_NOTIFY_TO)
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean)
      .every(isEmail),
    replyTo: Boolean(process.env.EMAIL_REPLY_TO?.trim())
  };
}

export async function sendEmailLeadNotification(lead: EmailLeadNotification) {
  const config = getConfig();

  if (!config) {
    console.info(
      "Email notification skipped: configure RESEND_API_KEY, valid EMAIL_FROM, and EMAIL_NOTIFY_TO."
    );
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: config.from,
        to: config.to,
        reply_to: config.replyTo,
        subject: `${config.subjectPrefix}: ${lead.type} from ${lead.name}`,
        text: buildText(lead),
        html: buildHtml(lead)
      })
    });

    if (!response.ok) {
      const details = await response.text();
      console.error(`Email notification failed: ${response.status} ${details}`);
    }
  } catch (error) {
    console.error("Email notification failed:", error);
  }
}
