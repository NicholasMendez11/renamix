import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  assertSafeFilename,
  isInsideRoot,
  isSafeFilename,
  resolveInsideRoot,
} from "./path-safety.js";

describe("isSafeFilename", () => {
  it("accepts normal filenames", () => {
    expect(isSafeFilename("photo.jpg")).toBe(true);
    expect(isSafeFilename(".renamix-log.json")).toBe(true);
  });

  it("rejects path traversal and separators", () => {
    expect(isSafeFilename("../secret.txt")).toBe(false);
    expect(isSafeFilename("folder/file.txt")).toBe(false);
    expect(isSafeFilename("..")).toBe(false);
  });
});

describe("resolveInsideRoot", () => {
  it("resolves paths inside the root", () => {
    const root = path.resolve("C:\\photos");
    const resolved = resolveInsideRoot(root, "a.jpg");
    expect(resolved).toBe(path.join(root, "a.jpg"));
  });

  it("blocks escaping the root via rollback segments", () => {
    expect(() =>
      resolveInsideRoot(path.resolve("C:\\photos"), "..", "secret.txt"),
    ).toThrow();
  });
});

describe("assertSafeFilename", () => {
  it("throws for unsafe rollback entries", () => {
    expect(() => assertSafeFilename("..\\x", "rollback log")).toThrow();
  });
});

describe("isInsideRoot", () => {
  it("detects paths outside the root", () => {
    const root = path.resolve("C:\\photos");
    expect(isInsideRoot(root, path.join(root, "a.jpg"))).toBe(true);
    expect(isInsideRoot(root, path.resolve("C:\\other\\a.jpg"))).toBe(false);
  });
});
