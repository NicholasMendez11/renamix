import fs from "node:fs/promises";
import path from "node:path";
import type { RenameItem, RenamePlan } from "../types/rename.js";
import { generateName, generateTempName } from "./name-generator.js";
import { scanFiles } from "./scanner.js";
import type { ScanOptions } from "../types/rename.js";

function basename(filePath: string): string {
  return path.basename(filePath);
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function ensureUniqueFinalName(
  proposedName: string,
  usedNames: Set<string>,
): string {
  let candidate = proposedName;
  let attempts = 0;

  while (attempts < 100) {
    if (!usedNames.has(candidate.toLowerCase())) {
      return candidate;
    }

    const ext = path.extname(proposedName);
    const base = path.basename(proposedName, ext);
    candidate = `${base}_${attempts + 1}${ext}`;
    attempts++;
  }

  return proposedName;
}

export async function createPlan(
  folder: string,
  options: ScanOptions = {},
): Promise<RenamePlan> {
  const resolvedFolder = path.resolve(folder);
  const filePaths = await scanFiles(resolvedFolder, options);
  const originalPaths = new Set(filePaths.map((p) => path.resolve(p)));

  const items: RenameItem[] = [];
  const usedFinalNames = new Set<string>();
  const usedTempNames = new Set<string>();

  for (const filePath of filePaths) {
    const dir = path.dirname(filePath);
    const originalName = basename(filePath);
    const extension = path.extname(filePath).toLowerCase();

    let finalName = generateName(filePath, { prefix: options.prefix });
    finalName = ensureUniqueFinalName(finalName, usedFinalNames);

    let tempName = generateTempName();
    while (usedTempNames.has(tempName)) {
      tempName = generateTempName();
    }
    usedTempNames.add(tempName);

    const finalPath = path.join(dir, finalName);
    const temporaryPath = path.join(dir, tempName);

    let status: RenameItem["status"] = "ready";

    if (usedFinalNames.has(finalName.toLowerCase())) {
      status = "conflict";
    } else {
      usedFinalNames.add(finalName.toLowerCase());
    }

    const finalExists = await fileExists(finalPath);
    if (
      finalExists &&
      !originalPaths.has(path.resolve(finalPath)) &&
      status !== "conflict"
    ) {
      status = "conflict";
    }

    const tempExists = await fileExists(temporaryPath);
    if (tempExists) {
      status = "conflict";
    }

    items.push({
      selected: status === "ready",
      originalPath: filePath,
      originalName,
      temporaryPath,
      finalPath,
      finalName,
      extension,
      status,
    });
  }

  return {
    folder: resolvedFolder,
    items,
    createdAt: new Date().toISOString(),
  };
}

export function getSelectedItems(plan: RenamePlan): RenameItem[] {
  return plan.items.filter(
    (item) => item.selected && item.status === "ready",
  );
}
