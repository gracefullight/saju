import type { DateAdapter } from "@/adapters/date-adapter";

export async function createLuxonAdapter(): Promise<DateAdapter<import("luxon").DateTime>> {
  let DateTime: typeof import("luxon").DateTime;

  try {
    const luxon = await import("luxon");
    DateTime = luxon.DateTime;
  } catch {
    throw new Error("Luxon is not installed. Install it with: npm install luxon @types/luxon");
  }

  return {
    getYear: (date) => date.year,
    getMonth: (date) => date.month,
    getDay: (date) => date.day,
    getHour: (date) => date.hour,
    getMinute: (date) => date.minute,
    getSecond: (date) => date.second,
    getZoneName: (date) => {
      const zoneName = date.zoneName;
      if (zoneName === null) throw new Error("DateTime has no timezone");
      return zoneName;
    },
    plusMinutes: (date, minutes) => date.plus({ minutes }),
    plusDays: (date, days) => date.plus({ days }),
    minusDays: (date, days) => date.minus({ days }),
    toUTC: (date) => date.toUTC(),
    toISO: (date) => {
      const iso = date.toISO();
      if (iso === null) throw new Error("Failed to convert DateTime to ISO string");
      return iso;
    },
    toMillis: (date) => date.toMillis(),
    fromMillis: (millis, zone) => DateTime.fromMillis(millis, { zone }),
    createUTC: (year, month, day, hour, minute, second) =>
      DateTime.utc(year, month, day, hour, minute, second),
    setZone: (date, zoneName) => date.setZone(zoneName),
    isGreaterThanOrEqual: (date1, date2) => date1 >= date2,
  };
}
