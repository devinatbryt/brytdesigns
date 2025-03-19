import path from "node:path";
import fs from "node:fs/promises";
import { jsDelivrImportsPlugin } from "@repo/js-delivr-imports-plugin";
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
    entry: ["src/effect/**/*.ts"],
    outDir: `${outDir}/effect`,
    async onSuccess() {
      const [effectDts] = generateDtsBundle([
        {
          filePath: path.resolve("./src/effect/index.ts"),
        },
      ]);

      if (!effectDts) return;

      await fs.writeFile(
        path.resolve(outDir, "effect", "index.d.ts"),
        effectDts,
      );
    },
  },
  {
    ...commonConfig,
    format: "esm",
    entry: ["src/**/*.ts"],
    outDir: `${outDir}/main`,
    async onSuccess() {
      const [dts] = generateDtsBundle(
        [
          {
            filePath: path.resolve("./src/index.ts"),
          },
        ],
        { preferredConfigPath: "./tsconfig.json" },
      );

      if (!dts) return;

      await fs.writeFile(path.resolve(outDir, "main", "index.d.ts"), dts);
    },
  },
  {
    ...commonConfig,
    format: "esm",
    entry: ["src/**/*.ts"],
    outDir: `${outDir}/jsdelivr`,
    dts: false,

    esbuildPlugins: [jsDelivrImportsPlugin()],
  },
]);
