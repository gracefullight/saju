import { mkdir, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { loadConfig } from "@/load-config.js";

describe("loadConfig", () => {
  const testDir = join(tmpdir(), `validate-branch-test-${Date.now()}`);
  const originalCwd = process.cwd();

  beforeEach(async () => {
    await mkdir(testDir, { recursive: true });
    process.chdir(testDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    const configFiles = [
      "branch.config.ts",
      "branch.config.mts",
      "branch.config.js",
      "branch.config.cjs",
      "branch.config.mjs",
    ];
    for (const file of configFiles) {
      try {
        await unlink(join(testDir, file));
      } catch {}
    }
  });

  describe("config file loading order", () => {
    it("should load branch.config.ts first", async () => {
      const configContent = `export default {
        pattern: "^(main|develop|feature/.+)$",
        description: "TypeScript config"
      }`;

      await writeFile("branch.config.ts", configContent, "utf-8");

      const result = await loadConfig();

      expect(result).not.toBeNull();
      expect(result?.pattern).toBe("^(main|develop|feature/.+)$");
      expect(result?.description).toBe("TypeScript config");
    });

    it("should skip .ts and load .mts when .ts is not found", async () => {
      const configContent = `export default {
        pattern: "^(main|develop)$",
        description: "MTS config"
      }`;

      await writeFile("branch.config.mts", configContent, "utf-8");

      const result = await loadConfig();

      expect(result).not.toBeNull();
      expect(result?.pattern).toBe("^(main|develop)$");
    });

    it("should skip .ts and .mts and load .js", async () => {
      const configContent = `module.exports = {
        pattern: "^(main|develop)$",
        description: "JS config"
      }`;

      await writeFile("branch.config.js", configContent, "utf-8");

      const result = await loadConfig();

      expect(result).not.toBeNull();
      expect(result?.pattern).toBe("^(main|develop)$");
    });

    it("should load .cjs when .js is not found", async () => {
      const configContent = `module.exports = {
        pattern: "^(main|develop)$",
        description: "CJS config"
      }`;

      await writeFile("branch.config.cjs", configContent, "utf-8");

      const result = await loadConfig();

      expect(result).not.toBeNull();
      expect(result?.pattern).toBe("^(main|develop)$");
    });

    it("should load .mjs when .cjs is not found", async () => {
      const configContent = `export default {
        pattern: "^(main|develop)$",
        description: "MJS config"
      }`;

      await writeFile("branch.config.mjs", configContent, "utf-8");

      const result = await loadConfig();

      expect(result).not.toBeNull();
      expect(result?.pattern).toBe("^(main|develop)$");
    });

    it("should prioritize .ts over other files", async () => {
      const tsContent = `export default { pattern: "ts-pattern" }`;
      const mtsContent = `export default { pattern: "mts-pattern" }`;

      await writeFile("branch.config.ts", tsContent, "utf-8");
      await writeFile("branch.config.mts", mtsContent, "utf-8");

      const result = await loadConfig();

      expect(result?.pattern).toBe("ts-pattern");
    });
  });

  describe("when no config file exists", () => {
    it("should return null when no config files are found", async () => {
      const result = await loadConfig();
      expect(result).toBeNull();
    });
  });

  describe("config file content", () => {
    it("should load config with only pattern", async () => {
      const configContent = `export default {
        pattern: "^(main|develop|feature/.+)$"
      }`;

      await writeFile("branch.config.ts", configContent, "utf-8");

      const result = await loadConfig();

      expect(result).toEqual({ pattern: "^(main|develop|feature/.+)$" });
    });

    it("should load config with pattern and description", async () => {
      const configContent = `export default {
        pattern: "^(main|develop|feature/.+|fix/.+)$",
        description: "Project branch naming convention"
      }`;

      await writeFile("branch.config.ts", configContent, "utf-8");

      const result = await loadConfig();

      expect(result).toEqual({
        pattern: "^(main|develop|feature/.+|fix/.+)$",
        description: "Project branch naming convention",
      });
    });

    it("should load config with only description", async () => {
      const configContent = `export default {
        description: "Using default pattern"
      }`;

      await writeFile("branch.config.ts", configContent, "utf-8");

      const result = await loadConfig();

      expect(result).toEqual({ description: "Using default pattern" });
    });

    it("should load empty config object", async () => {
      const configContent = `export default {}`;

      await writeFile("branch.config.ts", configContent, "utf-8");

      const result = await loadConfig();

      expect(result).toEqual({});
    });

    it("should load config with patterns array", async () => {
      const configContent = `export default {
        patterns: ["^(main|develop)$", "^(feature|fix)/.+$"],
        description: "Multiple patterns"
      }`;

      await writeFile("branch.config.ts", configContent, "utf-8");

      const result = await loadConfig();

      expect(result).toEqual({
        patterns: ["^(main|develop)$", "^(feature|fix)/.+$"],
        description: "Multiple patterns",
      });
    });
  });

  describe("TypeScript config files", () => {
    it("should load .ts config", async () => {
      const configContent = `export default {
        pattern: "^(main|develop)$",
        description: "TS config"
      }`;

      await writeFile("branch.config.ts", configContent, "utf-8");

      const result = await loadConfig();

      expect(result).not.toBeNull();
      expect(result?.pattern).toBe("^(main|develop)$");
    });

    it("should load .mts config", async () => {
      const configContent = `export default {
        pattern: "^(main|develop)$",
        description: "MTS config"
      }`;

      await writeFile("branch.config.mts", configContent, "utf-8");

      const result = await loadConfig();

      expect(result).not.toBeNull();
      expect(result?.pattern).toBe("^(main|develop)$");
    });
  });

  describe("JavaScript config files", () => {
    it("should load .js config with CommonJS", async () => {
      const configContent = `module.exports = {
        pattern: "^(main|develop)$",
        description: "CommonJS config"
      }`;

      await writeFile("branch.config.js", configContent, "utf-8");

      const result = await loadConfig();

      expect(result).not.toBeNull();
      expect(result?.pattern).toBe("^(main|develop)$");
    });

    it("should load .cjs config", async () => {
      const configContent = `module.exports = {
        pattern: "^(main|develop)$",
        description: "CJS config"
      }`;

      await writeFile("branch.config.cjs", configContent, "utf-8");

      const result = await loadConfig();

      expect(result).not.toBeNull();
      expect(result?.pattern).toBe("^(main|develop)$");
    });

    it("should load .mjs config", async () => {
      const configContent = `export default {
        pattern: "^(main|develop)$",
        description: "MJS config"
      }`;

      await writeFile("branch.config.mjs", configContent, "utf-8");

      const result = await loadConfig();

      expect(result).not.toBeNull();
      expect(result?.pattern).toBe("^(main|develop)$");
    });
  });

  describe("complex pattern cases", () => {
    it("should load config with complex regexp pattern", async () => {
      const configContent = `export default {
        pattern: "^(main|develop|feature/[A-Z]+-\\\\d+/.+|fix/[A-Z]+-\\\\d+/.+)$",
        description: "JIRA-style branch naming"
      }`;

      await writeFile("branch.config.ts", configContent, "utf-8");

      const result = await loadConfig();

      expect(result).not.toBeNull();
      expect(result?.pattern).toMatch(
        /\^\(main\|develop\|feature\/\[A-Z\]\+-\\d\+\/\.\+\|fix\/\[A-Z\]\+-\\d\+\/\.\+\)\$/,
      );
    });

    it("should load config with escaped special characters in pattern", async () => {
      const configContent = `export default {
        pattern: "^(main|develop|v\\\\d+\\\\.\\\\d+\\\\.\\\\d+)$",
        description: "Versioned branches"
      }`;

      await writeFile("branch.config.ts", configContent, "utf-8");

      const result = await loadConfig();

      expect(result).not.toBeNull();
      expect(result?.pattern).toMatch(/\^\(main\|develop\|v\\d\+\\\.\\d\+\\\.\\d\+\)\$/);
    });

    it("should load config with unicode characters in description", async () => {
      const configContent = `export default {
        pattern: "^(main|develop)$",
        description: "프로젝트 브랜치 네이밍 규칙"
      }`;

      await writeFile("branch.config.ts", configContent, "utf-8");

      const result = await loadConfig();

      expect(result).not.toBeNull();
      expect(result?.description).toBe("프로젝트 브랜치 네이밍 규칙");
    });
  });

  describe("integration with validate functions", () => {
    it("should work with validateBranchName using loaded pattern", async () => {
      const { validateBranchName } = await import("@/validate-branch-name.js");

      const configContent = `export default {
        pattern: "^(main|develop|story/.+)$"
      }`;

      await writeFile("branch.config.ts", configContent, "utf-8");

      const config = await loadConfig();
      const isValid = validateBranchName("story/US-123", { customRegexp: config?.pattern });

      expect(isValid).toBe(true);
    });
  });
});
