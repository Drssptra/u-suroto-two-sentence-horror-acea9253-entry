// u-suroto-two-sentence-horror-acea9253 — v2 resubmission entry runner.
// Emits exactly two sentences of horror to stdout and to entry.txt
// (byte-exact, no trailing newline) inside MAKEFUN_OUTPUT_DIR.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const GATE = { minChars: 1, maxChars: 400, sentences: 2 } as const;

class HorrorEntry {
  readonly #parts: readonly string[];

  constructor(parts: readonly string[]) {
    this.#parts = parts;
  }

  render(): string {
    return this.#parts.map((part) => part.trim()).join(" ");
  }

  sentenceCount(text: string): number {
    return text.split(/(?<=[.!?])\s+/).filter(Boolean).length;
  }

  check(text: string): void {
    if (text.length < GATE.minChars || text.length > GATE.maxChars) {
      throw new Error(`entry length ${text.length} outside ${GATE.minChars}-${GATE.maxChars}`);
    }
    if (text !== text.trim() || /\n/.test(text)) {
      throw new Error("entry must be a single line with no leading/trailing whitespace");
    }
    if (!/[.!?]$/.test(text)) {
      throw new Error("entry must end with terminal punctuation");
    }
    const n = this.sentenceCount(text);
    if (n !== GATE.sentences) {
      throw new Error(`expected ${GATE.sentences} sentences, found ${n}`);
    }
  }
}

const entry = new HorrorEntry([
  "Every night I lock the front door twice, the way my father taught me, and check every window before bed.",
  "Last night the second lock clicked shut from the inside, and a voice almost like my father's whispered that now we were both safe in here.",
]);

const text = entry.render();
entry.check(text);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, Buffer.from(text, "utf8"));

// Self-check: what landed on disk must be byte-identical to what we render.
const onDisk = readFileSync(outPath);
if (!onDisk.equals(Buffer.from(text, "utf8"))) {
  throw new Error("entry.txt mismatch after write");
}

process.stdout.write(text + "\n");
