// Writes the entry text to /output/entry.txt (deterministic, stdlib only).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const text = readFileSync(join(here, "entry.txt"), "utf8");
const points = [...text].length;
if (points < 1 || points > 280) {
  throw new Error(`entry.txt must be 1-280 code points, got ${points}`);
}
if (!text.trim()) {
  throw new Error("entry.txt must not be only whitespace");
}
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, text, "utf8");
// Verify the round-trip: what was written must be byte-identical.
const written = readFileSync(outPath, "utf8");
if (written !== text) {
  throw new Error("round-trip mismatch: written entry.txt differs from source");
}
const hash = createHash("sha256").update(text, "utf8").digest("hex");
console.log(`wrote entry.txt (${points} code points, sha256 ${hash})`);
