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
      const [focusTrapDts] = generateDtsBundle([
        {
          filePath: path.resolve("./src/focusTrap/index.ts"),
        },
      ]);
      const [promiseDts] = generateDtsBundle([
        {
          filePath: path.resolve("./src/promise/index.ts"),
        },
      ]);
      const [animationDts] = generateDtsBundle([
        {
          filePath: path.resolve("./src/animation/index.ts"),
        },
      ]);
      const [utilsDts] = generateDtsBundle([
        {
          filePath: path.resolve("./src/utils/index.ts"),
        },
      ]);

      await Promise.all([
        fs.writeFile(path.resolve(outDir, "main", "index.d.ts"), indexDts),
        fs.writeFile(
          path.resolve(outDir, "main", "focusTrap", "index.d.ts"),
          focusTrapDts,
        ),
        fs.writeFile(
          path.resolve(outDir, "main", "animation", "index.d.ts"),
          animationDts,
        ),
        fs.writeFile(
          path.resolve(outDir, "main", "promise", "index.d.ts"),
          promiseDts,
        ),
        fs.writeFile(
          path.resolve(outDir, "main", "utils", "index.d.ts"),
          utilsDts,
        ),
      ]);
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
  {
    ...commonConfig,
    format: "esm",
    bundle: true,
    splitting: false,
    entry: ["src/focusTrap/index.ts"],
    outDir: `${outDir}/esm/focusTrap`,
    external: [],
  },
  {
    ...commonConfig,
    format: "esm",
    bundle: true,
    splitting: false,
    entry: ["src/promise/index.ts"],
    outDir: `${outDir}/esm/promise`,
    external: [],
  },
  {
    ...commonConfig,
    format: "esm",
    bundle: true,
    splitting: false,
    entry: ["src/animation/index.ts"],
    outDir: `${outDir}/esm/animation`,
    external: [],
  },
  {
    ...commonConfig,
    format: "esm",
    bundle: true,
    splitting: false,
    entry: ["src/utils/index.ts"],
    outDir: `${outDir}/esm/utils`,
    external: [],
  },
  // {
  //   ...commonConfig,
  //   format: "esm",
  //   entry: ["src/**/*.ts"],
  //   outDir: `${outDir}/jsdelivr`,
  //   dts: false,
  //   esbuildPlugins: [jsDelivrImportsPlugin()],
  // },
]);
