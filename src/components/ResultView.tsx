import React from "react";
import { Text } from "ink";
import { theme } from "../ui/theme.js";
import { DialogPanel } from "./DialogPanel.js";
import { ShortcutBar } from "./ShortcutBar.js";

type ResultViewProps = {
  kind: "rename" | "rollback";
  successCount: number;
  errorCount: number;
  logPath?: string;
};

export function ResultView({
  kind,
  successCount,
  errorCount,
  logPath,
}: ResultViewProps) {
  const label = kind === "rename" ? "Renamed" : "Restored";
  const icon = errorCount > 0 ? "✗" : "✓";
  const tone = errorCount > 0 ? "warning" : "success";

  return (
    <DialogPanel
      title={`${icon} Done`}
      tone={errorCount > 0 ? "warning" : "default"}
    >
      <Text color={theme.colors.text}>
        {label}:{" "}
        <Text bold color={theme.colors.success}>
          {successCount}
        </Text>
        <Text dimColor> | Errors: </Text>
        <Text bold color={errorCount > 0 ? theme.colors.warning : theme.colors.muted}>
          {errorCount}
        </Text>
      </Text>
      {kind === "rename" && logPath ? (
        <Text dimColor>Rollback log: {logPath}</Text>
      ) : null}
      <Text dimColor color={tone === "success" ? theme.colors.success : undefined}>
        {errorCount === 0 ? "Operation completed successfully." : "Some files could not be processed."}
      </Text>
      <ShortcutBar
        shortcuts={[
          { keyLabel: "R", action: "continue" },
          { keyLabel: "Q", action: "quit" },
        ]}
      />
    </DialogPanel>
  );
}
