import * as esbuild from "esbuild";

const context = await esbuild.context({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "../../build/client.js",
  platform: "neutral",
  target: "es2020",
  logLevel: "info",
  mainFields: ["main"],
  format: "iife",
  external: ['zlib', 'https', 'url', 'http', 'stream'],
});

const shouldWatch = process.argv.includes("--watch");

if (shouldWatch) {
  await context.watch();
} else {
  await context.rebuild();
  process.exit();
}
