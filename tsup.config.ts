import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  sourcemap: true,
  clean: true,
  shims: true,
  tsconfig: "./tsconfig.json",
  minify: "terser",
  format: ["cjs", "esm"],
  external: ["react", "react-dom"],
  treeshake: true,
});
