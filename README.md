# Warhammer Painting Academy

一个可直接部署到 GitHub Pages 的静态网站原型。

## 本地查看
直接双击 `index.html` 即可。为了确保浏览器本地存储稳定，也可以用任意静态服务器打开。

## 部署到 GitHub Pages
1. 在 GitHub 新建一个 Public repository，例如 `warhammer-painting-academy`
2. 上传本文件夹中的 `index.html`、`style.css`、`script.js`
3. 打开仓库 `Settings` → `Pages`
4. Source 选择 `Deploy from a branch`
5. Branch 选择 `main`，Folder 选择 `/ (root)`
6. 保存后等待 GitHub 发布页面

## 已实现
- 7 天 Phase I 入门任务
- 每日教程链接
- Practice checklist
- XP / Level / Rank
- Skill Tree
- Achievements
- 每日反思与给伴侣留言
- 图片上传预览
- localStorage 自动保存

## 注意
当前进度只保存在访问者自己的浏览器中，不会同步到另一台设备。
如果以后希望两个人在不同设备上共同查看/留言，需要接入后端（例如 Firebase / Supabase）。
