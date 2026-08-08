# Warhammer Painting Academy V3

V3 把课程正式改成 Campaign Map / Mission Path。

## 本版包含
- 6 Campaign / 60 Missions
- 无 Day 1 / Day 2，无 streak，无 deadline
- Campaign Map
- 普通 Mission 可自由选择
- 完成当前 Campaign 全部普通 Mission 后解锁 Boss
- Boss 通关后解锁下一个 Campaign
- 中英双语 Why / Goal / Practice / Pass Criteria / Common Mistakes
- 每个 Mission 2–3 个教程入口
- 每个 Mission 下方提供“去哪里 + 搜什么关键词”的自主搜索提示
- Reflection
- Photo upload
- Gallery
- XP / Badges
- Responsive mobile layout

## 视频说明
核心涂装技巧优先使用制作 V3 时能够确认的具体公开 YouTube 视频链接，包括 Duncan Rhodes、Warhammer、Vince Venturella、Artis Opus、Trovarion、Miniac、JOSEDAVINCI、Zumikito 等。
对接单/商业流程等难以可靠确认固定视频 URL 的主题，本版会明确使用定向 YouTube 搜索入口，而不会把搜索结果伪装成已经验证的具体视频。

## 替换 GitHub Pages
删除旧的：
- index.html
- style.css
- script.js / app.js
- course-data.js（如果已有）

上传：
- index.html
- style.css
- app.js
- course-data.js

Commit 后 GitHub Pages 会自动重新部署。

## 存储
V3 仍使用 localStorage，因此同一浏览器会保存进度、Reflection 与 Gallery 照片。
下一阶段可接 GitHub OAuth + Supabase/Firebase，实现跨设备云同步。
