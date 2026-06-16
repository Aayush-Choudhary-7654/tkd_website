import type { ScheduleItem } from "./types";

const weekdayOrder = new Map(
  ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].map(
    (day, index) => [day, index]
  )
);

function dayRank(day: string) {
  const normalized = day.trim().toLowerCase();
  const exact = weekdayOrder.get(normalized);
  if (exact !== undefined) return exact;

  const matchedDay = [...weekdayOrder.keys()].find((weekday) =>
    normalized.startsWith(weekday.slice(0, 3))
  );
  return matchedDay ? weekdayOrder.get(matchedDay) ?? weekdayOrder.size : weekdayOrder.size;
}

function startMinutes(time: string) {
  const match = time.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!match) return Number.MAX_SAFE_INTEGER;

  let hours = Number(match[1]);
  const minutes = Number(match[2] || 0);
  const period = match[3]?.toLowerCase();

  if (period === "pm" && hours < 12) hours += 12;
  if (period === "am" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function sortScheduleItems<T extends Pick<ScheduleItem, "day" | "time">>(items: T[]) {
  return [...items].sort((left, right) => {
    const dayDifference = dayRank(left.day) - dayRank(right.day);
    if (dayDifference) return dayDifference;

    const timeDifference = startMinutes(left.time) - startMinutes(right.time);
    if (timeDifference) return timeDifference;

    return left.day.localeCompare(right.day) || left.time.localeCompare(right.time);
  });
}
