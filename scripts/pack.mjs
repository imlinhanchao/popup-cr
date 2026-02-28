#!/usr/bin/env node
/**
 * pack.mjs
 * Post-build script: reads the Parcel bundle output and prepends the
 * Tampermonkey metadata block to produce a ready-to-install .user.js file.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distDir = join(root, 'dist');
const metaFile = join(root, 'userscript.meta.js');

// Find the built JS file in dist/ (tsdown outputs *.iife.js)
const files = readdirSync(distDir).filter(f => f.endsWith('.js') && !f.endsWith('.user.js'));
if (files.length === 0) {
  console.error('No JS file found in dist/. Run `npm run build:raw` first.');
  process.exit(1);
}

// Prefer the .iife.js file produced by tsdown
const bundleFile = join(distDir, files.find(f => f.endsWith('.iife.js')) ?? files[0]);
const meta = readFileSync(metaFile, 'utf8').trimEnd();
const bundle = readFileSync(bundleFile, 'utf8');

const userscript = meta + '\n\n' + bundle + '\n';
const outFile = join(distDir, 'popup-cr.user.js');
writeFileSync(outFile, userscript, 'utf8');

console.log(`Created: ${outFile}`);
