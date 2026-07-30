# 手機維修報價查詢網站

這是一個不需要後端 server 的純靜態維修報價查詢網站。前端用原生 JavaScript 提供品牌、型號/設備、維修項目與關鍵字搜尋，可涵蓋手機、平板、Apple Mac、Desktop & Laptop、Dyson 與 Nintendo。

網站功能與報價資料採用兩條獨立版本線：

- 網站版本：由 `package.json` 管理，只有版面或功能變更時才升級。
- 報價版本：由 `pricing/approved/prices.json` 的 `metadata.priceDataVersion` 管理，臨時改價不需要更動網站版本。

## 架構判斷

這個版本適合黑曜手機維修的第一版 MVP。它沒有會員登入、沒有資料庫、沒有 API server，部署成本低，也比較不會因為缺 npm、Vite 或 node_modules 導致白畫面。

報價資料流：

```text
pricing/approved/prices.json（唯一正式來源）
  ↓ 自動驗證與同步
data/prices.json + data/prices.js（自動產生）
  ↓
assets/app.js fetch('./pricing/approved/prices.json')
  ↓
index.html 顯示報價查詢 UI
```

`data/prices.js` 是直接雙擊 `index.html` 時使用的備援檔。它與 `data/prices.json` 都由同步程式產生，不再人工維護。

## 缺點與風險

- 沒有公開後台管理，正式報價要透過 GitHub 報價專區或本機審核流程更新。
- 報價資料是公開靜態檔，不能放內部成本、員工備註或私密折扣。
- GitHub 自動發布需要設定 Cloudflare API Token 與 Account ID；未設定時仍會執行資料驗證與網站建置，但不會自動上線。
- 未來如果要登入、寫入資料、即時庫存或預約單，就應該改用 CMS、資料庫或後端 API。

## 資料夾結構

```text
assets/
  app.js
  styles.css
data/
  prices.json                 # 自動產生
  prices.js                   # 自動產生
pricing/
  approved/
    prices.json               # 唯一正式報價來源
  incoming/                   # 待審核資料
  archive/                    # 復原與封存規則
scripts/
  validate-price-data.mjs
  sync-price-data.mjs
.github/workflows/
  price-data.yml
_redirects
firebase.json
index.html
vercel.json
```

## 報價資料格式

正式 `prices.json` 採用品牌、型號、維修項目的階層式結構：

```json
{
  "metadata": {
    "studioName": "黑曜手機維修",
    "updatedAt": "2026-05-18",
    "priceDataVersion": "2026-05-18.1",
    "currency": "TWD",
    "address": "新北市中和區信義街41巷3號一樓",
    "warrantyDays": 90,
    "notice": "全站維修保固 90 天；實際報價會依零件等級、機況與現場檢測結果調整。"
  },
  "repairCategories": [{ "id": "screen", "name": "螢幕維修" }],
  "brands": [
    {
      "id": "apple",
      "name": "Apple",
      "models": [
        {
          "id": "iphone-15-pro",
          "name": "iPhone 15 Pro",
          "aliases": ["15 Pro"],
          "repairs": [
            {
              "id": "screen-oled",
              "categoryId": "screen",
              "item": "OLED 螢幕總成",
              "price": { "type": "fixed", "amount": 9800 },
              "duration": "2-3 小時",
              "warrantyDays": 90,
              "availability": "in_stock",
              "note": "含觸控、Face ID 與亮度測試。"
            }
          ]
        }
      ]
    }
  ]
}
```

`price.type` 可以是 `fixed`、`range` 或 `inquiry`。

## 開啟方式

第一次取得專案或更新報價後，先同步資料：

```bash
npm run prices:sync
npm run prices:check
```

建立正式靜態檔：

```bash
npm run build
```

本機預覽：

```bash
python3 -m http.server 4173
```

然後開啟：

```text
http://127.0.0.1:4173/
```

同步資料後也可以直接雙擊 `index.html`，網站會使用自動產生的 `data/prices.js` 備援資料顯示。

完整報價更新規則請閱讀 `pricing/README.md`。

## 部署

- Cloudflare Pages：建置指令為 `npm run build`，輸出目錄為 `dist`。
- GitHub Actions：報價來源或同步腳本變更時會自動驗證、建置；設定 Cloudflare 金鑰後可獨立發布報價更新。
- Vercel：可當成純靜態網站部署，不需要 Framework preset。
- Firebase Hosting：`firebase.json` 已設定 `public` 為專案根目錄。

### 正式站與 Debug 測試站

- 正式站：`https://otrepair-price.pages.dev/`
- Debug 測試站：`https://debug.otrepair-price.pages.dev/`
- `codex/debug` 分支只發布到 Debug 測試站，不會更新正式站。
- Debug 建置會在頁首版本後自動加上 `-debug版`，方便跨裝置辨識。
- 測試內容經確認後，才另外建立正式版本並發布到正式站。
