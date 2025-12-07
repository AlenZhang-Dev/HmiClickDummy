# 🚀 Vercel 部署指南

## 📦 部署文件

### 配置文件
- **`vercel.json`** - Vercel 配置（已创建）

### 文档文件  
- **`QUICK_DEPLOY.md`** - 快速部署步骤
- **`README.md`** - 项目说明（含部署信息）

---

## ⚡ 快速部署（3步完成）

### 1️⃣ 推送到 GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2️⃣ 部署到 Vercel

访问 [vercel.com](https://vercel.com)：
- 登录 GitHub 账号
- 点击 "Add New Project"  
- 选择 `HmiClickDummy` 仓库
- 点击 "Deploy"

### 3️⃣ 完成！

获得 URL: `https://your-project.vercel.app`

---

## ✅ Vercel 优势

- ✅ 完全免费
- ✅ 自动 HTTPS + CDN
- ✅ Git 集成（每次 push 自动部署）
- ✅ 全球加速
- ✅ 支持自定义域名

---

## 🔧 可选: Vercel CLI 部署

```bash
# 安装 CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

---

## 🐛 常见问题

### 部署后页面空白
```bash
# 本地测试
npm run build
npm run preview
```

### 样式丢失
确认 `tailwind.config.js` 和 `postcss.config.js` 存在

### Git 推送失败
```bash
# 检查远程仓库
git remote -v

# 如需要，添加远程仓库
git remote add origin https://github.com/AlenZhang-Dev/HmiClickDummy.git
```

---

## 📱 自定义域名（可选）

在 Vercel 项目设置中：
1. 选择 "Domains"
2. 添加域名（如 `hmi.yourcompany.com`）
3. 配置 DNS 记录
4. 等待生效

---

## 🎉 部署完成！

访问你的应用，测试所有功能：
- AC Hammer 变体
- DC Hammer 变体
- Industrial 变体
- 移动端响应式

**更多信息**: 查看 `QUICK_DEPLOY.md`
