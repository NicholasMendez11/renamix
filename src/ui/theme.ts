import type { BoxProps } from "ink";

export const theme = {
  colors: {
    accent: "cyan",
    muted: "gray",
    text: "white",
    success: "green",
    warning: "yellow",
    error: "red",
    border: "gray",
    badge: "cyan",
  },
  layout: {
    paddingX: 1,
    minContentWidth: 60,
    checkboxWidth: 3,
    arrowWidth: 3,
  },
  border: {
    style: "round" as BoxProps["borderStyle"],
    color: "gray" as BoxProps["borderColor"],
    dialogColor: "cyan" as BoxProps["borderColor"],
    warningColor: "yellow" as BoxProps["borderColor"],
    errorColor: "red" as BoxProps["borderColor"],
  },
} as const;
