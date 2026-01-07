import { describe, expect, it } from "vitest";
import { getLunarDate, getSolarDate } from "@/core/lunar";

describe("Lunar Calendar", () => {
  describe("getLunarDate", () => {
    it("should convert solar date to lunar date (2000-01-01)", () => {
      const result = getLunarDate(2000, 1, 1);
      expect(result.lunarYear).toBe(1999);
      expect(result.lunarMonth).toBe(11);
      expect(result.lunarDay).toBe(25);
      expect(result.isLeapMonth).toBe(false);
    });

    it("should convert solar date to lunar date (1985-05-15)", () => {
      const result = getLunarDate(1985, 5, 15);
      expect(result.lunarYear).toBe(1985);
      expect(result.lunarMonth).toBe(3);
      expect(result.lunarDay).toBe(26);
      expect(result.isLeapMonth).toBe(false);
    });

    it("should handle leap month correctly (2023-03-22 is in leap 2nd month)", () => {
      const result = getLunarDate(2023, 3, 22);
      expect(result.lunarYear).toBe(2023);
      expect(result.lunarMonth).toBe(2);
      expect(result.isLeapMonth).toBe(true);
    });

    it("should convert first day of lunar year", () => {
      const result = getLunarDate(2024, 2, 10);
      expect(result.lunarYear).toBe(2024);
      expect(result.lunarMonth).toBe(1);
      expect(result.lunarDay).toBe(1);
      expect(result.isLeapMonth).toBe(false);
    });
  });

  describe("getSolarDate", () => {
    it("should convert lunar date to solar date", () => {
      const result = getSolarDate(1999, 11, 25, false);
      expect(result.year).toBe(2000);
      expect(result.month).toBe(1);
      expect(result.day).toBe(1);
    });

    it("should convert lunar date (1985-03-26) to solar date", () => {
      const result = getSolarDate(1985, 3, 26, false);
      expect(result.year).toBe(1985);
      expect(result.month).toBe(5);
      expect(result.day).toBe(15);
    });

    it("should handle leap month in reverse conversion", () => {
      const result = getSolarDate(2023, 2, 1, true);
      expect(result.year).toBe(2023);
      expect(result.month).toBe(3);
      expect(result.day).toBe(22);
    });

    it("should convert first day of lunar year 2024", () => {
      const result = getSolarDate(2024, 1, 1, false);
      expect(result.year).toBe(2024);
      expect(result.month).toBe(2);
      expect(result.day).toBe(10);
    });
  });

  describe("round-trip conversion", () => {
    it("should convert solar -> lunar -> solar correctly", () => {
      const original = { year: 2000, month: 6, day: 15 };
      const lunar = getLunarDate(original.year, original.month, original.day);
      const backToSolar = getSolarDate(
        lunar.lunarYear,
        lunar.lunarMonth,
        lunar.lunarDay,
        lunar.isLeapMonth,
      );

      expect(backToSolar.year).toBe(original.year);
      expect(backToSolar.month).toBe(original.month);
      expect(backToSolar.day).toBe(original.day);
    });

    it("should handle various dates in round-trip", () => {
      const testDates = [
        { year: 1990, month: 3, day: 20 },
        { year: 2010, month: 8, day: 1 },
        { year: 2020, month: 12, day: 31 },
      ];

      for (const date of testDates) {
        const lunar = getLunarDate(date.year, date.month, date.day);
        const backToSolar = getSolarDate(
          lunar.lunarYear,
          lunar.lunarMonth,
          lunar.lunarDay,
          lunar.isLeapMonth,
        );

        expect(backToSolar.year).toBe(date.year);
        expect(backToSolar.month).toBe(date.month);
        expect(backToSolar.day).toBe(date.day);
      }
    });
  });
});
