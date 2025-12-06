# 🚀 5分钟快速部署指南

## ⚡ 最快部署方式 - Vercel（推荐）

### 步骤 1: 提交代码到 GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 步骤 2: 部署到 Vercel

访问 [vercel.com](https://vercel.com) 并：

1. 点击 **"Add New Project"**
2. 选择你的 GitHub 仓库 **HmiClickDummy**
3. 点击 **"Deploy"**
4. 等待 1-2 分钟 ✅

**完成！** 你会得到一个 URL：`https://your-project.vercel.app`

---

## 📱 其他快速部署方式

### 方式 1: 使用部署脚本

```bash
# 检查部署准备
./check-deployment.sh

# 部署到 Vercel
./deploy.sh vercel

# 或部署到 Netlify
./deploy.sh netlify

# 或构建 Docker
./deploy.sh docker
```

### 方式 2: 手动构建上传

```bash
# 1. 构建
npm run build

# 2. 将 dist/ 文件夹上传到任意静态托管服务
#    - Vercel
#    - Netlify (拖拽上传)
#    - 你的服务器
```

---

## ✅ 部署前检查清单

运行自动检查：
```bash
./check-deployment.sh
```

或手动检查：
- [ ] `npm run build` 成功
- [ ] `npm run preview` 预览正常
- [ ] 所有功能测试通过
- [ ] Git 提交完成

---

## 🌐 访问你的应用

部署完成后，你会得到一个 URL，例如：

- **Vercel**: `https://hmi-simulator.vercel.app`
- **Netlify**: `https://hmi-simulator.netlify.app`
- **自定义域名**: 可在平台设置中配置

---

## 🎯 推荐配置

### Vercel（最简单）
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ Git 集成（自动部署）
- ✅ 完全免费

### 自定义域名（可选）
在 Vercel/Netlify 设置中添加你的域名，例如：
- `hmi.yourcompany.com`
- `tools.example.com`

---

## 📞 需要帮助？

查看完整部署指南：`DEPLOYMENT.md`

常见问题：
- 构建失败 → 检查 Node.js 版本 (需要 18+)
- 页面空白 → 检查浏览器控制台错误
- 样式丢失 → 确认 Tailwind CSS 配置正确

---

## 🎉 恭喜！

你的 HMI Simulator 现在已经在线上运行了！

**分享链接**: `https://your-project.vercel.app`

测试所有功能：
- ✅ AC Hammer 变体
- ✅ DC Hammer 变体  
- ✅ Industrial 变体
- ✅ Console 功能（Industrial）
- ✅ 移动端响应式

享受你的部署！🚀
