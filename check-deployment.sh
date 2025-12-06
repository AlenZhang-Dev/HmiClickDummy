#!/bin/bash

# 部署前检查脚本
echo "🔍 HMI Simulator 部署前检查"
echo "============================"
echo ""

# 颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

# 1. 检查 Node.js
echo -n "检查 Node.js... "
if command -v node &> /dev/null; then
    echo -e "${GREEN}✅ $(node -v)${NC}"
else
    echo -e "${RED}❌ 未安装${NC}"
    ((ERRORS++))
fi

# 2. 检查 npm
echo -n "检查 npm... "
if command -v npm &> /dev/null; then
    echo -e "${GREEN}✅ $(npm -v)${NC}"
else
    echo -e "${RED}❌ 未安装${NC}"
    ((ERRORS++))
fi

# 3. 检查依赖
echo -n "检查依赖安装... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${YELLOW}⚠️  未安装，运行: npm install${NC}"
    ((ERRORS++))
fi

# 4. 检查关键文件
echo ""
echo "检查关键文件:"

FILES=("package.json" "vite.config.js" "index.html" "Hmi.jsx" "tailwind.config.js")

for file in "${FILES[@]}"; do
    echo -n "  $file... "
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC}"
    else
        echo -e "${RED}❌ 缺失${NC}"
        ((ERRORS++))
    fi
done

# 5. 测试构建
echo ""
echo -n "测试构建... "
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅${NC}"
    # 检查 dist 目录
    if [ -d "dist" ] && [ -f "dist/index.html" ]; then
        DIST_SIZE=$(du -sh dist | cut -f1)
        echo -e "  构建大小: ${GREEN}$DIST_SIZE${NC}"
    fi
else
    echo -e "${RED}❌ 构建失败${NC}"
    ((ERRORS++))
fi

# 6. Git 状态
echo ""
echo -n "检查 Git 状态... "
if command -v git &> /dev/null && [ -d ".git" ]; then
    UNCOMMITTED=$(git status --porcelain | wc -l)
    if [ "$UNCOMMITTED" -eq 0 ]; then
        echo -e "${GREEN}✅ 所有更改已提交${NC}"
    else
        echo -e "${YELLOW}⚠️  有 $UNCOMMITTED 个未提交的更改${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  不是 Git 仓库${NC}"
fi

# 总结
echo ""
echo "============================"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ 所有检查通过！准备部署${NC}"
    echo ""
    echo "快速部署命令:"
    echo -e "  ${YELLOW}Vercel:${NC}  ./deploy.sh vercel"
    echo -e "  ${YELLOW}Netlify:${NC} ./deploy.sh netlify"
    echo -e "  ${YELLOW}Docker:${NC}  ./deploy.sh docker"
    exit 0
else
    echo -e "${RED}❌ 发现 $ERRORS 个问题，请修复后再部署${NC}"
    exit 1
fi
