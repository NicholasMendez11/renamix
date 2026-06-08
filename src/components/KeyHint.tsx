import React from "react";
import { Text } from "ink";
import { theme } from "../ui/theme.js";

type KeyHintProps = {
  keyLabel: string;
  action: string;
};

export function KeyHint({ keyLabel, action }: KeyHintProps) {
  return (
    <Text>
      <Text bold color={theme.colors.accent}>
        {keyLabel}
      </Text>
      <Text dimColor> {action}</Text>
    </Text>
  );
}
