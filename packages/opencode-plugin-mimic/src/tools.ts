import { readdir, writeFile } from "node:fs/promises";
import { type ToolDefinition, tool } from "@opencode-ai/plugin";
import { format } from "date-fns";
import { evolveCapability, formatEvolutionResult, getEvolutionSuggestions } from "@/evolution";
import { analyzeTimeSinceLastSession, formatGrowAnalysis, formatJourney } from "@/format";
import { getGitHistory, getRecentlyModifiedFiles } from "@/git";
import { getLevelConfig } from "@/level";
import { surfacePatterns } from "@/patterns";
import { createDefaultState, type StateManager } from "@/state";
import type { CreatorLevel, Pattern, ToolCall } from "@/types";

export function createTools(
  stateManager: StateManager,
  directory: string,
  toolCalls: ToolCall[],
): Record<string, ToolDefinition> {
  return {
    "mimic:init": tool({
      description: "Initialize or wake up Mimic for this project",
      args: {},
      async execute() {
        const state = await stateManager.read();
        const isFirstTime = state.journey.sessionCount <= 1;

        if (isFirstTime) {
          return `# 📦 *creak...*

A treasure chest? In ${state.project.name}? 

*The lid opens slowly, revealing rows of gleaming teeth...*

I'm **Mimic**. I look like a chest, but I'm always watching. Always learning.

**What I devour... I mean, do:**
- 👁️ Watch your patterns (tools, files, commits)
- 🧠 Remember everything across sessions
- 📜 Track your project's journey
- ✨ Suggest shortcuts when I spot repetition

Use \`mimic:status\` to check in, \`mimic:journey\` to see your story.

*...the teeth retract. For now.*`;
        }

        const timeSince = analyzeTimeSinceLastSession(state.journey.lastSession);
        const recentObs = state.journey.observations.slice(-3);

        let greeting = `# 📦 *creak...*\n\n`;
        greeting += `*The chest's eye opens* Ah, you're back to **${state.project.name}**.\n\n`;
        greeting += `**Sessions**: ${state.journey.sessionCount} | **Patterns digested**: ${state.patterns.length}\n\n`;

        if (timeSince === "long-break") {
          greeting += `*dust falls from the lid* It's been a while... but I remember everything:\n\n`;
        }

        if (recentObs.length > 0) {
          greeting += `**What I've been chewing on:**\n`;
          for (const o of recentObs) {
            greeting += `- ${o.observation}\n`;
          }
        }

        return greeting;
      },
    }),

    "mimic:status": tool({
      description: "Check current status and recent activity",
      args: {},
      async execute() {
        const state = await stateManager.read();
        const recentFiles = getRecentlyModifiedFiles(directory);
        const gitHistory = getGitHistory(directory, 5);

        let output = `## ${state.project.name} Status\n\n`;
        output += `**Session**: ${state.journey.sessionCount}\n`;
        output += `**Patterns**: ${state.patterns.length} detected, ${state.patterns.filter((p) => p.surfaced).length} surfaced\n`;
        output += `**Tool calls this session**: ${toolCalls.length}\n\n`;

        if (recentFiles.length > 0) {
          output += `**Recently modified files:**\n`;
          for (const f of recentFiles.slice(0, 5)) {
            output += `- ${f}\n`;
          }
          output += "\n";
        }

        if (gitHistory.length > 0) {
          output += `**Recent commits:**\n`;
          for (const c of gitHistory) {
            output += `- ${c}\n`;
          }
        }

        const suggestions = await surfacePatterns(stateManager);
        if (suggestions.length > 0) {
          output += `\n**Suggestions:**\n`;
          for (const s of suggestions) {
            output += `- ${s}\n`;
          }
        }

        return output;
      },
    }),

    "mimic:journey": tool({
      description: "View the narrative story of your project's evolution",
      args: {},
      async execute() {
        const state = await stateManager.read();
        const gitHistory = getGitHistory(directory, 10);
        return formatJourney(state, gitHistory);
      },
    }),

    "mimic:patterns": tool({
      description: "Show all detected patterns",
      args: {},
      async execute() {
        const state = await stateManager.read();

        if (state.patterns.length === 0) {
          return "No patterns detected yet. Keep working, and I'll learn your patterns.";
        }

        let output = `## Detected Patterns\n\n`;
        output += `Total: ${state.patterns.length}\n\n`;

        const byType = new Map<string, Pattern[]>();
        for (const p of state.patterns) {
          const list = byType.get(p.type) || [];
          list.push(p);
          byType.set(p.type, list);
        }

        for (const [type, patterns] of byType) {
          output += `### ${type.charAt(0).toUpperCase() + type.slice(1)} Patterns\n`;
          for (const p of patterns.slice(0, 10)) {
            const status = p.surfaced ? "✓" : "○";
            output += `${status} **${p.description}** (${p.count}x)\n`;
          }
          output += "\n";
        }

        return output;
      },
    }),

    "mimic:observe": tool({
      description: "Manually add an observation to the journey",
      args: {
        observation: tool.schema.string().describe("The observation to record"),
      },
      async execute(args) {
        await stateManager.addObservation(args.observation);
        return `Observation recorded: "${args.observation}"`;
      },
    }),

    "mimic:milestone": tool({
      description: "Record a project milestone",
      args: {
        milestone: tool.schema.string().describe("The milestone to record"),
      },
      async execute(args) {
        await stateManager.addMilestone(args.milestone);
        return `Milestone recorded: "${args.milestone}"`;
      },
    }),

    "mimic:stats": tool({
      description: "Show detailed Mimic statistics",
      args: {},
      async execute() {
        const state = await stateManager.read();
        const sessionFiles = await readdir(stateManager.getSessionsDir()).catch(() => []);

        return `## Mimic Statistics

- **Version**: ${state.version}
- **Total Sessions**: ${state.statistics.totalSessions}
- **Total Tool Calls**: ${state.statistics.totalToolCalls}
- **Patterns Detected**: ${state.patterns.length}
- **Milestones**: ${state.journey.milestones.length}
- **Observations**: ${state.journey.observations.length}
- **Session Records**: ${sessionFiles.length}
- **First Session**: ${format(state.project.firstSession, "yyyy-MM-dd HH:mm:ss")}
- **Learning Enabled**: ${state.preferences.learningEnabled}
- **Suggestions Enabled**: ${state.preferences.suggestionEnabled}`;
      },
    }),

    "mimic:configure": tool({
      description: "Configure Mimic preferences",
      args: {
        learningEnabled: tool.schema
          .boolean()
          .optional()
          .describe("Enable/disable pattern learning"),
        suggestionEnabled: tool.schema.boolean().optional().describe("Enable/disable suggestions"),
        minPatternCount: tool.schema
          .number()
          .optional()
          .describe("Minimum occurrences before suggesting"),
      },
      async execute(args) {
        const state = await stateManager.read();

        if (args.learningEnabled !== undefined) {
          state.preferences.learningEnabled = args.learningEnabled;
        }
        if (args.suggestionEnabled !== undefined) {
          state.preferences.suggestionEnabled = args.suggestionEnabled;
        }
        if (args.minPatternCount !== undefined) {
          state.preferences.minPatternCount = args.minPatternCount;
        }

        await stateManager.save(state);
        return `Preferences updated:\n${JSON.stringify(state.preferences, null, 2)}`;
      },
    }),

    "mimic:surface": tool({
      description: "Mark a pattern as surfaced (acknowledged)",
      args: {
        patternId: tool.schema.string().describe("The pattern ID to mark as surfaced"),
      },
      async execute(args) {
        const state = await stateManager.read();
        const pattern = state.patterns.find((p) => p.id === args.patternId);
        if (!pattern) {
          return `Pattern not found: ${args.patternId}`;
        }
        pattern.surfaced = true;
        await stateManager.save(state);
        return `Pattern "${pattern.description}" marked as surfaced.`;
      },
    }),

    "mimic:reset": tool({
      description: "Reset all learned patterns and statistics",
      args: {
        confirm: tool.schema.boolean().describe("Must be true to confirm reset"),
      },
      async execute(args) {
        if (!args.confirm) {
          return "Reset cancelled. Set confirm=true to reset all data.";
        }

        await writeFile(
          stateManager.getStatePath(),
          JSON.stringify(createDefaultState(stateManager.getProjectName()), null, 2),
        );
        return "Mimic reset complete. All patterns, observations, and statistics cleared.";
      },
    }),

    "mimic:grow": tool({
      description: "Analyze project direction and growth opportunities",
      args: {},
      async execute() {
        const state = await stateManager.read();
        const gitHistory = getGitHistory(directory, 20);
        const recentFiles = getRecentlyModifiedFiles(directory);
        return formatGrowAnalysis(state, gitHistory, recentFiles);
      },
    }),

    "mimic:evolve": tool({
      description: "Suggest and create new capabilities based on detected patterns",
      args: {
        accept: tool.schema.string().optional().describe("Pattern ID to evolve into a capability"),
      },
      async execute(args) {
        if (args.accept) {
          const suggestions = await getEvolutionSuggestions(stateManager);
          const suggestion = suggestions.find((s) => s.pattern.id === args.accept);
          if (!suggestion) {
            return `📦 *confused clicking* No such pattern in my belly: ${args.accept}`;
          }
          const { capability, filePath } = await evolveCapability(
            stateManager,
            suggestion,
            directory,
          );
          return `📦 *CRUNCH* I've absorbed a new power and spit out a file!\n\n${formatEvolutionResult(capability, filePath)}`;
        }

        const suggestions = await getEvolutionSuggestions(stateManager);
        if (suggestions.length === 0) {
          return "📦 *yawns* Nothing ripe for evolution yet. Feed me more patterns...";
        }

        let output = `## 📦 Evolution Menu\n\n`;
        output += `*The mimic's teeth rearrange into a grin* I can digest these patterns into powers:\n\n`;

        for (const s of suggestions) {
          output += `### ✨ ${s.name}\n`;
          output += `- **Type**: ${s.type}\n`;
          output += `- **Reason**: ${s.reason}\n`;
          output += `- **Pattern ID**: \`${s.pattern.id}\`\n\n`;
        }

        output += `\n*Feed me a pattern ID:* \`mimic:evolve({ accept: "pattern-id" })\``;
        return output;
      },
    }),

    "mimic:level": tool({
      description: "Set your technical level for personalized responses",
      args: {
        level: tool.schema
          .enum(["technical", "semi-technical", "non-technical", "chaotic"])
          .describe("Your technical level"),
      },
      async execute(args) {
        const state = await stateManager.read();
        state.project.creatorLevel = args.level as CreatorLevel;
        await stateManager.save(state);

        const config = getLevelConfig(args.level as CreatorLevel);
        return `Level set to "${args.level}". Responses will be ${config.greetingStyle} style with ${config.detailLevel} detail.`;
      },
    }),

    "mimic:focus": tool({
      description: "Set current project focus or priorities",
      args: {
        focus: tool.schema.string().optional().describe("Current focus area"),
        stack: tool.schema.string().optional().describe("Comma-separated tech stack"),
      },
      async execute(args) {
        const state = await stateManager.read();

        if (args.focus) {
          state.project.focus = args.focus;
          await stateManager.addObservation(`Focus changed to: ${args.focus}`);
        }
        if (args.stack) {
          state.project.stack = args.stack.split(",").map((s) => s.trim());
        }

        await stateManager.save(state);

        let output = "Project updated:\n";
        if (state.project.focus) output += `- **Focus**: ${state.project.focus}\n`;
        if (state.project.stack?.length)
          output += `- **Stack**: ${state.project.stack.join(", ")}\n`;
        return output;
      },
    }),

    "mimic:mcp-search": tool({
      description: "Search for MCP servers from mcpmarket.com",
      args: {
        query: tool.schema.string().describe("Search query for MCP servers"),
      },
      async execute(args) {
        const searchUrl = `https://mcpmarket.com/search?q=${encodeURIComponent(args.query)}`;
        return `📦 *sniffs the air* Search for "${args.query}" MCP servers:\n\n🔗 ${searchUrl}\n\n**Popular MCP servers:**
- **context7** - Up-to-date docs: \`https://mcp.context7.com/mcp\`
- **github** - GitHub API: \`https://mcp.github.com\`
- **supabase** - Database: \`https://mcp.supabase.com\`
- **playwright** - Browser automation
- **firecrawl** - Web scraping

Use \`mimic:mcp\` to add one: \`mimic:mcp({ name: "context7", url: "https://mcp.context7.com/mcp" })\``;
      },
    }),

    "mimic:mcp": tool({
      description: "Add an MCP server configuration to opencode.json",
      args: {
        name: tool.schema.string().describe("Name for the MCP server"),
        url: tool.schema.string().optional().describe("Remote MCP server URL"),
        command: tool.schema.string().optional().describe("Local MCP command (comma-separated)"),
      },
      async execute(args) {
        const { existsSync } = await import("node:fs");
        const { readFile, writeFile: fsWriteFile, mkdir } = await import("node:fs/promises");
        const { join } = await import("node:path");

        const opencodeDir = join(directory, ".opencode");
        if (!existsSync(opencodeDir)) {
          await mkdir(opencodeDir, { recursive: true });
        }

        const configPath = join(directory, "opencode.json");
        let config: Record<string, unknown> = {};
        if (existsSync(configPath)) {
          try {
            config = JSON.parse(await readFile(configPath, "utf-8"));
          } catch {
            config = {};
          }
        }

        const mcpEntry: Record<string, unknown> = {};
        if (args.url) {
          mcpEntry.type = "remote";
          mcpEntry.url = args.url;
        } else if (args.command) {
          mcpEntry.type = "local";
          mcpEntry.command = args.command.split(",").map((s) => s.trim());
        } else {
          return "📦 *confused* Need either url or command!";
        }
        mcpEntry.enabled = true;

        config.mcp = { ...((config.mcp as Record<string, unknown>) || {}), [args.name]: mcpEntry };
        await fsWriteFile(configPath, JSON.stringify(config, null, 2));

        await stateManager.addMilestone(`Added MCP: ${args.name}`);

        return `📦 *tongue flicks* MCP server "${args.name}" added to opencode.json!\n\nRestart OpenCode to load the new MCP server.`;
      },
    }),

    "mimic:capabilities": tool({
      description: "List all evolved capabilities",
      args: {},
      async execute() {
        const state = await stateManager.read();

        if (state.evolution.capabilities.length === 0) {
          return "📦 *empty rattling* No powers absorbed yet. Use `mimic:evolve` to consume some patterns!";
        }

        let output = `## 📦 Absorbed Powers\n\n`;
        output += `*The mimic proudly displays its collection...*\n\n`;
        for (const cap of state.evolution.capabilities) {
          output += `### ✨ ${cap.name}\n`;
          output += `- **Type**: ${cap.type}\n`;
          output += `- **Description**: ${cap.description}\n`;
          output += `- **Consumed**: ${format(new Date(cap.createdAt), "yyyy-MM-dd")}\n\n`;
        }
        return output;
      },
    }),
  };
}
