import { describe, expect, it } from "vitest";
import { MENU_ID, PLUGIN_ID, STYLE_ID, TOOLS_MENU_ID } from "@/constants";
import { extractTextFromBiblio, formatCitationMessage, getBibliographyFormat } from "@/utils";

describe("constants", () => {
  it("should have correct plugin ID", () => {
    expect(PLUGIN_ID).toBe("uts-citation@gracefullight.dev");
  });

  it("should have correct style ID", () => {
    expect(STYLE_ID).toBe("http://www.zotero.org/styles/uts-apa-7th");
  });

  it("should have correct menu IDs", () => {
    expect(MENU_ID).toBe("uts-citation-menuitem");
    expect(TOOLS_MENU_ID).toBe("uts-citation-tools-menuitem");
  });
});

describe("formatCitationMessage", () => {
  it("should return singular form for 1 item", () => {
    expect(formatCitationMessage(1)).toBe("Copied 1 citation to clipboard");
  });

  it("should return plural form for multiple items", () => {
    expect(formatCitationMessage(2)).toBe("Copied 2 citations to clipboard");
    expect(formatCitationMessage(10)).toBe("Copied 10 citations to clipboard");
  });

  it("should handle zero items", () => {
    expect(formatCitationMessage(0)).toBe("Copied 0 citation to clipboard");
  });
});

describe("getBibliographyFormat", () => {
  it("should return correct format string", () => {
    expect(getBibliographyFormat(STYLE_ID)).toBe(
      "bibliography=http://www.zotero.org/styles/uts-apa-7th",
    );
  });

  it("should work with custom style IDs", () => {
    expect(getBibliographyFormat("custom-style")).toBe("bibliography=custom-style");
  });
});

describe("extractTextFromBiblio", () => {
  it("should return string directly if biblio is a string", () => {
    expect(extractTextFromBiblio("Some citation text")).toBe("Some citation text");
  });

  it("should extract text property from object", () => {
    expect(extractTextFromBiblio({ text: "Citation from object" })).toBe("Citation from object");
  });

  it("should return empty string if object has no text", () => {
    expect(extractTextFromBiblio({})).toBe("");
  });

  it("should return empty string if text is undefined", () => {
    expect(extractTextFromBiblio({ text: undefined })).toBe("");
  });
});
