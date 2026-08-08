# Warhammer Painting Academy V2

这是一个可直接部署到 GitHub Pages 的完整前端版本。

## 已实现
- 6 个 Campaign
- 每个 Campaign 只有在前一个完全通关后才解锁
- 当前 Campaign 内 Mission 可自由选择，不使用 Day 1/Day 2
- Boss Mission 只有在同 Campaign 其他 Mission 全部完成后解锁
- 每个 Mission：
  - 中英双语 Why / Goal
  - 至少两个教程入口
  - 中英双语 Practice
  - Pass Criteria
  - Common Mistakes
  - Resources
  - Reflection
  - Photo Upload
- XP、总进度、战役进度
- Achievements
- Gallery
- localStorage 自动保存
- 手机适配

## 部署
把 `index.html`、`style.css`、`course-data.js`、`app.js` 上传到 GitHub Pages 仓库根目录即可。

## 更新现有仓库
最简单的方法：
1. 删除旧的 `index.html`、`style.css`、`script.js`
2. 上传本版本的 `index.html`、`style.css`、`course-data.js`、`app.js`
3. Commit changes
4. GitHub Pages 会自动重新部署

## 当前存储方式
目前进度、Reflection 和照片都保存在访问者浏览器的 localStorage。
这意味着：
- 同一个浏览器刷新/关闭后，进度还在
- 换电脑、清除浏览器数据后不会自动同步
- 照片不会写进 GitHub repository

下一步如需“GitHub 登录 + 多设备同步 + 云端 Gallery”，应接入 OAuth + Supabase/Firebase Storage，而不是把 GitHub 写入 token 放在前端。
