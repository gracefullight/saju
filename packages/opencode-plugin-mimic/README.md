# opencode-plugin-mimic

[![npm version](https://img.shields.io/npm/v/opencode-plugin-mimic)](https://www.npmjs.com/package/opencode-plugin-mimic)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> An OpenCode plugin that learns from your patterns and adapts to your workflow.

Mimic watches how you work, remembers across sessions, and suggests actions based on what you do repeatedly.

## Features

- **Pattern Detection**: Automatically detects repeated tool usage, file edits, and git commit patterns
- **Session Memory**: Remembers observations and milestones across sessions
- **Journey Tracking**: Narrative storytelling of your project's evolution
- **Git History Analysis**: Analyzes commit messages and file modifications
- **Smart Suggestions**: Offers to create shortcuts for repeated actions
- **Per-Project State**: Each project gets its own learned patterns
- **Configurable**: Enable/disable learning and suggestions, adjust thresholds

## How It Works

1. **Track**: Mimic tracks tool calls, file edits, and analyzes git history
2. **Detect**: Patterns are categorized by type (tool, file, commit, sequence)
3. **Remember**: Observations and milestones are recorded for your project's journey
4. **Suggest**: When patterns reach threshold, Mimic suggests creating shortcuts
5. **Persist**: All state persists in `.opencode/mimic/`

## Installation

### Via npm (Recommended)

```bash
npm install -g opencode-plugin-mimic
```

Then add to your `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-plugin-mimic"]
}
```

## Usage

### Custom Tools

Mimic adds 10 tools to OpenCode:

#### `mimic:init`

Initialize or wake up Mimic for this project. Shows welcome message with session stats and recent observations.

#### `mimic:status`

Check current status including:

- Session count and pattern stats
- Recently modified files (from git)
- Recent commits
- Active suggestions

#### `mimic:journey`

View the narrative story of your project's evolution:

- Milestones achieved
- Recent observations
- Git activity timeline

#### `mimic:patterns`

View all detected patterns organized by type:

- **Tool patterns**: Frequently used tools
- **File patterns**: Frequently modified files
- **Commit patterns**: Repeated commit messages
- **Sequence patterns**: Repeated action sequences

#### `mimic:observe`

Manually add an observation:

```
mimic:observe({ observation: "Refactored auth module for better security" })
```

#### `mimic:milestone`

Record a project milestone:

```
mimic:milestone({ milestone: "v1.0.0 released" })
```

#### `mimic:stats`

View detailed statistics:

- Total sessions and tool calls
- Pattern and milestone counts
- Session records
- Configuration status

#### `mimic:configure`

Adjust Mimic's behavior:

```
mimic:configure({ learningEnabled: false })     # Stop learning
mimic:configure({ suggestionEnabled: false })   # Stop suggestions
mimic:configure({ minPatternCount: 5 })         # Require 5 repetitions
```

#### `mimic:surface`

Mark a pattern as acknowledged:

```
mimic:surface({ patternId: "pattern-uuid" })
```

#### `mimic:reset`

Clear all learned data:

```
mimic:reset({ confirm: true })
```

## State Structure

```
your-project/
├── .opencode/
│   └── mimic/
│       ├── state.json          # Main state file
│       └── sessions/           # Individual session records
│           └── {session-id}.json
└── opencode.json
```

### state.json

```json
{
  "version": "0.2.0",
  "project": {
    "name": "your-project",
    "creatorLevel": null,
    "firstSession": 1705940400000
  },
  "journey": {
    "observations": [
      { "observation": "Intensive session with 25 tool calls", "timestamp": "..." }
    ],
    "milestones": [
      { "milestone": "Major refactoring session: 15 files edited", "timestamp": "..." }
    ],
    "sessionCount": 10,
    "lastSession": "2026-01-22T12:00:00.000Z"
  },
  "patterns": [
    {
      "id": "uuid",
      "type": "tool",
      "description": "Read",
      "count": 50,
      "surfaced": false
    }
  ],
  "evolution": {
    "evolvedCapabilities": [],
    "lastEvolution": null
  },
  "preferences": {
    "learningEnabled": true,
    "suggestionEnabled": true,
    "minPatternCount": 3
  },
  "statistics": {
    "totalSessions": 10,
    "totalToolCalls": 250,
    "filesModified": { "src/index.ts": 15 }
  }
}
```

## Pattern Detection Thresholds

| Pattern Type | Threshold | Suggestion |
|--------------|-----------|------------|
| Tool usage | 3+ times | Create shortcut |
| File modified | 5+ times | Track closely |
| Commit message | 3+ identical | Create command |

## Automatic Behaviors

- **Session Start**: Increments session count, detects long breaks
- **Tool Execution**: Tracks every tool call for pattern detection
- **File Edit**: Tracks file modification frequency
- **Session Idle**: Analyzes patterns and surfaces suggestions
- **Session End**: Records intensive sessions, major refactoring milestones

## Development

```bash
pnpm install
pnpm run build
pnpm run dev  # watch mode
```

## License

MIT
