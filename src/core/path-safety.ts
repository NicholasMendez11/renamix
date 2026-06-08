import path from "node:path";

const UNSAFE_FILENAME = /[<>:"/\\|?*\x00-\x1f]/;

export function isSafeFilename(name: string): boolean {
  if (!name || name === "." || name === "..") {
    return false;
  }

  if (name !== path.basename(name)) {
    return false;
  }

  if (UNSAFE_FILENAME.test(name)) {
    return false;
  }

  return true;
}

export function assertSafeFilename(name: string, context: string): void {
  if (!isSafeFilename(name)) {
    throw new Error(`Unsafe filename in ${context}: ${name}`);
  }
}

export function isInsideRoot(root: string, target: string): boolean {
  const resolvedRoot = path.resolve(root);
  const resolvedTarget = path.resolve(target);
  const relative = path.relative(resolvedRoot, resolvedTarget);

  if (relative === "") {
    return true;
  }

  return !relative.startsWith("..") && !path.isAbsolute(relative);
}

export function resolveInsideRoot(
  root: string,
  ...segments: string[]
): string {
  const resolvedRoot = path.resolve(root);
  const resolvedTarget = path.resolve(resolvedRoot, ...segments);

  if (!isInsideRoot(resolvedRoot, resolvedTarget)) {
    throw new Error(`Path escapes target folder: ${resolvedTarget}`);
  }

  return resolvedTarget;
}
