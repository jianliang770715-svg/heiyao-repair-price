(function (root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.REPAIR_SITE_UTILS = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function boundedEditDistance(leftValue, rightValue, maxDistance) {
    const left = String(leftValue || '');
    const right = String(rightValue || '');

    if (Math.abs(left.length - right.length) > maxDistance) {
      return maxDistance + 1;
    }

    const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

    for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
      const current = [leftIndex];
      let rowMinimum = current[0];

      for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
        const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
        const distance = Math.min(
          previous[rightIndex] + 1,
          current[rightIndex - 1] + 1,
          previous[rightIndex - 1] + substitutionCost,
        );
        current[rightIndex] = distance;
        rowMinimum = Math.min(rowMinimum, distance);
      }

      if (rowMinimum > maxDistance) {
        return maxDistance + 1;
      }

      previous.splice(0, previous.length, ...current);
    }

    return previous[right.length];
  }

  function isTypoEligibleToken(tokenValue) {
    const token = String(tokenValue || '');
    return token.length >= 5 && /[a-z]/i.test(token) && /\d/.test(token);
  }

  function findUniqueModelCorrection(tokenValue, candidateValues) {
    const token = String(tokenValue || '');
    if (!isTypoEligibleToken(token)) {
      return '';
    }

    const matches = new Set((candidateValues || []).filter((candidateValue) => {
      const candidate = String(candidateValue || '');
      if (!candidate || candidate === token || !hasSameDigitSequence(token, candidate)) {
        return false;
      }

      return isSingleEditAway(token, candidate);
    }));

    return matches.size === 1 ? [...matches][0] : '';
  }

  function hasSameDigitSequence(leftValue, rightValue) {
    const leftDigits = String(leftValue || '').match(/\d+/g)?.join('') || '';
    const rightDigits = String(rightValue || '').match(/\d+/g)?.join('') || '';
    return leftDigits === rightDigits;
  }

  function isSingleEditAway(leftValue, rightValue) {
    const left = String(leftValue || '');
    const right = String(rightValue || '');
    if (boundedEditDistance(left, right, 1) <= 1) {
      return true;
    }

    if (left.length !== right.length) {
      return false;
    }

    const differences = [];
    for (let index = 0; index < left.length; index += 1) {
      if (left[index] !== right[index]) {
        differences.push(index);
      }
    }

    return (
      differences.length === 2 &&
      differences[1] === differences[0] + 1 &&
      left[differences[0]] === right[differences[1]] &&
      left[differences[1]] === right[differences[0]]
    );
  }

  function parseStructuredPrice(itemValue, price) {
    if (!price || price.type !== 'inquiry') {
      return null;
    }

    const item = String(itemValue || '').trim();
    const label = String(price.label || '').trim();
    if (!item || !label) {
      return null;
    }

    if (item.includes('容量擴充')) {
      const options = parseCapacityOptions(label);
      return options ? { kind: 'capacity', label: '容量擴充參考報價', options } : null;
    }

    if (/前鏡頭\s*[／/]\s*後鏡頭/.test(item)) {
      const amounts = parsePlainAmountList(label);
      if (amounts?.length === 2) {
        return {
          kind: 'paired',
          label: '前後鏡頭參考報價',
          options: [
            { label: '前鏡頭', amount: amounts[0] },
            { label: '後鏡頭', amount: amounts[1] },
          ],
        };
      }
    }

    return null;
  }

  function parseCapacityOptions(label) {
    const normalized = label.replace(/／/g, '/').replace(/\s+/g, '');
    const segments = normalized.split('/').filter(Boolean);
    if (!segments.length) {
      return null;
    }

    const options = segments.map((segment) => {
      const match = segment.match(/^(\d{3,6})\((\d+)(gb|g|tb|t)?\)$/i);
      if (!match) {
        return null;
      }

      return {
        label: formatCapacity(match[2], match[3]),
        amount: Number(match[1]),
      };
    });

    return options.every(Boolean) ? options : null;
  }

  function parsePlainAmountList(label) {
    const segments = label.replace(/／/g, '/').split('/').map((part) => part.trim());
    if (!segments.length || segments.some((segment) => !/^\d{3,6}$/.test(segment))) {
      return null;
    }

    return segments.map(Number);
  }

  function formatCapacity(value, unitValue) {
    const unit = String(unitValue || '').toLowerCase();
    if (unit === 'tb' || unit === 't') {
      return `${value} TB`;
    }

    return `${value} GB`;
  }

  function sliceResults(items, limitValue) {
    const limit = Math.max(0, Number(limitValue) || 0);
    return (items || []).slice(0, limit);
  }

  function nextResultLimit(currentValue, totalValue, batchValue) {
    const current = Math.max(0, Number(currentValue) || 0);
    const total = Math.max(0, Number(totalValue) || 0);
    const batch = Math.max(1, Number(batchValue) || 1);
    return Math.min(total, current + batch);
  }

  return {
    boundedEditDistance,
    findUniqueModelCorrection,
    hasSameDigitSequence,
    isTypoEligibleToken,
    isSingleEditAway,
    nextResultLimit,
    parseStructuredPrice,
    sliceResults,
  };
});
