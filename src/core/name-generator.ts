import { randomUUID } from "node:crypto";
import path from "node:path";

const INVALID_PREFIX_CHARS = /[<>:"/\\|?*\x00-\x1f]/g;

export type GenerateNameOptions = {
  prefix?: string;
  length?: number;
};

export function sanitizePrefix(prefix: string): string {
  return prefix.replace(INVALID_PREFIX_CHARS, "").trim();
}

export function generateName(
  originalPath: string,
  options: GenerateNameOptions = {},
): string {
  const { prefix = "", length = 12 } = options;
  const ext = path.extname(originalPath).toLowerCase();
  const id = randomUUID().replaceAll("-", "").slice(0, length);
  const safePrefix = sanitizePrefix(prefix);

  return `${safePrefix}${id}${ext}`;
}

export function generateTempName(): string {
  const id = randomUUID().replaceAll("-", "").slice(0, 8);
  return `.renamix_tmp_${id}`;
}
