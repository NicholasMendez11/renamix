import React, { type ReactNode } from "react";
import { Box, Text } from "ink";
import { theme } from "../ui/theme.js";

type DialogPanelProps = {
  title: string;
  tone?: "default" | "warning" | "error";
  children: ReactNode;
};

const toneColors = {
  default: theme.border.dialogColor,
  warning: theme.border.warningColor,
  error: theme.border.errorColor,
} as const;

export function DialogPanel({
  title,
  tone = "default",
  children,
}: DialogPanelProps) {
  return (
    <Box
      flexDirection="column"
      borderStyle={theme.border.style}
      borderColor={toneColors[tone]}
      paddingX={theme.layout.paddingX}
      marginY={1}
    >
      <Text bold color={toneColors[tone]}>
        {title}
      </Text>
      {children}
    </Box>
  );
}
