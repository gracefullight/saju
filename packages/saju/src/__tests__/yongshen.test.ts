import { describe, expect, it } from "vitest";
import { analyzeYongShen, getElementRecommendations } from "@/core/yongshen";

describe("yongshen", () => {
  describe("analyzeYongShen", () => {
    it("returns yongshen analysis result", () => {
      const result = analyzeYongShen("甲子", "丙寅", "甲辰", "乙亥");

      expect(result.primary).toBeDefined();
      expect(result.method).toBeDefined();
      expect(result.reasoning).toBeDefined();
      expect(result.allElements).toBeDefined();
    });

    it("identifies yongshen elements correctly", () => {
      const result = analyzeYongShen("甲子", "丙寅", "甲辰", "乙亥");

      expect(result.allElements[result.primary.key].isYongShen).toBe(true);
    });

    it("identifies kishen elements correctly", () => {
      const result = analyzeYongShen("甲子", "丙寅", "甲辰", "乙亥");

      const hasKiShen = Object.values(result.allElements).some((e) => e.isKiShen);
      expect(hasKiShen).toBe(true);
    });

    it("uses 억부 method for 중화 strength (조후 is adjustment, not primary)", () => {
      const result = analyzeYongShen("甲子", "丙寅", "庚申", "丁亥");
      expect(["balance", "formation"]).toContain(result.method.key);
    });

    it("uses 억부 method for extreme strength", () => {
      const result = analyzeYongShen("甲寅", "甲寅", "甲寅", "甲寅");
      expect(result.method.key).toBe("balance");
    });

    it("includes johuAdjustment field in result", () => {
      const result = analyzeYongShen("甲子", "丙寅", "甲辰", "乙亥");
      expect("johuAdjustment" in result).toBe(true);
    });

    it("includes reasoning in result", () => {
      const result = analyzeYongShen("甲子", "丙寅", "甲辰", "乙亥");
      expect(result.reasoning.length).toBeGreaterThan(0);
    });
  });

  describe("getElementRecommendations", () => {
    it("returns colors for yongshen element", () => {
      const yongShen = analyzeYongShen("甲子", "丙寅", "甲辰", "乙亥");
      const recommendations = getElementRecommendations(yongShen);

      expect(recommendations.colors.length).toBeGreaterThan(0);
    });

    it("returns directions for yongshen element", () => {
      const yongShen = analyzeYongShen("甲子", "丙寅", "甲辰", "乙亥");
      const recommendations = getElementRecommendations(yongShen);

      expect(recommendations.directions.length).toBeGreaterThan(0);
    });

    it("returns numbers for yongshen element", () => {
      const yongShen = analyzeYongShen("甲子", "丙寅", "甲辰", "乙亥");
      const recommendations = getElementRecommendations(yongShen);

      expect(recommendations.numbers.length).toBeGreaterThan(0);
    });

    it("includes secondary element recommendations when present", () => {
      const yongShen = analyzeYongShen("甲子", "丙寅", "甲辰", "乙亥");

      if (yongShen.secondary) {
        const recommendations = getElementRecommendations(yongShen);
        expect(recommendations.colors.length).toBeGreaterThan(2);
      }
    });
  });
});
