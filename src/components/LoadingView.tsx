import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";
import { theme } from "../ui/theme.js";

const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

type LoadingViewProps = {
  message: string;
};

export function LoadingView({ message }: LoadingViewProps) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((current) => (current + 1) % FRAMES.length);
    }, 80);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box marginY={1} columnGap={1}>
      <Text color={theme.colors.accent}>{FRAMES[frameIndex]}</Text>
      <Text color={theme.colors.muted}>{message}</Text>
    </Box>
  );
}
