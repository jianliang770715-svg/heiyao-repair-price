import { appendFile, readFile, access } from 'node:fs/promises';

import { readAndValidatePriceData } from './validate-price-data.mjs';

const MANIFEST_PATH = 'pricing/release-manifest.json';
const DEPLOYABLE_STATUS = 'approved';
const VALID_STATUSES = new Set([
  'draft',
  'review_required',
  'structure_review_required',
  'approved',
  'published',
  'rejected',
]);
const VALID_STRUCTURE_IMPACTS = new Set([
  'none',
  'data-only',
  'policy-review-required',
  'site-change-required',
]);
const RESOLVED_PROPOSAL_STATUSES = new Set([
  'applied',
  'rejected',
  'not-required',
]);
const STATUS_LABELS = {
  draft: '草稿',
  review_required: '待發布審核',
  structure_review_required: '待網站／政策異動',
  approved: '已可提交 GitHub，但尚未上傳及發布',
  published: '已發布',
  rejected: '退回修正',
};

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function requireString(value, path, errors) {
  if (typeof value !== 'string' || value.trim() === '') {
    errors.push(`${path} 必須是非空白字串`);
  }
}

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function writeGitHubOutputs(result) {
  if (!process.argv.includes('--github-output') || !process.env.GITHUB_OUTPUT) {
    return;
  }

  await appendFile(
    process.env.GITHUB_OUTPUT,
    [
      `deploy_allowed=${result.deployAllowed ? 'true' : 'false'}`,
      `release_status=${result.status}`,
      `release_status_label=${result.statusLabel}`,
      `price_data_version=${result.priceDataVersion}`,
      '',
    ].join('\n'),
    'utf8',
  );
}

export async function validatePriceRelease() {
  const errors = [];
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
  const { result: priceResult } = await readAndValidatePriceData();

  if (!isObject(manifest)) {
    throw new Error(`${MANIFEST_PATH} 必須是 JSON 物件`);
  }

  if (manifest.schemaVersion !== 1) {
    errors.push('schemaVersion 目前只支援 1');
  }

  requireString(manifest.batchId, 'batchId', errors);
  if (!VALID_STATUSES.has(manifest.status)) {
    errors.push(`status 不支援：${String(manifest.status)}`);
  }
  requireString(manifest.targetPriceDataVersion, 'targetPriceDataVersion', errors);
  requireString(manifest.priceSha256, 'priceSha256', errors);

  if (!VALID_STRUCTURE_IMPACTS.has(manifest.structureImpact)) {
    errors.push(`structureImpact 不支援：${String(manifest.structureImpact)}`);
  }

  if (!Array.isArray(manifest.structureProposals)) {
    errors.push('structureProposals 必須是陣列');
  }
  if (!Array.isArray(manifest.unresolvedItems)) {
    errors.push('unresolvedItems 必須是陣列');
  }

  if (manifest.targetPriceDataVersion !== priceResult.dataVersion) {
    errors.push(
      `許可檔版本 ${manifest.targetPriceDataVersion} 與報價版本 ${priceResult.dataVersion} 不一致`,
    );
  }
  if (manifest.priceSha256 !== priceResult.sha256) {
    errors.push('許可檔雜湊與目前正式報價不一致，代表候選資料尚未登記或內容已被更動');
  }

  const deployAllowed = manifest.status === DEPLOYABLE_STATUS;
  if (deployAllowed) {
    if (!['none', 'data-only'].includes(manifest.structureImpact)) {
      errors.push(`結構影響為 ${manifest.structureImpact}，必須先完成網站或政策審核`);
    }

    if (manifest.unresolvedItems.length > 0) {
      errors.push(`仍有 ${manifest.unresolvedItems.length} 筆未決項目，不得發布`);
    }

    const pendingProposals = manifest.structureProposals.filter(
      (proposal) => !RESOLVED_PROPOSAL_STATUSES.has(proposal?.status),
    );
    if (pendingProposals.length > 0) {
      errors.push(`仍有 ${pendingProposals.length} 筆結構異動建議未完成`);
    }

    if (manifest.userApproval?.approved !== true) {
      errors.push('尚未記錄使用者核准');
    }
    requireString(manifest.userApproval?.approvedAt, 'userApproval.approvedAt', errors);
    requireString(manifest.userApproval?.note, 'userApproval.note', errors);

    for (const [label, path] of [
      ['evidence.sourceSnapshot', manifest.evidence?.sourceSnapshot],
      ['evidence.diffReport', manifest.evidence?.diffReport],
      ['evidence.worklog', manifest.evidence?.worklog],
    ]) {
      requireString(path, label, errors);
      if (typeof path === 'string' && !(await pathExists(path))) {
        errors.push(`${label} 找不到檔案：${path}`);
      }
    }
  }

  if (manifest.status === 'published') {
    requireString(manifest.published?.commit, 'published.commit', errors);
    requireString(manifest.published?.url, 'published.url', errors);
  }

  if (errors.length > 0) {
    throw new Error([
      `報價發布許可驗證失敗，共 ${errors.length} 項：`,
      ...errors.map((error) => `- ${error}`),
    ].join('\n'));
  }

  const result = {
    batchId: manifest.batchId,
    status: manifest.status,
    statusLabel: STATUS_LABELS[manifest.status],
    deployAllowed,
    priceDataVersion: priceResult.dataVersion,
    structureImpact: manifest.structureImpact,
  };

  await writeGitHubOutputs(result);

  console.log(`報價批次：${result.batchId}`);
  console.log(`發布狀態：${result.status}（${result.statusLabel}）`);
  console.log(`結構影響：${result.structureImpact}`);
  console.log(`允許發布：${result.deployAllowed ? '是' : '否'}`);

  return result;
}

await validatePriceRelease();
