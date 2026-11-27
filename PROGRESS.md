# 專案開發進度交接紀錄（PROGRESS.md）

> **交接說明**：專案規則主檔 [`AGENTS.md`](./AGENTS.md) 位於專案根目錄，會於每次對話由 Antigravity 自動載入；跨電腦或開新對話想快速掌握進度時，可輸入 `/start` 讀取本文件取得簡報；每次修改功能、調整架構或生成／擴充題庫後，請主動（或透過 `/handoff`）更新本文件並同步推送至 GitHub。

## 1. 專案基本資訊
* **專案名稱**：國小親子互動複習遊樂場（`peaceful-evening-project`）
* **最後更新日期**：`2026-11-27`
* **目前 Git 分支**：`main`（基準 Commit：`5cb0fa1`，遠端：`https://github.com/GrayChung/peaceful-evening-project`）
* **技術架構**：純前端架構（HTML5 + Tailwind Play CDN + CSS3 + Vanilla JavaScript ES6+），無需前端建置工具，支援 GitHub Pages 部署與本機離線開啟。

---

## 2. 專案現有檔案與模組清單

### 2.1 設定與專案文件
* [`AGENTS.md`](./AGENTS.md)：自動載入之專案規則主檔（`PracticeResources/` 唯讀保護鐵則、前端與題庫 JSON 規範、跨電腦開發與進度交接規範）。
* [`.agents/skills/start/SKILL.md`](./.agents/skills/start/SKILL.md)：正式 `/` 斜線指令技能檔（`/start`），讀取 `PROGRESS.md` 並簡報目前專案狀態與第一項待辦事項。
* [`.agents/skills/handoff/SKILL.md`](./.agents/skills/handoff/SKILL.md)：正式 `/` 斜線指令技能檔（`/handoff`），依 `AGENTS.md` 交接規範更新 `PROGRESS.md` 並提醒推送。
* [`.gitignore`](./.gitignore)：排除 macOS / Windows 系統暫存檔、編輯器暫存檔與 `node_modules/`；保留 `AGENTS.md`、`.agents/` 與 `PROGRESS.md` 納入版控。
* [`PROGRESS.md`](./PROGRESS.md)：本專案跨電腦開發進度交接紀錄。
* [`LICENSE`](./LICENSE)：專案授權條款。

### 2.2 主大廳與科目網頁（共 8 份 HTML）
* [`index.html`](./index.html)（1,092 行）：全站 2.5D 冒險總島大廳。包含三大分頁（國小學科／雙語英文／劍橋英檢）、3D 主角主題切換、動態貓頭鷹隨機鼓勵、全站進度總覽、卡片預載（`setupCardPrefetch`）與初次指南彈窗（`localStorage`: `playground_guide_hub_v1`、`playground_theme_v1`、`portal_hide_ipad_tip`）。
* [`4a/math.html`](./4a/math.html)（4,088 行）：四上期末考數學冒險島（翰林版第 6～10 單元＋模擬考＋錯題消滅戰）。具備 iPad Apple Pencil 防誤觸計算草稿紙（橡皮擦／15 步復原／加高）、寬螢幕雙欄工作台與動態 SVG 幾何／折線圖表（`localStorage`: `hanlin_math_4a_final_v2`）。
* [`4a/chinese.html`](./4a/chinese.html)（3,409 行）：四上期末考國語文勇者試煉（南一版第 7～12 課 6 關＋模擬考＋錯題消滅戰）。具備第 6 關田字格生字手寫板、手寫題寬螢幕雙欄排版（`localStorage`: `nani_chinese_4a_final_v1`）。
* [`4a/science.html`](./4a/science.html)（2,981 行）：四上期末考自然科學探險營（康軒版第 3～4 單元 5 關＋模擬考＋錯題消滅戰）。具備聲光／電路動態 SVG 實驗圖解與 4-2 電池／燈泡串並聯互動圖（`localStorage`: `knsh_science_4a_final_v1`）。
* [`4a/society.html`](./4a/society.html)（2,692 行）：四上期末考社會探險家（康軒版第 3～4 單元 5 關＋模擬考＋錯題消滅戰）（`localStorage`: `knsh_society_4a_final_v1`）。
* [`4a/en-is.html`](./4a/en-is.html)（2,369 行）：Grade 4 IS Lab 雙語自然實驗室（Ch.7 Properties of Light ＋ 習作 Activity 7A，5 關＋Stage 99 錯題消滅戰）。支援互動式 SVG 光線圖（Ray Diagram）組裝、光線草稿畫板、英文 TTS 語音朗讀與繁體中文提示切換（`localStorage`: `bilingual_is_4a_v1`）。
* [`4a/en-rs.html`](./4a/en-rs.html)（2,380 行）：Grade 4 RS Lab 雙語英文（*The Game of Silence* & Grammar 4.1/4.2/4.4，5 關＋Stage 99 錯題消滅戰）。涵蓋短／長母音 u 聽寫拼字、歷史小說理解、修辭描寫與文法綜合練習（`localStorage`: `bilingual_rs_4a_v1`）。
* [`cambridge/pet.html`](./cambridge/pet.html)（2,692 行）：Cambridge PET (B1) 倫敦特快車（5 大備考關卡＋Stage 99 全真衝刺賽＋錯題特訓營）。支援英／美口音與 `0.85x` / `1.0x` 聽寫語速切換、詞彙拼字與段落句子還原（`localStorage`: `cambridge_pet_v1`）。

> 註：各科目頁另共用初次指南與跨頁主角主題鍵值 `playground_guide_subject_v1` 與 `playground_theme_v1`。

### 2.3 共用樣式與 JS 模組
* [`Styles/common.css`](./Styles/common.css)（178 行）：全站共用基礎排版、立體按鈕 `.btn-3d`、跨頁 `@view-transition`、Anti-FOUC 進場淡入、Toast 輕提示、星星彈出／加分飄字／積分彈跳／怪獸受擊與斬擊動畫，以及 `prefers-reduced-motion` 無障礙支援。
* [`Scripts/sound-engine.js`](./Scripts/sound-engine.js)（82 行）：Web Audio API 音效合成引擎（`SoundEngine`：`click`、`hit`、`correct`、`wrong`、`victory`）與靜音切換（`toggleSound`）。
* [`Scripts/game-effects.js`](./Scripts/game-effects.js)（346 行）：分數滾動與彈跳（`animateScoreTo`）、高對比加分飄字（`spawnFloatingText`）、雙砲彩帶與漫天煙火粒子引擎（`ConfettiEngine`），以及錯題魔王血條／斬擊／反擊動畫（`MonsterBoss`）。

### 2.4 視覺素材（`assets/`，共 13 個檔案）
* **2.5D 微縮浮島／科目地圖（10 張，1376×768 JPEG Q85）**：
  * 大廳三大島嶼：`world-island-school-25d.jpg`、`world-island-bilingual-25d.jpg`、`world-island-english-25d.jpg`
  * 各科目專屬地圖：`math-kingdom-25d.jpg`、`chinese-academy-25d.jpg`、`science-camp-25d.jpg`、`society-heritage-25d.jpg`、`bilingual-is-25d.jpg`、`bilingual-rs-25d.jpg`、`cambridge-pet-25d.jpg`
* **3D 去背主角公仔（3 款 PNG）**：
  * `actor-hero-3d.png`（勇者打怪）、`actor-bakery-3d.png`（甜點做蛋糕）、`actor-garden-3d.png`（花園澆花）

### 2.5 獨立題庫目錄（`data/`）
* 目前尚未建立 `data/` 目錄；現有 7 個科目的題庫資料皆內嵌於各自對應的 HTML 檔案中。

### 2.6 唯讀參考來源（`PracticeResources/`，絕對唯讀・嚴禁寫入）
* `Cambridge/`：`506886-a2-key-2020-vocabulary-list.pdf`、`506887-b1-preliminary-vocabulary-list.pdf`
* `Chinese/L7/`：課本掃描圖檔（`L7_64.jpg` ～ `L7_71.jpg`）
* `English/IS/`：`IS CH7.pdf`、`IS期中考.pdf`、`Activity_Book_7A_pp63-65_KEY.pdf`
* `English/RS/`：`ELA4.pdf`、`Grmmar4.pdf`、`sample/RS期中考.pdf`、`The Game of Silence/`（`p0`～`p8.png`）

---

## 3. 已完成的功能與題庫進度

### 3.1 系統與介面核心功能（截至 `4f26290`）
* **全站 2.5D 立體微縮地圖與主題互動舞台**：大廳與 7 個正式科目頁統一配備 2.5D 地圖背景、雙排狀態列 Header、高對比定錨圓盤節點、下方關卡情報條、快速選關列、作答區 3D 主角互動舞台（跨頁主題同步）與初次指南彈窗。
* **流暢轉場與跨平台優化**：支援原生 `@view-transition`、Anti-FOUC 進場淡入、首頁懸停／觸控卡片預載、PWA 主畫面標籤、SVG Favicon、Enter/Esc 鍵盤快捷操作與 `prefers-reduced-motion`。
* **遊戲化回饋與錯題消滅戰**：全站（國小 4 科、雙語 IS/RS、Cambridge PET）整合 `SoundEngine` 音效、`ConfettiEngine` 彩帶煙火、`MonsterBoss` 雙層殘影 RPG 血條與斬擊反擊動畫，以及 Toast／自訂圓角彈窗（無原生 `alert`/`confirm`）。
* **觸控手寫與寬螢幕排版**：數學草稿板與雙語 IS 光線畫板支援單一 `activePointerId` 防誤觸、手寫筆優先與 DPR 座標補償；數學與國語手寫題於寬螢幕提供雙欄工作台，含 SVG 圖表題目支援左右並排。

### 3.2 各科目題庫與關卡進度總表

| 科目 | 檔案路徑 | 範圍／版本 | 現有題庫規模與關卡配置 |
| :--- | :--- | :--- | :--- |
| 四上數學 | [`4a/math.html`](./4a/math.html) | 翰林版第 6～10 單元 | **37 題型**（動態出題）：第 6～10 單元 5 關＋期末綜合模擬考＋錯題消滅戰 |
| 四上國語 | [`4a/chinese.html`](./4a/chinese.html) | 南一版第 7～12 課 | **101 題**：字音、形近錯別字／一字多義、成語歇後語、修辭句型、文意理解、田字格生字手寫 6 關＋模擬考＋錯題戰（已完整擴充第 7 課〈到此「藝」遊〉含 15 個生字手寫題） |
| 四上自然 | [`4a/science.html`](./4a/science.html) | 康軒版第 3～4 單元 | **45 題型**：聲、光特性、燈泡發亮、電路連接（含串並聯互動圖）、安全用電 5 關＋模擬考＋錯題戰 |
| 四上社會 | [`4a/society.html`](./4a/society.html) | 康軒版第 3～4 單元 | **42 題型**：信仰與生活、老街與生活、生活作息、傳統節慶、現代節日 5 關＋模擬考＋錯題戰 |
| 四上雙語 IS | [`4a/en-is.html`](./4a/en-is.html) | Ch.7 Properties of Light & Activity 7A | **33 題**（選擇／是非 23、拼字 6、互動光線圖 2、句型重組 2）：5 關（滿星 15 星）＋Stage 99 錯題消滅戰 |
| 四上雙語 RS | [`4a/en-rs.html`](./4a/en-rs.html) | *The Game of Silence* & Grammar 4.1/4.2/4.4 | **51 題**（選擇／是非 45、拼字 3、句型重組 3）：5 關（滿星 15 星）＋Stage 99 錯題消滅戰 |
| 劍橋英檢 PET | [`cambridge/pet.html`](./cambridge/pet.html) | Cambridge B1 Preliminary | **5 大關卡＋衝刺賽＋錯題營**：Stage 1 同義替換 6 回合（24 組）、Stage 2 動詞片語克漏字 62 題、Stage 3 開放式文法拼字 14 題、Stage 4 段落句子還原 6 篇、Stage 5 聽力聽寫 10 題 |

---

## 4. 已知待辦事項與架構優化建議（Next Steps）

1. **題庫資料與頁面邏輯抽離（建立 `data/`）**：
   * 目前 7 個科目 HTML 單檔行數介於 2,369 至 4,088 行，題庫與前端邏輯耦合於同檔內。
   * 建議後續新建單元或大量擴充題庫時，依 [AGENTS.md](./AGENTS.md) 第 3.3 節規範逐步抽離至 `data/*.json`；若需保留本機 `file://` 直接雙擊開啟的離線相容性，需留意瀏覽器對 `fetch()` 的 CORS 限制，可評估搭配本機靜態伺服器／GitHub Pages，或以 `data/*.js` 掛載資料的相容方案。
2. **2.5D 地圖與跨科共用 UI 模組化**：
   * `4f26290` 升級後，7 個科目頁皆包含相似的雙排 Header、主題角色同步、作答區互動舞台與初次指南彈窗程式碼。後續可評估將共用 UI 元件邏輯抽離至 `Scripts/`（例如主題與指南管理器），降低跨頁維護成本。
3. **後續新單元與題庫擴充方向**：
   * 可運用 `PracticeResources/Cambridge/506886-a2-key-2020-vocabulary-list.pdf` 規劃劍橋 KET (A2) 互動模組，或持續擴充 PET (B1) 題庫。
   * 依後續學期課表擴充國語其餘課次完整題庫、四上／四下新單元及雙語 IS / RS 新章節，並逐步啟用首頁「籌備中」的入口卡片。
4. **Git 分支清理維護**：
   * 本地尚留有歷史分支 `branch_modifyByAntigravity`（停留在 `3347f4a`，大幅落後目前 `main` 的 `4f26290`），確認無保留需求後可刪除清理。

---

## 5. 跨電腦交接 SOP 速查
1. **換電腦接手時**：先執行 `git pull origin main`；開啟對話後 Antigravity 會自動載入 `AGENTS.md`，如需快速回顧現況與待辦事項可直接輸入 `/start`。
2. **開發或生成題庫後**：主動（或輸入 `/handoff`）更新 `PROGRESS.md` 的進度紀錄、異動清單與更新日期。
3. **結束前同步**：檢查 `git status` 確認未誤觸 `PracticeResources/` 與暫存檔，執行 `git add`、`git commit` 與 `git push origin main`。
