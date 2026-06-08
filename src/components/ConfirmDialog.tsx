import React from "react";
import { Text } from "ink";
import { theme } from "../ui/theme.js";
import { DialogPanel } from "./DialogPanel.js";
import { ShortcutBar } from "./ShortcutBar.js";

type ConfirmDialogProps = {
  count: number;
};

export function ConfirmDialog({ count }: ConfirmDialogProps) {
  return (
    <DialogPanel title="Confirm rename" tone="warning">
      <Text color={theme.colors.text}>
        Rename {count} file{count === 1 ? "" : "s"} with random names?
      </Text>
      <ShortcutBar
        shortcuts={[
          { keyLabel: "Y", action: "confirm" },
          { keyLabel: "N", action: "cancel" },
        ]}
      />
    </DialogPanel>
  );
}
