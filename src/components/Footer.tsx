import React from "react";
import { Box, Text } from "ink";
import type { RenameItem } from "../types/rename.js";
import { theme } from "../ui/theme.js";
import { buildPreviewShortcuts, ShortcutBar } from "./ShortcutBar.js";

type FooterProps = {
  items: RenameItem[];
  canRollback?: boolean;
};

function StatPill({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone?: string;
}) {
  return (
    <Text>
      <Text bold color={tone ?? theme.colors.accent}>
        {value}
      </Text>
      <Text dimColor> {label}</Text>
    </Text>
  );
}

export function Footer({ items, canRollback = false }: FooterProps) {
  const selected = items.filter((i) => i.selected).length;
  const conflicts = items.filter((i) => i.status === "conflict").length;

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box columnGap={2}>
        <StatPill value={items.length} label="files" />
        <Text dimColor>·</Text>
        <StatPill value={selected} label="selected" />
        <Text dimColor>·</Text>
        <StatPill
          value={conflicts}
          label="conflicts"
          tone={conflicts > 0 ? theme.colors.warning : theme.colors.accent}
        />
      </Box>
      <Box marginTop={1}>
        <ShortcutBar shortcuts={buildPreviewShortcuts(canRollback)} />
      </Box>
    </Box>
  );
}
