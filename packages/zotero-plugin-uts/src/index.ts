import {
  addToWindow,
  checkFirstRun,
  copyCitation,
  installStyle,
  pluginState,
  registerMenus,
  registerPreferencePane,
  removeFromWindow,
  unregisterMenus,
} from "@/core";
import type { PluginContext, ZoteroAPI } from "@/types";

declare const Zotero: ZoteroAPI;

declare const Cc: Record<
  string,
  { getService: (iface: unknown) => { registerResource: (name: string, uri: unknown) => void } }
>;
declare const Ci: { nsIResProtocolHandler: unknown };
declare const Services: {
  io: { newURI: (uri: string) => unknown };
};

const handleCopyCitation = async () => copyCitation();

export function onWindowLoad(window: Window): void {
  addToWindow(window, handleCopyCitation);
}

export function onWindowUnload(window: Window): void {
  removeFromWindow(window);
}

function registerChrome(rootURI: string): void {
  try {
    const resHandler = Cc["@mozilla.org/network/protocol;1?name=resource"].getService(
      Ci.nsIResProtocolHandler,
    );
    resHandler.registerResource("uts-copy", Services.io.newURI(rootURI));

    const chromeHandler = Cc["@mozilla.org/network/protocol;1?name=chrome"].getService(
      Ci.nsIResProtocolHandler,
    );
    chromeHandler.registerResource("uts-copy", Services.io.newURI(`${rootURI}content/`));

    Zotero.debug("UTS Copy: Chrome resources registered");
  } catch (e) {
    Zotero.debug(`UTS Copy: Chrome registration skipped: ${e}`);
  }
}

export async function startup(context: PluginContext): Promise<void> {
  Zotero.debug("UTS Copy: Startup");
  pluginState.initialize(context);

  registerChrome(context.rootURI);
  await installStyle(context.rootURI);
  registerMenus(handleCopyCitation);
  registerPreferencePane();
  checkFirstRun(context.version);
}

export function shutdown(): void {
  Zotero.debug("UTS Copy: Shutdown");
  unregisterMenus();
  pluginState.reset();
}

export { addToWindow, removeFromWindow };
