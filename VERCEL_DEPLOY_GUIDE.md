# 🚀 Vercel 部署指南 - HMI Simulator

## 方式一：通过 Vercel 网站部署（推荐，最简单）⭐

### 步骤 1: 推送代码到 GitHub

你的代码已经提交到本地，需要推送到 GitHub：

```bash
# 如果网络不好，多试几次
git push origin main

# 或者使用 SSH（如果配置了）
git push git@github.com:AlenZhang-Dev/HmiClickDummy.git main
```

### 步骤 2: 访问 Vercel

1. 打开浏览器，访问：https://vercel.com
2. 点击右上角 **"Sign Up"** 或 **"Log in"**
3. 选择 **"Continue with GitHub"** 使用 GitHub 账号登录

### 步骤 3: 导入项目

1. 登录后，点击 **"Add New..."** → **"Project"**
2. 在列表中找到 **"HmiClickDummy"** 仓库
3. 点击 **"Import"** 按钮

### 步骤 4: 配置项目（通常自动识别）

Vercel 会自动检测到这是一个 Vite 项目，配置如下：

```
Framework Preset: Vite
Build Command:    npm run build
Output Directory: dist
Install Command:  npm install
```

**保持默认设置即可！**

### 步骤 5: 部署

1. 点击 **"Deploy"** 按钮
2. 等待 1-2 分钟，观看构建过程
3. 看到 🎉 恭喜页面即部署成功！

### 步骤 6: 获取 URL

部署成功后，你会得到：

```
https://hmi-click-dummy.vercel.app
或
https://hmi-click-dummy-<random>.vercel.app
```

**完成！** 点击链接即可访问你的应用！

---

## 方式二：通过 Vercel CLI 部署

### 步骤 1: 安装 Vercel CLI

```bash
npm install -g vercel
```

如果安装慢，可以使用国内镜像：

```bash
npm install -g vercel --registry=https://registry.npmmirror.com
```

### 步骤 2: 登录 Vercel

```bash
vercel login
```

会弹出浏览器，使用 GitHub 账号登录。

### 步骤 3: 部署

在项目目录运行：

```bash
cd /Users/alenzhang/Code/Hmi
vercel --prod
```

按照提示操作：

```
? Set up and deploy "~/Code/Hmi"? [Y/n] y
? Which scope do you want to deploy to? Your Name
? Link to existing project? [y/N] n
? What's your project's name? hmi-simulator
? In which directory is your code located? ./
Auto-detected Project Settings (Vite):
- Build Command: npm run build
- Output Directory: dist
- Development Command: npm run dev
? Want to override the settings? [y/N] n
```

等待部署完成！

---

## 🎯 部署后操作

### 查看部署状态

访问 Vercel Dashboard：
```
https://vercel.com/dashboard
```

### 自定义域名（可选）

1. 在 Vercel Dashboard 中选择你的项目
2. 点击 **"Settings"** → **"Domains"**
3. 添加你的域名，按照提示配置 DNS

### 自动部署设置

Vercel 已经自动为你设置了：
- ✅ 每次 `git push` 到 `main` 分支自动部署
- ✅ Pull Request 预览
- ✅ HTTPS 自动配置
- ✅ 全球 CDN 加速

---

## 🔍 部署验证

部署成功后，测试以下功能：

### 1. 基本功能
- [ ] 页面正常加载
- [ ] 样式正确显示（Tailwind CSS）
- [ ] 图标正常显示（Lucide React）

### 2. HMI 变体
- [ ] AC Hammer 变体正常
- [ ] DC Hammer 变体正常
- [ ] Industrial 变体正常

### 3. 交互功能
- [ ] 电源开关正常
- [ ] 模式切换正常
- [ ] 扭矩调节正常（Industrial）
- [ ] Tool Lock 长按功能正常
- [ ] Console 显示正常（Industrial）

### 4. 移动端
- [ ] 在手机浏览器中测试
- [ ] 响应式布局正常

---

## ⚠️ 常见问题

### 问题 1: 构建失败

**解决方法**:
```bash
# 本地测试构建
npm run build

# 检查错误
npm run preview
```

### 问题 2: 页面空白

**原因**: 路径配置问题

**解决**: 检查 `vite.config.js` 中的 `base` 配置，确保为 `/`

### 问题 3: 样式丢失

**原因**: Tailwind CSS 配置问题

**解决**: 确保以下文件存在：
- `tailwind.config.js`
- `postcss.config.js`
- `src/index.css` 包含 Tailwind 指令

### 问题 4: 推送到 GitHub 失败

**网络超时解决方法**:

```bash
# 方法 1: 使用 SSH
git remote set-url origin git@github.com:AlenZhang-Dev/HmiClickDummy.git
git push origin main

# 方法 2: 增加超时时间
git config --global http.postBuffer 524288000
git push origin main

# 方法 3: 使用代理（如果有）
git config --global http.proxy http://127.0.0.1:7890
git push origin main
```

---

## 📊 当前状态

### ✅ 已完成
- [x] 代码已提交到本地 Git
- [x] 部署配置文件已创建（vercel.json）
- [x] 项目已构建测试（dist/ 目录存在）

### 🔄 待完成
- [ ] 推送代码到 GitHub
- [ ] 在 Vercel 上导入项目
- [ ] 完成部署

---

## 🎯 快速部署流程总结

### 最简单的方式：

1. **推送到 GitHub**
   ```bash
   git push origin main
   ```
   
2. **访问 Vercel**
   - 打开 https://vercel.com
   - 使用 GitHub 登录
   
3. **导入项目**
   - 点击 "Add New Project"
   - 选择 "HmiClickDummy"
   - 点击 "Deploy"
   
4. **完成！**
   - 获得 URL
   - 分享你的应用

---

## 📞 需要帮助？

### 如果推送 GitHub 遇到网络问题：

1. **使用手机热点**：切换网络环境
2. **稍后重试**：网络波动可能是暂时的
3. **使用 Vercel CLI**：直接从本地部署，无需 GitHub

### Vercel 官方文档

- 部署指南: https://vercel.com/docs/deployments/overview
- CLI 文档: https://vercel.com/docs/cli
- Vite 集成: https://vercel.com/docs/frameworks/vite

---

## 💡 下一步建议

部署成功后：

1. **分享链接**
   - 复制 Vercel 提供的 URL
   - 分享给团队或客户

2. **设置自定义域名**（可选）
   - 在 Vercel Dashboard 配置
   - 例如：`hmi.yourcompany.com`

3. **监控部署**
   - 在 Vercel Dashboard 查看访问统计
   - 检查错误日志

4. **持续更新**
   - 每次 `git push` 自动部署新版本
   - Pull Request 自动生成预览链接

---

## 🎉 祝你部署成功！

如果遇到任何问题，可以：
- 查看 Vercel Dashboard 的构建日志
- 检查浏览器控制台错误
- 参考 `DEPLOYMENT.md` 完整文档

**你的 HMI Simulator 马上就要上线了！** 🚀
