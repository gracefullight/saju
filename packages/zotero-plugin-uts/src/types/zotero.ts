export interface ZoteroPane {
  getSelectedItems: () => unknown[];
}

export interface ZoteroProgressWindow {
  changeHeadline: (text: string) => void;
  addDescription: (text: string) => void;
  show: () => void;
  startCloseTimer: (ms: number) => void;
}

export interface ZoteroStyles {
  get: (id: string) => unknown;
  install: (content: string, uri: string, temp: boolean) => Promise<void>;
}

export interface ZoteroQuickCopy {
  getContentFromItems: (items: unknown[], format: string) => BiblioResult;
}

export interface MenuItemOptions {
  id: string;
  l10nId?: string;
  label?: string;
  icon?: string;
  commandListener: (event: Event) => void | Promise<void>;
  condition?: (event: Event) => boolean;
}

export interface SubMenuOptions {
  id: string;
  l10nId?: string;
  label?: string;
  icon?: string;
  children: (MenuItemOptions | SubMenuOptions)[];
  condition?: (event: Event) => boolean;
}

export interface ZoteroMenu {
  registerMenu: (
    pluginID: string,
    target: string,
    options: MenuItemOptions | SubMenuOptions,
  ) => void;
  unregisterMenu: (pluginID: string, menuID: string) => void;
}

export interface ZoteroPrefs {
  get: (key: string) => unknown;
  set: (key: string, value: unknown) => void;
}

export interface ZoteroAPI {
  debug: (msg: string) => void;
  getMainWindows: () => Window[];
  getActiveZoteroPane: () => ZoteroPane | null;
  Styles: ZoteroStyles;
  QuickCopy: ZoteroQuickCopy;
  ProgressWindow: new () => ZoteroProgressWindow;
  Menu?: ZoteroMenu;
  Prefs?: ZoteroPrefs;
}

export interface MozillaClipboard {
  copyString: (s: string) => void;
}

export interface MozillaComponents {
  classes: Record<string, { getService: (iface: unknown) => MozillaClipboard }>;
  interfaces: { nsIClipboardHelper: unknown };
}

export interface MozillaServices {
  scriptloader: {
    loadSubScript: (uri: string) => void;
  };
}

export type BiblioResult = { text?: string } | string;

export interface PluginContext {
  id: string;
  version: string;
  rootURI: string;
}

export interface XULDocument extends Document {
  createXULElement?: (tagName: string) => Element;
}
