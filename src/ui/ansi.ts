export function osc8Link(url: string, label: string): string {
  return `\u001b]8;;${url}\u0007${label}\u001b]8;;\u0007`;
}
