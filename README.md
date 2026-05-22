# 手機維修報價查詢網站

這是一個不需要 npm、不需要 build、不需要後端 server 的純靜態維修報價查詢網站。資料放在 `data/prices.json`，前端用原生 JavaScript 讀取並提供品牌、型號/設備、維修項目與關鍵字搜尋，可涵蓋手機、平板、Apple Mac、Desktop & Laptop、Dyson 與 Nintendo。

## 架構判斷

這個版本適合黑曜手機維修的第一版 MVP。它沒有會員登入、沒有資料庫、沒有 API server，部署成本低，也比較不會因為缺 npm、Vite 或 node_modules 導致白畫面。

資料流很單純：

```text
data/prices.json
  ↓
assets/app.js fetch('./data/prices.json')
  ↓
index.html 顯示報價查詢 UI
```

`data/prices.js` 是同一份資料的備用 JS 檔，用在直接雙擊開啟 `index.html` 時避免瀏覽器封鎖 `file:// fetch`。正式部署時主要仍會讀 `data/prices.json`。

## 缺點與風險

- 沒有後台管理，修改報價要直接編輯 `data/prices.json`。
- 報價資料是公開靜態檔，不能放內部成本、員工備註或私密折扣。
- 如果更新 `data/prices.json` 後也想支援雙擊開檔案，需要同步更新 `data/prices.js`。
- 未來如果要登入、寫入資料、即時庫存或預約單，就應該改用 CMS、資料庫或後端 API。

## 資料夾結構

```text
assets/
  app.js
  styles.css
data/
  prices.json
  prices.js
_redirects
firebase.json
index.html
vercel.json
```

## 報價資料格式

`prices.json` 採用品牌、型號、維修項目的階層式結構，方便人工維護：

```json
{
  "metadata": {
    "studioName": "黑曜手機維修",
    "updatedAt": "2026-05-18",
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

最穩的本機開啟方式：

```bash
python3 -m http.server 4173
```

然後開啟：

```text
http://127.0.0.1:4173/
```

也可以直接雙擊 `index.html`，網站會使用 `data/prices.js` 備用資料顯示。

## 部署

- Cloudflare Pages：不需要 build command，output directory 設成 `/` 或專案根目錄。
- Vercel：可當成純靜態網站部署，不需要 Framework preset。
- Firebase Hosting：`firebase.json` 已設定 `public` 為專案根目錄。
