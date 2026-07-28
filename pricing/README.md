# 黑曜報價更新專區

這個資料夾只處理報價資料，不處理網站版面、搜尋功能或品牌文案。

## 唯一正式來源

`approved/prices.json` 是正式報價的唯一來源。

- 不要直接修改 `data/prices.json`。
- 不要直接修改 `data/prices.js`。
- `data` 內的兩份檔案會在驗證、建置或發布時自動產生。
- 報價資料只能放公開資訊，不能加入內部成本、客戶資料或私密備註。

## 更新流程

1. 將新抓取或待比對資料放進 `incoming/` 或既有 `imports/`。
2. 產生差異報告並人工審閱。
3. 只把核准內容合併到 `approved/prices.json`。
4. 更新 `metadata.updatedAt`。
5. 更新 `metadata.priceDataVersion`，格式為 `YYYY-MM-DD.序號`。
6. 執行 `npm run prices:sync`。
7. 執行 `npm run prices:check` 與 `npm run build`。
8. GitHub 只將這次報價資料變更納入一筆獨立提交。

網站功能版本與報價資料版本彼此獨立。只修改價格時，不需要調整 `package.json` 的網站版本，也不需要更改頁首版本徽章。

## 版本與復原

每次核准報價都應使用清楚的 Git 提交訊息，例如：

```text
Update prices 2026-07-28.1
```

GitHub 的提交歷史就是正式報價封存。若資料有誤，可取回上一筆核准提交中的 `approved/prices.json`，重新同步並發布。

`archive/` 只記錄復原規則與重要里程碑，不重複保存每一份 1.6 MB 的完整 JSON，避免 GitHub 儲存空間快速膨脹。
