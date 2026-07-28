import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_PRICE_SOURCE = 'pricing/approved/prices.json';
const VALID_PRICE_TYPES = new Set(['fixed', 'range', 'inquiry']);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DATA_VERSION_PATTERN = /^\d{4}-\d{2}-\d{2}\.\d+$/;

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function requireUniqueId(value, seen, path, errors) {
  if (!isNonEmptyString(value)) {
    errors.push(`${path}.id 必須是非空白字串`);
    return;
  }

  if (seen.has(value)) {
    errors.push(`${path}.id 重複：${value}`);
    return;
  }

  seen.add(value);
}

function validateAliases(aliases, path, errors) {
  if (aliases === undefined) {
    return;
  }

  if (!Array.isArray(aliases) || aliases.some((alias) => !isNonEmptyString(alias))) {
    errors.push(`${path}.aliases 必須是非空白字串陣列`);
  }
}

function validatePrice(price, path, errors) {
  if (!isObject(price)) {
    errors.push(`${path}.price 必須是物件`);
    return;
  }

  if (!VALID_PRICE_TYPES.has(price.type)) {
    errors.push(`${path}.price.type 不支援：${String(price.type)}`);
    return;
  }

  if (price.type === 'fixed' && (!Number.isFinite(price.amount) || price.amount < 0)) {
    errors.push(`${path}.price.amount 必須是大於或等於 0 的數字`);
  }

  if (price.type === 'range') {
    const minimum = price.minAmount ?? price.minimum;
    const maximum = price.maxAmount ?? price.maximum;
    if (!Number.isFinite(minimum) || !Number.isFinite(maximum) || minimum < 0 || maximum < minimum) {
      errors.push(`${path}.price 的區間金額格式錯誤`);
    }
  }

  if (price.type === 'inquiry' && price.label !== undefined && !isNonEmptyString(price.label)) {
    errors.push(`${path}.price.label 若有設定，必須是非空白字串`);
  }
}

export function validatePriceData(data, { sourcePath = DEFAULT_PRICE_SOURCE } = {}) {
  const errors = [];
  const warnings = [];
  const stats = {
    brands: 0,
    models: 0,
    repairs: 0,
  };

  if (!isObject(data)) {
    throw new Error(`${sourcePath} 的最上層必須是 JSON 物件`);
  }

  if (!isObject(data.metadata)) {
    errors.push('metadata 必須是物件');
  } else {
    if (!isNonEmptyString(data.metadata.studioName)) {
      errors.push('metadata.studioName 必須是非空白字串');
    }
    if (!DATE_PATTERN.test(String(data.metadata.updatedAt || ''))) {
      errors.push('metadata.updatedAt 必須使用 YYYY-MM-DD 格式');
    }
    if (!DATA_VERSION_PATTERN.test(String(data.metadata.priceDataVersion || ''))) {
      errors.push('metadata.priceDataVersion 必須使用 YYYY-MM-DD.序號格式，例如 2026-07-28.1');
    }
    if (!isNonEmptyString(data.metadata.currency)) {
      errors.push('metadata.currency 必須是非空白字串');
    }
  }

  if (!Array.isArray(data.repairCategories) || data.repairCategories.length === 0) {
    errors.push('repairCategories 必須是非空陣列');
  }

  const categoryIds = new Set();
  for (const [categoryIndex, category] of (data.repairCategories || []).entries()) {
    const path = `repairCategories[${categoryIndex}]`;
    if (!isObject(category)) {
      errors.push(`${path} 必須是物件`);
      continue;
    }
    requireUniqueId(category.id, categoryIds, path, errors);
    if (!isNonEmptyString(category.name)) {
      errors.push(`${path}.name 必須是非空白字串`);
    }
  }

  if (!Array.isArray(data.brands) || data.brands.length === 0) {
    errors.push('brands 必須是非空陣列');
  }

  const brandIds = new Set();
  for (const [brandIndex, brand] of (data.brands || []).entries()) {
    const brandPath = `brands[${brandIndex}]`;
    if (!isObject(brand)) {
      errors.push(`${brandPath} 必須是物件`);
      continue;
    }

    stats.brands += 1;
    requireUniqueId(brand.id, brandIds, brandPath, errors);
    if (!isNonEmptyString(brand.name)) {
      errors.push(`${brandPath}.name 必須是非空白字串`);
    }
    validateAliases(brand.aliases, brandPath, errors);

    if (!Array.isArray(brand.models)) {
      errors.push(`${brandPath}.models 必須是陣列`);
      continue;
    }

    const modelIds = new Set();
    for (const [modelIndex, model] of brand.models.entries()) {
      const modelPath = `${brandPath}.models[${modelIndex}]`;
      if (!isObject(model)) {
        errors.push(`${modelPath} 必須是物件`);
        continue;
      }

      stats.models += 1;
      requireUniqueId(model.id, modelIds, modelPath, errors);
      if (!isNonEmptyString(model.name)) {
        errors.push(`${modelPath}.name 必須是非空白字串`);
      }
      validateAliases(model.aliases, modelPath, errors);

      if (!Array.isArray(model.repairs)) {
        errors.push(`${modelPath}.repairs 必須是陣列`);
        continue;
      }

      const repairIds = new Set();
      for (const [repairIndex, repair] of model.repairs.entries()) {
        const repairPath = `${modelPath}.repairs[${repairIndex}]`;
        if (!isObject(repair)) {
          errors.push(`${repairPath} 必須是物件`);
          continue;
        }

        stats.repairs += 1;
        requireUniqueId(repair.id, repairIds, repairPath, errors);
        if (!isNonEmptyString(repair.item)) {
          errors.push(`${repairPath}.item 必須是非空白字串`);
        }
        if (!categoryIds.has(repair.categoryId)) {
          errors.push(`${repairPath}.categoryId 找不到對應分類：${String(repair.categoryId)}`);
        }
        validatePrice(repair.price, repairPath, errors);

        if (
          repair.warrantyDays !== undefined
          && (!Number.isInteger(repair.warrantyDays) || repair.warrantyDays < 0)
        ) {
          errors.push(`${repairPath}.warrantyDays 必須是大於或等於 0 的整數`);
        }
      }
    }
  }

  if (stats.repairs === 0) {
    errors.push('報價資料沒有任何維修項目');
  } else if (stats.repairs < 1000) {
    warnings.push(`目前只有 ${stats.repairs} 筆維修項目，請確認是否誤刪大量資料`);
  }

  if (errors.length > 0) {
    throw new Error([
      `${sourcePath} 驗證失敗，共 ${errors.length} 項：`,
      ...errors.map((error) => `- ${error}`),
    ].join('\n'));
  }

  const canonicalJson = `${JSON.stringify(data, null, 2)}\n`;
  const sha256 = createHash('sha256').update(canonicalJson).digest('hex');

  return {
    sourcePath,
    dataVersion: data.metadata.priceDataVersion,
    updatedAt: data.metadata.updatedAt,
    stats,
    sha256,
    warnings,
    canonicalJson,
  };
}

export async function readAndValidatePriceData(sourcePath = DEFAULT_PRICE_SOURCE) {
  const raw = await readFile(sourcePath, 'utf8');
  let data;

  try {
    data = JSON.parse(raw);
  } catch (error) {
    throw new Error(`${sourcePath} 不是有效 JSON：${error.message}`);
  }

  return {
    data,
    result: validatePriceData(data, { sourcePath }),
  };
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  const sourcePath = process.argv[2] || DEFAULT_PRICE_SOURCE;
  const { result } = await readAndValidatePriceData(sourcePath);
  const { stats } = result;

  console.log(`報價資料驗證通過：${result.dataVersion}`);
  console.log(`品牌 ${stats.brands}、型號 ${stats.models}、維修項目 ${stats.repairs}`);
  console.log(`SHA-256 ${result.sha256}`);
  for (const warning of result.warnings) {
    console.warn(`警告：${warning}`);
  }
}
