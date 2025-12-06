# 🎯 HMI Simulator 部署决策树

```
                        开始部署
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   你有 GitHub 仓库吗？              │
        └───────────────────────────────────┘
                 │                │
            是 ──┤                └── 否
                 │                    │
                 ▼                    ▼
      ┌──────────────────┐    创建 GitHub 仓库
      │ 推送代码到 GitHub │    git init & push
      └──────────────────┘           │
                 │                   │
                 └───────┬───────────┘
                         ▼
           ┌─────────────────────────┐
           │ 选择部署平台              │
           └─────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   ┌─────────┐     ┌──────────┐    ┌──────────┐
   │ Vercel  │     │ Netlify  │    │  其他    │
   │  ⭐⭐⭐   │     │  ⭐⭐⭐    │    │   ⭐⭐    │
   └─────────┘     └──────────┘    └──────────┘
        │                │                │
        ▼                ▼                ▼
   1. 登录          1. 登录         1. GitHub
   2. Import        2. Import          Pages
   3. Deploy        3. Deploy       2. Docker
                                    3. 自建


═══════════════════════════════════════════════════

推荐流程（Vercel - 5分钟）:

   1️⃣  Push to GitHub
       ├─ git add .
       ├─ git commit -m "Deploy"
       └─ git push origin main
       
   2️⃣  Deploy on Vercel
       ├─ Visit vercel.com
       ├─ Click "Import Project"
       ├─ Select repository
       └─ Click "Deploy"
       
   3️⃣  Get Your URL
       └─ https://hmi-simulator.vercel.app
       
   4️⃣  Done! 🎉
       └─ Share & Enjoy

═══════════════════════════════════════════════════

或使用自动化脚本:

   ./check-deployment.sh     # 检查准备情况
   ./deploy.sh vercel        # 一键部署

═══════════════════════════════════════════════════
```

## 📊 部署时间对比

```
Vercel/Netlify (推荐)
├─ 设置时间: ████░░░░░░ 5 分钟
├─ 技术难度: ███░░░░░░░ 简单
└─ 维护成本: ██░░░░░░░░ 极低

GitHub Pages
├─ 设置时间: ██████░░░░ 10 分钟
├─ 技术难度: █████░░░░░ 中等
└─ 维护成本: ███░░░░░░░ 低

Docker
├─ 设置时间: ████████░░ 15 分钟
├─ 技术难度: ████████░░ 较高
└─ 维护成本: ██████░░░░ 中等

自建服务器
├─ 设置时间: ██████████ 30+ 分钟
├─ 技术难度: ██████████ 高
└─ 维护成本: ██████████ 高
```

## 🎯 场景匹配

| 你的需求 | 推荐方案 | 理由 |
|---------|---------|------|
| 快速演示给客户 | **Vercel** | 5分钟上线，专业域名 |
| 个人项目展示 | **Vercel/Netlify** | 免费，速度快 |
| 开源项目 | **GitHub Pages** | GitHub 集成 |
| 企业内网 | **Docker/自建** | 私有部署，安全可控 |
| 学习练习 | **Vercel** | 最简单，无需配置 |
| 高流量生产 | **Vercel Pro** | CDN + 高可用 |

## ⚡ 快速命令参考

```bash
# 方式 1: 自动脚本（推荐）
./check-deployment.sh && ./deploy.sh vercel

# 方式 2: 手动构建
npm run build && npm run preview

# 方式 3: Docker
docker-compose up -d

# 检查状态
curl -I https://your-app.vercel.app
```

## 🔗 重要链接

- 📖 完整指南: [DEPLOYMENT.md](./DEPLOYMENT.md)
- ⚡ 快速开始: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)  
- 📝 部署总结: [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)
- 🏠 项目首页: [README.md](./README.md)
