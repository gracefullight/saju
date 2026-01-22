import type { CreatorLevel, State } from "@/types";

interface LevelConfig {
  greetingStyle: "formal" | "casual" | "minimal" | "chaotic";
  detailLevel: "high" | "medium" | "low";
  useEmoji: boolean;
  technicalTerms: boolean;
}

const LEVEL_CONFIGS: Record<CreatorLevel, LevelConfig> = {
  technical: {
    greetingStyle: "minimal",
    detailLevel: "high",
    useEmoji: false,
    technicalTerms: true,
  },
  "semi-technical": {
    greetingStyle: "casual",
    detailLevel: "medium",
    useEmoji: false,
    technicalTerms: true,
  },
  "non-technical": {
    greetingStyle: "formal",
    detailLevel: "low",
    useEmoji: true,
    technicalTerms: false,
  },
  chaotic: {
    greetingStyle: "chaotic",
    detailLevel: "medium",
    useEmoji: true,
    technicalTerms: true,
  },
};

export function getLevelConfig(level: CreatorLevel | null): LevelConfig {
  return LEVEL_CONFIGS[level ?? "technical"];
}

export function adaptMessage(message: string, state: State): string {
  const config = getLevelConfig(state.project.creatorLevel);

  if (config.greetingStyle === "minimal") {
    return message.replace(/^#+\s*/gm, "").trim();
  }

  if (config.greetingStyle === "chaotic") {
    const chaosEmojis = ["🔥", "⚡", "🚀", "💥", "✨"];
    const emoji = chaosEmojis[Math.floor(Math.random() * chaosEmojis.length)];
    return `${emoji} ${message}`;
  }

  return message;
}

export function formatGreeting(state: State): string {
  const config = getLevelConfig(state.project.creatorLevel);
  const name = state.project.name;

  switch (config.greetingStyle) {
    case "minimal":
      return `📦 ${name} | s${state.journey.sessionCount} | p${state.patterns.length}`;
    case "casual":
      return `📦 *creak* Back to ${name}. I've been watching... Session ${state.journey.sessionCount}.`;
    case "formal":
      return `📦 The chest opens... Welcome back to ${name}. Session ${state.journey.sessionCount}.`;
    case "chaotic": {
      const greetings = ["*CHOMP*", "*lid creaks*", "*teeth gleam*", "*tongue flicks*"];
      const g = greetings[Math.floor(Math.random() * greetings.length)];
      return `📦 ${g} ${name}! #${state.journey.sessionCount}`;
    }
  }
}

export function formatSuggestion(suggestion: string, state: State): string {
  const config = getLevelConfig(state.project.creatorLevel);

  if (!config.technicalTerms) {
    return suggestion
      .replace(/tool/gi, "shortcut")
      .replace(/pattern/gi, "habit")
      .replace(/hook/gi, "automation");
  }

  return suggestion;
}
