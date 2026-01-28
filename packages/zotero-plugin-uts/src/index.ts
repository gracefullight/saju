import {
  addToWindow,
  checkFirstRun,
  copyCitation,
  installStyle,
  onPrefsEvent,
  pluginState,
  registerMenus,
  registerPreferencePane,
  removeFromWindow,
  unregisterMenus,
} from "@/core";
import type { PluginContext, ZoteroAPI } from "@/types";

declare const Zotero: ZoteroAPI;

const handleCopyCitation = async () => copyCitation();

export function onWindowLoad(window: Window): void {
  addToWindow(window, handleCopyCitation);
}

export function onWindowUnload(window: Window): void {
  removeFromWindow(window);
}

export async function startup(context: PluginContext): Promise<void> {
  Zotero.debug("UTS Citation: Startup");
  pluginState.initialize(context);

  await installStyle(context.rootURI);
  registerMenus(handleCopyCitation);
  registerPreferencePane(context.rootURI);
  checkFirstRun(context.version);
}

export function shutdown(): void {
  Zotero.debug("UTS Citation: Shutdown");
  unregisterMenus();
  pluginState.reset();
}

export { addToWindow, onPrefsEvent, removeFromWindow };
