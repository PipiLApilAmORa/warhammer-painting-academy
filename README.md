# Archie's Warhammer Painting Academy — V4

V4 是一次纯视觉与体验升级，完整保留 V3 的 6 Campaign / 60 Missions 课程数据库。

## V4 主要变化
- 顶部品牌改为 **ARCHIE'S WARHAMMER PAINTING ACADEMY**
- 首页按批准的概念图重做
- 黄色英文标题整体放大，和白色主标题形成更接近游戏 UI 的比例
- Hero 区加入战锤风格人物视觉背景
- 四个 Progress 面板重新设计
- Campaign 改为横向战役 Banner
- Recruit / Battle Brother 使用独立背景图
- Locked Campaign 明显显示锁定状态
- Mission / Gallery / Achievement 页面统一到新视觉系统
- 保留全部 V3：
  - 60 Missions
  - 双语内容
  - 2–3 教程入口
  - 自主搜索关键词
  - Practice / Pass Criteria / Common Mistakes
  - Reflection
  - Gallery
  - XP / Achievements
  - Campaign 解锁逻辑

## 进度迁移
V4 首次打开时会尝试读取同一浏览器中的 `wpa-v3-state`，并复制到 `wpa-v4-state`。
因此如果同一个浏览器之前使用 V3，升级页面后已有进度可以继续保留。

## 上传到 GitHub Pages
上传以下内容到仓库根目录并覆盖旧版本：
- index.html
- style.css
- app.js
- course-data.js
- assets/hero-marine.webp
- assets/recruit-marines.webp
- assets/battle-brother.webp

注意：`assets` 文件夹必须一并上传，并保持文件夹结构。

GitHub Pages 不需要重新配置，Commit 后会自动部署。
