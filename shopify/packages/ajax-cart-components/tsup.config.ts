import path from "node:path";
import fs from "node:fs/promises";
import { generateDtsBundle } from "dts-bundle-generator";
import { defineConfig } from "tsup";

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
    entry: ["src/**/*.ts"],
    outDir: `${outDir}/main`,
    dts: false,
    async onSuccess() {
      const [indexDts] = generateDtsBundle([
        {
          filePath: path.resolve("./src/index.ts"),
        },
      ]);

      await fs.writeFile(path.resolve(outDir, "main", "index.d.ts"), indexDts);
    },
  },
  {
    ...commonConfig,
    format: "esm",
    bundle: true,
    splitting: false,
    entry: ["src/index.ts"],
    outDir: `${outDir}/esm`,
    external: [],
  },
  // {
  //   ...commonConfig,
  //   format: "esm",
  //   entry: ["src/**/*.ts"],
  //   outDir: `${outDir}/jsdelivr`,
  //   dts: false,
  //
  //   esbuildPlugins: [jsDelivrImportsPlugin()],
  // },
]);
