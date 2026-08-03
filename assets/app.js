(function () {
  const state = {
    data: null,
    quotes: [],
    query: '',
    brandId: 'all',
    modelKey: 'all',
    categoryId: 'all',
    sortMode: 'relevance',
    quoteFocusMode: false,
    quoteFocusScrollTimer: null,
    mobileFiltersCompact: false,
    mobileProgrammaticScrollTimer: null,
    searchUpdateTimer: null,
    loading: true,
    error: '',
  };

  const searchUpdateDelay = 180;
  const conversationalStopPhrases = [
    '維修價格',
    '維修報價',
    '多少錢',
    '請問一下',
    '請問',
    '幫我查',
    '幫我',
    '維修',
    '報價',
    '價格',
    '多少',
    '更換',
    '換',
    '修',
  ]
    .map(compactText)
    .sort((left, right) => right.length - left.length);

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
    ['battery', 'batt', '電池', '电池'],
    ['screen', 'lcd', '螢幕', '屏幕', '玻璃', '面板'],
    ['charging', 'charge', 'charge port', '尾插', '充電孔', '充電口', '充電模組', '充电孔', '充电口', '充电模组'],
    ['camera', '鏡頭', '相機', '镜头', '相机'],
    ['back glass', 'backglass', '背蓋', '後玻璃', '玻璃背板', '背盖', '后玻璃'],
    ['face id', 'faceid', '臉部辨識', '臉部識別'],
    ['board', 'mainboard', 'motherboard', '主機板', '機板', '主板'],
    ['keyboard', '鍵盤', '键盘'],
    ['touch bar', 'touchbar'],
    ['cleaning', '清潔', '保養', '清洁', '保养'],
    ['water damage', 'waterdamage', '泡水', '進水', '进水'],
    ['system', '重灌', '系統重灌', '重装', '系统重装'],
  ].map((group) => group.map(compactText));

  const brandAliasEntries = [
    {
      keys: ['apple'],
      aliases: ['蘋果', '苹果'],
    },
    {
      keys: ['asus'],
      aliases: ['華碩', '华硕'],
    },
    {
      keys: ['desktop-laptop', 'Desktop & Laptop'],
      aliases: ['Windows', 'Win', '桌機', '桌上型電腦', '筆電', '筆記型電腦', '電腦', 'PC'],
    },
    {
      keys: ['dyson'],
      aliases: ['戴森'],
    },
    {
      keys: ['google'],
      aliases: ['谷歌', 'Pixel'],
    },
    {
      keys: ['nintendo'],
      aliases: ['任天堂', 'Switch'],
    },
    {
      keys: ['oppo'],
      aliases: ['歐珀', '欧珀'],
    },
    {
      keys: ['samsung'],
      aliases: ['三星'],
    },
    {
      keys: ['sony'],
      aliases: ['索尼'],
    },
    {
      keys: ['小米', 'xiaomi'],
      aliases: ['小米', '紅米', '红米', 'Redmi'],
    },
    {
      keys: ['華為 HUAWEI', 'huawei'],
      aliases: ['華為', '华为'],
    },
    {
      keys: ['NOKIA'],
      aliases: ['諾基亞', '诺基亚'],
    },
    {
      keys: ['MOTOROLA'],
      aliases: ['摩托羅拉', '摩托罗拉', 'Moto'],
    },
    {
      keys: ['realme'],
      aliases: ['真我'],
    },
    {
      keys: ['SUGAR'],
      aliases: ['糖果手機', '糖果手机'],
    },
    {
      keys: ['VIVO'],
      aliases: ['vivo'],
    },
  ];
  let fallbackPriceDataPromise = null;

  const root = document.getElementById('root');

  renderShell();
  syncSiteVersion();
  loadPriceData()
    .then((data) => {
      state.data = normalizePriceData(data);
      state.quotes = flattenQuotes(state.data).map((quote, sourceIndex) => ({
        ...quote,
        sourceIndex,
      }));
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
                <div class="brand-title-row">
                  <img
                    class="studio-round-logo"
                    src="./assets/studio-round-logo.webp"
                    alt=""
                    aria-hidden="true"
                    width="192"
                    height="192"
                    decoding="async"
                  />
                  <div class="brand-title-copy">
                    <h1 data-role="studio-name">黑曜手機維修</h1>
                    <p class="service-scope">手機・平板（iPad／Android）・Apple Mac（桌機／筆電）・Windows 系統（桌機／筆電）・Dyson・Nintendo 維修</p>
                  </div>
                </div>
                <p data-role="notice">
                  <span data-role="notice-main">選擇品牌、型號與維修項目，快速查詢參考報價。</span>
                  <span class="notice-desktop-break" aria-hidden="true"></span>
                  <span class="notice-warning">⚠️本網頁報價為參考，實際價格均以現場報價為主⚠️</span>
                </p>
              </div>
              <div class="brand-meta">
                <img
                  class="obsidian-mark"
                  src="./assets/obsidian-mark.webp"
                  alt="黑曜專屬圖案"
                  width="96"
                  height="96"
                  decoding="async"
                />
              </div>
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

          </div>
        </div>

        <section class="workspace" aria-label="報價查詢">
          <div class="sticky-search-panel">
            <form class="search-toolbar" role="search" data-role="search-form">
              <label class="search-field">
                <span class="field-label">搜尋</span>
                <span class="input-shell">
                  <span class="search-mark" aria-hidden="true">⌕</span>
                  <input
                    type="search"
                    data-role="query"
                    placeholder="例如 蘋果11電池、s23 ultra 螢幕、ip11"
                    autocomplete="off"
                    disabled
                  />
                  <button
                    class="query-clear-button"
                    type="button"
                    data-role="query-clear"
                    aria-label="清除搜尋並展開篩選選單"
                    title="清除搜尋並展開篩選選單"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                  <button
                    class="mobile-reset-button"
                    type="button"
                    data-role="mobile-reset"
                    aria-label="重設搜尋條件"
                    title="重設搜尋條件"
                    disabled
                  >
                    重設
                  </button>
                  <button
                    class="filter-expand-button"
                    type="button"
                    data-role="filter-expand"
                    aria-controls="filter-row"
                    aria-expanded="true"
                    aria-label="展開篩選選單"
                    title="展開篩選選單"
                    hidden
                  >
                    篩選
                  </button>
                </span>
              </label>

              <div class="filter-row" id="filter-row">
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

            <aside class="repair-notice" aria-label="送修前資料備份提醒">
              <strong>送修前請先備份重要資料</strong>
              <p>一般維修不會主動清除資料，但部分故障、系統重置或維修過程仍可能造成資料遺失。</p>
            </aside>
          </div>

          <div class="contact-collapse" data-role="contact-collapse">
            <div class="contact-collapse-content">
              <section class="contact-panel" aria-label="聯絡方式">
                <h2>聯絡方式</h2>
                <nav class="mobile-contact-actions" aria-label="手機版快速聯絡">
                  <a
                    class="mobile-contact-action"
                    data-role="line-direct-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    hidden
                  >
                    LINE 詢問
                  </a>
                  <a
                    class="mobile-contact-action"
                    data-role="phone-direct-link"
                    href="tel:0966691696"
                  >
                    電話聯絡
                  </a>
                  <a
                    class="mobile-contact-action"
                    data-role="map-direct-link"
                    href="https://maps.app.goo.gl/Sd1sp2foGwqFfy5x8"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    導航前往
                  </a>
                </nav>
                <div class="contact-grid">
                  <article class="contact-item">
                    <p class="contact-label">主要聯絡電話</p>
                    <a data-role="phone-primary" href="tel:0966691696">0966-691-696</a>
                  </article>
                  <article class="contact-item">
                    <p class="contact-label">備用聯絡電話</p>
                    <a data-role="phone-secondary" href="tel:0976900166">0976-900-166</a>
                  </article>
                  <article class="contact-item contact-item-wide vcard-contact-item">
                    <div class="vcard-contact-copy">
                      <p class="contact-label">手機通訊錄</p>
                      <h3>儲存黑曜手機維修聯絡人</h3>
                      <p>一次加入主要／備用電話、地址、LINE、Email 與官方網站。</p>
                      <a
                        class="vcard-save-button"
                        href="./obsidian-phone-repair.vcf"
                        aria-label="開啟並儲存黑曜手機維修聯絡人"
                      >
                        <span aria-hidden="true">↓</span>
                        儲存黑曜聯絡人
                      </a>
                    </div>
                    <a
                      class="vcard-qr-link"
                      href="./obsidian-phone-repair.vcf"
                      aria-label="掃描或點擊儲存黑曜手機維修聯絡人"
                    >
                      <img
                        src="./assets/vcard-contact-qr.svg"
                        alt="黑曜手機維修聯絡人 QR Code"
                        width="132"
                        height="132"
                        loading="lazy"
                        decoding="async"
                      />
                      <span>手機掃碼儲存</span>
                    </a>
                  </article>
                  <article class="contact-item contact-item-wide line-contact-item">
                    <p class="contact-label">LINE 官方帳號</p>
                    <div class="line-contact-content">
                      <a
                        class="line-poster-link"
                        data-role="line-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="掃描 QR Code 或點擊加入黑曜手機維修 LINE 官方帳號"
                        hidden
                      >
                        <img
                          class="line-friends-poster"
                          src="./assets/line-friends-banner.jpg"
                          alt="黑曜手機維修 LINE 好友募集中，帳號 @ot_repair"
                          width="1000"
                          height="707"
                          loading="lazy"
                          decoding="async"
                        />
                      </a>
                      <a
                        class="review-poster-link"
                        data-role="review-poster-link"
                        href="https://maps.app.goo.gl/Sd1sp2foGwqFfy5x8"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="掃描 QR Code 或點擊前往 Google Maps 為黑曜手機維修留下五星好評"
                      >
                        <img
                          class="review-poster"
                          src="./assets/google-review-banner.jpg"
                          alt="黑曜手機維修 Google Maps 好評募集中，掃描 QR Code 留下五星好評"
                          width="1200"
                          height="675"
                          loading="lazy"
                          decoding="async"
                        />
                      </a>
                    </div>
                    <p data-role="line-placeholder">建置中，稍後補上</p>
                  </article>
                  <article class="contact-item contact-item-wide social-contact-item">
                    <p class="contact-label">黑曜手機維修｜官方社群</p>
                    <div class="social-link-grid">
                      <a
                        class="social-link"
                        data-role="facebook-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        hidden
                      >
                        <span class="social-icon" aria-hidden="true">
                          <img
                            src="./assets/facebook-icon-small.webp"
                            alt=""
                            width="128"
                            height="128"
                            loading="lazy"
                            decoding="async"
                          />
                        </span>
                        <span>Facebook</span>
                      </a>
                      <a
                        class="social-link"
                        data-role="instagram-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        hidden
                      >
                        <span class="social-icon" aria-hidden="true">
                          <img
                            src="./assets/instagram-icon-small.webp"
                            alt=""
                            width="128"
                            height="128"
                            loading="lazy"
                            decoding="async"
                          />
                        </span>
                        <span>Instagram</span>
                      </a>
                      <a
                        class="social-link"
                        data-role="threads-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        hidden
                      >
                        <span class="social-icon" aria-hidden="true">
                          <img
                            src="./assets/threads-icon-small.webp"
                            alt=""
                            width="128"
                            height="128"
                            loading="lazy"
                            decoding="async"
                          />
                        </span>
                        <span>Threads</span>
                      </a>
                    </div>
                    <p data-role="facebook-placeholder">Facebook 建置中</p>
                    <p data-role="instagram-placeholder">Instagram 建置中</p>
                    <p data-role="threads-placeholder">Threads 建置中</p>
                  </article>
                  <article class="contact-item contact-item-wide mobile-review-contact-item">
                    <p class="contact-label">Google Maps</p>
                    <a
                      class="mobile-review-link"
                      data-role="review-direct-link"
                      href="https://maps.app.goo.gl/Sd1sp2foGwqFfy5x8"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      維修完成後留下 Google 好評
                    </a>
                  </article>
                </div>
              </section>
            </div>
          </div>

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
            <div>
              <label class="summary-label" for="quote-sort">排序</label>
              <select class="summary-sort-select" id="quote-sort" data-role="sort" disabled>
                <option value="relevance">推薦順序</option>
                <option value="brand-model">品牌／型號</option>
                <option value="price-asc">價格低至高</option>
                <option value="price-desc">價格高至低</option>
              </select>
            </div>
          </section>

          <aside class="category-context-note" data-role="context-note" hidden></aside>

          <section data-role="results" class="quote-grid" aria-label="報價列表">
            ${renderSkeletons()}
          </section>
        </section>

        <footer class="site-footer">
          <span>黑曜手機維修</span>
          <span data-role="site-version">ver v?</span>
        </footer>

        <button
          class="top-button"
          type="button"
          data-role="top"
          aria-label="回頂部"
          title="回頂部"
          hidden
        >
          <span class="top-button-icon" aria-hidden="true">↑</span>
          <span>回頂部</span>
        </button>
      </main>
    `;

    getElement('query').addEventListener('input', (event) => {
      state.query = event.target.value;
      scheduleResultsUpdate();
    });

    getElement('brand').addEventListener('change', (event) => {
      state.brandId = event.target.value;
      state.modelKey = 'all';
      populateModels();
      updateResults();
      syncUrlState({ push: true });
    });

    getElement('model').addEventListener('change', (event) => {
      state.modelKey = event.target.value;
      updateResults();
      syncUrlState({ push: true });
    });

    getElement('category').addEventListener('change', (event) => {
      state.categoryId = event.target.value;
      updateResults();
      syncUrlState({ push: true });
    });

    getElement('sort').addEventListener('change', (event) => {
      state.sortMode = normalizeSortMode(event.target.value);
      updateResults();
      syncUrlState({ push: true });
    });

    getElement('reset').addEventListener('click', resetFilters);
    getElement('mobile-reset').addEventListener('click', resetFilters);
    getElement('query-clear').addEventListener('click', clearQueryAndExpandFilters);
    getElement('filter-expand').addEventListener('click', expandMobileFilters);
    getElement('search-form').addEventListener('submit', preventSearchFormSubmit);
    getElement('top').addEventListener('click', showPageHeader);
    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    window.addEventListener('resize', syncResponsiveToolbar);
    window.addEventListener('popstate', restoreStateFromUrl);
    syncTopButtonVisibility();
    syncResponsiveToolbar();
  }

  async function loadPriceData() {
    if (window.location.protocol === 'file:') {
      return loadFallbackPriceData();
    }

    try {
      const response = await fetch('./pricing/approved/prices.json', {
        headers: { Accept: 'application/json' },
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error(`讀取報價資料失敗 (${response.status})`);
      }

      return response.json();
    } catch (error) {
      return loadFallbackPriceData(error);
    }
  }

  function loadFallbackPriceData(originalError) {
    if (window.REPAIR_PRICE_DATA) {
      return Promise.resolve(window.REPAIR_PRICE_DATA);
    }

    if (fallbackPriceDataPromise) {
      return fallbackPriceDataPromise;
    }

    fallbackPriceDataPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = './data/prices.js';
      script.async = true;
      script.dataset.role = 'price-data-fallback';
      script.addEventListener('load', () => {
        if (window.REPAIR_PRICE_DATA) {
          resolve(window.REPAIR_PRICE_DATA);
          return;
        }

        reject(new Error('備援報價資料格式錯誤'));
      });
      script.addEventListener('error', () => {
        reject(originalError || new Error('無法讀取備援報價資料'));
      });
      document.head.append(script);
    });

    return fallbackPriceDataPromise;
  }

  function normalizePriceData(data) {
    if (!data || !Array.isArray(data.brands)) {
      return data;
    }

    return {
      ...data,
      brands: data.brands.flatMap((brand, brandIndex) => splitBrandForDropdown(brand, brandIndex)),
    };
  }

  function splitBrandForDropdown(brand, brandIndex) {
    if (brand.name !== '華為/其他 Android' || !Array.isArray(brand.models)) {
      return [{ ...brand, sortOrder: brandIndex }];
    }

    const groupOrder = [];
    const groupMap = new Map();

    brand.models.forEach((model) => {
      const groupName = String(model.modelGroup || '未分類').trim() || '未分類';
      if (!groupMap.has(groupName)) {
        groupMap.set(groupName, []);
        groupOrder.push(groupName);
      }
      groupMap.get(groupName).push(model);
    });

    return groupOrder.map((groupName, groupIndex) => ({
      ...brand,
      id: `${brand.id}:split:${groupIndex}`,
      name: groupName,
      sortOrder: brandIndex * 100 + groupIndex,
      sourceBrandId: brand.id,
      sourceBrandName: brand.name,
      models: groupMap.get(groupName) || [],
    }));
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
    document.querySelector('[data-role="notice-main"]').textContent =
      metadata.notice || '選擇品牌、型號與維修項目，快速查詢參考報價。';
    document.querySelector('[data-role="address"]').textContent =
      metadata.address || '新北市中和區信義街41巷3號一樓';
    syncAddressMapLink(metadata);
    document.querySelector('[data-role="warranty"]').textContent =
      `維修保固 ${metadata.warrantyDays || 90} 天`;
    hydrateContactInfo(metadata);
    getElement('currency').textContent = metadata.currency || 'TWD';
    getElement('updated-at').textContent = metadata.updatedAt || '-';

    applyUrlStateFromLocation();
    populateBrands();
    populateCategories();
    populateModels();
    getElement('query').value = state.query;
    getElement('sort').value = state.sortMode;
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
    setSocialLink(
      'instagram',
      metadata.instagramUrl,
      metadata.instagramContact,
      'Instagram 官方帳號',
    );
    setSocialLink(
      'threads',
      metadata.threadsUrl,
      metadata.threadsContact,
      'Threads 官方帳號',
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

    if (role === 'phone-primary') {
      const directLink = document.querySelector('[data-role="phone-direct-link"]');
      if (directLink) {
        directLink.href = `tel:${digits}`;
      }
    }
  }

  function setSocialLink(platform, url, contact, fallbackLabel) {
    const link = document.querySelector(`[data-role="${platform}-link"]`);
    const placeholder = document.querySelector(`[data-role="${platform}-placeholder"]`);
    const posterLink = document.querySelector(`[data-role="${platform}-poster-link"]`);
    const directLink = document.querySelector(`[data-role="${platform}-direct-link"]`);
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
      if (directLink) {
        directLink.hidden = true;
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
    if (directLink) {
      directLink.href = normalizedUrl;
      directLink.hidden = false;
      directLink.setAttribute('aria-label', linkLabel);
      directLink.title = linkLabel;
    }
    link.hidden = false;
    placeholder.hidden = true;
  }

  function syncAddressMapLink(metadata) {
    const link = document.querySelector('[data-role="address-link"]');
    if (!link) {
      return;
    }

    const mapLink = metadata.mapLink || 'https://maps.app.goo.gl/Sd1sp2foGwqFfy5x8';
    link.href = mapLink;

    ['map-direct-link', 'review-direct-link', 'review-poster-link'].forEach((role) => {
      const target = document.querySelector(`[data-role="${role}"]`);
      if (target) {
        target.href = mapLink;
      }
    });
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
    const hasSelectedBrand = state.brandId !== 'all';

    if (!hasSelectedBrand) {
      replaceOptions(select, [{ value: 'all', label: '請先選擇品牌' }]);
      select.value = 'all';
      select.disabled = true;
      return;
    }

    replaceOptions(select, [
      { value: 'all', label: '全部型號/設備' },
      ...getModels(state.brandId).map((model) => ({
        value: model.value,
        label: formatModelOption(model, state.brandId),
      })),
    ]);
    select.value = state.modelKey;
    select.disabled = false;
  }

  function updateResults() {
    const hasActiveFilters = hasActiveQuoteFilters();
    const results = getElement('results');
    syncCategoryContextNote();

    if (hasActiveFilters) {
      enterQuoteFocusMode();
    } else {
      setMobileFiltersCompact(false);
    }

    document.querySelectorAll('[data-role="reset"], [data-role="mobile-reset"]').forEach(
      (button) => {
        button.disabled = !hasActiveFilters;
      },
    );
    getElement('sort').disabled = state.loading || !hasActiveFilters;

    if (!hasActiveFilters) {
      getElement('result-count').textContent = `請先搜尋 / ${state.quotes.length}`;
      results.className = 'state-panel';
      results.innerHTML = `
        <h2>請開始搜尋</h2>
        <p>輸入品牌、型號、維修項目，或使用上方下拉選單縮小範圍後，就會顯示符合的報價卡。</p>
      `;
      return;
    }

    const filteredQuotes = state.quotes.filter((quote) => matchesQuote(quote));
    const sortedQuotes = sortQuotes(filteredQuotes);
    getElement('result-count').textContent = `${filteredQuotes.length} / ${state.quotes.length}`;
    results.className = filteredQuotes.length ? 'quote-grid' : 'state-panel';

    if (!filteredQuotes.length) {
      const lineInquiryUrl = buildGeneralLineInquiryUrl();
      results.innerHTML = `
        <h2>沒有符合的報價</h2>
        <p>可以試試「ip11」、「S23U」或「電池」，也可以改用品牌、型號與維修項目下拉選單。</p>
        <div class="empty-state-actions">
          ${hasActiveFilters ? '<button type="button" data-empty-reset>清除篩選</button>' : ''}
          ${
            lineInquiryUrl
              ? `
                <a
                  class="empty-line-action"
                  href="${escapeHtml(lineInquiryUrl)}"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LINE 詢問
                </a>
              `
              : ''
          }
        </div>
      `;
      const emptyReset = results.querySelector('[data-empty-reset]');
      if (emptyReset) {
        emptyReset.addEventListener('click', resetFilters);
      }
      return;
    }

    results.innerHTML = sortedQuotes.map(renderQuoteCard).join('');
  }

  function syncCategoryContextNote() {
    const note = getElement('context-note');
    const isComputerCategory = state.brandId === 'desktop-laptop';
    note.hidden = !isComputerCategory;
    note.textContent = isComputerCategory
      ? 'Windows 桌機／筆電維修需依設備規格與故障狀況現場檢測，本類別目前不提供固定金額。'
      : '';
  }

  function sortQuotes(quotes) {
    const sorted = [...quotes];

    if (state.sortMode === 'brand-model') {
      return sorted.sort(compareQuotesByBrandAndModel);
    }

    if (state.sortMode === 'price-asc' || state.sortMode === 'price-desc') {
      return sorted.sort(compareQuotesByPrice);
    }

    const tokens = tokenizeSearchQuery(state.query);
    if (!tokens.length) {
      return sorted.sort((left, right) => left.sourceIndex - right.sourceIndex);
    }

    return sorted.sort((left, right) => {
      const scoreDifference = quoteRelevanceScore(right, tokens) - quoteRelevanceScore(left, tokens);
      return scoreDifference || left.sourceIndex - right.sourceIndex;
    });
  }

  function compareQuotesByBrandAndModel(left, right) {
    const brandDifference = brandSortRank(left.brandId) - brandSortRank(right.brandId);
    if (brandDifference !== 0) {
      return brandDifference;
    }

    const modelDifference = compareText(left.modelName, right.modelName);
    return modelDifference || compareText(left.item, right.item) || left.sourceIndex - right.sourceIndex;
  }

  function compareQuotesByPrice(left, right) {
    const leftPrice = getSortablePrice(left.price);
    const rightPrice = getSortablePrice(right.price);
    const leftHasPrice = Number.isFinite(leftPrice);
    const rightHasPrice = Number.isFinite(rightPrice);

    if (leftHasPrice !== rightHasPrice) {
      return leftHasPrice ? -1 : 1;
    }

    if (!leftHasPrice) {
      return left.sourceIndex - right.sourceIndex;
    }

    const direction = state.sortMode === 'price-desc' ? -1 : 1;
    return direction * (leftPrice - rightPrice) || left.sourceIndex - right.sourceIndex;
  }

  function getSortablePrice(price) {
    if (price?.type === 'fixed') {
      return Number(price.amount);
    }

    if (price?.type === 'range') {
      return Number(price.min);
    }

    return Number.NaN;
  }

  function quoteRelevanceScore(quote, tokens) {
    const model = compactText(quote.modelName);
    const item = compactText(quote.item);
    const brand = compactText([quote.brandName, ...(quote.brandAliases || [])].join(' '));
    const index = getQuoteSearchIndex(quote);

    return tokens.reduce((score, token) => {
      const compactToken = compactText(token);
      if (!compactToken) {
        return score;
      }
      if (model === compactToken) {
        return score + 20;
      }
      if (model.includes(compactToken)) {
        return score + 12;
      }
      if (item.includes(compactToken)) {
        return score + 8;
      }
      if (brand.includes(compactToken)) {
        return score + 5;
      }
      return index.compact.includes(compactToken) ? score + 1 : score;
    }, 0);
  }

  function compareText(left, right) {
    return String(left || '').localeCompare(String(right || ''), 'zh-Hant', {
      numeric: true,
      sensitivity: 'base',
    });
  }

  function scheduleResultsUpdate() {
    cancelScheduledResultsUpdate();
    state.searchUpdateTimer = window.setTimeout(() => {
      state.searchUpdateTimer = null;
      updateResults();
      syncUrlState();
    }, searchUpdateDelay);
  }

  function cancelScheduledResultsUpdate() {
    if (!state.searchUpdateTimer) {
      return;
    }

    window.clearTimeout(state.searchUpdateTimer);
    state.searchUpdateTimer = null;
  }

  function resetFilters() {
    cancelScheduledResultsUpdate();
    state.query = '';
    state.brandId = 'all';
    state.modelKey = 'all';
    state.categoryId = 'all';
    state.sortMode = 'relevance';

    getElement('query').value = '';
    getElement('brand').value = 'all';
    getElement('category').value = 'all';
    getElement('sort').value = 'relevance';
    populateModels();
    updateResults();
    syncUrlState({ push: true });
  }

  function clearQueryAndExpandFilters(event) {
    event.preventDefault();
    cancelScheduledResultsUpdate();
    state.query = '';
    getElement('query').value = '';
    updateResults();
    syncUrlState({ push: true });

    setMobileFiltersCompact(false);
    getElement('query').focus({ preventScroll: true });
  }

  function preventSearchFormSubmit(event) {
    event.preventDefault();
    cancelScheduledResultsUpdate();
    updateResults();
    syncUrlState();
  }

  function applyUrlStateFromLocation() {
    const params = new URL(window.location.href).searchParams;
    const requestedBrand = params.get('brand') || 'all';
    const validBrandIds = new Set((state.data?.brands || []).map((brand) => brand.id));

    state.query = params.get('q') || '';
    state.brandId = requestedBrand === 'all' || validBrandIds.has(requestedBrand)
      ? requestedBrand
      : 'all';

    const requestedCategory = params.get('category') || 'all';
    const validCategoryIds = new Set(
      (state.data?.repairCategories || []).map((category) => category.id),
    );
    state.categoryId =
      requestedCategory === 'all' || validCategoryIds.has(requestedCategory)
        ? requestedCategory
        : 'all';

    const requestedModel = params.get('model') || 'all';
    const validModelKeys = new Set(getModels(state.brandId).map((model) => model.value));
    state.modelKey =
      requestedModel === 'all' || validModelKeys.has(requestedModel)
        ? requestedModel
        : 'all';
    state.sortMode = normalizeSortMode(params.get('sort'));
  }

  function syncUrlState(options = {}) {
    if (!state.data || !window.history?.replaceState) {
      return;
    }

    const url = new URL(window.location.href);
    const currentHasState = hasManagedUrlState(url.searchParams);
    setUrlParameter(url, 'q', state.query.trim());
    setUrlParameter(url, 'brand', state.brandId !== 'all' ? state.brandId : '');
    setUrlParameter(url, 'model', state.modelKey !== 'all' ? state.modelKey : '');
    setUrlParameter(url, 'category', state.categoryId !== 'all' ? state.categoryId : '');
    setUrlParameter(url, 'sort', state.sortMode !== 'relevance' ? state.sortMode : '');

    if (url.href === window.location.href) {
      return;
    }

    const nextHasState = hasManagedUrlState(url.searchParams);
    const shouldPush = Boolean(options.push) || (!currentHasState && nextHasState);
    window.history[shouldPush ? 'pushState' : 'replaceState']({}, '', url.href);
  }

  function setUrlParameter(url, key, value) {
    if (value) {
      url.searchParams.set(key, value);
      return;
    }

    url.searchParams.delete(key);
  }

  function hasManagedUrlState(params) {
    return ['q', 'brand', 'model', 'category', 'sort'].some((key) => params.has(key));
  }

  function normalizeSortMode(value) {
    const allowed = new Set(['relevance', 'brand-model', 'price-asc', 'price-desc']);
    return allowed.has(value) ? value : 'relevance';
  }

  function restoreStateFromUrl() {
    if (!state.data || state.loading) {
      return;
    }

    cancelScheduledResultsUpdate();
    applyUrlStateFromLocation();
    populateBrands();
    populateCategories();
    populateModels();
    getElement('query').value = state.query;
    getElement('sort').value = state.sortMode;

    if (!hasActiveQuoteFilters() && state.quoteFocusMode) {
      showPageHeader();
    }

    updateResults();
  }

  function expandMobileFilters(event) {
    event.preventDefault();
    setMobileFiltersCompact(false);
  }

  function enterQuoteFocusMode() {
    if (state.quoteFocusMode) {
      return;
    }

    state.quoteFocusMode = true;
    const introPanel = getElement('intro-panel');
    introPanel.setAttribute('aria-hidden', 'true');
    introPanel.inert = true;
    const contactCollapse = getElement('contact-collapse');
    contactCollapse.setAttribute('aria-hidden', 'true');
    contactCollapse.inert = true;
    document.querySelector('.app-shell').classList.add('is-quote-focus');
    syncTopButtonVisibility();

    const scrollDelay = preferredScrollBehavior() === 'auto' ? 0 : 430;
    state.quoteFocusScrollTimer = window.setTimeout(() => {
      state.quoteFocusScrollTimer = null;
      beginMobileProgrammaticScroll(false);
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

    setMobileFiltersCompact(false);
    state.quoteFocusMode = false;
    const introPanel = getElement('intro-panel');
    introPanel.removeAttribute('aria-hidden');
    introPanel.inert = false;
    const contactCollapse = getElement('contact-collapse');
    contactCollapse.removeAttribute('aria-hidden');
    contactCollapse.inert = false;
    document.querySelector('.app-shell').classList.remove('is-quote-focus');
    syncTopButtonVisibility();
    beginMobileProgrammaticScroll(true);
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
    if (!isMobileToolbarViewport()) {
      setMobileFiltersCompact(false);
      return;
    }

    if (state.mobileProgrammaticScrollTimer) {
      return;
    }

    if (window.scrollY <= 8 && !state.quoteFocusMode) {
      setMobileFiltersCompact(false);
      return;
    }

    if (window.scrollY > 8) {
      setMobileFiltersCompact(true);
    }
  }

  function beginMobileProgrammaticScroll(expandAtEnd) {
    const duration = 1000;

    if (state.mobileProgrammaticScrollTimer) {
      window.clearTimeout(state.mobileProgrammaticScrollTimer);
    }

    state.mobileProgrammaticScrollTimer = window.setTimeout(() => {
      state.mobileProgrammaticScrollTimer = null;
      if (expandAtEnd && isMobileToolbarViewport()) {
        setMobileFiltersCompact(false);
      }
    }, duration);
  }

  function setMobileFiltersCompact(compact) {
    const shouldCompact = Boolean(compact) && isMobileToolbarViewport();
    if (state.mobileFiltersCompact === shouldCompact) {
      return;
    }

    state.mobileFiltersCompact = shouldCompact;
    const filterRow = document.querySelector('.filter-row');
    const filterExpandButton = getElement('filter-expand');
    filterExpandButton.hidden = !shouldCompact;
    filterExpandButton.setAttribute('aria-expanded', String(!shouldCompact));
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
    if (!isMobileToolbarViewport()) {
      setMobileFiltersCompact(false);
      return;
    }

    if (window.scrollY <= 8 && !state.quoteFocusMode) {
      setMobileFiltersCompact(false);
    }
  }

  function isMobileToolbarViewport() {
    return window.matchMedia('(max-width: 939px)').matches;
  }

  function hasActiveQuoteFilters() {
    return Boolean(
      tokenizeSearchQuery(state.query).length ||
        state.brandId !== 'all' ||
        state.modelKey !== 'all' ||
        state.categoryId !== 'all',
    );
  }

  function preferredScrollBehavior() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }

  function disableControls(disabled) {
    ['query', 'brand', 'category', 'sort'].forEach((role) => {
      getElement(role).disabled = disabled;
    });
    getElement('model').disabled = disabled || state.brandId === 'all';
  }

  function syncSiteVersion() {
    const target = document.querySelector('[data-role="site-version"]');
    if (!target) {
      return;
    }

    const rawVersion = window.REPAIR_SITE_VERSION;
    const version = String(rawVersion || '').trim();
    const normalized = version ? (version.toLowerCase().startsWith('v') ? version : `v${version}`) : 'v?';
    const debugLabel = version.toLowerCase().includes('debug') ? '版' : '';
    target.textContent = `ver ${normalized}${debugLabel}`;
  }

  function renderQuoteCard(quote) {
    const screenType = getAppleScreenTypeLabel(quote);

    return `
      <article class="quote-card">
        <div class="card-topline">
          <span>${highlightSearchText(quote.brandName)}</span>
          <span class="availability availability-${escapeHtml(quote.availability)}">
            ${escapeHtml(availabilityLabel(quote.availability))}
          </span>
        </div>

        <h2>${highlightSearchText(formatQuoteModelName(quote))}</h2>
        <p class="repair-item">${highlightSearchText(quote.item)}</p>
        ${
          screenType
            ? `
              <div class="repair-badge-row" aria-label="螢幕類型">
                <span class="repair-badge repair-badge-${screenType.kind}">
                  ${escapeHtml(screenType.label)}
                </span>
              </div>
            `
            : ''
        }

        <div class="price-line">${renderQuotePrice(quote)}</div>

        <div class="detail-list" aria-label="維修細節">
          <span>${escapeHtml(quote.categoryName)}</span>
          <span>${escapeHtml(quote.duration)}</span>
          <span>${quote.warrantyDays > 0 ? `${escapeHtml(quote.warrantyDays)} 天保固` : '檢測無保固'}</span>
        </div>

        ${renderLineInquiryAction(quote)}

        ${
          quote.note
            ? `<p class="card-note">${escapeHtml(quote.note)}</p>`
            : ''
        }
      </article>
    `;
  }

  function highlightSearchText(value) {
    const source = String(value || '');
    const terms = getHighlightTerms().filter((term) =>
      normalize(source).includes(normalize(term)),
    );

    if (!terms.length) {
      return escapeHtml(source);
    }

    const pattern = new RegExp(
      `(${terms.sort((left, right) => right.length - left.length).map(escapeRegExp).join('|')})`,
      'giu',
    );

    return source
      .split(pattern)
      .map((part, index) =>
        index % 2 === 1
          ? `<mark class="search-highlight">${escapeHtml(part)}</mark>`
          : escapeHtml(part),
      )
      .join('');
  }

  function getHighlightTerms() {
    const terms = new Set();

    tokenizeSearchQuery(state.query).forEach((token) => {
      const compactToken = compactText(token);
      if (!compactToken) {
        return;
      }

      terms.add(token);
      getSynonymMatches(compactToken).forEach((synonym) => terms.add(synonym));

      brandAliasEntries.forEach((entry) => {
        const brandTerms = [...entry.keys, ...entry.aliases];
        if (brandTerms.map(compactText).includes(compactToken)) {
          brandTerms.forEach((brandTerm) => terms.add(brandTerm));
        }
      });

      const samsungMatch = compactToken.match(/^(s\d{1,2})u$/);
      if (samsungMatch) {
        terms.add(samsungMatch[1]);
        terms.add('ultra');
      }

      const iphoneMatch = compactToken.match(/^ip(?:hone)?(\d+)/);
      if (iphoneMatch) {
        terms.add(iphoneMatch[1]);
      }
    });

    return [...terms].filter((term) => String(term).length > 0);
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function getAppleScreenTypeLabel(quote) {
    if (quote.brandId !== 'apple' || quote.categoryId !== 'screen') {
      return null;
    }

    const text = normalize([quote.item, quote.note, quote.modelName].join(' '));
    if (text.includes('原廠')) {
      return { kind: 'original', label: '原廠螢幕' };
    }

    return { kind: 'aftermarket', label: '副廠螢幕' };
  }

  function renderQuotePrice(quote) {
    const formattedPrice = escapeHtml(formatPrice(quote.price, quote.currency));
    if (quote.price?.type !== 'fixed') {
      return formattedPrice;
    }

    return `<span class="price-prefix">參考報價</span><span>${formattedPrice}</span>`;
  }

  function renderLineInquiryAction(quote) {
    if (!hasActiveQuoteFilters()) {
      return '';
    }

    const url = buildLineInquiryUrl(quote);
    if (!url) {
      return '';
    }

    const label = `透過 LINE 詢問 ${quote.brandName} ${formatQuoteModelName(quote)} ${quote.item}`;
    return `
      <a
        class="quote-line-action"
        href="${escapeHtml(url)}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="${escapeHtml(label)}"
      >
        LINE 詢問此項目
      </a>
    `;
  }

  function buildLineInquiryUrl(quote) {
    const message = `您好，我想詢問 ${quote.brandName} ${formatQuoteModelName(quote)} 的「${quote.item}」參考報價與可預約時間。`;
    return buildLineContactUrl(message);
  }

  function buildGeneralLineInquiryUrl() {
    return buildLineContactUrl('您好，我在報價網站沒有找到符合的項目，想進一步詢問維修報價。');
  }

  function buildLineContactUrl(message) {
    const desktopUrl = String(state.data?.metadata?.lineDesktopUrl || '').trim();
    if (isDesktopViewport() && desktopUrl) {
      return desktopUrl;
    }

    const lineId = String(state.data?.metadata?.lineOaId || '').trim();
    if (!/^@[a-z0-9._-]+$/i.test(lineId)) {
      return String(state.data?.metadata?.lineUrl || '').trim();
    }

    return `https://line.me/R/oaMessage/${lineId}/?${encodeURIComponent(message)}`;
  }

  function isDesktopViewport() {
    return window.matchMedia('(min-width: 769px)').matches;
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
          brandAliases: getBrandAliases(brand),
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
    return [...(state.data.brands || [])].sort(compareBrands);
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
      .sort(compareModelOptions);
  }

  function compareModelOptions(left, right) {
    const brandOrder = brandSortRank(left.brandId) - brandSortRank(right.brandId);
    if (brandOrder !== 0) {
      return brandOrder;
    }

    const familyOrder = modelFamilyRank(left) - modelFamilyRank(right);
    return familyOrder || compareByName(left, right);
  }

  function compareBrands(left, right) {
    const leftOrder = Number.isFinite(left.sortOrder) ? left.sortOrder : Number.POSITIVE_INFINITY;
    const rightOrder = Number.isFinite(right.sortOrder) ? right.sortOrder : Number.POSITIVE_INFINITY;
    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return compareByName(left, right);
  }

  function brandSortRank(brandId) {
    const brand = (state.data.brands || []).find((entry) => entry.id === brandId);
    return Number.isFinite(brand?.sortOrder) ? brand.sortOrder : Number.POSITIVE_INFINITY;
  }

  function modelFamilyRank(model) {
    if (model.brandId !== 'apple') {
      return 0;
    }

    if (model.name.startsWith('iPhone')) {
      return 0;
    }

    if (model.name.startsWith('iPad')) {
      return 1;
    }

    return 2;
  }

  function matchesQuote(quote) {
    const brandMatches = state.brandId === 'all' || quote.brandId === state.brandId;
    const modelMatches = state.modelKey === 'all' || quote.modelKey === state.modelKey;
    const categoryMatches =
      state.categoryId === 'all' || quote.categoryId === state.categoryId;

    if (!brandMatches || !modelMatches || !categoryMatches) {
      return false;
    }

    const tokens = tokenizeSearchQuery(state.query);

    if (!tokens.length) {
      return true;
    }

    const searchIndex = getQuoteSearchIndex(quote);
    const requiredPhrases = getRequiredPhrases(
      normalize(state.query).split(/\s+/).filter(Boolean),
    );

    return (
      requiredPhrases.every((phrase) => phraseMatches(phrase, searchIndex)) &&
      tokens.every((token) => tokenMatches(token, searchIndex))
    );
  }

  function getQuoteSearchIndex(quote) {
    if (quote.searchIndex) {
      return quote.searchIndex;
    }

    const modelText = normalize(
      [
        quote.modelName,
        ...createDerivedAliases(quote),
      ].join(' '),
    );
    const text = normalize(
      [
        quote.brandName,
        ...(quote.brandAliases || []),
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
      modelText,
      modelCompact: compactText(modelText),
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

    if (/^\d+$/.test(compactToken)) {
      const numericModelPattern = new RegExp(`(^|\\D)${escapeRegExp(compactToken)}(\\D|$)`);
      return numericModelPattern.test(searchIndex.modelText);
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
      ...createSamsungAliases(quote.brandId, quote.modelName),
    ];
  }

  function getBrandAliases(brand) {
    const sourceKeys = [brand.id, brand.name]
      .filter(Boolean)
      .map(compactText);
    const aliases = new Set(Array.isArray(brand.aliases) ? brand.aliases : []);

    brandAliasEntries.forEach((entry) => {
      const matchesBrand = entry.keys
        .map(compactText)
        .some((key) => sourceKeys.includes(key));

      if (matchesBrand) {
        entry.aliases.forEach((alias) => aliases.add(alias));
      }
    });

    return [...aliases];
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

  function createSamsungAliases(brandId, modelName) {
    if (brandId !== 'samsung') {
      return [];
    }

    const match = compactText(modelName).match(/^(s\d{1,2})u/);
    if (!match) {
      return [];
    }

    return [`${match[1]} ultra`, `${match[1]}ultra`];
  }

  function tokenizeSearchQuery(value) {
    let workingText = compactText(value);
    if (!workingText) {
      return [];
    }

    const impliedIphoneModel = getImpliedIphoneModel(workingText);

    conversationalStopPhrases.forEach((phrase) => {
      workingText = workingText.replaceAll(phrase, ' ');
    });

    const tokens = [];
    workingText = extractQueryTerms(workingText, getBrandQueryTerms(), tokens);
    workingText = extractQueryTerms(workingText, getRepairQueryTerms(), tokens);
    workingText = normalizeModelQueryTerms(workingText);
    tokens.push(...workingText.split(/\s+/).filter(Boolean));
    if (impliedIphoneModel) {
      tokens.push(impliedIphoneModel);
    }

    return [...new Set(tokens.map(compactText).filter(Boolean))];
  }

  function getImpliedIphoneModel(compactQuery) {
    if (/ipad|mac/.test(compactQuery)) {
      return '';
    }

    const match = compactQuery.match(/(?:蘋果|苹果)(\d{1,2})/);
    return match ? `iphone${match[1]}` : '';
  }

  function extractQueryTerms(source, terms, tokens) {
    let remaining = source;

    terms.forEach((term) => {
      if (!term || !remaining.includes(term)) {
        return;
      }

      tokens.push(term);
      remaining = remaining.replaceAll(term, ' ');
    });

    return remaining;
  }

  function getBrandQueryTerms() {
    const terms = brandAliasEntries.flatMap((entry) => [...entry.keys, ...entry.aliases]);
    return [...new Set(terms.map(compactText).filter(Boolean))]
      .sort((left, right) => right.length - left.length);
  }

  function getRepairQueryTerms() {
    return [...new Set(searchSynonymGroups.flat())]
      .sort((left, right) => right.length - left.length);
  }

  function normalizeModelQueryTerms(value) {
    return value.replace(/(s\d{1,2})ultra/g, '$1u');
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
      return 'Apple 全系列（iPhone／iPad／Mac）';
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
