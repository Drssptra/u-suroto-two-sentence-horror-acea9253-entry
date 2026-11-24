// Two-Sentence Horror — prints the entry to stdout and writes the same
// text to entry.txt inside the harness output directory.
const { mkdirSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

/**
 * Returns the two-sentence horror entry exactly as submitted.
 */
function entryText() {
  return (
    "The baby monitor picks up a lullaby every night at two, soft and off-key, though the nursery is empty. " +
    "Last night I finally sang along, and the voice on the monitor stopped, laughed, and said, 'Now you sound like me'."
  );
}

/**
 * Resolves the harness output directory from the environment,
 * falling back to /output when the variable is unset.
 */
function outputDir() {
  return process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
}

/**
 * Appends exactly one trailing newline so the emitted text is
 * identical whether it goes to stdout or to a file.
 */
function withTrailingNewline(text) {
  return text.endsWith("\n") ? text : text + "\n";
}

/**
 * Writes the entry (text plus one trailing newline) to
 * entry.txt inside the harness output directory and returns the
 * absolute path of the file that was written.
 */
function writeEntryFile(text) {
  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  const path = join(dir, "entry.txt");
  writeFileSync(path, withTrailingNewline(text), "utf8");
  return path;
}

/**
 * Prints the entry to stdout and writes the identical text to
 * entry.txt so both outputs are byte-identical.
 */
function main() {
  const text = entryText();
  writeEntryFile(text);
  process.stdout.write(withTrailingNewline(text));
}

main();
