import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { cwd } from "node:process";
import type { Preset } from "@/validate-branch-name";

export interface Config {
  pattern?: string;
  patterns?: string[];
  preset?: Preset;
  description?: string;
}

const CONFIG_FILES = [
  "branch.config.ts",
  "branch.config.mts",
  "branch.config.js",
  "branch.config.cjs",
  "branch.config.mjs",
] as const;

export async function loadConfig(): Promise<Config | null> {
  for (const file of CONFIG_FILES) {
    const configPath = resolve(cwd(), file);

    try {
      await readFile(configPath, "utf-8");

      if (file.endsWith(".ts") || file.endsWith(".mts")) {
        const { default: config } = await import(`file://${configPath}?ts=${Date.now()}`);
        return config as Config;
      }

      if (file.endsWith(".mjs")) {
        const { default: config } = await import(`file://${configPath}?ts=${Date.now()}`);
        return config as Config;
      }

      if (file.endsWith(".js") || file.endsWith(".cjs")) {
        const { default: config } = await import(configPath);
        return config as Config;
      }
    } catch (error) {
      if ((error as { code?: string }).code !== "ENOENT") {
        console.error(`Error loading config file ${file}:`, error);
      }
    }
  }

  return null;
}
