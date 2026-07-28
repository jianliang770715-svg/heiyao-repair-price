import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

import { syncPriceData } from './sync-price-data.mjs';

const outputDir = 'dist';
const entries = [
  'index.html',
  'assets',
  'data',
  'pricing/approved',
  '_redirects',
  '_headers',
  'obsidian-phone-repair.vcf',
];
const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
const version = String(packageJson.version || '').trim() || '0.0.0';
const versionScript = `window.REPAIR_SITE_VERSION = ${JSON.stringify(version)};\n`;

await syncPriceData({ silent: true });
await writeFile('data/version.js', versionScript, 'utf8');

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

for (const entry of entries) {
  await cp(entry, `${outputDir}/${entry}`, { recursive: true });
}
