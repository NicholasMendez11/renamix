import React, { type ReactNode } from "react";
import { Box, useStdout } from "ink";
import { theme } from "../ui/theme.js";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const { stdout } = useStdout();
  const width = Math.max(
    stdout.columns ?? theme.layout.minContentWidth,
    theme.layout.minContentWidth,
  );

  return (
    <Box flexDirection="column" width={width}>
      <Box
        flexDirection="column"
        borderStyle={theme.border.style}
        borderColor={theme.border.color}
        paddingX={theme.layout.paddingX}
        width={width}
      >
        {children}
      </Box>
    </Box>
  );
}
