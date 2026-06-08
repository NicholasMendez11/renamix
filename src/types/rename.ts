export type RenameStatus =
  | "ready"
  | "conflict"
  | "skipped"
  | "renamed"
  | "error";

export type RenameItem = {
  selected: boolean;
  originalPath: string;
  originalName: string;
  temporaryPath: string;
  finalPath: string;
  finalName: string;
  extension: string;
  status: RenameStatus;
  error?: string;
};

export type RenamePlan = {
  folder: string;
  items: RenameItem[];
  createdAt: string;
};

export type RollbackLog = {
  folder: string;
  createdAt: string;
  items: Array<{
    from: string;
    to: string;
  }>;
};

export type ScanOptions = {
  recursive?: boolean;
  extensions?: string[];
  includeHidden?: boolean;
  prefix?: string;
};

export type CliOptions = ScanOptions & {
  dryRun?: boolean;
  apply?: boolean;
};
