import path from "node:path";
import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: { index: "src/index.ts" },
    format: ["iife"],
    globalName: "ZoteroPluginUTS",
    outDir: "addon",
    target: "es2022",
    noExternal: [/(.*)/],
    minify: true,
    clean: false,
    splitting: false,
    esbuildOptions(options) {
      options.alias = {
        "@": path.resolve(__dirname, "src"),
      };
    },
  },
  {
    entry: { bootstrap: "src/bootstrap.ts" },
    format: ["iife"],
    outDir: "addon",
    target: "es2022",
    noExternal: [/(.*)/],
    minify: true,
    clean: false,
    splitting: false,
    outExtension() {
      return {
        js: ".js",
      };
    },
    esbuildOptions(options) {
      options.alias = {
        "@": path.resolve(__dirname, "src"),
      };
    },
  },
]);
