import { readFile, writeFile } from 'node:fs/promises';

const snapshotPath = 'imports/cerphone-latest.json';
const snapshot = JSON.parse(await readFile(snapshotPath, 'utf8'));

if (!Array.isArray(snapshot.records)) {
  throw new Error(`${snapshotPath} 缺少 records 陣列`);
}

const standardIPadPattern = /^ipad(?:\s+(?:初代|第一代|[1-9]|10|11))?$/i;
const screenMainFieldPattern = /^螢幕(?:破裂|更換|維修)?$/;
const androidScreenBrands = new Set([
  'huawei',
  'nokia',
  'sugar',
  'vivo',
  'realme',
  'motorola',
]);

function isStandardIPad(model) {
  return standardIPadPattern.test(String(model || '').trim());
}

function shouldExclude(record) {
  const brand = String(record.brand || '').trim().toLowerCase();
  const model = String(record.model || '').trim();
  const item = String(record.repairItem || '').trim();
  const sourceUrl = String(record.sourceUrl || '').trim();

  if (brand === 'dyson' && sourceUrl.includes('quotation_dyson')) {
    return true;
  }

  if (brand === 'htc') {
    return true;
  }

  if (brand !== 'apple') {
    return false;
  }

  if (/watch|airpods/i.test(model)) {
    return true;
  }

  if (item === 'APPLE / 原廠螢幕' || item === 'APPLE / 原廠電池' || item === 'APPLE / 原廠鏡頭') {
    return true;
  }

  return item === '玻璃破裂' && !isStandardIPad(model);
}

function translateRecord(record) {
  const translated = { ...record };
  const brand = String(translated.brand || '').trim().toLowerCase();
  const model = String(translated.model || '').trim();
  const item = String(translated.repairItem || '').trim();

  if (brand === 'apple' && item === '螢幕破裂' && !isStandardIPad(model)) {
    translated.repairItem = '螢幕維修';
  } else if ((brand === 'sony' || brand === 'asus') && item === '螢幕破裂') {
    translated.repairItem = '螢幕維修';
  } else if (androidScreenBrands.has(brand) && screenMainFieldPattern.test(item)) {
    translated.repairItem = '螢幕維修';
  }

  return translated;
}

const beforeCount = snapshot.records.length;
snapshot.records = snapshot.records.filter((record) => !shouldExclude(record)).map(translateRecord);

await writeFile(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

console.log(`Cerphone snapshot normalized: ${beforeCount} -> ${snapshot.records.length} records`);
