import React from "react";
import { Text } from "ink";
import { theme } from "../ui/theme.js";

type StatusBadgeProps = {
  label: string;
  tone?: "default" | "success" | "warning" | "error";
};

const toneColors = {
  default: theme.colors.badge,
  success: theme.colors.success,
  warning: theme.colors.warning,
  error: theme.colors.error,
} as const;

export function StatusBadge({ label, tone = "default" }: StatusBadgeProps) {
  return (
    <Text color={toneColors[tone]} dimColor={tone === "default"}>
      {label}
    </Text>
  );
}
