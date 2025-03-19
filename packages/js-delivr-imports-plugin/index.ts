import type { Options } from "tsup";

import fs from "node:fs/promises";
import path from "node:path";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import yaml from "yaml";

type Plugin = NonNullable<Options["esbuildPlugins"]>[number];

export function jsDelivrImportsPlugin(): Plugin {
  // Cache for package versions (to avoid repetitive file system reads)
  const versionCache: Record<
    string,
    { version: string; workspace: boolean } | null
  > = {};

  // Helper to load JSON safely
  function readJSON(filePath: string) {
    try {
      const data = readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  // Locate the workspace root (where pnpm-workspace.yaml might exist)
  function findWorkspaceRoot(dir: string) {
    const workspaceFile = "pnpm-workspace.yaml";
    let currentDir = dir;
    while (true) {
      if (existsSync(path.join(currentDir, workspaceFile))) {
        return currentDir;
      }
      const parent = path.dirname(currentDir);
      if (parent === currentDir) break; // reached filesystem root
      currentDir = parent;
    }
    return null;
  }

  // Load local workspace package versions if pnpm workspace is used
  function loadWorkspacePackages(rootDir: string) {
    const wsFile = path.join(rootDir, "pnpm-workspace.yaml");
    if (!existsSync(wsFile)) return;
    const wsConfig = readFileSync(wsFile, "utf-8");
    let patterns = [];
    try {
      // Parse YAML to get package patterns
      const wsData = yaml.parse(wsConfig);
      if (wsData && Array.isArray(wsData.packages)) {
        patterns = wsData.packages;
      }
    } catch {
      // Fallback to manual parsing if YAML library not used
      const lines = wsConfig.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("-")) {
          // Extract the path pattern, remove quotes if any
          const pattern = trimmed
            .slice(1)
            .trim()
            .replace(/^['"]|['"]$/g, "");
          patterns.push(pattern);
        }
      }
    }
    // Resolve glob patterns (supports simple patterns like "shopify/*" or "shopify/packages/*")
    for (const pattern of patterns) {
      // If the pattern is just a directory (no wildcard), include directly
      if (!pattern.includes("*")) {
        const pkgPath = path.join(rootDir, pattern);
        const pkgJson = readJSON(path.join(pkgPath, "package.json"));
        if (pkgJson && pkgJson.name && pkgJson.version) {
          versionCache[pkgJson.name] = pkgJson.version;
        }
        continue;
      }
      // Handle patterns with one wildcard (e.g., "shopify/*" or "shopify/packages/*")
      const prefix = pattern.split("*")[0]; // e.g., "shopify/" or "shopify/packages/"
      const baseDir = path.join(rootDir, prefix);
      if (!existsSync(baseDir)) continue;
      for (const name of readdirSync(baseDir)) {
        const pkgDir = path.join(baseDir, name);
        const stats = statSync(pkgDir);
        if (!stats.isDirectory()) continue;
        const pkgJsonPath = path.join(pkgDir, "package.json");
        if (!existsSync(pkgJsonPath)) continue;
        const pkgJson = readJSON(pkgJsonPath);
        if (pkgJson && pkgJson.name && pkgJson.version) {
          versionCache[pkgJson.name] = {
            version: pkgJson.version,
            workspace: true,
          };
        }
      }
    }
  }

  // Preload the current package's dependency versions
  const pkg = readJSON(path.join(process.cwd(), "package.json")) || {};
  const deps: Record<string, string> = pkg.dependencies || {};

  // Populate version cache for direct dependencies
  for (const [depName, depVersion] of Object.entries(deps)) {
    if (depVersion.startsWith("workspace:")) {
      // Mark workspace deps for resolution
      versionCache[depName] = null; // will fill in after scanning workspaces
    } else {
      versionCache[depName] = {
        version: depVersion,
        workspace: false,
      };
    }
  }

  // Load workspace package versions if needed
  if (Object.values(versionCache).includes(null)) {
    const root = findWorkspaceRoot(process.cwd());
    if (root) {
      loadWorkspacePackages(root);
    }
  }

  return {
    name: "jsdelivr-imports",
    setup(build) {
      // Intercept TS file loads
      build.onLoad({ filter: /\.ts$/ }, async (args) => {
        // Skip declaration files
        if (args.path.endsWith(".d.ts")) return null;
        const source = await fs.readFile(args.path, "utf-8");
        let transformed = source;

        // Regex to find import statements and capture the module specifier
        const importRegex =
          /^(\s*(?:import|export)\s+(?:type\s+)?(?:[^'"]*\sfrom\s+)?)['"]([^'"]+)['"]/gm;
        transformed = transformed.replace(
          importRegex,
          (match, importPart, moduleSpecifier) => {
            // Only transform if moduleSpecifier is a dependency (exclude relative and dev-only imports)
            if (
              moduleSpecifier.startsWith(".") ||
              moduleSpecifier.startsWith("/")
            ) {
              const relativePath = path.join(
                "./dist/jsdelivr/",
                moduleSpecifier,
              );
              return `${importPart}"/npm/${pkg.name}@${pkg.version}/${relativePath}"`;
            }
            let actualModuleName = "";
            if (moduleSpecifier.startsWith("@")) {
              const [scope, name] = moduleSpecifier.split("/");
              actualModuleName = `${scope}/${name}`;
            } else {
              actualModuleName = moduleSpecifier.split("/").shift();
            }
            if (!(actualModuleName in deps)) {
              return match; // skip if not a declared dependency (e.g., devDependency or peer)
            }
            // Determine package name vs subpath
            let pkgName = moduleSpecifier;
            let subPath = "";
            if (pkgName.startsWith("@")) {
              // Scoped package: split "@scope/name/sub..." into pkgName = "@scope/name", subPath = the rest
              const parts = moduleSpecifier.split("/");
              if (parts.length >= 2) {
                pkgName = parts[0] + "/" + parts[1];
                subPath = parts.slice(2).join("/");
              }
            } else if (moduleSpecifier.includes("/")) {
              const parts = moduleSpecifier.split("/");
              pkgName = parts[0];
              subPath = parts.slice(1).join("/");
            }
            // Only transform if pkgName is in the version cache (i.e., a dependency)
            const version = versionCache[pkgName];
            if (!version) {
              return match;
            }
            // Build jsDelivr URL path
            let newImport = `/npm/${pkgName}@${version.version}`;
            if (subPath) {
              newImport += `/${subPath}`;
            }
            if (!version.workspace) newImport += `/+esm`; // ensure ESM format
            return `${importPart}"${newImport}"`; // preserve original import syntax around the path
          },
        );

        return { contents: transformed, loader: "ts" };
      });

      // Mark CDN imports as external so esbuild doesn't try to bundle or resolve them
      build.onResolve({ filter: /^\/npm\// }, (args) => {
        return { path: args.path, external: true };
      });
    },
  };
}
