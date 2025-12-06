# 🚀 HMI Simulator 部署指南

本指南提供多种部署方案，从最简单到最专业，选择适合你的方式。

---

## 📋 部署前准备

### 1. 构建生产版本

```bash
npm run build
```

这会在 `dist/` 目录生成优化后的生产文件。

### 2. 本地预览构建结果

```bash
npm run preview
```

访问显示的 URL（通常是 http://localhost:4173）验证构建是否正常。

---

## 🌟 方案一：Vercel 部署（推荐 ⭐）

**优点**: 
- ✅ 最简单，完全免费
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速
- ✅ 支持自定义域名
- ✅ 每次 git push 自动部署

### 步骤：

#### **方式 A: 通过 GitHub 连接（推荐）**

1. **将代码推送到 GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **访问 [Vercel](https://vercel.com)**
   - 使用 GitHub 账号登录
   - 点击 "Add New Project"
   - 选择你的 GitHub 仓库 `HmiClickDummy`

3. **配置项目**
   - Framework Preset: 自动检测为 `Vite`
   - Root Directory: `./`
   - Build Command: `npm run build`（自动填充）
   - Output Directory: `dist`（自动填充）
   - 点击 "Deploy"

4. **等待部署完成**
   - 通常 1-2 分钟
   - 会得到一个 `.vercel.app` 域名

5. **访问你的应用**
   ```
   https://your-project-name.vercel.app
   ```

#### **方式 B: 通过 Vercel CLI**

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署**
   ```bash
   vercel --prod
   ```

4. **按提示操作**
   - 确认项目设置
   - 等待部署完成

---

## 🐙 方案二：GitHub Pages

**优点**: 
- ✅ 完全免费
- ✅ 直接托管在 GitHub
- ✅ 简单配置

**缺点**:
- ⚠️ 需要配置 base path（如果不是根路径）

### 步骤：

1. **修改 `vite.config.js`**
   ```javascript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     base: '/HmiClickDummy/', // 替换为你的仓库名
     server: {
       port: 3000,
       open: true
     }
   })
   ```

2. **安装 gh-pages 工具**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **在 `package.json` 添加部署脚本**
   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview",
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

4. **部署**
   ```bash
   npm run deploy
   ```

5. **启用 GitHub Pages**
   - 访问 GitHub 仓库设置
   - Settings → Pages
   - Source: 选择 `gh-pages` 分支
   - 保存

6. **访问**
   ```
   https://AlenZhang-Dev.github.io/HmiClickDummy/
   ```

---

## 🎨 方案三：Netlify

**优点**:
- ✅ 免费且功能强大
- ✅ 拖放部署
- ✅ 自动 HTTPS
- ✅ 表单处理、函数等高级功能

### 方式 A: 拖放部署

1. **构建项目**
   ```bash
   npm run build
   ```

2. **访问 [Netlify](https://www.netlify.com)**
   - 登录或注册账号
   - 将 `dist/` 文件夹拖放到部署区域
   - 等待部署完成

### 方式 B: GitHub 连接

1. **访问 Netlify → "Add new site" → "Import an existing project"**

2. **连接 GitHub 仓库**

3. **配置构建设置**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - 点击 "Deploy site"

4. **访问分配的域名**
   ```
   https://random-name-123456.netlify.app
   ```

---

## 🖥️ 方案四：自建服务器（Nginx）

**适用于**: 有自己的服务器或 VPS

### 步骤：

1. **构建项目**
   ```bash
   npm run build
   ```

2. **将 `dist/` 目录上传到服务器**
   ```bash
   scp -r dist/ user@your-server:/var/www/hmi-simulator/
   ```

3. **配置 Nginx**
   
   创建配置文件 `/etc/nginx/sites-available/hmi-simulator`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       root /var/www/hmi-simulator;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # 启用 gzip 压缩
       gzip on;
       gzip_types text/css application/javascript application/json image/svg+xml;
       gzip_comp_level 6;
       
       # 缓存静态资源
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

4. **启用站点并重启 Nginx**
   ```bash
   sudo ln -s /etc/nginx/sites-available/hmi-simulator /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. **配置 HTTPS（推荐使用 Let's Encrypt）**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## 🐳 方案五：Docker 部署

**适用于**: 容器化部署需求

### 创建 `Dockerfile`:

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 创建 `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
}
```

### 构建和运行:

```bash
# 构建镜像
docker build -t hmi-simulator .

# 运行容器
docker run -d -p 8080:80 hmi-simulator
```

访问 `http://localhost:8080`

---

## 📊 方案对比

| 方案 | 难度 | 费用 | 速度 | HTTPS | CDN | 自定义域名 |
|------|------|------|------|-------|-----|-----------|
| **Vercel** | ⭐ | 免费 | 极快 | ✅ | ✅ | ✅ |
| **GitHub Pages** | ⭐⭐ | 免费 | 快 | ✅ | ✅ | ✅ |
| **Netlify** | ⭐ | 免费 | 极快 | ✅ | ✅ | ✅ |
| **自建服务器** | ⭐⭐⭐⭐ | 收费 | 取决于配置 | 需配置 | ❌ | ✅ |
| **Docker** | ⭐⭐⭐ | 取决于托管 | 取决于配置 | 需配置 | ❌ | ✅ |

---

## 🎯 推荐方案

### 个人项目 / 演示
→ **Vercel** （最简单，自动化程度最高）

### 企业内网 / 私有部署
→ **自建服务器** 或 **Docker**

### 开源项目
→ **GitHub Pages** （与仓库集成）

---

## 🔧 环境变量配置（可选）

如果需要不同环境的配置，创建 `.env` 文件：

```env
# .env.production
VITE_APP_TITLE=HMI Simulator
VITE_API_URL=https://api.yourserver.com
```

在代码中使用：
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## ✅ 部署检查清单

- [ ] 运行 `npm run build` 无错误
- [ ] 运行 `npm run preview` 本地验证
- [ ] 检查所有功能正常（三个 HMI 变体）
- [ ] 测试响应式布局（移动端/桌面端）
- [ ] 确认 Console 功能正常
- [ ] 检查浏览器控制台无错误
- [ ] 配置自定义域名（可选）
- [ ] 设置 HTTPS（生产环境必需）

---

## 🐛 常见问题

### 1. 部署后页面空白

**原因**: 路径配置问题

**解决**: 检查 `vite.config.js` 中的 `base` 配置

### 2. 样式丢失

**原因**: Tailwind CSS 未正确构建

**解决**: 确保 `tailwind.config.js` 和 `postcss.config.js` 存在

### 3. 404 错误

**原因**: SPA 路由配置

**解决**: 
- Vercel/Netlify 自动处理
- Nginx 需要配置 `try_files`
- GitHub Pages 需要添加 404.html

### 4. 构建失败

**解决**:
```bash
# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📱 移动端优化

项目已使用 Tailwind CSS 响应式设计，自动适配移动端。

测试移动端体验：
- Chrome DevTools → Device Toolbar (F12)
- 实际手机浏览器测试

---

## 🚀 持续集成/部署（CI/CD）

### GitHub Actions 自动部署到 Vercel

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 📞 需要帮助？

- Vercel 文档: https://vercel.com/docs
- Netlify 文档: https://docs.netlify.com
- Vite 文档: https://vitejs.dev/guide/

---

## 🎉 快速开始（1 分钟部署）

**最快方式 - Vercel:**

```bash
# 1. 推送到 GitHub
git push origin main

# 2. 访问 vercel.com 并导入项目
# 3. 点击 Deploy
# 完成！🎊
```

**立即访问你的应用**: `https://your-project.vercel.app`
