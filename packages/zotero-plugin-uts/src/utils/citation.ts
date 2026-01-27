import type { BiblioResult } from "@/types";

export function formatCitationMessage(itemCount: number): string {
  return `Copied ${itemCount} citation${itemCount > 1 ? "s" : ""} to clipboard`;
}

export function getBibliographyFormat(styleId: string): string {
  return `bibliography=${styleId}`;
}

export function extractTextFromBiblio(biblio: BiblioResult): string {
  return typeof biblio === "string" ? biblio : biblio.text || "";
}
