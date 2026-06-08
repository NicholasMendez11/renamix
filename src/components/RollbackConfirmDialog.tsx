import React from "react";
import { Text } from "ink";
import { theme } from "../ui/theme.js";
import { DialogPanel } from "./DialogPanel.js";
import { ShortcutBar } from "./ShortcutBar.js";

type RollbackConfirmDialogProps = {
  count: number;
};

export function RollbackConfirmDialog({ count }: RollbackConfirmDialogProps) {
  return (
    <DialogPanel title="Confirm rollback" tone="warning">
      <Text color={theme.colors.text}>
        Restore {count} file{count === 1 ? "" : "s"} to their previous names?
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
