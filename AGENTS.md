# Project Rules & AI Agent Guidelines

## 1. Workspace 結構與目錄職責（嚴格隔離）
本工作區（Workspace）包含兩個獨立掛載的根目錄，請嚴格遵守各自的讀寫權限：

* **程式碼主專案（`peaceful-evening-project/`）**：【可讀寫】所有網頁程式碼（HTML/CSS/JS）、題庫資料檔、設定檔與文件皆建立或修改於此目錄內。
* **參考資料來源（`PracticeResources/`）**：【絕對唯讀 Read-Only】此目錄僅作為知識庫、單字表、課文或原始規格的資料來源。

### 唯讀保護鐵則
1. **嚴禁寫入**：在任何情況下，**絕對禁止**在 `PracticeResources/` 目錄內新增、修改、重新命名或刪除任何檔案。
2. **純讀取引用**：當需要根據參考資料開發或生成題庫時，僅能讀取 `PracticeResources/` 的內容，並將處理後的產物輸出至 `peaceful-evening-project/` 對應的目錄中（例如 `peaceful-evening-project/data/`）。

---

## 2. 技術棧與前端開發規範
* **架構原則**：採用純前端架構（HTML5 + CSS3 + Vanilla JavaScript ES6+），無需前端建置工具（如 Webpack/Vite），確保可直接部署於 GitHub Pages。
* **路徑規範**：所有資源引用（CSS、JS、圖片、題庫檔案）一律使用**相對路徑**（如 `./js/app.js`、`./data/questions.json`），嚴禁使用 `/` 開頭的根目錄絕對路徑，避免在 GitHub Pages 子路徑下破圖。
* **裝置相容性**：介面設計需優先支援平板觸控（iPad Touch / Apple Pencil）與桌面瀏覽器，按鈕點擊區域（Hit Area）需足夠大且避免依賴 Hover 狀態才能觸發的核心功能。
* **程式碼風格**：
  * 保持模組化，將「題庫資料」與「遊戲邏輯/UI 渲染」分離，不將大量題庫硬編碼（Hardcode）在 HTML 檔案中。
  * 關鍵邏輯與資料結構需保留簡潔明確的註解，方便後續維護。

---

## 3. 題庫生成與資料處理規則
當收到「根據 `PracticeResources/` 生成題庫」的指令時，請依循以下標準作業程序：

### 3.1 資料來源忠實度
* 題目所使用的核心單字、文法句型或知識點，**必須嚴格出自 `PracticeResources/` 中指定的參考檔案**，不隨意引入超出該範圍的冷僻詞彙。
* 若參考檔案為純文字或 CSV，請先解析確認欄位結構後再進行轉換。

### 3.2 題目品質與設計標準
1. **選項設計（選擇題）**：
   * 每題提供 4 個選項（1 個正確答案 + 3 個誘答選項）。
   * 誘答選項（Distractors）必須具備合理性（例如詞性一致、字形相近或常見易混淆概念），避免出現明顯不合邏輯或長度差異過大的選項。
2. **詳解要求**：
   * 每題必須包含清楚的中文解析（`explanation`），說明為何正確答案成立，以及其餘選項錯誤的原因。
3. **隨機性與防作弊**：
   * 生成靜態題庫時，正確答案的位置（A/B/C/D 或 index 0~3）必須均勻分布，不可連續多題集中在同一位置。

### 3.3 標準輸出格式（JSON Schema）
所有生成的題庫檔案，若無特別指定，一律輸出為標準 JSON 格式存放在 `peaceful-evening-project/data/` 下，並遵循以下結構：

```json
[
  {
    "id": "unique-id-001",
    "category": "單元或題型分類",
    "question": "題目內容（若為克漏字請使用 ______ 表示空格）",
    "options": [
      "選項 A",
      "選項 B",
      "選項 C",
      "選項 D"
    ],
    "answerIndex": 0,
    "explanation": "詳細的解題說明與文法/單字提示"
  }
]
```

---

## 4. 跨電腦開發與進度交接規範
為確保在多台電腦之間切換開發與開啟新對話時能無縫銜接上下文，所有協作與 AI Agent 必須遵守以下交接準則：

1. **自動載入與啟動簡報**：
   * 本文件（`peaceful-evening-project/AGENTS.md`）位於專案根目錄，由 Antigravity 於每次對話自動載入。
   * 跨電腦或開新對話想快速掌握專案現況與待辦事項時，可透過 `/start` 指令讀取 `peaceful-evening-project/PROGRESS.md` 取得進度簡報。
2. **主動維護進度交接檔（`PROGRESS.md`）**：
   * 每次完成功能新增或修改、介面／架構調整、Bug 修復，或根據 `PracticeResources/` 生成／擴充題庫後，必須主動更新 `peaceful-evening-project/PROGRESS.md`（亦可於收尾時透過 `/handoff` 執行）。
   * 更新內容應同步反映最新狀態：更新日期與基準資訊、新增或異動的檔案／模組清單、已完成的功能與題庫進度，以及最新的待辦事項與建議（Next Steps）。
3. **版本控制同步原則**：
   * `AGENTS.md`、`.agents/` 與 `PROGRESS.md` 皆須納入 Git 版本控制，嚴禁被 `.gitignore` 排除。
   * 完成階段性變更並更新 `PROGRESS.md` 後，應確認工作區狀態乾淨無誤，以便隨時提交（commit）並推送（push）至 GitHub 進行跨機同步。
