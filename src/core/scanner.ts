import fs from "node:fs/promises";
import path from "node:path";
import type { ScanOptions } from "../types/rename.js";
import { shouldSkipFile } from "./filters.js";
import { isInsideRoot } from "./path-safety.js";

export async function scanFiles(
  folder: string,
  options: ScanOptions = {},
): Promise<string[]> {
  const resolvedFolder = path.resolve(folder);
  const stat = await fs.stat(resolvedFolder);

  if (!stat.isDirectory()) {
    throw new Error(`Not a directory: ${resolvedFolder}`);
  }

  const files: string[] = [];

  async function walk(dir: string): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isSymbolicLink()) {
        continue;
      }

      const entryPath = path.join(dir, entry.name);

      if (!isInsideRoot(resolvedFolder, entryPath)) {
        continue;
      }

      if (entry.isDirectory()) {
        if (options.recursive) {
          await walk(entryPath);
        }
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      if (
        shouldSkipFile(entry.name, {
          includeHidden: options.includeHidden,
          extensions: options.extensions,
        })
      ) {
        continue;
      }

      files.push(entryPath);
    }
  }

  await walk(resolvedFolder);
  files.sort((a, b) => a.localeCompare(b));

  return files;
}
