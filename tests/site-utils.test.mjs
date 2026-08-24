import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const require = createRequire(import.meta.url);
const {
  findUniqueModelCorrection,
  isSingleEditAway,
  nextResultLimit,
  parseStructuredPrice,
  sliceResults,
} = require('../assets/site-utils.js');

test('typo correction only accepts one unambiguous model term with the same digits', () => {
  assert.equal(
    findUniqueModelCorrection('iphne15', ['iphone15', 'iphone16', 'ip15']),
    'iphone15',
  );
  assert.equal(findUniqueModelCorrection('iphone18', ['iphone17', 'iphone16']), '');
  assert.equal(findUniqueModelCorrection('電持', ['電池']), '');
  assert.equal(
    findUniqueModelCorrection('iphon15', ['iphone15', 'iphons15']),
    '',
  );
});

test('typo correction recognises a single adjacent transposition', () => {
  assert.equal(isSingleEditAway('iphnoe15', 'iphone15'), true);
  assert.equal(isSingleEditAway('ipone15', 'iphone15'), true);
  assert.equal(isSingleEditAway('ipxxne15', 'iphone15'), false);
});

test('capacity and front/back camera labels become structured options', () => {
  assert.deepEqual(
    parseStructuredPrice('容量擴充', {
      type: 'inquiry',
      label: '4000(256)/5000(512)/8000(1T)',
    }),
    {
      kind: 'capacity',
      label: '容量擴充參考報價',
      options: [
        { label: '256 GB', amount: 4000 },
        { label: '512 GB', amount: 5000 },
        { label: '1 TB', amount: 8000 },
      ],
    },
  );

  assert.deepEqual(
    parseStructuredPrice('前鏡頭／後鏡頭', {
      type: 'inquiry',
      label: '3500／2500',
    })?.options,
    [
      { label: '前鏡頭', amount: 3500 },
      { label: '後鏡頭', amount: 2500 },
    ],
  );

  assert.equal(
    parseStructuredPrice('其他項目', { type: 'inquiry', label: '京東方8000/三星11000' }),
    null,
  );
});

test('result batching never renders beyond the requested or available count', () => {
  const items = Array.from({ length: 53 }, (_, index) => index + 1);
  assert.equal(sliceResults(items, 24).length, 24);
  assert.equal(nextResultLimit(24, items.length, 24), 48);
  assert.equal(nextResultLimit(48, items.length, 24), 53);
  assert.deepEqual(sliceResults(items, 53), items);
});

test('all structured prices derived from approved data preserve positive amounts', async () => {
  const data = JSON.parse(await readFile('pricing/approved/prices.json', 'utf8'));
  const structured = [];

  for (const brand of data.brands || []) {
    for (const model of brand.models || []) {
      for (const repair of model.repairs || []) {
        const parsed = parseStructuredPrice(repair.item, repair.price);
        if (parsed) {
          structured.push(parsed);
        }
      }
    }
  }

  assert.ok(structured.length >= 50);
  assert.ok(
    structured.every((entry) =>
      entry.options.every((option) => option.label && Number.isFinite(option.amount) && option.amount > 0),
    ),
  );
});
