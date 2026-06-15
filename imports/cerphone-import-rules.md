# Cerphone 報價匯入規則

Cerphone 的原始欄位名稱不能直接當成站內正式分類，匯入前必須先依下列規則轉譯與過濾。

## Apple

- 一般 Apple 裝置的 `螢幕破裂` 轉成站內 `螢幕維修`。
- `APPLE / 原廠螢幕` 不抓取。
- `APPLE / 原廠電池` 不抓取。
- `APPLE / 原廠鏡頭` 不抓取。
- `組裝螢幕總成` 保留為獨立項目，不併入 `螢幕維修`。
- Apple Watch 不抓取。
- AirPods 不抓取。

### 標準款 iPad 例外

- 標準款 iPad 範圍為初代至 iPad 11。
- 標準款 iPad 的 `玻璃破裂` 與 `螢幕破裂` 都要保留，且不能合併。
- iPad Air、iPad Pro、iPad mini 等全貼合螢幕系列只保留 `螢幕維修`。

## Sony / ASUS

- Sony 的 `螢幕破裂` 轉成站內 `螢幕維修`。
- ASUS 的 `螢幕破裂` 轉成站內 `螢幕維修`。

## 華為與其他 Android

- HUAWEI、NOKIA、SUGAR、VIVO、realme 的螢幕主欄位轉成站內 `螢幕維修`。
- MOTOROLA 的螢幕主欄位轉成站內 `螢幕維修`。
- MOTOROLA 的 `排線` 與 `轉軸` 保留為獨立項目。
- HTC 不抓取。

## 其他排除項目

- Cerphone `quotation_dyson` 頁面的主機項目實為清潔服務，不列入維修報價。
