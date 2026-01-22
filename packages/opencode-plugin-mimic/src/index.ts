import type { Plugin } from "@opencode-ai/plugin";
import type { Event } from "@opencode-ai/sdk";
import { analyzeTimeSinceLastSession, formatDuration } from "@/format";
import { detectPatterns, surfacePatterns } from "@/patterns";
import { StateManager } from "@/state";
import { createTools } from "@/tools";
import type { ToolCall } from "@/types";

export const mimic: Plugin = async ({ directory }) => {
  const stateManager = new StateManager(directory);
  await stateManager.initialize();

  const sessionId = crypto.randomUUID();
  const sessionStartTime = Date.now();
  const toolCalls: ToolCall[] = [];
  const filesEdited: Set<string> = new Set();

  const handleSessionCreated = async () => {
    const state = await stateManager.read();
    const timeSince = analyzeTimeSinceLastSession(state.journey.lastSession);

    state.statistics.totalSessions += 1;
    state.statistics.lastSessionId = sessionId;
    state.journey.sessionCount += 1;
    state.journey.lastSession = new Date().toISOString();

    await stateManager.save(state);

    if (timeSince === "long-break") {
      await stateManager.addObservation("Returned after a long break");
    }

    console.log(
      `[Mimic] Session started. Sessions: ${state.journey.sessionCount}, Patterns: ${state.patterns.length}`,
    );
  };

  const handleSessionIdle = async () => {
    const newPatterns = await detectPatterns(stateManager, directory);
    if (newPatterns.length > 0) {
      const state = await stateManager.read();
      state.patterns.push(...newPatterns);
      await stateManager.save(state);
    }

    const suggestions = await surfacePatterns(stateManager);
    for (const suggestion of suggestions) {
      console.log(`[Mimic] ${suggestion}`);
    }
  };

  const handleFileEdited = async (event: Event) => {
    if (!("properties" in event)) return;

    const filename = (event.properties as { filename?: string })?.filename;
    if (!filename) return;

    filesEdited.add(filename);
    const state = await stateManager.read();
    state.statistics.filesModified[filename] = (state.statistics.filesModified[filename] || 0) + 1;
    await stateManager.save(state);
  };

  return {
    async event({ event }: { event: Event }) {
      switch (event.type) {
        case "session.created":
          await handleSessionCreated();
          return;
        case "session.idle":
          await handleSessionIdle();
          return;
        case "file.edited":
          await handleFileEdited(event);
      }
    },

    async "tool.execute.after"(
      input: { tool: string; sessionID: string; callID: string },
      _output: { title: string; output: string; metadata: unknown },
    ) {
      const state = await stateManager.read();
      if (!state.preferences.learningEnabled) return;

      const toolCall: ToolCall = {
        tool: input.tool,
        callID: input.callID,
        timestamp: Date.now(),
      };

      toolCalls.push(toolCall);
      state.statistics.totalToolCalls += 1;

      const toolPattern = input.tool;
      const existing = state.patterns.find((p) => p.type === "tool" && p.description === toolPattern);
      if (existing) {
        existing.count += 1;
        existing.lastSeen = Date.now();
      } else {
        state.patterns.push({
          id: crypto.randomUUID(),
          type: "tool",
          description: toolPattern,
          count: 1,
          firstSeen: Date.now(),
          lastSeen: Date.now(),
          surfaced: false,
          examples: [toolCall],
        });
      }

      await stateManager.save(state);
    },

    async stop() {
      const sessionDuration = Date.now() - sessionStartTime;

      const sessionData = {
        sessionId,
        startTime: new Date(sessionStartTime).toISOString(),
        endTime: new Date().toISOString(),
        durationMs: sessionDuration,
        toolCalls: toolCalls.length,
        filesEdited: Array.from(filesEdited),
      };

      await stateManager.saveSession(sessionId, sessionData);

      if (toolCalls.length > 20) {
        await stateManager.addObservation(`Intensive session with ${toolCalls.length} tool calls`);
      }
      if (filesEdited.size > 10) {
        await stateManager.addMilestone(`Major refactoring session: ${filesEdited.size} files edited`);
      }

      console.log(`[Mimic] Session ended. Duration: ${formatDuration(sessionDuration)}, Tools: ${toolCalls.length}, Files: ${filesEdited.size}`);
    },

    tool: createTools(stateManager, directory, toolCalls),
  };
};

export default mimic;
