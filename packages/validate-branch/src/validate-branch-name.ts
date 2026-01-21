import * as fs from "node:fs";
import { cwd } from "node:process";
import * as git from "isomorphic-git";

export type Preset = "gitflow" | "jira";

export interface ValidateBranchNameOptions {
  customRegexp?: string;
  preset?: Preset;
}

const GITFLOW_PATTERN =
  /^(main|master|develop|stage|feature\/[A-Za-z0-9_-]+|fix\/[A-Za-z0-9_-]+|hotfix\/[A-Za-z0-9_-]+|release\/[A-Za-z0-9_.-]+)$/;

const JIRA_PATTERN = /^(main|master|develop|stage|[A-Z]+-[0-9]+)$/;

export function validateBranchName(
  branchName: string,
  options?: ValidateBranchNameOptions,
): boolean {
  const { customRegexp, preset = "gitflow" } = options ?? {};

  if (customRegexp) {
    return new RegExp(customRegexp).test(branchName);
  }

  const pattern = preset === "jira" ? JIRA_PATTERN : GITFLOW_PATTERN;

  return pattern.test(branchName);
}

export async function getCurrentBranchName(): Promise<string | null> {
  try {
    const branch = await git.currentBranch({
      fs,
      dir: cwd(),
      fullname: false,
    });

    return branch ?? null;
  } catch {
    return null;
  }
}

export interface ValidationResult {
  valid: boolean;
  branchName: string;
  error?: string;
}

export function validateWithDetails(
  branchName: string,
  options?: ValidateBranchNameOptions,
): ValidationResult {
  const { customRegexp, preset = "gitflow" } = options ?? {};

  if (customRegexp) {
    const pattern = new RegExp(customRegexp);
    if (pattern.test(branchName)) {
      return { valid: true, branchName };
    }
    return {
      valid: false,
      branchName,
      error: `Branch name "${branchName}" does not match pattern: ${pattern.source}`,
    };
  }

  const pattern = preset === "jira" ? JIRA_PATTERN : GITFLOW_PATTERN;

  if (pattern.test(branchName)) {
    return { valid: true, branchName };
  }

  return {
    valid: false,
    branchName,
    error: `Branch name "${branchName}" does not match pattern: ${pattern.source}`,
  };
}
