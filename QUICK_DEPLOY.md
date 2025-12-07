# 🚀 Vercel 部署指南

## ⚡ 最快部署方式 - Vercel

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

## 🌐 访问你的应用

部署完成后，你会得到一个 URL，例如：

**Vercel**: `https://hmi-simulator.vercel.app`

---

## 🎯 Vercel 优势

- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ Git 集成（自动部署）
- ✅ 完全免费

---

## 📱 自定义域名（可选）

在 Vercel 设置中添加你的域名，例如：
- `hmi.yourcompany.com`
- `tools.example.com`

---

## � 常见问题

### 部署后页面空白

**检查**: 浏览器控制台是否有错误

**解决**: 
```bash
# 本地测试构建
npm run build
npm run preview
```

### 样式丢失

**确认**: Tailwind CSS 配置正确

**解决**: 
```bash
# 重新构建
npm run build
```

---

## 🎉 恭喜！

你的 HMI Simulator 现在已经在线上运行了！

**分享链接**: `https://your-project.vercel.app`

测试所有功能：
- ✅ AC Hammer 变体
- ✅ DC Hammer 变体  
- ✅ Industrial 变体
- ✅ 移动端响应式

享受你的部署！🚀

