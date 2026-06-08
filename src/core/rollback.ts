import fs from "node:fs/promises";
import path from "node:path";
import type { RenameItem, RollbackLog } from "../types/rename.js";
import { assertSafeFilename, resolveInsideRoot } from "./path-safety.js";

const LATEST_LOG_NAME = ".renamix-log.json";

export function getLatestLogPath(folder: string): string {
  return path.join(path.resolve(folder), LATEST_LOG_NAME);
}

export async function writeRollbackLog(
  folder: string,
  items: RenameItem[],
): Promise<string> {
  const log: RollbackLog = {
    folder: path.resolve(folder),
    createdAt: new Date().toISOString(),
    items: items.map((item) => ({
      from: item.originalName,
      to: item.finalName,
    })),
  };

  const logPath = getLatestLogPath(folder);
  await fs.writeFile(logPath, JSON.stringify(log, null, 2), "utf-8");

  return logPath;
}

export async function getRollbackInfo(
  folder: string,
): Promise<{ path: string; itemCount: number } | null> {
  const logPath = getLatestLogPath(folder);

  try {
    const log = await readRollbackLog(logPath);
    return { path: logPath, itemCount: log.items.length };
  } catch {
    return null;
  }
}

export async function deleteRollbackLog(folder: string): Promise<void> {
  try {
    await fs.unlink(getLatestLogPath(folder));
  } catch {
    // Log may already be missing.
  }
}

export async function readRollbackLog(logPath: string): Promise<RollbackLog> {
  const resolved = path.resolve(logPath);
  const content = await fs.readFile(resolved, "utf-8");
  const log = JSON.parse(content) as RollbackLog;

  if (!log.folder || !Array.isArray(log.items)) {
    throw new Error(`Invalid rollback log: ${resolved}`);
  }

  const resolvedFolder = path.resolve(log.folder);

  for (const item of log.items) {
    assertSafeFilename(item.from, "rollback log");
    assertSafeFilename(item.to, "rollback log");
  }

  return { ...log, folder: resolvedFolder };
}

export type RollbackResult = {
  restored: number;
  errors: Array<{ from: string; to: string; error: string }>;
};

export async function executeRollback(
  logPath?: string,
  folder?: string,
): Promise<RollbackResult> {
  const resolvedLogPath =
    logPath ?? getLatestLogPath(folder ?? process.cwd());

  const log = await readRollbackLog(resolvedLogPath);
  const result: RollbackResult = { restored: 0, errors: [] };

  for (const item of [...log.items].reverse()) {
    const fromPath = resolveInsideRoot(log.folder, item.to);
    const toPath = resolveInsideRoot(log.folder, item.from);

    try {
      await fs.rename(fromPath, toPath);
      result.restored++;
    } catch (error) {
      result.errors.push({
        from: item.from,
        to: item.to,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  if (result.errors.length === 0) {
    await deleteRollbackLog(log.folder);
  }

  return result;
}
