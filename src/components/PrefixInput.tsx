import React, { useEffect, useState } from "react";
import { Text } from "ink";
import { theme } from "../ui/theme.js";
import { DialogPanel } from "./DialogPanel.js";
import { ShortcutBar } from "./ShortcutBar.js";

type PrefixInputProps = {
  value: string;
};

export function PrefixInput({ value }: PrefixInputProps) {
  const [cursorVisible, setCursorVisible] = useState(true);
  const preview = value ? `${value}a8f31c90d2ab.jpg` : "a8f31c90d2ab.jpg";

  useEffect(() => {
    const timer = setInterval(() => {
      setCursorVisible((current) => !current);
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <DialogPanel title="Set prefix">
      <Text>
        <Text dimColor>Prefix </Text>
        <Text color={theme.colors.text}>{value || "(none)"}</Text>
        <Text color={theme.colors.accent}>{cursorVisible ? "▌" : " "}</Text>
      </Text>
      <Text dimColor>Example: {preview}</Text>
      <ShortcutBar
        shortcuts={[
          { keyLabel: "Enter", action: "save" },
          { keyLabel: "Esc", action: "cancel" },
          { keyLabel: "Backspace", action: "delete" },
        ]}
      />
    </DialogPanel>
  );
}
