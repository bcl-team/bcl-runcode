import * as esbuild from "esbuild";
import { esbuildPluginDecorator } from "esbuild-plugin-decorator";

const context = await esbuild.context({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "../../build/server.js",
  platform: "node",
  target: "es2020",
  logLevel: "info",
  mainFields: ["main"],
  format: "iife",
  keepNames: true,
  external: [],
  plugins: [
    esbuildPluginDecorator({
      tsconfigPath: './tsconfig.json',
    }),
  ]
});

const shouldWatch = process.argv.includes("--watch");

if (shouldWatch) {
  await context.watch();
} else {
  await context.rebuild();
  process.exit();
}
