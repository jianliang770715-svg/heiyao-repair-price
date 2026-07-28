# Cerphone 完整報價人工審核清單（2026-07-29）

> 處理狀態：使用者已確認套用規則，結果已寫入報價版本 `2026-07-29.2`。目前為**價格審核完成、可交接；尚未由網站管理分頁歸檔、上傳及發布**。實際套用結果請見 `pricing/incoming/cerphone-applied-2026-07-29.2.md`；本檔保留作為原始完整差異記錄。

- Source: https://cerphone.com/quotation/
- 完整快照取得時間: 2026-07-20T10:07:01+08:00
- 即時有效性複查: 2026-07-29；Cerphone 9 個報價頁均未在完整快照後更新。
- 比對基準: `pricing/approved/prices.json`，報價資料版本 `2026-07-29.1`
- 已依 `imports/cerphone-import-rules.md` 先完成欄位轉譯與排除，再與站內資料比對。
- Apple 原廠螢幕、原廠電池、原廠鏡頭、非標準款 iPad 的玻璃破裂、Apple Watch、AirPods、HTC，以及 Dyson 清潔服務均不列入維修報價盤點。
- 說明: 這份差異檔列出所有剩餘價格差異、新增、Cerphone 未列出但站內保留，以及需人工判讀項目；未自動覆寫未核准價格。

## 摘要
- 總筆數: 3772
- 可比對/可審核筆數: 3624
- 待審精確價格差異: 34
- 上修: 6
- 下調: 28
- 持平: 3419
- 需人工確認: 136
- 新增/未對上: 35
- Cerphone 未列出／站內保留: 68
- Cerphone 空白／`-` 欄位，無法比價: 148
- 異動金額範圍: -1,300 ~ 1,300 TWD

## Cerphone 空白／`-` 欄位明細

這些項目只代表 Cerphone 沒有提供可比較的公開金額，不代表黑曜不能維修，也不構成改價、刪除或下架建議。

### Apple（56）
- 認證電池（4）：iPhone 17 Pro Max、iPhone 17 Pro、iPhone 17、iPhone Air
- HOME鍵（20）：iPad 11、iPad mini 7、iPad mini 6、iPad Air 7 (11吋)、iPad Air 7 (13吋)、iPad Air 6 (11吋)、iPad Air 6 (13吋)、iPad Air 5、iPad Air 4、iPad Air 3、iPad Pro 11" 第四代、iPad Pro 11" 第三代、iPad Pro 11" 第二代、iPad Pro 11"、iPad Pro 10.5"、iPad Pro 9.7"、iPad Pro 12.9" 第六代、iPad Pro 12.9" 第五代、iPad Pro 12.9" 第四代、iPad Pro 12.9" 第三代
- 容量擴充（12）：iPad 11、iPad mini 7、iPad mini 4、iPad Air 7 (13吋)、iPad Air 3、iPad Air 2、iPad Pro 11"、iPad Pro 10.5"、iPad Pro 9.7"、iPad Pro 12.9" 第三代、iPad Pro 12.9" 第二代、iPad Pro 12.9" 第一代
- Touch Bar（8）：A2991、A2918／A2992、A2485／A2780、A2442／A2779、A1708（無Touch Bar）、A1502、A1398、A3240
- 電源板（2）：A2439、A2438
- 無線網卡（5）：A2439、A2438、A2115、A1419、A1418
- 風扇（5）：A2439、A2438、A2115、A1419、A1418

### Samsung（22）
- 背蓋（4）：J7 PRO（J730）、J7 Prime（G610）、J6+（J610）、J4+（J415）
- 後鏡頭 前鏡頭（18）：X200/X205、X210/X216、X510/X516、X610/X616、X700、P200、P610/P615、P620/P625、T295、T385、T500/T505、T510/T515、T590/T595、T720/T725、T825/T820、T830/T835、T860、T870

### ASUS（6）
- 後鏡頭 前鏡頭（2）：ROG 9、ROG 9 PRO
- 背蓋（4）：Zenfone 11 Ultra、Zenfone 3 Zoom（ZE553KL）、Zenfone Max M2（ZB633KL）、Zenfone Max Pro（ZB602KL）

### OPPO（15）
- 電池（3）：FindN2、FindN3、FindN3Flip
- 充電 耳機孔 震動（3）：FindN2、FindN3、FindN3Flip
- 聽筒 麥克風 響鈴（3）：FindN2、FindN3、FindN3Flip
- 後鏡頭 前鏡頭（3）：FindN2、FindN3、FindN3Flip
- 開機鍵 音量鍵（3）：FindN2、FindN3、FindN3Flip

### realme（16）
- 後鏡頭 前鏡頭（16）：8、9I/10/10T、Narzo 50、9 pro、C21、C25、C33、C35、C51、C61/C63、GT/GT大師版、GT2 Pro、GT6、GT NEO2、GT NEO3T、X3/X50

### MOTOROLA（24）
- 聽筒 麥克風 響鈴（6）：Razr40、Razr40Ultra、Razr50、Razr50Ultra、Razr60、Razr60Ultra
- 後鏡頭 前鏡頭（6）：Razr40、Razr40Ultra、Razr50、Razr50Ultra、Razr60、Razr60Ultra
- 開機鍵 音量鍵（6）：Razr40、Razr40Ultra、Razr50、Razr50Ultra、Razr60、Razr60Ultra
- 機板試修 CPU另報（6）：Razr40、Razr40Ultra、Razr50、Razr50Ultra、Razr60、Razr60Ultra

### Nintendo（9）
- 磨菇頭（2）：Switch OLED版、Switch
- 螢幕維修（2）：joy-con、Switch Pro 手把
- 充電孔／滑軌充電排線（2）：joy-con、Switch Pro 手把
- 卡槽故障（2）：joy-con、Switch Pro 手把
- 電池（1）：Switch Pro 手把

## 已核准並套用
- Sony / X1IV（XQ-CT72） / 螢幕維修: 站內 6,500 → 7,100；已由使用者核准並納入報價版本 `2026-07-29.1`。

## 上修項目
- Samsung / Note 20 ultra N9860 / 螢幕破裂: Cerphone 6,800 | 站內 5500（+1,300）
- Samsung / S24（S9210） / 螢幕破裂: Cerphone 4,500 | 站內 4000（+500）
- Samsung / S23（S9110） / 螢幕破裂: Cerphone 5,200 | 站內 4200（+1,000）
- Samsung / S23+（S9160） / 螢幕破裂: Cerphone 4,600 | 站內 4000（+600）
- Samsung / S23U（S9180） / 螢幕破裂: Cerphone 7,800 | 站內 7500（+300）
- Sony / X10IV（XQ-CC72） / 螢幕維修: Cerphone 4,000 | 站內 3800（+200）

## 下調項目
- Google / Pixel 4 / 螢幕維修: Cerphone 2,200 | 站內 2300（-100）
- Google / Pixel 4 XL / 螢幕維修: Cerphone 2,500 | 站內 2800（-300）
- Google / Pixel 5A / 螢幕維修: Cerphone 3,500 | 站內 4800（-1,300）
- Google / Pixel 6 / 螢幕維修: Cerphone 3,300 | 站內 3500（-200）
- Google / Pixel 6A / 螢幕維修: Cerphone 3,700 | 站內 4000（-300）
- Google / Pixel 9 pro / 螢幕維修: Cerphone 3,200 | 站內 3800（-600）
- Google / Pixel 10 pro XL / 螢幕維修: Cerphone 5,400 | 站內 5800（-400）
- Sony / X1（J9110） / 螢幕維修: Cerphone 2,000 | 站內 2300（-300）
- Sony / X5III（XQ-BQ72） / 螢幕維修: Cerphone 5,100 | 站內 5300（-200）
- Sony / X5IV（XQ-CQ72） / 螢幕維修: Cerphone 5,700 | 站內 6500（-800）
- Sony / X10II（XQ-AU52） / 螢幕維修: Cerphone 3,000 | 站內 3200（-200）
- OPPO / RENO 2 / 螢幕維修: Cerphone 2,100 | 站內 2300（-200）
- OPPO / RENO 2Z / 螢幕維修: Cerphone 3,200 | 站內 3500（-300）
- OPPO / RENO Z / 螢幕維修: Cerphone 1,800 | 站內 2000（-200）
- OPPO / RENO 10倍 / 螢幕維修: Cerphone 3,200 | 站內 3600（-400）
- OPPO / RENO 4 / 螢幕維修: Cerphone 2,200 | 站內 2600（-400）
- OPPO / RENO 5 Pro / 螢幕維修: Cerphone 3,000 | 站內 3300（-300）
- OPPO / RENO 6Z / 螢幕維修: Cerphone 2,500 | 站內 2800（-300）
- OPPO / RENO 6 Pro / 螢幕維修: Cerphone 3,000 | 站內 3300（-300）
- OPPO / RENO 7 SE／RENO 7 5G / 螢幕維修: Cerphone 3,000 | 站內 3200（-200）
- OPPO / RENO 8 / 螢幕維修: Cerphone 3,000 | 站內 3300（-300）
- OPPO / Reno11 (5G)/ Reno11pro / 螢幕維修: Cerphone 2,500 | 站內 2700（-200）
- OPPO / Reno11F (5G) / 螢幕維修: Cerphone 2,300 | 站內 2500（-200）
- OPPO / Reno 13 pro(5G) / 螢幕維修: Cerphone 2,300 | 站內 2500（-200）
- OPPO / Reno 13(5G) / 螢幕維修: Cerphone 2,300 | 站內 2500（-200）
- OPPO / Reno14(5G) / 螢幕維修: Cerphone 2,300 | 站內 2500（-200）
- OPPO / Reno14F(5G) / 螢幕維修: Cerphone 3,000 | 站內 3200（-200）
- OPPO / Reno14Pro(5G) / 螢幕維修: Cerphone 2,800 | 站內 3200（-400）

## 新增項目
- Google / Pixel 10A / 螢幕維修: Cerphone 4,700 | 站內未找到對應
- Google / Pixel 10A / 電池: Cerphone 1,500 | 站內未找到對應
- Google / Pixel 10A / 充電 耳機孔 震動: Cerphone 1,500 | 站內未找到對應
- Google / Pixel 10A / 聽筒 麥克風 響鈴: Cerphone 1,500 | 站內未找到對應
- Google / Pixel 10A / 後鏡頭 前鏡頭: Cerphone 2,000 | 站內未找到對應
- Google / Pixel 10A / 開機鍵 音量鍵: Cerphone 1,200 | 站內未找到對應
- Google / Pixel 10A / 機板試修 CPU另報: Cerphone 3,000 | 站內未找到對應
- OPPO / Reno 15(5G) / 螢幕維修: Cerphone 2,000 | 站內未找到對應
- OPPO / Reno 15(5G) / 電池: Cerphone 1,000 | 站內未找到對應
- OPPO / Reno 15(5G) / 充電 耳機孔 震動: Cerphone 1,000 | 站內未找到對應
- OPPO / Reno 15(5G) / 聽筒 麥克風 響鈴: Cerphone 1,000 | 站內未找到對應
- OPPO / Reno 15(5G) / 後鏡頭 前鏡頭: Cerphone 1,000 | 站內未找到對應
- OPPO / Reno 15(5G) / 開機鍵 音量鍵: Cerphone 1,000 | 站內未找到對應
- OPPO / Reno 15(5G) / 機板試修 CPU另報: Cerphone 2,500 | 站內未找到對應
- OPPO / Reno 15F(5G) / 螢幕維修: Cerphone 2,300 | 站內未找到對應
- OPPO / Reno 15F(5G) / 電池: Cerphone 1,000 | 站內未找到對應
- OPPO / Reno 15F(5G) / 充電 耳機孔 震動: Cerphone 1,000 | 站內未找到對應
- OPPO / Reno 15F(5G) / 聽筒 麥克風 響鈴: Cerphone 1,000 | 站內未找到對應
- OPPO / Reno 15F(5G) / 後鏡頭 前鏡頭: Cerphone 1,000 | 站內未找到對應
- OPPO / Reno 15F(5G) / 開機鍵 音量鍵: Cerphone 1,000 | 站內未找到對應
- OPPO / Reno 15F(5G) / 機板試修 CPU另報: Cerphone 2,500 | 站內未找到對應
- OPPO / Reno 15Pro(5G) / 螢幕維修: Cerphone 4,200 | 站內未找到對應
- OPPO / Reno 15Pro(5G) / 電池: Cerphone 1,000 | 站內未找到對應
- OPPO / Reno 15Pro(5G) / 充電 耳機孔 震動: Cerphone 1,000 | 站內未找到對應
- OPPO / Reno 15Pro(5G) / 聽筒 麥克風 響鈴: Cerphone 1,000 | 站內未找到對應
- OPPO / Reno 15Pro(5G) / 後鏡頭 前鏡頭: Cerphone 1,000 | 站內未找到對應
- OPPO / Reno 15Pro(5G) / 開機鍵 音量鍵: Cerphone 1,000 | 站內未找到對應
- OPPO / Reno 15Pro(5G) / 機板試修 CPU另報: Cerphone 2,500 | 站內未找到對應
- OPPO / Reno 15Pro max(5G) / 螢幕維修: Cerphone 4,200 | 站內未找到對應
- OPPO / Reno 15Pro max(5G) / 電池: Cerphone 1,000 | 站內未找到對應
- OPPO / Reno 15Pro max(5G) / 充電 耳機孔 震動: Cerphone 1,000 | 站內未找到對應
- OPPO / Reno 15Pro max(5G) / 聽筒 麥克風 響鈴: Cerphone 1,000 | 站內未找到對應
- OPPO / Reno 15Pro max(5G) / 後鏡頭 前鏡頭: Cerphone 1,000 | 站內未找到對應
- OPPO / Reno 15Pro max(5G) / 開機鍵 音量鍵: Cerphone 1,000 | 站內未找到對應
- OPPO / Reno 15Pro max(5G) / 機板試修 CPU另報: Cerphone 2,500 | 站內未找到對應

## Cerphone 未列出（站內保留，不代表停修）
- Google / Pixel 3 / 螢幕維修: 站內 2200 | Cerphone 快照未對上
- Google / Pixel 3 / 電池: 站內 1000 | Cerphone 快照未對上
- Google / Pixel 3 / 充電 / 耳機孔 / 震動: 站內 1000 | Cerphone 快照未對上
- Google / Pixel 3 / 聽筒 / 麥克風 / 響鈴: 站內 1000 | Cerphone 快照未對上
- Google / Pixel 3 / 後鏡頭 / 前鏡頭: 站內 1200 | Cerphone 快照未對上
- Google / Pixel 3 / 開機鍵 / 音量鍵: 站內 1000 | Cerphone 快照未對上
- Google / Pixel 3 / 機板試修 / CPU另報: 站內 2500 | Cerphone 快照未對上
- Google / Pixel 3 XL / 螢幕維修: 站內 2500 | Cerphone 快照未對上
- Google / Pixel 3 XL / 電池: 站內 1000 | Cerphone 快照未對上
- Google / Pixel 3 XL / 充電 / 耳機孔 / 震動: 站內 1000 | Cerphone 快照未對上
- Google / Pixel 3 XL / 聽筒 / 麥克風 / 響鈴: 站內 1000 | Cerphone 快照未對上
- Google / Pixel 3 XL / 後鏡頭 / 前鏡頭: 站內 1200 | Cerphone 快照未對上
- Google / Pixel 3 XL / 開機鍵 / 音量鍵: 站內 1000 | Cerphone 快照未對上
- Google / Pixel 3 XL / 機板試修 / CPU另報: 站內 2500 | Cerphone 快照未對上
- Google / Pixel 3A / 螢幕維修: 站內 2200 | Cerphone 快照未對上
- Google / Pixel 3A / 電池: 站內 1000 | Cerphone 快照未對上
- Google / Pixel 3A / 充電 / 耳機孔 / 震動: 站內 1000 | Cerphone 快照未對上
- Google / Pixel 3A / 聽筒 / 麥克風 / 響鈴: 站內 1000 | Cerphone 快照未對上
- Google / Pixel 3A / 後鏡頭 / 前鏡頭: 站內 1200 | Cerphone 快照未對上
- Google / Pixel 3A / 開機鍵 / 音量鍵: 站內 1000 | Cerphone 快照未對上
- Google / Pixel 3A / 機板試修 / CPU另報: 站內 2500 | Cerphone 快照未對上
- Google / Pixel 3A XL / 螢幕維修: 站內 2500 | Cerphone 快照未對上
- Google / Pixel 3A XL / 電池: 站內 1000 | Cerphone 快照未對上
- Google / Pixel 3A XL / 充電 / 耳機孔 / 震動: 站內 1000 | Cerphone 快照未對上
- Google / Pixel 3A XL / 聽筒 / 麥克風 / 響鈴: 站內 1000 | Cerphone 快照未對上
- Google / Pixel 3A XL / 後鏡頭 / 前鏡頭: 站內 1200 | Cerphone 快照未對上
- Google / Pixel 3A XL / 開機鍵 / 音量鍵: 站內 1000 | Cerphone 快照未對上
- Google / Pixel 3A XL / 機板試修 / CPU另報: 站內 2500 | Cerphone 快照未對上
- Sony / XA2U（H4233） / 螢幕維修: 站內 2000 | Cerphone 快照未對上
- Sony / XA2U（H4233） / 電池: 站內 1000 | Cerphone 快照未對上
- Sony / XA2U（H4233） / 背蓋: 站內 800 | Cerphone 快照未對上
- Sony / XA2U（H4233） / 充電 / 耳機孔 / 震動: 站內 1000 | Cerphone 快照未對上
- Sony / XA2U（H4233） / 聽筒 / 麥克風 / 響鈴: 站內 1000 | Cerphone 快照未對上
- Sony / XA2U（H4233） / 後鏡頭 / 前鏡頭: 站內 1000 | Cerphone 快照未對上
- Sony / XA2U（H4233） / 開機鍵 / 音量鍵: 站內 1000 | Cerphone 快照未對上
- Sony / XA2U（H4233） / 機板試修 / CPU另報: 站內 2000 | Cerphone 快照未對上
- Sony / XZ1（G8341） / 螢幕維修: 站內 1600 | Cerphone 快照未對上
- Sony / XZ1（G8341） / 電池: 站內 1000 | Cerphone 快照未對上
- Sony / XZ1（G8341） / 背蓋: 站內 1500 | Cerphone 快照未對上
- Sony / XZ1（G8341） / 充電 / 耳機孔 / 震動: 站內 1000 | Cerphone 快照未對上
- Sony / XZ1（G8341） / 聽筒 / 麥克風 / 響鈴: 站內 1000 | Cerphone 快照未對上
- Sony / XZ1（G8341） / 後鏡頭 / 前鏡頭: 站內 1000 | Cerphone 快照未對上
- Sony / XZ1（G8341） / 開機鍵 / 音量鍵: 站內 1000 | Cerphone 快照未對上
- Sony / XZ1（G8341） / 機板試修 / CPU另報: 站內 1500 | Cerphone 快照未對上
- Sony / XZ2P（H8166） / 螢幕維修: 站內 2500 | Cerphone 快照未對上
- Sony / XZ2P（H8166） / 電池: 站內 1000 | Cerphone 快照未對上
- Sony / XZ2P（H8166） / 背蓋: 站內 1500 | Cerphone 快照未對上
- Sony / XZ2P（H8166） / 充電 / 耳機孔 / 震動: 站內 1000 | Cerphone 快照未對上
- Sony / XZ2P（H8166） / 聽筒 / 麥克風 / 響鈴: 站內 1000 | Cerphone 快照未對上
- Sony / XZ2P（H8166） / 後鏡頭 / 前鏡頭: 站內 1200 | Cerphone 快照未對上
- Sony / XZ2P（H8166） / 開機鍵 / 音量鍵: 站內 1000 | Cerphone 快照未對上
- Sony / XZ2P（H8166） / 機板試修 / CPU另報: 站內 2000 | Cerphone 快照未對上
- Sony / XZ2（H8296） / 螢幕維修: 站內 1600 | Cerphone 快照未對上
- Sony / XZ2（H8296） / 電池: 站內 1000 | Cerphone 快照未對上
- Sony / XZ2（H8296） / 背蓋: 站內 1500 | Cerphone 快照未對上
- Sony / XZ2（H8296） / 充電 / 耳機孔 / 震動: 站內 1000 | Cerphone 快照未對上
- Sony / XZ2（H8296） / 聽筒 / 麥克風 / 響鈴: 站內 1000 | Cerphone 快照未對上
- Sony / XZ2（H8296） / 後鏡頭 / 前鏡頭: 站內 1000 | Cerphone 快照未對上
- Sony / XZ2（H8296） / 開機鍵 / 音量鍵: 站內 1000 | Cerphone 快照未對上
- Sony / XZ2（H8296） / 機板試修 / CPU另報: 站內 2000 | Cerphone 快照未對上
- Sony / XZS（G8232） / 螢幕維修: 站內 1600 | Cerphone 快照未對上
- Sony / XZS（G8232） / 電池: 站內 1000 | Cerphone 快照未對上
- Sony / XZS（G8232） / 背蓋: 站內 1500 | Cerphone 快照未對上
- Sony / XZS（G8232） / 充電 / 耳機孔 / 震動: 站內 1000 | Cerphone 快照未對上
- Sony / XZS（G8232） / 聽筒 / 麥克風 / 響鈴: 站內 1000 | Cerphone 快照未對上
- Sony / XZS（G8232） / 後鏡頭 / 前鏡頭: 站內 1000 | Cerphone 快照未對上
- Sony / XZS（G8232） / 開機鍵 / 音量鍵: 站內 1000 | Cerphone 快照未對上
- Sony / XZS（G8232） / 機板試修 / CPU另報: 站內 1500 | Cerphone 快照未對上

## 需要人工確認的項目
- Apple / iPhone 17 Pro Max / 前鏡頭／後鏡頭: Cerphone 3500／2800 | 站內 3500／2800；複合/文字價格，顯示值相同
- Apple / iPhone 17 Pro Max / 容量擴充: Cerphone 4000(256)/5000(512)/8000(1T) | 站內 4000(256)/5000(512)/8000(1T)；複合/文字價格，顯示值相同
- Apple / iPhone 17 Pro / 前鏡頭／後鏡頭: Cerphone 3500／2800 | 站內 3500／2800；複合/文字價格，顯示值相同
- Apple / iPhone 17 Pro / 容量擴充: Cerphone 4000(256)/5000(512)/8000(1T) | 站內 4000(256)/5000(512)/8000(1T)；複合/文字價格，顯示值相同
- Apple / iPhone 17 / 前鏡頭／後鏡頭: Cerphone 3500／2500 | 站內 3500／2500；複合/文字價格，顯示值相同
- Apple / iPhone 17 / 容量擴充: Cerphone 4000(256)/5000(512) | 站內 4000(256)/5000(512)；複合/文字價格，顯示值相同
- Apple / iPhone Air / 前鏡頭／後鏡頭: Cerphone 3500／2800 | 站內 3500／2800；複合/文字價格，顯示值相同
- Apple / iPhone Air / 容量擴充: Cerphone 4000(256)/5000(512) | 站內 4000(256)/5000(512)；複合/文字價格，顯示值相同
- Apple / iPhone 16 Pro Max / 前鏡頭／後鏡頭: Cerphone 3500／2500 | 站內 3500／2500；複合/文字價格，顯示值相同
- Apple / iPhone 16 Pro Max / 容量擴充: Cerphone 4000(256)/5000(512)/8000(1T) | 站內 4000(256)/5000(512)/8000(1T)；複合/文字價格，顯示值相同
- Apple / iPhone 16 Pro / 前鏡頭／後鏡頭: Cerphone 3500／2500 | 站內 3500／2500；複合/文字價格，顯示值相同
- Apple / iPhone 16 Pro / 容量擴充: Cerphone 4000(256)/5000(512)/8000(1T) | 站內 4000(256)/5000(512)/8000(1T)；複合/文字價格，顯示值相同
- Apple / iPhone 16 Plus / 前鏡頭／後鏡頭: Cerphone 3500／2600 | 站內 3500／2600；複合/文字價格，顯示值相同
- Apple / iPhone 16 Plus / 容量擴充: Cerphone 4000(256)/5000(512) | 站內 4000(256)/5000(512)；複合/文字價格，顯示值相同
- Apple / iPhone 16 / 前鏡頭／後鏡頭: Cerphone 3500／2200 | 站內 3500／2200；複合/文字價格，顯示值相同
- Apple / iPhone 16 / 容量擴充: Cerphone 4000(256)/5000(512) | 站內 4000(256)/5000(512)；複合/文字價格，顯示值相同
- Apple / iPhone 16e / 前鏡頭／後鏡頭: Cerphone 3500／2300 | 站內 3500／2300；複合/文字價格，顯示值相同
- Apple / iPhone 16e / 容量擴充: Cerphone 4000(256)/5000(512)/8000(1T) | 站內 4000(256)/5000(512)/8000(1T)；複合/文字價格，顯示值相同
- Apple / iPhone 15 Pro Max / 前鏡頭／後鏡頭: Cerphone 3500／2500 | 站內 3500／2500；複合/文字價格，顯示值相同
- Apple / iPhone 15 Pro Max / 容量擴充: Cerphone 4000(256)/5000(512)/8000(1T) | 站內 4000(256)/5000(512)/8000(1T)；複合/文字價格，顯示值相同
- Apple / iPhone 15 Pro / 前鏡頭／後鏡頭: Cerphone 3500／2500 | 站內 3500／2500；複合/文字價格，顯示值相同
- Apple / iPhone 15 Pro / 容量擴充: Cerphone 4000(256)/5000(512)/8000(1T) | 站內 4000(256)/5000(512)/8000(1T)；複合/文字價格，顯示值相同
- Apple / iPhone 15 Plus / 前鏡頭／後鏡頭: Cerphone 3500／1800 | 站內 3500／1800；複合/文字價格，顯示值相同
- Apple / iPhone 15 Plus / 容量擴充: Cerphone 4000(256)/5000(512) | 站內 4000(256)/5000(512)；複合/文字價格，顯示值相同
- Apple / iPhone 15 / 前鏡頭／後鏡頭: Cerphone 3500／1800 | 站內 3500／1800；複合/文字價格，顯示值相同
- Apple / iPhone 15 / 容量擴充: Cerphone 4000(256)/5000(512) | 站內 4000(256)/5000(512)；複合/文字價格，顯示值相同
- Apple / iPhone 14 Pro Max / 前鏡頭／後鏡頭: Cerphone 3500 / 2300 | 站內 3500 / 2300；複合/文字價格，顯示值相同
- Apple / iPhone 14 Pro Max / 容量擴充: Cerphone 4000(256)/5000(512)/8000(1T) | 站內 4000(256)/5000(512)/8000(1T)；複合/文字價格，顯示值相同
- Apple / iPhone 14 Pro / 前鏡頭／後鏡頭: Cerphone 3500／2500 | 站內 3500／2500；複合/文字價格，顯示值相同
- Apple / iPhone 14 Pro / 容量擴充: Cerphone 4000(256)/5000(512)/8000(1T) | 站內 4000(256)/5000(512)/8000(1T)；複合/文字價格，顯示值相同
- Apple / iPhone 14 Plus / 前鏡頭／後鏡頭: Cerphone 3500／1800 | 站內 3500／1800；複合/文字價格，顯示值相同
- Apple / iPhone 14 Plus / 容量擴充: Cerphone 4000(256)/5000(512) | 站內 4000(256)/5000(512)；複合/文字價格，顯示值相同
- Apple / iPhone 14 / 前鏡頭／後鏡頭: Cerphone 3500／1800 | 站內 3500／1800；複合/文字價格，顯示值相同
- Apple / iPhone 14 / 容量擴充: Cerphone 4000(256)/5000(512) | 站內 4000(256)/5000(512)；複合/文字價格，顯示值相同
- Apple / iPhone 13 Pro Max / 前鏡頭／後鏡頭: Cerphone 2000／2500 | 站內 2000／2500；複合/文字價格，顯示值相同
- Apple / iPhone 13 Pro Max / 容量擴充: Cerphone 4000(256)/4500(512) | 站內 4000(256)/4500(512)；複合/文字價格，顯示值相同
- Apple / iPhone 13 Pro / 前鏡頭／後鏡頭: Cerphone 2000／2500 | 站內 2000／2500；複合/文字價格，顯示值相同
- Apple / iPhone 13 Pro / 容量擴充: Cerphone 4000(256)/4500(512) | 站內 4000(256)/4500(512)；複合/文字價格，顯示值相同
- Apple / iPhone 13 / 前鏡頭／後鏡頭: Cerphone 2000／1300 | 站內 2000／1300；複合/文字價格，顯示值相同
- Apple / iPhone 13 / 容量擴充: Cerphone 4000(256)/4500(512) | 站內 4000(256)/4500(512)；複合/文字價格，顯示值相同
- Apple / iPhone 13 Mini / 前鏡頭／後鏡頭: Cerphone 2000／1300 | 站內 2000／1300；複合/文字價格，顯示值相同
- Apple / iPhone 13 Mini / 容量擴充: Cerphone 4000(256)/4500(512) | 站內 4000(256)/4500(512)；複合/文字價格，顯示值相同
- Apple / iPhone 12 Pro Max / 前鏡頭／後鏡頭: Cerphone 2000／2800 | 站內 2000／2800；複合/文字價格，顯示值相同
- Apple / iPhone 12 Pro Max / 容量擴充: Cerphone 3500(256)/4000(512) | 站內 3500(256)/4000(512)；複合/文字價格，顯示值相同
- Apple / iPhone 12 Pro / 前鏡頭／後鏡頭: Cerphone 2000／2500 | 站內 2000／2500；複合/文字價格，顯示值相同
- Apple / iPhone 12 Pro / 容量擴充: Cerphone 3500(256)/4000(512) | 站內 3500(256)/4000(512)；複合/文字價格，顯示值相同
- Apple / iPhone 12 / 前鏡頭／後鏡頭: Cerphone 2000／1600 | 站內 2000／1600；複合/文字價格，顯示值相同
- Apple / iPhone 12 / 容量擴充: Cerphone 3500(256) | 站內 3500(256)；複合/文字價格，顯示值相同
- Apple / iPhone 12 Mini / 前鏡頭／後鏡頭: Cerphone 2000／1500 | 站內 2000／1500；複合/文字價格，顯示值相同
- Apple / iPhone 12 Mini / 容量擴充: Cerphone 3500(256) | 站內 3500(256)；複合/文字價格，顯示值相同
- Apple / iPhone 11 Pro Max / 前鏡頭／後鏡頭: Cerphone 1500／1500 | 站內 1500／1500；複合/文字價格，顯示值相同
- Apple / iPhone 11 Pro Max / 容量擴充: Cerphone 3500(256)/4500(512) | 站內 3500(256)/4500(512)；複合/文字價格，顯示值相同
- Apple / iPhone 11 Pro / 前鏡頭／後鏡頭: Cerphone 1500／1500 | 站內 1500／1500；複合/文字價格，顯示值相同
- Apple / iPhone 11 Pro / 容量擴充: Cerphone 3500(256)/4500(512) | 站內 3500(256)/4500(512)；複合/文字價格，顯示值相同
- Apple / iPhone 11 / 前鏡頭／後鏡頭: Cerphone 1500／1200 | 站內 1500／1200；複合/文字價格，顯示值相同
- Apple / iPhone 11 / 容量擴充: Cerphone 3500(256)/4500(512) | 站內 3500(256)/4500(512)；複合/文字價格，顯示值相同
- Apple / iPhone XS Max / 前鏡頭／後鏡頭: Cerphone 2000／1200 | 站內 2000／1200；複合/文字價格，顯示值相同
- Apple / iPhone XS Max / 容量擴充: Cerphone 3000(256)/3500(512) | 站內 3000(256)/3500(512)；複合/文字價格，顯示值相同
- Apple / iPhone XS / 前鏡頭／後鏡頭: Cerphone 2000／1200 | 站內 2000／1200；複合/文字價格，顯示值相同
- Apple / iPhone XS / 容量擴充: Cerphone 3000(256)/3500(512) | 站內 3000(256)/3500(512)；複合/文字價格，顯示值相同
- Apple / iPhone XR / 前鏡頭／後鏡頭: Cerphone 1500／1200 | 站內 1500／1200；複合/文字價格，顯示值相同
- Apple / iPhone XR / 容量擴充: Cerphone 3000(256)/4000(512) | 站內 3000(256)/4000(512)；複合/文字價格，顯示值相同
- Apple / iPhone X / 前鏡頭／後鏡頭: Cerphone 1500／1200 | 站內 1500／1200；複合/文字價格，顯示值相同
- Apple / iPhone X / 容量擴充: Cerphone 3000(256) | 站內 3000(256)；複合/文字價格，顯示值相同
- Apple / iPhone SE2 SE3 / 前鏡頭/後鏡頭: Cerphone 1000/1200 | 站內 1000/1200；複合/文字價格，顯示值相同
- Apple / iPhone SE2 SE3 / HOME鍵: Cerphone 2000 保有指紋 | 站內 2000 保有指紋；複合/文字價格，顯示值相同
- Apple / iPhone SE2 SE3 / 容量擴充: Cerphone 2500(256) | 站內 2500(256)；複合/文字價格，顯示值相同
- Apple / iPhone 8 Plus / 前鏡頭/後鏡頭: Cerphone 1000/1200 | 站內 1000/1200；複合/文字價格，顯示值相同
- Apple / iPhone 8 Plus / HOME鍵: Cerphone 2000 保有指紋 | 站內 2000 保有指紋；複合/文字價格，顯示值相同
- Apple / iPhone 8 Plus / 容量擴充: Cerphone 2500(256) | 站內 2500(256)；複合/文字價格，顯示值相同
- Apple / iPhone 8 / 前鏡頭/後鏡頭: Cerphone 1000/1200 | 站內 1000/1200；複合/文字價格，顯示值相同
- Apple / iPhone 8 / HOME鍵: Cerphone 2000 保有指紋 | 站內 2000 保有指紋；複合/文字價格，顯示值相同
- Apple / iPhone 8 / 容量擴充: Cerphone 2500(256) | 站內 2500(256)；複合/文字價格，顯示值相同
- Apple / iPhone 7 Plus / 前鏡頭/後鏡頭: Cerphone 1000/1200 | 站內 1000/1200；複合/文字價格，顯示值相同
- Apple / iPhone 7 Plus / HOME鍵: Cerphone 1500 保有指紋 | 站內 1500 保有指紋；複合/文字價格，顯示值相同
- Apple / iPhone 7 Plus / 容量擴充: Cerphone 2500(128)/3000(256) | 站內 2500(128)/3000(256)；複合/文字價格，顯示值相同
- Apple / iPhone 7 / HOME鍵: Cerphone 1500 保有指紋 | 站內 1500 保有指紋；複合/文字價格，顯示值相同
- Apple / iPhone 7 / 容量擴充: Cerphone 2500(128)3000(256) | 站內 2500(128)3000(256)；複合/文字價格，顯示值相同
- Apple / iPhone 6 SP / HOME鍵: Cerphone 1500 保有指紋 | 站內 1500 保有指紋；複合/文字價格，顯示值相同
- Apple / iPhone 6 SP / 容量擴充: Cerphone 2500(128)/3000(256) | 站內 2500(128)/3000(256)；複合/文字價格，顯示值相同
- Apple / iPhone 6 S / HOME鍵: Cerphone 1500 保有指紋 | 站內 1500 保有指紋；複合/文字價格，顯示值相同
- Apple / iPhone 6 S / 容量擴充: Cerphone 2500(128)/3000(256) | 站內 2500(128)/3000(256)；複合/文字價格，顯示值相同
- Apple / iPhone 6 P / HOME鍵: Cerphone 1500 保有指紋 | 站內 1500 保有指紋；複合/文字價格，顯示值相同
- Apple / iPhone 6 P / 容量擴充: Cerphone 2500(128) | 站內 2500(128)；複合/文字價格，顯示值相同
- Apple / iPhone 6 / HOME鍵: Cerphone 1500 保有指紋 | 站內 1500 保有指紋；複合/文字價格，顯示值相同
- Apple / iPhone 6 / 容量擴充: Cerphone 2500(128) | 站內 2500(128)；複合/文字價格，顯示值相同
- Apple / iPad 10 / 容量擴充: Cerphone 3000(256)/3500(512) | 站內 3000(256)/3500(512)；複合/文字價格，顯示值相同
- Apple / iPad 9 / 容量擴充: Cerphone 3000(256) | 站內 3000(256)；複合/文字價格，顯示值相同
- Apple / iPad 8 / 容量擴充: Cerphone 3000(256) | 站內 3000(256)；複合/文字價格，顯示值相同
- Apple / iPad 7 / 容量擴充: Cerphone 3000(256) | 站內 3000(256)；複合/文字價格，顯示值相同
- Apple / iPad 6 / 容量擴充: Cerphone 3000(256) | 站內 3000(256)；複合/文字價格，顯示值相同
- Apple / iPad mini 6 / 容量擴充: Cerphone 3500(256)/4000(512) | 站內 3500(256)/4000(512)；複合/文字價格，顯示值相同
- Apple / iPad mini 5 / 容量擴充: Cerphone 3000(256)/3500(512) | 站內 3000(256)/3500(512)；複合/文字價格，顯示值相同
- Apple / iPad Air 7 (11吋) / 容量擴充: Cerphone 3500(256)/4000(512)/7000(1TB) | 站內 3500(256)/4000(512)/7000(1TB)；複合/文字價格，顯示值相同
- Apple / iPad Air 6 (11吋) / 容量擴充: Cerphone 3500(256)/4000(512)/7000(1TB) | 站內 3500(256)/4000(512)/7000(1TB)；複合/文字價格，顯示值相同
- Apple / iPad Air 6 (13吋) / 容量擴充: Cerphone 4000(256)/5000(512)/ | 站內 4000(256)/5000(512)；複合/文字價格，需人工判讀
- Apple / iPad Air 5 / 容量擴充: Cerphone 3500(256)/4000(512) | 站內 3500(256)/4000(512)；複合/文字價格，顯示值相同
- Apple / iPad Air 4 / 容量擴充: Cerphone 3500(256) | 站內 3500(256)；複合/文字價格，顯示值相同
- Apple / iPad Pro 11" 第四代 / 容量擴充: Cerphone 3000(256)/4000(512)/6000(1TB) | 站內 3000(256)/4000(512)/6000(1TB)；複合/文字價格，顯示值相同
- Apple / iPad Pro 11" 第三代 / 容量擴充: Cerphone 3000(256)/4000(512)/6000(1TB) | 站內 3000(256)/4000(512)/6000(1TB)；複合/文字價格，顯示值相同
- Apple / iPad Pro 11" 第二代 / 容量擴充: Cerphone 3000(256)/4000(512)/6000(1TB) | 站內 3000(256)/4000(512)/6000(1TB)；複合/文字價格，顯示值相同
- Apple / iPad Pro 12.9" 第六代 / 容量擴充: Cerphone 4000(256)/5000(512) | 站內 4000(256)/5000(512)；複合/文字價格，顯示值相同
- Apple / iPad Pro 12.9" 第五代 / 容量擴充: Cerphone 3500(256)/4000(512) | 站內 3500(256)/4000(512)；複合/文字價格，顯示值相同
- Apple / iPad Pro 12.9" 第四代 / 容量擴充: Cerphone 3500(256)/4000(512) | 站內 3500(256)/4000(512)；複合/文字價格，顯示值相同
- Samsung / Z Fold 7 (SM-F966) / 內螢幕破裂／總成帶框: Cerphone 14000／22000 | 站內 14000／22000；複合/文字價格，顯示值相同
- Samsung / Z Fold 6（SM-F956） / 內螢幕破裂／總成帶框: Cerphone 15200／17300 | 站內 15200／17300；複合/文字價格，顯示值相同
- Samsung / Z Fold 5（SM-F946） / 內螢幕破裂／總成帶框: Cerphone 11800／17100 | 站內 11800／17100；複合/文字價格，顯示值相同
- Samsung / Z Fold 4（SM-F936） / 內螢幕破裂／總成帶框: Cerphone 9800／17100 | 站內 9800／17100；複合/文字價格，顯示值相同
- Samsung / Z Fold 3（SM-F926） / 內螢幕破裂／總成帶框: Cerphone 7700／17100 | 站內 7700／17100；複合/文字價格，顯示值相同
- Samsung / Z Flip 5（SM-F731） / 內螢幕破裂／總成帶框: Cerphone 7500／9600 | 站內 7500／9600；複合/文字價格，顯示值相同
- Samsung / Z Flip 4（SM-F721） / 內螢幕破裂／總成帶框: Cerphone 7000／9600 | 站內 7000／9600；複合/文字價格，顯示值相同
- Samsung / Z Flip 3（SM-F711） / 內螢幕破裂／總成帶框: Cerphone 5500／9600 | 站內 5500／9600；複合/文字價格，顯示值相同
- Samsung / Note 20 ultra N9860 / 背蓋: Cerphone 1200 副廠 | 站內 1200 副廠；複合/文字價格，顯示值相同
- Samsung / Note 20 ultra N9860 / 後鏡頭／前鏡頭: Cerphone 1800／1200 | 站內 1800／1200；複合/文字價格，顯示值相同
- Samsung / Note 20 N9810 / 背蓋: Cerphone 1200 副廠 | 站內 1200 副廠；複合/文字價格，顯示值相同
- Samsung / Note 20 N9810 / 後鏡頭／前鏡頭: Cerphone 2000／1200 | 站內 2000／1200；複合/文字價格，顯示值相同
- Samsung / Note 10 Lite N770 / 背蓋: Cerphone 1200 副廠 | 站內 1200 副廠；複合/文字價格，顯示值相同
- Samsung / Note 10+ N9750 / 背蓋: Cerphone 1200 副廠 | 站內 1200 副廠；複合/文字價格，顯示值相同
- Samsung / Note 10 N9700 / 背蓋: Cerphone 1200 副廠 | 站內 1200 副廠；複合/文字價格，顯示值相同
- Samsung / Note 9 N960 / 背蓋: Cerphone 1200 副廠 | 站內 1200 副廠；複合/文字價格，顯示值相同
- Samsung / Note 8 N950 / 背蓋: Cerphone 1200 副廠 | 站內 1200 副廠；複合/文字價格，顯示值相同
- Samsung / S23U（S9180） / 後鏡頭／前鏡頭: Cerphone 2200/1500 | 站內 2200/1500；複合/文字價格，顯示值相同
- Samsung / S22U（S9080） / 後鏡頭／前鏡頭: Cerphone 1800／1200 | 站內 1800／1200；複合/文字價格，顯示值相同
- Samsung / S21 Ultra（G998） / 後鏡頭／前鏡頭: Cerphone 1800／1200 | 站內 1800／1200；複合/文字價格，顯示值相同
- Samsung / S20 Ultra（G988） / 後鏡頭／前鏡頭: Cerphone 1600／1200 | 站內 1600／1200；複合/文字價格，顯示值相同
- Samsung / S20+ （G9860） / 後鏡頭／前鏡頭: Cerphone 1500／1200 | 站內 1500／1200；複合/文字價格，顯示值相同
- OPPO / FindN3 / 螢幕維修: Cerphone 京東方8000/三星11000(檢測後告知) | 站內 京東方8000/三星11000(檢測後告知)；複合/文字價格，顯示值相同
- MOTOROLA / Razr40 / 螢幕維修: Cerphone 內5000/外2500 | 站內 內5000/外2500；複合/文字價格，顯示值相同
- MOTOROLA / Razr40Ultra / 螢幕維修: Cerphone 內5500/外3500 | 站內 內5500/外3500；複合/文字價格，顯示值相同
- MOTOROLA / Razr50 / 螢幕維修: Cerphone 內5200/外3500 | 站內 內5200/外3500；複合/文字價格，顯示值相同
- MOTOROLA / Razr50Ultra / 螢幕維修: Cerphone 內5200/外3500 | 站內 內5200/外3500；複合/文字價格，顯示值相同
- MOTOROLA / Razr60 / 螢幕維修: Cerphone 內5200/外3500 | 站內 內5200/外3500；複合/文字價格，顯示值相同
- MOTOROLA / Razr60Ultra / 螢幕維修: Cerphone 內7500/外3500 | 站內 內7500/外3500；複合/文字價格，顯示值相同
- Nintendo / Switch OLED版 / 充電孔／滑軌充電排線: Cerphone 1200／800 | 站內 1200／800；複合/文字價格，顯示值相同
- Nintendo / Switch / 充電孔／滑軌充電排線: Cerphone 1200／800 | 站內 1200／800；複合/文字價格，顯示值相同
- Nintendo / Switch Pro 手把 / 磨菇頭: Cerphone 單邊600 雙邊1000 | 站內 單邊600 雙邊1000；複合/文字價格，顯示值相同
