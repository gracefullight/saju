import type { ZoteroAPI } from "@/types";

declare const Zotero: ZoteroAPI;

export async function installStyle(rootURI: string) {
  try {
    const styleURI = `${rootURI}uts-apa.csl`;
    const response = await fetch(styleURI);
    if (!response.ok) {
      Zotero.debug(`UTS Citation: Failed to fetch style ${styleURI}`);
      return;
    }
    const styleContent = await response.text();

    await Zotero.Styles.install(styleContent, styleURI, true);
    Zotero.debug("UTS Citation: Installed UTS APA 7th style");
  } catch (e) {
    Zotero.debug(`UTS Citation: Error installing style: ${e}`);
  }
}
