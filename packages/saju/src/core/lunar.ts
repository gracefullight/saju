import { Lunar, Solar } from "lunar-javascript";

export interface LunarDate {
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeapMonth: boolean;
}

export function getLunarDate(year: number, month: number, day: number): LunarDate {
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();
  const rawMonth = lunar.getMonth();
  const isLeapMonth = rawMonth < 0;

  return {
    lunarYear: lunar.getYear(),
    lunarMonth: isLeapMonth ? Math.abs(rawMonth) : rawMonth,
    lunarDay: lunar.getDay(),
    isLeapMonth,
  };
}

export function getSolarDate(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  isLeapMonth = false,
): { year: number; month: number; day: number } {
  // lunar-javascript uses negative month for leap months
  const month = isLeapMonth ? -lunarMonth : lunarMonth;
  const lunar = Lunar.fromYmd(lunarYear, month, lunarDay);
  const solar = lunar.getSolar();

  return {
    year: solar.getYear(),
    month: solar.getMonth(),
    day: solar.getDay(),
  };
}
