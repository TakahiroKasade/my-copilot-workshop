# 待辦清單 Web App

![工作坊完成徽章](https://img.shields.io/badge/GitHub_Copilot_%E5%AF%A6%E6%88%B0%E5%B7%A5%E4%BD%9C%E5%9D%8A-%E5%B7%B2%E5%AE%8C%E6%88%90-1F883D?style=for-the-badge&logo=githubcopilot&logoColor=white)

這是一個在 GitHub Copilot 實戰工作坊中完成的待辦清單 Web App。專案以純前端技術打造，提供簡潔的待辦管理、主題切換與清單篩選功能，並可直接離線開啟使用。

## 線上展示

https://TakahiroKasade.github.io/my-copilot-workshop/

> 請將上方網址替換成實際的 GitHub Pages 網址。

## 功能

- 新增待辦事項，空白內容不會被加入。
- 勾選或取消勾選待辦事項，完成項目會顯示刪除線並淡化文字。
- 刪除單筆待辦事項。
- 顯示所有待辦事項中的未完成數量。
- 清單沒有項目，或目前篩選結果為空時，顯示對應提示文字。
- 使用 `localStorage` 保存待辦資料，重新整理後仍能保留。
- 在淺色模式與深色模式之間切換。
- 手動選擇的主題會保存至 `localStorage`；沒有手動選擇時，會跟隨作業系統的 `prefers-color-scheme` 設定。
- 依「全部」、「未完成」與「已完成」篩選待辦事項。
- 支援手機螢幕與鍵盤焦點操作。

## 技術

- 使用 HTML 建立頁面結構。
- 使用 CSS 建立卡片式介面、響應式版面與 CSS 變數主題配色。
- 使用原生 JavaScript 處理待辦資料、事件互動、主題切換與篩選功能。
- 不使用任何框架或套件。
- 不使用外部 CDN，可離線運作。
- 使用瀏覽器 `localStorage` 保存待辦資料與主題偏好。

## 開發方式

本專案是在 GitHub Copilot 實戰工作坊中，透過 GitHub Copilot Agent Mode 逐步完成。開發過程從基本待辦功能開始，再加入深色模式、篩選功能與相關專案文件。

專案也設定了 MCP，讓開發流程可以使用 Microsoft Learn 文件與 GitHub 相關工具取得外部資訊。`.github/prompts/fix-issue.prompt.md` 定義了 agentic workflow，將讀取 Issue、提出修改計畫、建立修復分支、修改與驗證、提交推送，以及建立 Pull Request 的流程寫成可重複使用的 prompt。

## 我學到什麼

- 如何用 Agent Mode 將一段需求拆成可驗證的前端實作步驟。
- 如何用 `localStorage` 保存瀏覽器端資料與使用者偏好。
- 如何使用 CSS 變數與 `prefers-color-scheme` 建立可切換且較易維護的主題。
- 如何透過 MCP 查詢官方文件與 GitHub repository 資訊。
- 如何把 Issue 修復流程整理成可重複執行的 agentic workflow。
