import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, useApp, useInput } from "ink";
import { AppShell } from "./components/AppShell.js";
import { BrandFooter } from "./components/BrandFooter.js";
import { ConfirmDialog } from "./components/ConfirmDialog.js";
import { FileTable } from "./components/FileTable.js";
import { Footer } from "./components/Footer.js";
import { Header } from "./components/Header.js";
import { LoadingView } from "./components/LoadingView.js";
import { PrefixInput } from "./components/PrefixInput.js";
import { ResultView } from "./components/ResultView.js";
import { RollbackConfirmDialog } from "./components/RollbackConfirmDialog.js";
import { ShortcutBar } from "./components/ShortcutBar.js";
import { sanitizePrefix } from "./core/name-generator.js";
import { createPlan } from "./core/planner.js";
import { executePlan } from "./core/renamer.js";
import { executeRollback, getRollbackInfo } from "./core/rollback.js";
import { theme } from "./ui/theme.js";
import type { CliOptions, RenamePlan } from "./types/rename.js";

type AppMode =
  | "preview"
  | "confirm"
  | "rollback-confirm"
  | "prefix-edit"
  | "result"
  | "loading"
  | "error";

type LoadingContext = "scan" | "rename" | "rollback";

type ResultState = {
  kind: "rename" | "rollback";
  successCount: number;
  errorCount: number;
  logPath?: string;
};

type AppProps = {
  folder: string;
  options?: CliOptions;
};

function modeTone(
  mode: string,
): "default" | "success" | "warning" | "error" {
  if (mode === "Error") return "error";
  if (mode === "Result" || mode === "Rollback") return "success";
  if (mode === "Loading") return "default";
  return "default";
}

function loadingMessage(context: LoadingContext): string {
  switch (context) {
    case "rename":
      return "Applying renames...";
    case "rollback":
      return "Restoring previous names...";
    default:
      return "Scanning files...";
  }
}

export function App({ folder, options = {} }: AppProps) {
  const { exit } = useApp();
  const [mode, setMode] = useState<AppMode>("loading");
  const [loadingContext, setLoadingContext] = useState<LoadingContext>("scan");
  const [plan, setPlan] = useState<RenamePlan | null>(null);
  const [cursorIndex, setCursorIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultState | null>(null);
  const [prefix, setPrefix] = useState(sanitizePrefix(options.prefix ?? ""));
  const [draftPrefix, setDraftPrefix] = useState("");
  const [rollbackInfo, setRollbackInfo] = useState<{
    path: string;
    itemCount: number;
  } | null>(null);

  const planOptions = useMemo(
    () => ({
      recursive: options.recursive,
      extensions: options.extensions,
      includeHidden: options.includeHidden,
      prefix: prefix || undefined,
    }),
    [options.recursive, options.extensions, options.includeHidden, prefix],
  );

  const loadPlan = useCallback(async () => {
    setLoadingContext("scan");
    setMode("loading");
    setError(null);
    setResult(null);

    try {
      const [nextPlan, nextRollbackInfo] = await Promise.all([
        createPlan(folder, planOptions),
        getRollbackInfo(folder),
      ]);
      setPlan(nextPlan);
      setRollbackInfo(nextRollbackInfo);
      setCursorIndex(0);
      setMode("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load folder");
      setMode("error");
    }
  }, [folder, planOptions]);

  useEffect(() => {
    void loadPlan();
  }, [loadPlan]);

  const toggleSelection = useCallback(() => {
    if (!plan || mode !== "preview") return;

    setPlan((current) => {
      if (!current) return current;

      const items = current.items.map((item, index) => {
        if (index !== cursorIndex) return item;
        if (item.status === "conflict" || item.status === "error") {
          return item;
        }
        return { ...item, selected: !item.selected };
      });

      return { ...current, items };
    });
  }, [plan, mode, cursorIndex]);

  const applyRename = useCallback(async () => {
    if (!plan) return;

    setLoadingContext("rename");
    setMode("loading");
    try {
      const execResult = await executePlan(plan);
      setPlan(execResult.plan);
      setRollbackInfo(await getRollbackInfo(folder));
      setResult({
        kind: "rename",
        successCount: execResult.renamedCount,
        errorCount: execResult.errorCount,
        logPath: execResult.logPath,
      });
      setMode("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rename failed");
      setMode("error");
    }
  }, [plan, folder]);

  const applyRollback = useCallback(async () => {
    if (!rollbackInfo) return;

    setLoadingContext("rollback");
    setMode("loading");
    try {
      const rollbackResult = await executeRollback(rollbackInfo.path);
      setRollbackInfo(null);
      setResult({
        kind: "rollback",
        successCount: rollbackResult.restored,
        errorCount: rollbackResult.errors.length,
      });
      setMode("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rollback failed");
      setMode("error");
    }
  }, [rollbackInfo]);

  const confirmPrefix = useCallback(() => {
    setPrefix(sanitizePrefix(draftPrefix));
  }, [draftPrefix]);

  useInput((input, key) => {
    if (mode === "prefix-edit") {
      if (key.return) {
        confirmPrefix();
      } else if (key.escape) {
        setMode("preview");
      } else if (key.backspace || key.delete) {
        setDraftPrefix((current) => current.slice(0, -1));
      } else if (input && !key.ctrl && !key.meta) {
        setDraftPrefix((current) => current + input);
      }
      return;
    }

    if (mode === "result") {
      if (input.toLowerCase() === "r") {
        void loadPlan();
      } else if (input.toLowerCase() === "q") {
        exit();
      }
      return;
    }

    if (mode === "error") {
      if (input.toLowerCase() === "q") {
        exit();
      }
      return;
    }

    if (mode === "confirm") {
      if (input.toLowerCase() === "y") {
        void applyRename();
      } else if (input.toLowerCase() === "n" || key.escape) {
        setMode("preview");
      }
      return;
    }

    if (mode === "rollback-confirm") {
      if (input.toLowerCase() === "y") {
        void applyRollback();
      } else if (input.toLowerCase() === "n" || key.escape) {
        setMode("preview");
      }
      return;
    }

    if (mode !== "preview" || !plan) return;

    if (key.upArrow) {
      setCursorIndex((i) => Math.max(0, i - 1));
    } else if (key.downArrow) {
      setCursorIndex((i) => Math.min(plan.items.length - 1, i + 1));
    } else if (input === " ") {
      toggleSelection();
    } else if (input.toLowerCase() === "p") {
      setDraftPrefix(prefix);
      setMode("prefix-edit");
    } else if (input.toLowerCase() === "a") {
      const selectedCount = plan.items.filter(
        (item) => item.selected && item.status === "ready",
      ).length;
      if (selectedCount > 0) {
        setMode("confirm");
      }
    } else if (input.toLowerCase() === "u" && rollbackInfo) {
      setMode("rollback-confirm");
    } else if (input.toLowerCase() === "r") {
      void loadPlan();
    } else if (input.toLowerCase() === "q") {
      exit();
    }
  });

  if (mode === "loading") {
    return (
      <AppShell>
        <Header folder={folder} mode="Loading" prefix={prefix} />
        <LoadingView message={loadingMessage(loadingContext)} />
        <BrandFooter />
      </AppShell>
    );
  }

  if (mode === "error") {
    return (
      <AppShell>
        <Header
          folder={folder}
          mode="Error"
          prefix={prefix}
          modeTone="error"
        />
        <Text color={theme.colors.error}>{error}</Text>
        <ShortcutBar shortcuts={[{ keyLabel: "Q", action: "quit" }]} />
        <BrandFooter />
      </AppShell>
    );
  }

  if (mode === "result" && result) {
    return (
      <AppShell>
        <Header
          folder={folder}
          mode={result.kind === "rename" ? "Result" : "Rollback"}
          prefix={prefix}
          modeTone={modeTone(result.kind === "rename" ? "Result" : "Rollback")}
        />
        <ResultView
          kind={result.kind}
          successCount={result.successCount}
          errorCount={result.errorCount}
          logPath={result.logPath}
        />
        <BrandFooter />
      </AppShell>
    );
  }

  if (!plan) {
    return null;
  }

  const selectedCount = plan.items.filter(
    (item) => item.selected && item.status === "ready",
  ).length;

  return (
    <AppShell>
      <Header folder={plan.folder} mode="Preview" prefix={prefix} />
      <FileTable items={plan.items} cursorIndex={cursorIndex} />
      {mode === "prefix-edit" ? <PrefixInput value={draftPrefix} /> : null}
      {mode === "confirm" ? <ConfirmDialog count={selectedCount} /> : null}
      {mode === "rollback-confirm" && rollbackInfo ? (
        <RollbackConfirmDialog count={rollbackInfo.itemCount} />
      ) : null}
      <Footer items={plan.items} canRollback={rollbackInfo !== null} />
      <BrandFooter />
    </AppShell>
  );
}
