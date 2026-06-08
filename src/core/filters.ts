import path from "node:path";

const RENAMIX_LOG_PATTERN = /^\.?renamix-log.*\.json$/i;
const RENAMIX_TMP_PATTERN = /^\.renamix_tmp_/;
const LEGACY_NAMIX_LOG_PATTERN = /^\.?namix-log.*\.json$/i;
const LEGACY_NAMIX_TMP_PATTERN = /^\.namix_tmp_/;
const LEGACY_RENAMR_LOG_PATTERN = /^\.?renamr-log.*\.json$/i;
const LEGACY_RENAMR_TMP_PATTERN = /^\.renamr_tmp_/;

export function isHidden(name: string): boolean {
  return name.startsWith(".");
}

export function isRenamixLog(name: string): boolean {
  return (
    RENAMIX_LOG_PATTERN.test(name) ||
    LEGACY_NAMIX_LOG_PATTERN.test(name) ||
    LEGACY_RENAMR_LOG_PATTERN.test(name)
  );
}

export function isRenamixTemp(name: string): boolean {
  return (
    RENAMIX_TMP_PATTERN.test(name) ||
    LEGACY_NAMIX_TMP_PATTERN.test(name) ||
    LEGACY_RENAMR_TMP_PATTERN.test(name)
  );
}

export function matchesExtension(
  name: string,
  extensions?: string[],
): boolean {
  if (!extensions || extensions.length === 0) {
    return true;
  }

  const fileExt = path.extname(name).toLowerCase().replace(/^\./, "");
  return extensions.some(
    (ext) => ext.toLowerCase().replace(/^\./, "") === fileExt,
  );
}

export function shouldSkipFile(
  name: string,
  options: { includeHidden?: boolean; extensions?: string[] },
): boolean {
  if (!options.includeHidden && isHidden(name)) {
    return true;
  }

  if (isRenamixLog(name) || isRenamixTemp(name)) {
    return true;
  }

  if (!matchesExtension(name, options.extensions)) {
    return true;
  }

  return false;
}
