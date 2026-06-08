#!/usr/bin/env node

import { Command } from "commander";
import React from "react";
import { render } from "ink";
import { App } from "./app.js";
import { createPlan, getSelectedItems } from "./core/planner.js";
import { executePlan } from "./core/renamer.js";
import { executeRollback, getLatestLogPath } from "./core/rollback.js";
import type { CliOptions } from "./types/rename.js";
import path from "node:path";

const program = new Command();

function parseExtensions(value?: string): string[] | undefined {
  if (!value) return undefined;
  return value
    .split(",")
    .map((ext) => ext.trim())
    .filter(Boolean);
}

function buildScanOptions(opts: {
  recursive?: boolean;
  ext?: string;
  prefix?: string;
}): CliOptions {
  return {
    recursive: opts.recursive ?? false,
    extensions: parseExtensions(opts.ext),
    prefix: opts.prefix,
  };
}

async function runCliMode(
  folder: string,
  options: CliOptions & { dryRun?: boolean; apply?: boolean },
): Promise<void> {
  const plan = await createPlan(folder, options);

  if (options.dryRun) {
    const selected = getSelectedItems(plan);
    console.log(`Dry run — ${selected.length} file(s) would be renamed:\n`);
    for (const item of selected) {
      console.log(`  ${item.originalName} → ${item.finalName}`);
    }
    return;
  }

  if (options.apply) {
    const result = await executePlan(plan);
    console.log(
      `Renamed ${result.renamedCount} file(s). Errors: ${result.errorCount}`,
    );
    if (result.logPath) {
      console.log(`Rollback log: ${result.logPath}`);
    }
    return;
  }
}

program
  .name("renamix")
  .description(
    "A terminal UI for safely renaming files with random unique names.",
  )
  .argument("[folder]", "Folder to process", process.cwd())
  .option("--dry-run", "Preview renames without modifying files")
  .option("--apply", "Apply renames with safe defaults (no TUI)")
  .option("--recursive", "Include files in subfolders")
  .option("--ext <extensions>", "Comma-separated extensions (e.g. jpg,png)")
  .option("--prefix <prefix>", "Prefix for generated names (e.g. photo_)")
  .action(async (folder: string, opts) => {
    const resolvedFolder = path.resolve(folder);
    const scanOptions = buildScanOptions(opts);

    if (opts.dryRun || opts.apply) {
      try {
        await runCliMode(resolvedFolder, {
          ...scanOptions,
          dryRun: opts.dryRun,
          apply: opts.apply,
        });
      } catch (error) {
        console.error(
          error instanceof Error ? error.message : "Unexpected error",
        );
        process.exitCode = 1;
      }
      return;
    }

    render(
      React.createElement(App, {
        folder: resolvedFolder,
        options: scanOptions,
      }),
    );
  });

program
  .command("rollback [logPath]")
  .description("Revert a previous rename operation using a rollback log")
  .action(async (logPath?: string) => {
    try {
      const target = logPath ?? getLatestLogPath(process.cwd());
      const result = await executeRollback(target);

      console.log(`Restored ${result.restored} file(s).`);

      if (result.errors.length > 0) {
        console.error(`Errors: ${result.errors.length}`);
        for (const err of result.errors) {
          console.error(`  ${err.to} → ${err.from}: ${err.error}`);
        }
        process.exitCode = 1;
      }
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : "Rollback failed",
      );
      process.exitCode = 1;
    }
  });

program.parse();
