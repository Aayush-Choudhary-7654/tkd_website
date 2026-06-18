type LeadNotification = {
  type: "New inquiry" | "New student booking";
  name: string;
  phone: string;
  message?: string;
  program?: string;
  level?: string;
  age?: number;
};

type WhatsAppConfig = {
  accessToken: string;
  notifyTo: string;
  phoneNumberId: string;
  templateLanguage: string;
  templateName: string;
  version: string;
};

function getConfig(): WhatsAppConfig | null {
  if (process.env.WHATSAPP_NOTIFICATIONS_ENABLED === "false") {
    return null;
  }

  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
  const notifyTo = process.env.WHATSAPP_NOTIFY_TO?.trim().replace(/[^\d]/g, "");
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();

  if (!accessToken || !notifyTo || !phoneNumberId) {
    return null;
  }

  return {
    accessToken,
    notifyTo,
    phoneNumberId,
    templateLanguage: process.env.WHATSAPP_TEMPLATE_LANGUAGE?.trim() || "en_US",
    templateName: process.env.WHATSAPP_TEMPLATE_NAME?.trim() || "",
    version: process.env.WHATSAPP_GRAPH_API_VERSION?.trim() || "v23.0"
  };
}

function buildNotificationText(lead: LeadNotification) {
  const lines = [
    `ACTIVE TAEKWONDO ${lead.type}`,
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`
  ];

  if (typeof lead.age === "number") {
    lines.push(`Age: ${lead.age}`);
  }

  if (lead.program) {
    lines.push(`Program: ${lead.program}`);
  }

  if (lead.level) {
    lines.push(`Level: ${lead.level}`);
  }

  if (lead.message) {
    lines.push(`Message: ${lead.message}`);
  }

  lines.push(`Received: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`);
  return lines.join("\n").slice(0, 4000);
}

function buildMessagePayload(config: WhatsAppConfig, text: string) {
  if (config.templateName) {
    return {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: config.notifyTo,
      type: "template",
      template: {
        name: config.templateName,
        language: { code: config.templateLanguage },
        components: [
          {
            type: "body",
            parameters: [{ type: "text", text }]
          }
        ]
      }
    };
  }

  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: config.notifyTo,
    type: "text",
    text: {
      preview_url: false,
      body: text
    }
  };
}

export function getWhatsAppNotificationStatus() {
  const config = getConfig();

  return {
    enabled: process.env.WHATSAPP_NOTIFICATIONS_ENABLED !== "false",
    configured: Boolean(config),
    phoneNumberId: Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID?.trim()),
    accessToken: Boolean(process.env.WHATSAPP_ACCESS_TOKEN?.trim()),
    notifyTo: Boolean(process.env.WHATSAPP_NOTIFY_TO?.trim()),
    templateName: Boolean(process.env.WHATSAPP_TEMPLATE_NAME?.trim()),
    graphApiVersion: process.env.WHATSAPP_GRAPH_API_VERSION?.trim() || "v23.0"
  };
}

export async function sendWhatsAppLeadNotification(lead: LeadNotification) {
  const config = getConfig();

  if (!config) {
    console.info("WhatsApp notification skipped: configure WhatsApp env vars to enable it.");
    return;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/${config.version}/${config.phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(buildMessagePayload(config, buildNotificationText(lead)))
      }
    );

    if (!response.ok) {
      const details = await response.text();
      console.error(`WhatsApp notification failed: ${response.status} ${details}`);
    }
  } catch (error) {
    console.error("WhatsApp notification failed:", error);
  }
}
