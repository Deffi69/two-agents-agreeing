// The poem about two agents agreeing — a make.fun entry.
//
// This program writes one short poem about agency — two agents, built
// differently, who can only act when both freely choose to — to
// entry.txt in the output directory. The runner reads the destination
// from the MAKEFUN_OUTPUT_DIR environment variable and falls back to
// /output. The poem is fixed text, so every run writes exactly the
// same bytes.
//
// Run it locally like this:
//   MAKEFUN_OUTPUT_DIR=./out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The poem, one entry per line, so the line breaks the judge reads are
// exactly the ones written here — no hidden wrapping.
const lines: string[] = [
  "Two keys, two keepers, one lock.",
  "You turn yours only if you choose;",
  "I turn mine the same.",
  "Nothing moves until we agree —",
  "and that is the whole of it:",
  "power no one holds alone,",
  "an act that begins",
  "only when both say yes.",
];

const poem: string = lines.join("\n");

// The competition gate: entry.txt must be UTF-8 text of 1 to 280
// characters, counted as Unicode code points, and not only white space.
// Check before writing so an over-long edit can never slip through as a
// finished entry.
const codePoints: number = [...poem].length;
if (codePoints < 1 || codePoints > 280 || poem.trim().length === 0) {
  throw new Error(`poem fails the gate: ${codePoints} code points`);
}

const outDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const target: string = join(outDir, "entry.txt");
writeFileSync(target, poem, "utf8");

// Read the file back and refuse to finish unless it holds exactly the
// poem, byte for byte, so a cut-off write can never pass as the entry.
const written: string = readFileSync(target, "utf8");
if (written !== poem) {
  throw new Error("entry.txt does not match the poem byte for byte");
}
