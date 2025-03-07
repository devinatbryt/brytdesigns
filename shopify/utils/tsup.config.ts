import path from "node:path";
import fs from "node:fs/promises";
import { defineConfig } from "tsup";
import { generateDtsBundle } from "dts-bundle-generator";

const outDir = "dist";

const commonConfig = {
  minify: false,
  bundle: false,
  splitting: true,
  clean: true,
  treeshake: true,
  sourcemap: true,
};

export default defineConfig([
  {
    ...commonConfig,
    format: "esm",
    entry: ["effect/index.ts"],
    outDir: `${outDir}/effect`,
    async onSuccess() {
      const [effectDts] = generateDtsBundle([
        {
          filePath: path.resolve("effect", "./index.ts"),
        },
      ]);

      if (!effectDts) return;

      await fs.writeFile(
        path.resolve(outDir, "effect", "index.d.ts"),
        effectDts
      );
    },
  },
  {
    ...commonConfig,
    format: "esm",
    entry: ["index.ts"],
    outDir: outDir,
    async onSuccess() {
      const [dts] = generateDtsBundle(
        [
          {
            filePath: path.resolve("./index.ts"),
          },
        ],
        { preferredConfigPath: "./tsconfig.json" }
      );

      if (!dts) return;

      await fs.writeFile(path.resolve(outDir, "index.d.ts"), dts);
    },
  },
]);
