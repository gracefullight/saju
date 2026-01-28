import { STYLE_ID } from "@/constants";
import { checkAndShowNudge } from "@/core/nudge";
import type { MozillaComponents, ZoteroAPI } from "@/types";
import { extractTextFromBiblio, formatCitationMessage, getBibliographyFormat } from "@/utils";

declare const Zotero: ZoteroAPI;
declare const Components: MozillaComponents;

export type CopyResult = { success: true; count: number } | { success: false; error: string };

function showNotification(message: string, isError = false): void {
  try {
    const pw = new Zotero.ProgressWindow();
    pw.changeHeadline(isError ? "UTS Citation Error" : "UTS Citation");
    pw.addDescription(message);
    pw.show();
    pw.startCloseTimer(3000);
  } catch (e) {
    Zotero.debug(`UTS Citation: Notification error: ${e}`);
  }
}

async function copyToClipboard(text: string): Promise<void> {
  if (globalThis.navigator?.clipboard) {
    await globalThis.navigator.clipboard.writeText(text);
  } else {
    const clipboard = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(
      Components.interfaces.nsIClipboardHelper,
    );
    clipboard.copyString(text);
  }
}

export async function copyCitationCore(): Promise<CopyResult> {
  const pane = Zotero.getActiveZoteroPane();
  if (!pane) {
    return { success: false, error: "No active pane" };
  }

  const items = pane.getSelectedItems();
  if (!items || items.length === 0) {
    return { success: false, error: "No items selected" };
  }

  const format = getBibliographyFormat(STYLE_ID);
  const biblio = Zotero.QuickCopy.getContentFromItems(items, format);
  const text = extractTextFromBiblio(biblio);

  if (!text) {
    return { success: false, error: "Failed to generate citation" };
  }

  await copyToClipboard(text);
  return { success: true, count: items.length };
}

export async function copyCitation(): Promise<void> {
  try {
    const result = await copyCitationCore();

    if (result.success) {
      showNotification(formatCitationMessage(result.count));
      Zotero.debug(`UTS Citation: Copied ${result.count} citation(s) to clipboard`);
      checkAndShowNudge();
    } else {
      showNotification(result.error, true);
      Zotero.debug(`UTS Citation Error: ${result.error}`);
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    showNotification(`Error: ${errorMessage}`, true);
    Zotero.debug(`UTS Citation Error: ${errorMessage}`);
  }
}
