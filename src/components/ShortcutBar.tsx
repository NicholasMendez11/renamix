import React from "react";
import { Box, Text } from "ink";
import { KeyHint } from "./KeyHint.js";

type Shortcut = {
  keyLabel: string;
  action: string;
};

type ShortcutBarProps = {
  shortcuts: Shortcut[];
};

export function ShortcutBar({ shortcuts }: ShortcutBarProps) {
  return (
    <Box flexWrap="wrap" columnGap={2} rowGap={0}>
      {shortcuts.map((shortcut, index) => (
        <Box key={`${shortcut.keyLabel}-${shortcut.action}`}>
          {index > 0 ? <Text dimColor> </Text> : null}
          <KeyHint keyLabel={shortcut.keyLabel} action={shortcut.action} />
        </Box>
      ))}
    </Box>
  );
}

export function buildPreviewShortcuts(canRollback: boolean): Shortcut[] {
  const shortcuts: Shortcut[] = [
    { keyLabel: "↑↓", action: "move" },
    { keyLabel: "Space", action: "select" },
    { keyLabel: "P", action: "prefix" },
    { keyLabel: "A", action: "apply" },
  ];

  if (canRollback) {
    shortcuts.push({ keyLabel: "U", action: "undo" });
  }

  shortcuts.push(
    { keyLabel: "R", action: "refresh" },
    { keyLabel: "Q", action: "quit" },
  );

  return shortcuts;
}
