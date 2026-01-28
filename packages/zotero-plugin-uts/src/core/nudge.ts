import {
  FUNDING_COFFEE_URL,
  FUNDING_GITHUB_URL,
  GITHUB_REPO_URL,
  NUDGE_THRESHOLDS,
  PREF_KEYS,
} from "@/constants";
import type { ZoteroAPI } from "@/types";

declare const Zotero: ZoteroAPI;

declare const Services: {
  prefs: {
    getIntPref: (key: string, fallback: number) => number;
    setIntPref: (key: string, value: number) => void;
    getBoolPref: (key: string, fallback: boolean) => boolean;
    setBoolPref: (key: string, value: boolean) => void;
  };
};

interface NudgeConfig {
  threshold: number;
  prefKey: string;
  title: string;
  message: string;
  url: string;
}

const NUDGE_CONFIGS: NudgeConfig[] = [
  {
    threshold: NUDGE_THRESHOLDS.STAR,
    prefKey: PREF_KEYS.NUDGE_STAR_SHOWN,
    title: "UTS Citation ⭐",
    message: "Like it? Star us on GitHub!",
    url: GITHUB_REPO_URL,
  },
  {
    threshold: NUDGE_THRESHOLDS.COFFEE,
    prefKey: PREF_KEYS.NUDGE_COFFEE_SHOWN,
    title: "UTS Citation ☕",
    message: "Buy me a coffee?",
    url: FUNDING_COFFEE_URL,
  },
  {
    threshold: NUDGE_THRESHOLDS.SPONSOR,
    prefKey: PREF_KEYS.NUDGE_SPONSOR_SHOWN,
    title: "UTS Citation 💜",
    message: "Become a sponsor!",
    url: FUNDING_GITHUB_URL,
  },
];

function getIntPref(key: string, fallback: number): number {
  try {
    return Services.prefs.getIntPref(key, fallback);
  } catch {
    return fallback;
  }
}

function setIntPref(key: string, value: number): void {
  try {
    Services.prefs.setIntPref(key, value);
  } catch (e) {
    Zotero.debug(`UTS Citation: Failed to set int pref ${key}: ${e}`);
  }
}

function getBoolPref(key: string, fallback: boolean): boolean {
  try {
    return Services.prefs.getBoolPref(key, fallback);
  } catch {
    return fallback;
  }
}

function setBoolPref(key: string, value: boolean): void {
  try {
    Services.prefs.setBoolPref(key, value);
  } catch (e) {
    Zotero.debug(`UTS Citation: Failed to set bool pref ${key}: ${e}`);
  }
}

function getCopyCount(): number {
  return getIntPref(PREF_KEYS.COPY_COUNT, 0);
}

function incrementCopyCount(): number {
  const newCount = getCopyCount() + 1;
  setIntPref(PREF_KEYS.COPY_COUNT, newCount);
  return newCount;
}

function isNudgeShown(prefKey: string): boolean {
  return getBoolPref(prefKey, false);
}

function markNudgeShown(prefKey: string): void {
  setBoolPref(prefKey, true);
}

function showNudgeNotification(config: NudgeConfig): void {
  try {
    const pw = new Zotero.ProgressWindow();
    pw.changeHeadline(config.title);
    pw.addDescription(`${config.message}\n\n👉 ${config.url}`);
    pw.show();
    pw.startCloseTimer(6000);

    markNudgeShown(config.prefKey);
    Zotero.debug(`UTS Citation: Showed nudge for ${config.prefKey}`);
  } catch (e) {
    Zotero.debug(`UTS Citation: Nudge notification error: ${e}`);
  }
}

export function checkAndShowNudge(): void {
  const count = incrementCopyCount();

  for (const config of NUDGE_CONFIGS) {
    if (count === config.threshold && !isNudgeShown(config.prefKey)) {
      showNudgeNotification(config);
      break;
    }
  }
}
