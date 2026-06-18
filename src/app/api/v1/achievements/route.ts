import { jsonError, jsonOk } from "@/lib/api";
import { insertDocument, listDocuments } from "@/lib/repository";
import { requireSecureAdminJsonMutation } from "@/lib/security";
import { defaultAchievements } from "@/lib/seed-data";
import type { Achievement } from "@/lib/types";
import { achievementSchema, readJson } from "@/lib/validation";

export async function GET() {
  const achievements = await listDocuments<Achievement>("achievements", {
    fallback: defaultAchievements,
    sort: { date: -1 }
  });
  return jsonOk({ achievements });
}

export async function POST(request: Request) {
  const unauthorized = await requireSecureAdminJsonMutation(request, "admin-achievements");
  if (unauthorized) return unauthorized;

  try {
    const payload = await readJson(request, achievementSchema);
    const achievement = await insertDocument("achievements", {
      ...payload,
      date: new Date(payload.date),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return jsonOk({ achievement }, { status: 201 });
  } catch (error) {
    return jsonError(error, "Could not create achievement.");
  }
}
