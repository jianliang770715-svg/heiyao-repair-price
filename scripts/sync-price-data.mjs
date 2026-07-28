import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readAndValidatePriceData } from './validate-price-data.mjs';

const PRICE_SOURCE = 'pricing/approved/prices.json';
const JSON_OUTPUT = 'data/prices.json';
const JS_OUTPUT = 'data/prices.js';

async function readExisting(path) {
  try {
    return await readFile(path, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

export async function syncPriceData({ check = false, silent = false } = {}) {
  const { data, result } = await readAndValidatePriceData(PRICE_SOURCE);
  const jsonOutput = result.canonicalJson;
  const jsOutput = `window.REPAIR_PRICE_DATA = ${JSON.stringify(data, null, 2)};\n`;

  if (check) {
    const [existingJson, existingJs] = await Promise.all([
      readExisting(JSON_OUTPUT),
      readExisting(JS_OUTPUT),
    ]);
    const mismatches = [];

    if (existingJson !== jsonOutput) {
      mismatches.push(JSON_OUTPUT);
    }
    if (existingJs !== jsOutput) {
      mismatches.push(JS_OUTPUT);
    }

    if (mismatches.length > 0) {
      throw new Error(`報價輸出尚未同步：${mismatches.join('、')}。請執行 npm run prices:sync`);
    }
  } else {
    await mkdir('data', { recursive: true });
    await Promise.all([
      writeFile(JSON_OUTPUT, jsonOutput, 'utf8'),
      writeFile(JS_OUTPUT, jsOutput, 'utf8'),
    ]);
  }

  if (!silent) {
    const action = check ? '同步檢查通過' : '已同步到網站';
    console.log(`報價資料 ${result.dataVersion} ${action}`);
    console.log(`品牌 ${result.stats.brands}、型號 ${result.stats.models}、維修項目 ${result.stats.repairs}`);
  }

  return result;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  await syncPriceData({
    check: process.argv.includes('--check'),
  });
}
