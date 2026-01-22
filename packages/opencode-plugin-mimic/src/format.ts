import { differenceInHours, format, formatDistanceToNow } from "date-fns";
import type { State } from "@/types";

export type SessionStatus =
  | "first-time"
  | "continuing"
  | "same-day"
  | "short-break"
  | "week-break"
  | "long-break";

export function analyzeTimeSinceLastSession(lastSession: string | null): SessionStatus {
  if (!lastSession) return "first-time";
  const hours = differenceInHours(new Date(), new Date(lastSession));
  if (hours < 1) return "continuing";
  if (hours < 24) return "same-day";
  if (hours < 72) return "short-break";
  if (hours < 168) return "week-break";
  return "long-break";
}

export function formatJourney(state: State, gitHistory: string[]): string {
  const milestones = state.journey.milestones.slice(-10);
  const observations = state.journey.observations.slice(-5);

  let output = `## 📦 ${state.project.name}'s Journey\n\n`;
  output += `*The mimic opens its lid, revealing ancient scrolls within...*\n\n`;
  output += `**Sessions survived**: ${state.journey.sessionCount}\n`;
  output += `**First encounter**: ${format(state.project.firstSession, "yyyy-MM-dd")}\n`;
  output += `**Abilities gained**: ${state.evolution.capabilities.length}\n\n`;

  if (state.project.stack && state.project.stack.length > 0) {
    output += `**Treasures inside**: ${state.project.stack.join(", ")}\n`;
  }
  if (state.project.focus) {
    output += `**Current hunt**: ${state.project.focus}\n`;
  }
  output += "\n";

  if (milestones.length > 0) {
    output += `### 🏆 Victories\n`;
    for (const m of milestones) {
      const timeAgo = formatDistanceToNow(new Date(m.timestamp), { addSuffix: true });
      output += `- ${m.milestone} (${timeAgo})\n`;
    }
    output += "\n";
  }

  if (observations.length > 0) {
    output += `### 👁️ What I've Witnessed\n`;
    for (const o of observations) {
      output += `- ${o.observation}\n`;
    }
    output += "\n";
  }

  if (state.evolution.capabilities.length > 0) {
    output += `### ✨ Powers Absorbed\n`;
    for (const cap of state.evolution.capabilities.slice(-5)) {
      output += `- **${cap.name}** (${cap.type}): ${cap.description}\n`;
    }
    output += "\n";
  }

  if (gitHistory.length > 0) {
    output += `### 📜 Recent Scrolls\n`;
    for (const commit of gitHistory.slice(0, 5)) {
      output += `- ${commit}\n`;
    }
  }

  return output;
}

export function formatDuration(ms: number): string {
  const minutes = Math.round(ms / 1000 / 60);
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}min`;
}

export function formatGrowAnalysis(
  state: State,
  _gitHistory: string[],
  recentFiles: string[],
): string {
  let output = `## 📦 ${state.project.name} - Territory Analysis\n\n`;
  output += `*The mimic surveys the dungeon, noting paths most traveled...*\n\n`;

  const fileFrequency = Object.entries(state.statistics.filesModified)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  if (fileFrequency.length > 0) {
    output += `### 🔥 Feeding Grounds (Most Modified)\n`;
    for (const [file, count] of fileFrequency) {
      output += `- \`${file}\` (${count}x)\n`;
    }
    output += "\n";
  }

  const toolPatterns = state.patterns
    .filter((p) => p.type === "tool")
    .sort((a, b) => b.count - a.count);
  if (toolPatterns.length > 0) {
    output += `### 🦷 Favorite Prey (Tool Patterns)\n`;
    for (const p of toolPatterns.slice(0, 5)) {
      output += `- ${p.description}: ${p.count} bites\n`;
    }
    output += "\n";
  }

  if (recentFiles.length > 0) {
    const dirCount = new Map<string, number>();
    for (const file of recentFiles) {
      const dir = file.split("/").slice(0, -1).join("/") || ".";
      dirCount.set(dir, (dirCount.get(dir) || 0) + 1);
    }
    const sortedDirs = [...dirCount.entries()].sort((a, b) => b[1] - a[1]);

    output += `### 🗺️ Hunting Grounds\n`;
    for (const [dir, count] of sortedDirs.slice(0, 5)) {
      output += `- \`${dir}/\` (${count} prey)\n`;
    }
    output += "\n";
  }

  output += `### 🤔 The Chest Wonders...\n`;
  output += `- What treasure shall we hunt next?\n`;
  output += `- Are there forgotten corners of the dungeon?\n`;
  output += `- Does the current path lead to glory?\n`;

  if (state.project.focus) {
    output += `\n**Current hunt**: ${state.project.focus}\n`;
  }

  return output;
}
