# 報價封存說明

正式報價的完整歷史由 GitHub 提交紀錄保存，不在這裡重複存放整份 JSON。

復原時：

1. 找到最後一筆正確的 `Update prices ...` 提交。
2. 取回該提交的 `pricing/approved/prices.json`。
3. 執行報價同步與驗證。
4. 重新發布 Cloudflare Pages。

重大價格盤點可另外建立 Git 標籤，例如 `prices-2026-07-28.1`。
