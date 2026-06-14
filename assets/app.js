(function () {
  const state = {
    data: null,
    quotes: [],
    query: '',
    brandId: 'all',
    modelKey: 'all',
    categoryId: 'all',
    quoteFocusMode: false,
    quoteFocusScrollTimer: null,
    mobileFiltersCompact: false,
    lastScrollY: window.scrollY,
    downwardScrollDistance: 0,
    mobileScrollGestureStartY: window.scrollY,
    mobileScrollGestureTimer: null,
    mobileLargeUpGestureCount: 0,
    mobileTouchStartY: null,
    ignoreMobileScrollGestureUntil: 0,
    ignoreMobileDownScrollUntil: 0,
    ignoreMobileUpScrollUntil: 0,
    loading: true,
    error: '',
  };

  const chipPhrases = [
    'm1 pro',
    'm1 max',
    'm2 pro',
    'm2 max',
    'm3 pro',
    'm3 max',
    'm4 pro',
    'm4 max',
    'm5 pro',
    'm5 max',
  ];

  const searchSynonymGroups = [
    ['battery', 'batt', '電池'],
    ['screen', 'lcd', '螢幕', '玻璃', '面板'],
    ['charging', 'charge', 'charge port', '尾插', '充電孔', '充電口', '充電模組'],
    ['camera', '鏡頭', '相機'],
    ['back glass', 'backglass', '背蓋', '後玻璃', '玻璃背板'],
    ['face id', 'faceid', '臉部辨識', '臉部識別'],
    ['board', 'mainboard', 'motherboard', '主機板', '機板'],
    ['keyboard', '鍵盤'],
    ['touch bar', 'touchbar'],
    ['cleaning', '清潔', '保養'],
    ['water damage', 'waterdamage', '泡水', '進水'],
    ['system', '重灌', '系統重灌'],
  ].map((group) => group.map(compactText));

  const root = document.getElementById('root');

  renderShell();
  syncSiteVersion();
  loadPriceData()
    .then((data) => {
      state.data = data;
      state.quotes = flattenQuotes(data);
      state.loading = false;
      renderLoadedState();
    })
    .catch((error) => {
      state.loading = false;
      state.error = error.message || '讀取報價資料時發生未知錯誤';
      renderLoadedState();
    });

  function renderShell() {
    root.innerHTML = `
      <main class="app-shell">
        <div class="intro-panel" data-role="intro-panel">
          <div class="intro-content">
            <header class="site-header">
              <div class="header-copy">
                <h1 data-role="studio-name">黑曜手機維修</h1>
                <p class="service-scope">手機・平板（iPad／Android）・Apple Mac（桌機／筆電）・Windows 系統（桌機／筆電）・Dyson・Nintendo 維修</p>
                <p data-role="notice">快速查詢手機、平板、電腦、Dyson 與 Nintendo 維修項目的參考價格。</p>
              </div>
              <div class="version-badge" data-role="site-version">ver v?</div>
              <div class="header-chip">
                <span aria-hidden="true">NT$</span>
                <span>公開透明報價</span>
              </div>
              <div class="header-chip warranty-chip">
                <span aria-hidden="true">保固</span>
                <span data-role="warranty">維修保固 90 天</span>
              </div>
              <div class="header-chip address-chip">
                <span aria-hidden="true">地址</span>
                <a
                  data-role="address-link"
                  href="https://maps.app.goo.gl/Sd1sp2foGwqFfy5x8"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span class="address-note">現場快修手機？點此導航前往！</span>
                  <span data-role="address">新北市中和區信義街41巷3號一樓</span>
                </a>
              </div>
            </header>

            <section class="contact-panel" aria-label="聯絡方式">
              <h2>聯絡方式</h2>
              <div class="contact-grid">
                <article class="contact-item">
                  <p class="contact-label">維修聯絡電話</p>
                  <a data-role="phone-primary" href="tel:0966691696">0966-691-696</a>
                </article>
                <article class="contact-item">
                  <p class="contact-label">第二聯絡電話</p>
                  <a data-role="phone-secondary" href="tel:0976900166">0976-900-166</a>
                </article>
                <article class="contact-item contact-item-wide line-contact-item">
                  <p class="contact-label">LINE 官方帳號</p>
                  <div class="line-contact-content">
                    <a
                      class="social-image-link"
                      data-role="line-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      hidden
                    >
                      <img
                        class="line-add-friend-button"
                        src="https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png"
                        alt="加入好友"
                        height="36"
                        border="0"
                      />
                    </a>
                    <a
                      class="line-poster-link"
                      data-role="line-poster-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="掃描 QR Code 或點擊加入黑曜手機維修 LINE 官方帳號"
                      hidden
                    >
                      <img
                        class="line-friends-poster"
                        src="./assets/line-friends-banner.jpg"
                        alt="LINE Official Account 好友募集中，帳號 @200ysnhq"
                      />
                    </a>
                  </div>
                  <p data-role="line-placeholder">建置中，稍後補上</p>
                </article>
                <article class="contact-item contact-item-wide">
                  <p class="contact-label">Facebook 官方帳號</p>
                  <a
                    data-role="facebook-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    hidden
                  ></a>
                  <p data-role="facebook-placeholder">建置中，稍後補上</p>
                </article>
              </div>
            </section>
          </div>
        </div>

        <section class="workspace" aria-label="報價查詢">
          <form class="search-toolbar" role="search">
            <label class="search-field">
              <span class="field-label">搜尋</span>
              <span class="input-shell">
                <span class="search-mark" aria-hidden="true">⌕</span>
                <input
                  type="search"
                  data-role="query"
                  placeholder="例如 ip11、iphone11、A1534、電池"
                  autocomplete="off"
                  disabled
                />
              </span>
            </label>

            <div class="filter-row">
              <label>
                <span class="field-label">品牌</span>
                <select data-role="brand" disabled>
                  <option value="all">全部品牌</option>
                </select>
              </label>

              <label>
                <span class="field-label">型號/設備</span>
                <select data-role="model" disabled>
                  <option value="all">全部型號/設備</option>
                </select>
              </label>

              <label>
                <span class="field-label">維修項目</span>
                <select data-role="category" disabled>
                  <option value="all">全部項目</option>
                </select>
              </label>

              <button class="reset-button" type="button" data-role="reset" disabled>
                重設
              </button>
            </div>
          </form>

          <section class="summary-bar" aria-live="polite">
            <div>
              <span class="summary-label">符合結果</span>
              <strong data-role="result-count">讀取中</strong>
            </div>
            <div>
              <span class="summary-label">幣別</span>
              <strong data-role="currency">TWD</strong>
            </div>
            <div>
              <span class="summary-label">更新日期</span>
              <strong data-role="updated-at">-</strong>
            </div>
          </section>

          <section data-role="results" class="quote-grid" aria-label="報價列表">
            ${renderSkeletons()}
          </section>
        </section>

        <button
          class="top-button"
          type="button"
          data-role="top"
          aria-label="回到頁首"
          title="回到頁首"
          hidden
        >
          <span aria-hidden="true">↑</span>
        </button>
      </main>
    `;

    getElement('query').addEventListener('input', (event) => {
      state.query = event.target.value;
      updateResults();
    });

    getElement('brand').addEventListener('change', (event) => {
      state.brandId = event.target.value;
      state.modelKey = 'all';
      populateModels();
      updateResults();
    });

    getElement('model').addEventListener('change', (event) => {
      state.modelKey = event.target.value;
      updateResults();
    });

    getElement('category').addEventListener('change', (event) => {
      state.categoryId = event.target.value;
      updateResults();
    });

    getElement('reset').addEventListener('click', resetFilters);
    getElement('top').addEventListener('click', showPageHeader);
    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    window.addEventListener('touchstart', handleMobileTouchStart, { passive: true });
    window.addEventListener('touchend', handleMobileTouchEnd, { passive: true });
    window.addEventListener('resize', syncResponsiveToolbar);
    syncTopButtonVisibility();
    syncResponsiveToolbar();
  }

  async function loadPriceData() {
    if (window.REPAIR_PRICE_DATA && window.location.protocol === 'file:') {
      return window.REPAIR_PRICE_DATA;
    }

    try {
      const response = await fetch('./data/prices.json', {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`讀取報價資料失敗 (${response.status})`);
      }

      return response.json();
    } catch (error) {
      if (window.REPAIR_PRICE_DATA) {
        return window.REPAIR_PRICE_DATA;
      }

      throw error;
    }
  }

  function renderLoadedState() {
    if (state.error) {
      disableControls(true);
      getElement('results').className = 'state-panel error-state';
      getElement('results').innerHTML = `
        <h2>無法讀取報價資料</h2>
        <p>${escapeHtml(state.error)}</p>
      `;
      return;
    }

    const metadata = state.data.metadata || {};
    document.querySelector('[data-role="studio-name"]').textContent =
      metadata.studioName || '手機維修報價查詢';
    document.querySelector('[data-role="notice"]').textContent =
      metadata.notice || '快速查詢品牌、型號與維修項目的參考價格。';
    document.querySelector('[data-role="address"]').textContent =
      metadata.address || '新北市中和區信義街41巷3號一樓';
    syncAddressMapLink(metadata);
    document.querySelector('[data-role="warranty"]').textContent =
      `維修保固 ${metadata.warrantyDays || 90} 天`;
    hydrateContactInfo(metadata);
    getElement('currency').textContent = metadata.currency || 'TWD';
    getElement('updated-at').textContent = metadata.updatedAt || '-';

    populateBrands();
    populateCategories();
    populateModels();
    disableControls(false);
    updateResults();
  }

  function hydrateContactInfo(metadata) {
    const phones = Array.isArray(metadata.contactPhones) ? metadata.contactPhones : [];
    const primary = phones[0] || '0966691696';
    const secondary = phones[1] || '0976900166';
    setPhoneLink('phone-primary', primary);
    setPhoneLink('phone-secondary', secondary);
    setSocialLink('line', metadata.lineUrl, metadata.lineContact, 'LINE 官方帳號');
    setSocialLink(
      'facebook',
      metadata.facebookUrl,
      metadata.facebookContact,
      'Facebook 官方帳號',
    );
  }

  function setPhoneLink(role, phone) {
    const target = document.querySelector(`[data-role="${role}"]`);
    if (!target) {
      return;
    }

    const digits = String(phone || '').replace(/[^\d+]/g, '');
    if (!digits) {
      return;
    }

    target.href = `tel:${digits}`;
    target.textContent = formatPhoneText(digits);
  }

  function setSocialLink(platform, url, contact, fallbackLabel) {
    const link = document.querySelector(`[data-role="${platform}-link"]`);
    const placeholder = document.querySelector(`[data-role="${platform}-placeholder"]`);
    const posterLink = document.querySelector(`[data-role="${platform}-poster-link"]`);
    if (!link || !placeholder) {
      return;
    }

    const normalizedUrl = String(url || '').trim();
    const normalizedContact = String(contact || '').trim();
    if (!normalizedUrl) {
      link.hidden = true;
      if (posterLink) {
        posterLink.hidden = true;
      }
      placeholder.hidden = false;
      placeholder.textContent = normalizedContact || '建置中，稍後補上';
      return;
    }

    link.href = normalizedUrl;
    const linkLabel = normalizedContact || fallbackLabel;
    if (link.querySelector('img')) {
      link.setAttribute('aria-label', linkLabel);
      link.title = linkLabel;
    } else {
      link.textContent = linkLabel;
    }
    if (posterLink) {
      posterLink.href = normalizedUrl;
      posterLink.hidden = false;
    }
    link.hidden = false;
    placeholder.hidden = true;
  }

  function syncAddressMapLink(metadata) {
    const link = document.querySelector('[data-role="address-link"]');
    if (!link) {
      return;
    }

    if (metadata.mapLink) {
      link.href = metadata.mapLink;
      return;
    }

    link.href = 'https://maps.app.goo.gl/Sd1sp2foGwqFfy5x8';
  }

  function formatPhoneText(phone) {
    if (/^09\d{8}$/.test(phone)) {
      return `${phone.slice(0, 4)}-${phone.slice(4, 7)}-${phone.slice(7)}`;
    }

    return phone;
  }

  function populateBrands() {
    const select = getElement('brand');
    replaceOptions(select, [
      { value: 'all', label: '全部品牌' },
      ...getBrands().map((brand) => ({
        value: brand.id,
        label: formatBrandLabel(brand.name),
      })),
    ]);
    select.value = state.brandId;
  }

  function populateCategories() {
    const select = getElement('category');
    replaceOptions(select, [
      { value: 'all', label: '全部項目' },
      ...getCategories().map((category) => ({ value: category.id, label: category.name })),
    ]);
    select.value = state.categoryId;
  }

  function populateModels() {
    const select = getElement('model');
    replaceOptions(select, [
      { value: 'all', label: '全部型號/設備' },
      ...getModels(state.brandId).map((model) => ({
        value: model.value,
        label: formatModelOption(model, state.brandId),
      })),
    ]);
    select.value = state.modelKey;
  }

  function updateResults() {
    const filteredQuotes = state.quotes.filter((quote) => matchesQuote(quote));
    const hasActiveFilters = hasActiveQuoteFilters();

    if (hasActiveFilters) {
      enterQuoteFocusMode();
    } else {
      setMobileFiltersCompact(false);
    }

    getElement('result-count').textContent = `${filteredQuotes.length} / ${state.quotes.length}`;
    getElement('reset').disabled = !hasActiveFilters;

    const results = getElement('results');
    results.className = filteredQuotes.length ? 'quote-grid' : 'state-panel';

    if (!filteredQuotes.length) {
      results.innerHTML = `
        <h2>沒有符合的報價</h2>
        <p>可以換個型號、品牌或維修項目試試。</p>
        ${hasActiveFilters ? '<button type="button" data-empty-reset>清除篩選</button>' : ''}
      `;
      const emptyReset = results.querySelector('[data-empty-reset]');
      if (emptyReset) {
        emptyReset.addEventListener('click', resetFilters);
      }
      return;
    }

    results.innerHTML = filteredQuotes.map(renderQuoteCard).join('');
  }

  function resetFilters() {
    state.query = '';
    state.brandId = 'all';
    state.modelKey = 'all';
    state.categoryId = 'all';

    getElement('query').value = '';
    getElement('brand').value = 'all';
    getElement('category').value = 'all';
    populateModels();
    updateResults();
  }

  function enterQuoteFocusMode() {
    if (state.quoteFocusMode) {
      return;
    }

    state.quoteFocusMode = true;
    state.downwardScrollDistance = 0;
    resetMobileUpGestureCount();
    const introPanel = getElement('intro-panel');
    introPanel.setAttribute('aria-hidden', 'true');
    introPanel.inert = true;
    document.querySelector('.app-shell').classList.add('is-quote-focus');
    syncTopButtonVisibility();

    const scrollDelay = preferredScrollBehavior() === 'auto' ? 0 : 430;
    state.quoteFocusScrollTimer = window.setTimeout(() => {
      state.quoteFocusScrollTimer = null;
      state.ignoreMobileDownScrollUntil = Date.now() + 800;
      document.querySelector('.workspace').scrollIntoView({
        behavior: preferredScrollBehavior(),
        block: 'start',
      });
    }, scrollDelay);
  }

  function showPageHeader() {
    if (state.quoteFocusScrollTimer) {
      window.clearTimeout(state.quoteFocusScrollTimer);
      state.quoteFocusScrollTimer = null;
    }

    resetMobileScrollGestureTracking();
    resetMobileUpGestureCount();
    setMobileFiltersCompact(false);
    state.quoteFocusMode = false;
    const introPanel = getElement('intro-panel');
    introPanel.removeAttribute('aria-hidden');
    introPanel.inert = false;
    document.querySelector('.app-shell').classList.remove('is-quote-focus');
    syncTopButtonVisibility();
    window.scrollTo({ top: 0, behavior: preferredScrollBehavior() });
  }

  function handleWindowScroll() {
    syncTopButtonVisibility();
    syncMobileToolbar();
  }

  function syncTopButtonVisibility() {
    getElement('top').hidden = !state.quoteFocusMode && window.scrollY < 240;
  }

  function syncMobileToolbar() {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - state.lastScrollY;
    state.lastScrollY = currentScrollY;

    if (!isMobileToolbarViewport() || !hasActiveQuoteFilters()) {
      state.downwardScrollDistance = 0;
      resetMobileScrollGestureTracking();
      resetMobileUpGestureCount();
      setMobileFiltersCompact(false);
      return;
    }

    trackMobileScrollGesture(currentScrollY, scrollDelta);

    if (currentScrollY < 160 && !state.mobileFiltersCompact) {
      state.downwardScrollDistance = 0;
      resetMobileUpGestureCount();
      setMobileFiltersCompact(false);
      return;
    }

    if (scrollDelta > 0) {
      if (Date.now() < state.ignoreMobileDownScrollUntil) {
        return;
      }

      state.downwardScrollDistance += scrollDelta;
      if (state.downwardScrollDistance >= 72) {
        setMobileFiltersCompact(true);
        state.downwardScrollDistance = 0;
      }
      return;
    }

    if (scrollDelta < 0) {
      if (Date.now() < state.ignoreMobileUpScrollUntil) {
        return;
      }

      state.downwardScrollDistance = 0;
    }
  }

  function trackMobileScrollGesture(currentScrollY, scrollDelta) {
    if (Date.now() < state.ignoreMobileScrollGestureUntil) {
      resetMobileScrollGestureTracking();
      return;
    }

    if (!state.mobileScrollGestureTimer) {
      state.mobileScrollGestureStartY = currentScrollY - scrollDelta;
    } else {
      window.clearTimeout(state.mobileScrollGestureTimer);
    }

    state.mobileScrollGestureTimer = window.setTimeout(() => {
      state.mobileScrollGestureTimer = null;
      finishMobileScrollGesture();
    }, 180);
  }

  function finishMobileScrollGesture() {
    if (!state.mobileFiltersCompact || !isMobileToolbarViewport()) {
      resetMobileUpGestureCount();
      return;
    }

    const gestureDistance = window.scrollY - state.mobileScrollGestureStartY;
    if (gestureDistance <= -120 && Date.now() >= state.ignoreMobileUpScrollUntil) {
      registerMobileLargeUpGesture();
      return;
    }

    if (gestureDistance >= 120 && Date.now() >= state.ignoreMobileDownScrollUntil) {
      resetMobileUpGestureCount();
    }
  }

  function handleMobileTouchStart(event) {
    if (!isMobileToolbarViewport() || !hasActiveQuoteFilters() || !event.touches.length) {
      return;
    }

    state.mobileTouchStartY = event.touches[0].clientY;
    resetMobileScrollGestureTracking();
  }

  function handleMobileTouchEnd(event) {
    if (
      !state.mobileFiltersCompact ||
      state.mobileTouchStartY === null ||
      !event.changedTouches.length
    ) {
      state.mobileTouchStartY = null;
      return;
    }

    const touchDistance = event.changedTouches[0].clientY - state.mobileTouchStartY;
    state.mobileTouchStartY = null;
    state.ignoreMobileScrollGestureUntil = Date.now() + 1600;
    resetMobileScrollGestureTracking();

    if (touchDistance >= 120) {
      registerMobileLargeUpGesture();
    } else if (touchDistance <= -120) {
      resetMobileUpGestureCount();
    }
  }

  function registerMobileLargeUpGesture() {
    state.mobileLargeUpGestureCount += 1;

    if (state.mobileLargeUpGestureCount >= 5) {
      resetMobileUpGestureCount();
      setMobileFiltersCompact(false);
    }
  }

  function resetMobileScrollGestureTracking() {
    if (state.mobileScrollGestureTimer) {
      window.clearTimeout(state.mobileScrollGestureTimer);
      state.mobileScrollGestureTimer = null;
    }
    state.mobileScrollGestureStartY = window.scrollY;
  }

  function resetMobileUpGestureCount() {
    state.mobileLargeUpGestureCount = 0;
  }

  function setMobileFiltersCompact(compact) {
    const shouldCompact = Boolean(compact) && isMobileToolbarViewport();
    if (state.mobileFiltersCompact === shouldCompact) {
      return;
    }

    if (state.mobileFiltersCompact && !shouldCompact) {
      state.ignoreMobileDownScrollUntil = Date.now() + 500;
    }

    if (!state.mobileFiltersCompact && shouldCompact) {
      state.ignoreMobileUpScrollUntil = Date.now() + 500;
      resetMobileUpGestureCount();
    }

    state.mobileFiltersCompact = shouldCompact;
    const filterRow = document.querySelector('.filter-row');
    document.querySelector('.app-shell').classList.toggle(
      'is-mobile-toolbar-compact',
      shouldCompact,
    );
    filterRow.inert = shouldCompact;

    if (shouldCompact) {
      filterRow.setAttribute('aria-hidden', 'true');
    } else {
      filterRow.removeAttribute('aria-hidden');
    }
  }

  function syncResponsiveToolbar() {
    state.lastScrollY = window.scrollY;
    state.downwardScrollDistance = 0;
    resetMobileScrollGestureTracking();
    resetMobileUpGestureCount();
    if (!isMobileToolbarViewport()) {
      setMobileFiltersCompact(false);
    }
  }

  function isMobileToolbarViewport() {
    return window.matchMedia('(max-width: 939px)').matches;
  }

  function hasActiveQuoteFilters() {
    return Boolean(
      state.query.trim() ||
        state.brandId !== 'all' ||
        state.modelKey !== 'all' ||
        state.categoryId !== 'all',
    );
  }

  function preferredScrollBehavior() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }

  function disableControls(disabled) {
    ['query', 'brand', 'model', 'category'].forEach((role) => {
      getElement(role).disabled = disabled;
    });
  }

  function syncSiteVersion() {
    const target = document.querySelector('[data-role="site-version"]');
    if (!target) {
      return;
    }

    const rawVersion = window.REPAIR_SITE_VERSION;
    const version = String(rawVersion || '').trim();
    const normalized = version ? (version.toLowerCase().startsWith('v') ? version : `v${version}`) : 'v?';
    target.textContent = `ver ${normalized}`;
  }

  function renderQuoteCard(quote) {
    return `
      <article class="quote-card">
        <div class="card-topline">
          <span>${escapeHtml(quote.brandName)}</span>
          <span class="availability availability-${escapeHtml(quote.availability)}">
            ${escapeHtml(availabilityLabel(quote.availability))}
          </span>
        </div>

        <h2>${escapeHtml(formatQuoteModelName(quote))}</h2>
        <p class="repair-item">${escapeHtml(quote.item)}</p>

        <div class="price-line">${escapeHtml(formatPrice(quote.price, quote.currency))}</div>

        <div class="detail-list" aria-label="維修細節">
          <span>${escapeHtml(quote.categoryName)}</span>
          <span>${escapeHtml(quote.duration)}</span>
          <span>${quote.warrantyDays > 0 ? `${escapeHtml(quote.warrantyDays)} 天保固` : '檢測無保固'}</span>
        </div>

        ${
          quote.note
            ? `<p class="card-note">${escapeHtml(quote.note)}</p>`
            : ''
        }
      </article>
    `;
  }

  function renderSkeletons() {
    return Array.from({ length: 4 }, () => `
      <article class="quote-card skeleton">
        <div></div>
        <div></div>
        <div></div>
      </article>
    `).join('');
  }

  function flattenQuotes(data) {
    if (!data || !Array.isArray(data.brands)) {
      return [];
    }

    const categoryMap = new Map(
      (data.repairCategories || []).map((category) => [category.id, category.name]),
    );

    return data.brands.flatMap((brand) =>
      (brand.models || []).flatMap((model) =>
        (model.repairs || []).map((repair) => ({
          ...repair,
          quoteId: `${brand.id}:${model.id}:${repair.id}`,
          brandId: brand.id,
          brandName: brand.name,
          modelId: model.id,
          modelKey: `${brand.id}:${model.id}`,
          modelName: model.name,
          modelGroup: model.modelGroup,
          deviceType: model.deviceType,
          aliases: model.aliases || [],
          categoryName: categoryMap.get(repair.categoryId) || '其他維修',
          currency: data.metadata?.currency || 'TWD',
        })),
      ),
    );
  }

  function getBrands() {
    return [...(state.data.brands || [])].sort(compareByName);
  }

  function getCategories() {
    return [...(state.data.repairCategories || [])].sort(compareByName);
  }

  function getModels(brandId) {
    const brands =
      brandId === 'all'
        ? state.data.brands || []
        : (state.data.brands || []).filter((brand) => brand.id === brandId);

    return brands
      .flatMap((brand) =>
        (brand.models || []).map((model) => ({
          id: model.id,
          value: `${brand.id}:${model.id}`,
          name: model.name,
          modelGroup: model.modelGroup,
          brandId: brand.id,
          brandName: brand.name,
        })),
      )
      .sort(compareByName);
  }

  function matchesQuote(quote) {
    const brandMatches = state.brandId === 'all' || quote.brandId === state.brandId;
    const modelMatches = state.modelKey === 'all' || quote.modelKey === state.modelKey;
    const categoryMatches =
      state.categoryId === 'all' || quote.categoryId === state.categoryId;

    if (!brandMatches || !modelMatches || !categoryMatches) {
      return false;
    }

    const tokens = normalize(state.query).split(/\s+/).filter(Boolean);

    if (!tokens.length) {
      return true;
    }

    const searchIndex = getQuoteSearchIndex(quote);
    const requiredPhrases = getRequiredPhrases(tokens);

    return (
      requiredPhrases.every((phrase) => phraseMatches(phrase, searchIndex)) &&
      tokens.every((token) => tokenMatches(token, searchIndex))
    );
  }

  function getQuoteSearchIndex(quote) {
    if (quote.searchIndex) {
      return quote.searchIndex;
    }

    const text = normalize(
      [
        quote.brandName,
        quote.modelName,
        quote.modelGroup,
        quote.deviceType,
        quote.item,
        quote.categoryId,
        quote.categoryName,
        quote.note,
        ...(quote.aliases || []),
        ...createDerivedAliases(quote),
      ].join(' '),
    );

    quote.searchIndex = {
      text,
      compact: compactText(text),
    };

    return quote.searchIndex;
  }

  function phraseMatches(phrase, searchIndex) {
    return (
      searchIndex.text.includes(phrase) ||
      searchIndex.compact.includes(compactText(phrase))
    );
  }

  function tokenMatches(token, searchIndex) {
    const compactToken = compactText(token);

    if (!compactToken) {
      return true;
    }

    if (searchIndex.text.includes(token) || searchIndex.compact.includes(compactToken)) {
      return true;
    }

    return getSynonymMatches(compactToken).some((synonym) =>
      searchIndex.compact.includes(synonym),
    );
  }

  function getSynonymMatches(compactToken) {
    const group = searchSynonymGroups.find((items) => items.includes(compactToken));
    return group || [];
  }

  function createDerivedAliases(quote) {
    return [
      ...createIphoneAliases(quote.modelName),
    ];
  }

  function createIphoneAliases(modelName) {
    const compactName = compactText(modelName);

    if (!compactName.startsWith('iphone')) {
      return [];
    }

    const rest = compactName.replace(/^iphone/, '');
    const aliases = new Set([compactName, `ip${rest}`]);

    if (rest.endsWith('promax')) {
      aliases.add(`ip${rest.replace(/promax$/, 'pm')}`);
    }

    if (rest.endsWith('plus')) {
      aliases.add(`ip${rest.replace(/plus$/, 'p')}`);
    }

    if (/^\d+sp$/.test(rest)) {
      aliases.add(`ip${rest.replace(/sp$/, 'splus')}`);
    }

    if (/^\d+p$/.test(rest)) {
      aliases.add(`ip${rest.replace(/p$/, 'plus')}`);
    }

    if (rest === 'se2se3') {
      aliases.add('ipse2');
      aliases.add('ipse3');
      aliases.add('iphonese2');
      aliases.add('iphonese3');
    }

    return [...aliases];
  }

  function getRequiredPhrases(tokens) {
    const queryText = tokens.join(' ');
    return chipPhrases.filter((phrase) => queryText.includes(phrase));
  }

  function formatPrice(price, currency = 'TWD') {
    if (!price || price.type === 'inquiry') {
      return price?.label || '請洽詢';
    }

    const formatter = createPriceFormatter(currency);

    if (price.type === 'range') {
      return `${formatter.format(price.min)} - ${formatter.format(price.max)}`;
    }

    return formatter.format(price.amount);
  }

  function createPriceFormatter(currency) {
    const numberFormatter = new Intl.NumberFormat('zh-TW', {
      maximumFractionDigits: 0,
    });

    if (currency === 'TWD') {
      return {
        format(value) {
          return `NT$${numberFormatter.format(value)}`;
        },
      };
    }

    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    });
  }

  function availabilityLabel(availability) {
    const labels = {
      in_stock: '有現貨',
      preorder: '需預約',
      inquiry: '先詢問',
    };

    return labels[availability] || '請確認';
  }

  function replaceOptions(select, options) {
    select.replaceChildren(
      ...options.map((option) => {
        const element = document.createElement('option');
        element.value = option.value;
        element.textContent = option.label;
        return element;
      }),
    );
  }

  function getElement(role) {
    return document.querySelector(`[data-role="${role}"]`);
  }

  function normalize(value) {
    return String(value || '')
      .normalize('NFKC')
      .trim()
      .toLocaleLowerCase('zh-Hant');
  }

  function compactText(value) {
    return normalize(value).replace(/[\s\-_/／・.．,，:：;；'’"“”()[\]{}（）【】]+/g, '');
  }

  function compareByName(left, right) {
    return new Intl.Collator('zh-Hant', {
      numeric: true,
      sensitivity: 'base',
    }).compare(left.name, right.name);
  }

  function formatModelOption(model, selectedBrandId) {
    const groupText =
      shouldDisplayModelGroup(model.modelGroup, model.name)
        ? ` (${model.modelGroup})`
        : '';
    const modelText = `${model.name}${groupText}`;
    return selectedBrandId === 'all'
      ? `${formatBrandLabel(model.brandName)} ${modelText}`
      : modelText;
  }

  function formatBrandLabel(name) {
    if (name === 'Desktop & Laptop') {
      return 'Windows 系統（桌機／筆電）';
    }

    if (name === 'Apple') {
      return 'Apple Mac（桌機／筆電）';
    }

    return name;
  }

  function formatQuoteModelName(quote) {
    if (!shouldDisplayModelGroup(quote.modelGroup, quote.modelName)) {
      return quote.modelName;
    }

    return `${quote.modelName} (${quote.modelGroup})`;
  }

  function shouldDisplayModelGroup(modelGroup, modelName) {
    if (!modelGroup || modelName.includes(modelGroup)) {
      return false;
    }

    return !['iPhone Face ID', 'iPhone Touch ID'].includes(modelGroup);
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
})();
