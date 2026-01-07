import type { DateAdapter } from "@/adapters/date-adapter";

interface DateFnsDate {
  date: Date;
  timeZone: string;
}

export async function createDateFnsAdapter(): Promise<DateAdapter<DateFnsDate>> {
  let addMinutes: typeof import("date-fns").addMinutes;
  let addDays: typeof import("date-fns").addDays;
  let subDays: typeof import("date-fns").subDays;
  let getYear: typeof import("date-fns").getYear;
  let getMonth: typeof import("date-fns").getMonth;
  let getDate: typeof import("date-fns").getDate;
  let getHours: typeof import("date-fns").getHours;
  let getMinutes: typeof import("date-fns").getMinutes;
  let getSeconds: typeof import("date-fns").getSeconds;
  let formatISO: typeof import("date-fns").formatISO;
  let fromZonedTime: typeof import("date-fns-tz").fromZonedTime;
  let toZonedTime: typeof import("date-fns-tz").toZonedTime;

  try {
    const dateFns = await import("date-fns");
    const dateFnsTz = await import("date-fns-tz");

    addMinutes = dateFns.addMinutes;
    addDays = dateFns.addDays;
    subDays = dateFns.subDays;
    getYear = dateFns.getYear;
    getMonth = dateFns.getMonth;
    getDate = dateFns.getDate;
    getHours = dateFns.getHours;
    getMinutes = dateFns.getMinutes;
    getSeconds = dateFns.getSeconds;
    formatISO = dateFns.formatISO;
    fromZonedTime = dateFnsTz.fromZonedTime;
    toZonedTime = dateFnsTz.toZonedTime;
  } catch {
    throw new Error(
      "date-fns or date-fns-tz is not installed. Install with: npm install date-fns date-fns-tz",
    );
  }

  return {
    getYear: (dateFns) => getYear(dateFns.date),
    getMonth: (dateFns) => getMonth(dateFns.date) + 1,
    getDay: (dateFns) => getDate(dateFns.date),
    getHour: (dateFns) => getHours(dateFns.date),
    getMinute: (dateFns) => getMinutes(dateFns.date),
    getSecond: (dateFns) => getSeconds(dateFns.date),
    getZoneName: (dateFns) => dateFns.timeZone,
    plusMinutes: (dateFns, minutes) => ({
      date: addMinutes(dateFns.date, minutes),
      timeZone: dateFns.timeZone,
    }),
    plusDays: (dateFns, days) => ({
      date: addDays(dateFns.date, days),
      timeZone: dateFns.timeZone,
    }),
    minusDays: (dateFns, days) => ({
      date: subDays(dateFns.date, days),
      timeZone: dateFns.timeZone,
    }),
    toUTC: (dateFns) => ({
      date: fromZonedTime(dateFns.date, dateFns.timeZone),
      timeZone: "UTC",
    }),
    toISO: (dateFns) => formatISO(dateFns.date),
    toMillis: (dateFns) => dateFns.date.getTime(),
    fromMillis: (millis, zone) => ({
      date: new Date(millis),
      timeZone: zone,
    }),
    createUTC: (year, month, day, hour, minute, second) => ({
      date: new Date(Date.UTC(year, month - 1, day, hour, minute, second)),
      timeZone: "UTC",
    }),
    setZone: (dateFns, zoneName) => ({
      date: toZonedTime(dateFns.date, zoneName),
      timeZone: zoneName,
    }),
    isGreaterThanOrEqual: (date1, date2) => date1.date >= date2.date,
  };
}
