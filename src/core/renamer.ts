import fs from "node:fs/promises";
import path from "node:path";
import type { RenameItem, RenamePlan } from "../types/rename.js";
import { getSelectedItems } from "./planner.js";
import { isInsideRoot } from "./path-safety.js";
import { writeRollbackLog } from "./rollback.js";

export type ExecuteResult = {
  plan: RenamePlan;
  logPath: string;
  renamedCount: number;
  errorCount: number;
};

function assertPathsInPlanFolder(plan: RenamePlan, from: string, to: string): void {
  const root = path.resolve(plan.folder);

  if (!isInsideRoot(root, from) || !isInsideRoot(root, to)) {
    throw new Error("Rename path escapes target folder");
  }
}

async function renameFile(
  plan: RenamePlan,
  from: string,
  to: string,
): Promise<void> {
  assertPathsInPlanFolder(plan, from, to);
  await fs.rename(from, to);
}

export async function executePlan(
  plan: RenamePlan,
  options: { dryRun?: boolean } = {},
): Promise<ExecuteResult> {
  const selected = getSelectedItems(plan);
  const updatedItems = plan.items.map((item) => ({ ...item }));
  const itemMap = new Map(updatedItems.map((item) => [item.originalPath, item]));

  if (options.dryRun) {
    for (const item of selected) {
      const entry = itemMap.get(item.originalPath)!;
      entry.status = "renamed";
    }

    return {
      plan: { ...plan, items: updatedItems },
      logPath: "",
      renamedCount: selected.length,
      errorCount: 0,
    };
  }

  const phase1Done: RenameItem[] = [];

  for (const item of selected) {
    const entry = itemMap.get(item.originalPath)!;
    try {
      await renameFile(plan, item.originalPath, item.temporaryPath);
      phase1Done.push(item);
    } catch (error) {
      entry.status = "error";
      entry.error =
        error instanceof Error ? error.message : "Unknown rename error";
    }
  }

  for (const item of phase1Done) {
    const entry = itemMap.get(item.originalPath)!;
    try {
      await renameFile(plan, item.temporaryPath, item.finalPath);
      entry.status = "renamed";
    } catch (error) {
      entry.status = "error";
      entry.error =
        error instanceof Error ? error.message : "Unknown rename error";

      try {
        await renameFile(plan, item.temporaryPath, item.originalPath);
      } catch {
        // Best effort rollback for this file
      }
    }
  }

  const renamedItems = updatedItems.filter((item) => item.status === "renamed");
  let logPath = "";

  if (renamedItems.length > 0) {
    logPath = await writeRollbackLog(plan.folder, renamedItems);
  }

  return {
    plan: { ...plan, items: updatedItems },
    logPath,
    renamedCount: renamedItems.length,
    errorCount: updatedItems.filter((item) => item.status === "error").length,
  };
}
