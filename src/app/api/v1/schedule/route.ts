import { jsonError, jsonOk } from "@/lib/api";
import { insertDocument, listDocuments } from "@/lib/repository";
import { requireSecureAdminJsonMutation } from "@/lib/security";
import { sortScheduleItems } from "@/lib/schedule-order";
import { defaultSchedule } from "@/lib/seed-data";
import type { ScheduleItem } from "@/lib/types";
import { readJson, scheduleSchema } from "@/lib/validation";

export async function GET() {
  const schedule = await listDocuments<ScheduleItem>("schedule", {
    fallback: defaultSchedule,
    sort: { day: 1, time: 1 }
  });
  return jsonOk({ schedule: sortScheduleItems(schedule) });
}

export async function POST(request: Request) {
  const unauthorized = await requireSecureAdminJsonMutation(request, "admin-schedule");
  if (unauthorized) return unauthorized;

  try {
    const payload = await readJson(request, scheduleSchema);
    const scheduleItem = await insertDocument("schedule", {
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return jsonOk({ scheduleItem }, { status: 201 });
  } catch (error) {
    return jsonError(error, "Could not create schedule item.");
  }
}
