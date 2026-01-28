export const FUNDING_GITHUB_URL = "https://github.com/sponsors/gracefullight";
export const FUNDING_COFFEE_URL = "https://buymeacoffee.com/gracefullight";
export const GITHUB_REPO_URL = "https://github.com/gracefullight/pkgs";
export const HOMEPAGE_URL =
  "https://github.com/gracefullight/pkgs/tree/main/packages/zotero-plugin-uts";
export const AUTHOR_NAME = "gracefullight";

export const NUDGE_THRESHOLDS = {
  STAR: 5,
  COFFEE: 15,
  SPONSOR: 30,
} as const;

export const PREF_KEYS = {
  COPY_COUNT: "extensions.zotero-uts.copyCount",
  NUDGE_STAR_SHOWN: "extensions.zotero-uts.nudgeStarShown",
  NUDGE_COFFEE_SHOWN: "extensions.zotero-uts.nudgeCoffeeShown",
  NUDGE_SPONSOR_SHOWN: "extensions.zotero-uts.nudgeSponsorShown",
} as const;
