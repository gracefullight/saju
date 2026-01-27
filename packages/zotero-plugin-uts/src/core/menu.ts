import { KEY_ID, MENU_ID, MENU_LABEL, PLUGIN_ID, TOOLS_MENU_ID } from "@/constants";
import { pluginState } from "@/core/plugin-state";
import type { ZoteroAPI } from "@/types";

declare const Zotero: ZoteroAPI;

const ZOTERO_8_MENU_TARGETS = {
  itemContext: "main/library/item",
  toolsMenu: "main/menubar/tools",
} as const;

export function registerMenus(onCommand: () => Promise<void>): void {
  if (Zotero.Menu) {
    registerMenusV8(onCommand);
  } else {
    registerMenusLegacy(onCommand);
  }
}

export function unregisterMenus(): void {
  if (Zotero.Menu) {
    unregisterMenusV8();
  } else {
    unregisterMenusLegacy();
  }
}

function registerMenusV8(onCommand: () => Promise<void>): void {
  const iconPath = pluginState.rootURI ? `${pluginState.rootURI}icon.svg` : undefined;

  Zotero.Menu?.registerMenu(PLUGIN_ID, ZOTERO_8_MENU_TARGETS.itemContext, {
    id: MENU_ID,
    label: MENU_LABEL,
    icon: iconPath,
    commandListener: onCommand,
  });

  Zotero.Menu?.registerMenu(PLUGIN_ID, ZOTERO_8_MENU_TARGETS.toolsMenu, {
    id: TOOLS_MENU_ID,
    label: MENU_LABEL,
    icon: iconPath,
    commandListener: onCommand,
  });

  Zotero.debug("UTS Copy: Registered menus via Zotero 8 API");
}

function unregisterMenusV8(): void {
  Zotero.Menu?.unregisterMenu(PLUGIN_ID, MENU_ID);
  Zotero.Menu?.unregisterMenu(PLUGIN_ID, TOOLS_MENU_ID);
  Zotero.debug("UTS Copy: Unregistered menus via Zotero 8 API");
}

function registerMenusLegacy(onCommand: () => Promise<void>): void {
  for (const win of Zotero.getMainWindows()) {
    addMenusToWindow(win, onCommand);
  }
  Zotero.debug("UTS Copy: Registered menus via legacy API");
}

function unregisterMenusLegacy(): void {
  for (const win of Zotero.getMainWindows()) {
    removeMenusFromWindow(win);
  }
  Zotero.debug("UTS Copy: Unregistered menus via legacy API");
}

function addMenusToWindow(window: Window, onCommand: () => Promise<void>): void {
  const document = window.document;

  addContextMenu(document, onCommand);
  addToolsMenu(document, onCommand);
  addKeyboardShortcut(document, onCommand);
}

function removeMenusFromWindow(window: Window): void {
  const document = window.document;

  document.getElementById(MENU_ID)?.remove();
  document.getElementById(TOOLS_MENU_ID)?.remove();
  document.getElementById(KEY_ID)?.remove();
}

function addContextMenu(document: Document, onCommand: () => Promise<void>): void {
  const itemMenu = document.getElementById("zotero-itemmenu");
  if (!itemMenu) return;

  document.getElementById(MENU_ID)?.remove();

  const menuItem = createMenuItem(document);
  menuItem.id = MENU_ID;
  menuItem.addEventListener("command", onCommand);
  itemMenu.appendChild(menuItem);
}

function addToolsMenu(document: Document, onCommand: () => Promise<void>): void {
  const toolsMenu = document.getElementById("menu_ToolsPopup");
  if (!toolsMenu) return;

  document.getElementById(TOOLS_MENU_ID)?.remove();

  const menuItem = createMenuItem(document);
  menuItem.id = TOOLS_MENU_ID;
  menuItem.setAttribute("key", KEY_ID);
  menuItem.addEventListener("command", onCommand);
  toolsMenu.appendChild(menuItem);
}

function addKeyboardShortcut(document: Document, onCommand: () => Promise<void>): void {
  const keyset =
    document.getElementById("mainKeyset") ??
    document.querySelector("keyset") ??
    document.documentElement;

  document.getElementById(KEY_ID)?.remove();

  const key = document.createXULElement
    ? document.createXULElement("key")
    : document.createElement("key");

  key.id = KEY_ID;
  key.setAttribute("modifiers", "accel,shift");
  key.setAttribute("key", "U");
  key.setAttribute("oncommand", "void(0);");
  key.addEventListener("command", onCommand);
  keyset.appendChild(key);
}

function createMenuItem(document: Document): Element {
  const menuItem = document.createXULElement
    ? document.createXULElement("menuitem")
    : document.createElement("menuitem");

  menuItem.setAttribute("label", MENU_LABEL);
  menuItem.setAttribute("class", "menuitem-iconic");

  const iconPath = pluginState.rootURI;
  if (iconPath) {
    menuItem.setAttribute("image", `${iconPath}icon.svg`);
  }

  return menuItem;
}

export function addToWindow(window: Window, onCommand: () => Promise<void>): void {
  if (!Zotero.Menu) {
    addMenusToWindow(window, onCommand);
  }
}

export function removeFromWindow(window: Window): void {
  if (!Zotero.Menu) {
    removeMenusFromWindow(window);
  }
}
