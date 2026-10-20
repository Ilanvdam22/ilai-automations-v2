import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

// Huisregel: nooit lange gedachtestreepjes (— of –) in de site, ook niet in code-commentaar
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? files(p) : /\.(tsx?|css|md|txt)$/.test(name) ? [p] : [];
  });
}

describe("geen lange gedachtestreepjes", () => {
  const all = [...files("src"), "public/llms.txt"];
  it.each(all)("%s", (path) => {
    const hits = readFileSync(path, "utf8")
      .split("\n")
      .map((line, i) => ({ line: i + 1, text: line }))
      .filter(({ text }) => /[–—]/.test(text));
    expect(hits).toEqual([]);
  });
});
