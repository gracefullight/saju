import { detectCommitPatterns, getCommitMessages } from "@/git";
import type { StateManager } from "@/state";
import type { Pattern } from "@/types";

export async function detectPatterns(
  stateManager: StateManager,
  directory: string,
): Promise<Pattern[]> {
  const state = await stateManager.read();
  const newPatterns: Pattern[] = [];

  const commitMessages = getCommitMessages(directory);
  const commitPatterns = detectCommitPatterns(commitMessages);
  for (const [msg, count] of commitPatterns) {
    if (count >= 3) {
      const existing = state.patterns.find((p) => p.type === "commit" && p.description === msg);
      if (!existing) {
        newPatterns.push({
          id: crypto.randomUUID(),
          type: "commit",
          description: msg,
          count,
          firstSeen: Date.now(),
          lastSeen: Date.now(),
          surfaced: false,
          examples: [],
        });
      }
    }
  }

  const fileStats = state.statistics.filesModified;
  for (const [file, count] of Object.entries(fileStats)) {
    if (count >= 5) {
      const existing = state.patterns.find((p) => p.type === "file" && p.description === file);
      if (!existing) {
        newPatterns.push({
          id: crypto.randomUUID(),
          type: "file",
          description: file,
          count,
          firstSeen: Date.now(),
          lastSeen: Date.now(),
          surfaced: false,
          examples: [],
        });
      }
    }
  }

  return newPatterns;
}

export async function surfacePatterns(stateManager: StateManager): Promise<string[]> {
  const state = await stateManager.read();
  const suggestions: string[] = [];

  for (const pattern of state.patterns) {
    if (pattern.surfaced) continue;
    if (pattern.count < state.preferences.minPatternCount) continue;

    let suggestion = "";
    switch (pattern.type) {
      case "commit":
        suggestion = `📦 *munch munch* I've digested "${pattern.description}" ${pattern.count}+ times. Want me to spit out a shortcut?`;
        break;
      case "file":
        suggestion = `📦 *peers at file* You keep poking "${pattern.description}" (${pattern.count}x). Should I keep an eye on it?`;
        break;
      case "tool":
        suggestion = `📦 *teeth click* "${pattern.description}" is tasty... you use it often. Custom tool, perhaps?`;
        break;
      case "sequence":
        suggestion = `📦 *lid rattles* I sense a pattern in your movements... Let me automate this for you?`;
        break;
    }
    suggestions.push(suggestion);
  }

  return suggestions;
}
