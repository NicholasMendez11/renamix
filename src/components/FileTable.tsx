import React from "react";
import { Box, Text, useStdout } from "ink";
import type { RenameItem } from "../types/rename.js";
import {
  computeNameColumnWidth,
  padVisible,
  truncateMiddle,
} from "../ui/format.js";
import { theme } from "../ui/theme.js";

type FileTableProps = {
  items: RenameItem[];
  cursorIndex: number;
};

function statusLabel(item: RenameItem): string {
  if (item.status === "conflict") return "conflict";
  if (item.status === "skipped" || !item.selected) return "skipped";
  if (item.status === "renamed") return item.finalName;
  if (item.status === "error") return item.error ?? "error";
  return item.finalName;
}

function statusColor(item: RenameItem): string {
  if (item.status === "conflict") return theme.colors.warning;
  if (item.status === "error") return theme.colors.error;
  if (!item.selected || item.status === "skipped") return theme.colors.muted;
  if (item.status === "renamed") return theme.colors.success;
  return theme.colors.text;
}

export function FileTable({ items, cursorIndex }: FileTableProps) {
  const { stdout } = useStdout();
  const terminalWidth = stdout.columns ?? theme.layout.minContentWidth;
  const nameWidth = computeNameColumnWidth(terminalWidth);

  if (items.length === 0) {
    return (
      <Box marginY={1}>
        <Text dimColor>No files found in this folder.</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginY={1}>
      {items.map((item, index) => {
        const isCursor = index === cursorIndex;
        const checkbox = item.selected ? "x" : " ";
        const label = statusLabel(item);
        const color = statusColor(item);
        const original = truncateMiddle(item.originalName, nameWidth);
        const nextName = truncateMiddle(label, nameWidth);

        return (
          <Box key={item.originalPath}>
            <Text dimColor>{isCursor ? "› " : "  "}</Text>
            <Text color={isCursor ? theme.colors.accent : theme.colors.muted}>
              [{checkbox}]
            </Text>
            <Text> </Text>
            <Text bold={isCursor} dimColor={!item.selected}>
              {padVisible(original, nameWidth)}
            </Text>
            <Text dimColor> → </Text>
            <Text color={color} bold={isCursor && item.selected}>
              {padVisible(nextName, nameWidth)}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
