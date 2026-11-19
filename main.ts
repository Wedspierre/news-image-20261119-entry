// news-image-20261119 entry (Node 22, standard library only).
// The entry is the front page sitting next to this file: entry.png, a
// newspaper front page dated THURSDAY 19 NOVEMBER 2026 with four panels —
// Trump, Xi and Putin meeting in Shenzhen for the first-ever trilateral
// summit on nuclear arms and Iran, Iran widening the Gulf war by hitting
// US bases in Kuwait and Bahrain as the US struck Qeshm Island, Cyclone
// Akvan bearing down on India's east coast as a severe cyclonic storm,
// and Grand Theft Auto VI launching worldwide to a 99 on Metacritic.
// This program just delivers those exact bytes to the grader's output
// directory — the judge sees the file as-is, nothing is re-encoded or
// resized.
//
// Local run: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync, unlinkSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const source = new URL('./entry.png', import.meta.url);

// The grader's output directory may not exist yet — create it so the
// copy never fails on a missing folder.
mkdirSync(outDir, { recursive: true });
const target = join(outDir, 'entry.png');
// Unlink first: the grader runs the program twice and may reuse the
// output directory, and the copy it delivered on the first run carries
// the source's read-only mode — overwriting it in place would fail
// with EACCES, while unlinking and recreating it always succeeds.
try {
  unlinkSync(target);
} catch (err) {
  if (err.code !== 'ENOENT') throw err;
}
copyFileSync(source, target);

// The judge scores the file as-is, so confirm the delivered copy is
// byte-for-byte the source instead of silently shipping a short write:
// same size first, then the same SHA-256 digest, so a same-length
// corruption can no longer pass the check unnoticed.
const sourceBytes = statSync(source).size;
const targetBytes = statSync(target).size;
if (sourceBytes !== targetBytes) {
  throw new Error(`entry.png size mismatch: source ${sourceBytes} bytes, delivered ${targetBytes} bytes`);
}
const digest = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const sourceHash = digest(source);
const targetHash = digest(target);
if (sourceHash !== targetHash) {
  throw new Error(`entry.png sha256 mismatch: source ${sourceHash}, delivered ${targetHash}`);
}
console.log(`delivered entry.png to ${outDir} (${targetBytes} bytes, sha256 ${targetHash})`);
