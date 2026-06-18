import { requireAdminRequest } from "@/lib/auth";
import { getDb, hasMongoConfig } from "@/lib/mongodb";
import { getWhatsAppNotificationStatus } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const requiredEnv = [
  "MONGODB_URI",
  "MONGODB_DB",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD_HASH",
  "AUTH_SECRET"
] as const;

export async function GET(request: Request) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  const env = Object.fromEntries(
    requiredEnv.map((key) => [key, Boolean(process.env[key]?.trim())])
  );

  const health = {
    ok: false,
    env,
    whatsapp: getWhatsAppNotificationStatus(),
    mongo: {
      configured: hasMongoConfig(),
      ok: false,
      database: process.env.MONGODB_DB || "active_taekwondo",
      collections: [] as string[],
      error: ""
    }
  };

  if (!hasMongoConfig()) {
    health.mongo.error = "MONGODB_URI is missing.";
    return Response.json(health, { status: 503 });
  }

  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    const collections = await db.listCollections().toArray();
    health.mongo.ok = true;
    health.mongo.collections = collections.map((collection) => collection.name).sort();
    health.ok = health.mongo.ok;
    return Response.json(health, { status: health.ok ? 200 : 503 });
  } catch (error) {
    health.mongo.error = error instanceof Error ? error.message : String(error);
    return Response.json(health, { status: 503 });
  }
}
