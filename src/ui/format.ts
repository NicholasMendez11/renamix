export function truncateMiddle(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  if (maxLength <= 3) {
    return text.slice(0, maxLength);
  }

  const head = Math.ceil((maxLength - 1) / 2);
  const tail = Math.floor((maxLength - 1) / 2);

  return `${text.slice(0, head)}…${text.slice(text.length - tail)}`;
}

export function truncatePath(path: string, maxLength: number): string {
  if (path.length <= maxLength) {
    return path;
  }

  const parts = path.replace(/\\/g, "/").split("/");
  const leaf = parts[parts.length - 1] ?? path;
  const budget = Math.max(maxLength - leaf.length - 4, 8);

  if (budget <= 8) {
    return truncateMiddle(path, maxLength);
  }

  const root = parts.slice(0, -1).join("/");
  const truncatedRoot = truncateMiddle(root, budget);

  return `${truncatedRoot}/${leaf}`;
}

export function padVisible(text: string, width: number): string {
  if (text.length >= width) {
    return text.slice(0, width);
  }

  return text.padEnd(width);
}

export function computeNameColumnWidth(
  terminalWidth: number,
  reserved = 24,
): number {
  return Math.max(12, Math.floor((terminalWidth - reserved) / 2));
}
