import type { ZoteroAPI } from "@/types";

declare const Zotero: ZoteroAPI;

export async function installStyle(rootURI: string) {
  try {
    const styleURI = `${rootURI}uts-apa.csl`;
    const response = await fetch(styleURI);
    if (!response.ok) {
      Zotero.debug(`UTS Copy: Failed to fetch style ${styleURI}`);
      return;
    }
    const styleContent = await response.text();

    await Zotero.Styles.install(styleContent, styleURI, false);
    Zotero.debug("UTS Copy: Installed UTS APA 7th style");
  } catch (e) {
    Zotero.debug(`UTS Copy: Error installing style: ${e}`);
  }
}
