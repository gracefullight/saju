import type { PluginContext } from "@/types";

class PluginState {
  private context: PluginContext | null = null;

  initialize(ctx: PluginContext): void {
    this.context = ctx;
  }

  get rootURI(): string {
    return this.context?.rootURI ?? "";
  }

  get pluginID(): string {
    return this.context?.id ?? "";
  }

  get version(): string {
    return this.context?.version ?? "";
  }

  isInitialized(): boolean {
    return this.context !== null;
  }

  reset(): void {
    this.context = null;
  }
}

export const pluginState = new PluginState();
