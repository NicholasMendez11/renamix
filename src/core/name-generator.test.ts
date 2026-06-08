import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  generateName,
  generateTempName,
  sanitizePrefix,
} from "./name-generator.js";

describe("generateName", () => {
  it("preserves extension in lowercase", () => {
    const name = generateName("/photos/IMG_001.JPG");
    expect(path.extname(name)).toBe(".jpg");
    expect(name).toMatch(/^[a-f0-9]{12}\.jpg$/);
  });

  it("prepends a sanitized prefix", () => {
    const name = generateName("/photos/IMG_001.jpg", { prefix: "photo_" });
    expect(name).toMatch(/^photo_[a-f0-9]{12}\.jpg$/);
  });

  it("strips invalid characters from prefix", () => {
    expect(sanitizePrefix('bad<>prefix')).toBe("badprefix");
    const name = generateName("/file.png", { prefix: 'img/:' });
    expect(name).toMatch(/^img[a-f0-9]{12}\.png$/);
  });

  it("generates unique temp names", () => {
    const a = generateTempName();
    const b = generateTempName();
    expect(a).not.toBe(b);
    expect(a).toMatch(/^\.renamix_tmp_[a-f0-9]{8}$/);
  });
});
