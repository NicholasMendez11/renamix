import React from "react";
import { Box, Text, useStdout } from "ink";
import { BRANDING } from "../config/branding.js";
import { truncatePath } from "../ui/format.js";
import { theme } from "../ui/theme.js";
import { StatusBadge } from "./StatusBadge.js";

type HeaderProps = {
  folder: string;
  mode: string;
  prefix?: string;
  modeTone?: "default" | "success" | "warning" | "error";
};

export function Header({ folder, mode, prefix, modeTone = "default" }: HeaderProps) {
  const { stdout } = useStdout();
  const maxPathWidth = Math.max((stdout.columns ?? 80) - 12, 24);
  const displayFolder = truncatePath(folder, maxPathWidth);

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box justifyContent="space-between">
        <Text bold color={theme.colors.text}>
          {BRANDING.name}
        </Text>
        <StatusBadge label={mode} tone={modeTone} />
      </Box>
      <Text>
        <Text dimColor>Folder </Text>
        <Text color={theme.colors.text}>{displayFolder}</Text>
      </Text>
      {prefix !== undefined ? (
        <Box>
          <Text dimColor>Prefix </Text>
          <StatusBadge label={prefix || "(none)"} />
        </Box>
      ) : null}
    </Box>
  );
}
