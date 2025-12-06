#!/bin/bash

# HMI Simulator 快速部署脚本
# 使用方法: ./deploy.sh [vercel|netlify|docker]

set -e

echo "🚀 HMI Simulator 部署脚本"
echo "=========================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 错误: 未安装 Node.js${NC}"
    echo "请访问 https://nodejs.org 安装 Node.js"
    exit 1
fi

echo -e "${GREEN}✅ Node.js 版本: $(node -v)${NC}"
echo ""

# 构建项目
echo -e "${BLUE}📦 正在构建项目...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 构建成功！${NC}"
else
    echo -e "${RED}❌ 构建失败${NC}"
    exit 1
fi

echo ""

# 部署方式选择
DEPLOY_TYPE=${1:-}

if [ -z "$DEPLOY_TYPE" ]; then
    echo -e "${YELLOW}请选择部署方式:${NC}"
    echo "1) Vercel (推荐)"
    echo "2) Netlify"
    echo "3) Docker"
    echo "4) 仅构建（不部署）"
    echo ""
    read -p "请输入选项 (1-4): " choice
    
    case $choice in
        1) DEPLOY_TYPE="vercel" ;;
        2) DEPLOY_TYPE="netlify" ;;
        3) DEPLOY_TYPE="docker" ;;
        4) DEPLOY_TYPE="build-only" ;;
        *) 
            echo -e "${RED}❌ 无效选项${NC}"
            exit 1
            ;;
    esac
fi

echo ""

case $DEPLOY_TYPE in
    vercel)
        echo -e "${BLUE}🔷 部署到 Vercel...${NC}"
        
        if ! command -v vercel &> /dev/null; then
            echo -e "${YELLOW}⚠️  未安装 Vercel CLI，正在安装...${NC}"
            npm install -g vercel
        fi
        
        echo ""
        echo -e "${GREEN}运行 Vercel 部署:${NC}"
        vercel --prod
        
        echo ""
        echo -e "${GREEN}✅ 部署完成！${NC}"
        ;;
        
    netlify)
        echo -e "${BLUE}🔷 部署到 Netlify...${NC}"
        
        if ! command -v netlify &> /dev/null; then
            echo -e "${YELLOW}⚠️  未安装 Netlify CLI，正在安装...${NC}"
            npm install -g netlify-cli
        fi
        
        echo ""
        echo -e "${GREEN}运行 Netlify 部署:${NC}"
        netlify deploy --prod --dir=dist
        
        echo ""
        echo -e "${GREEN}✅ 部署完成！${NC}"
        ;;
        
    docker)
        echo -e "${BLUE}🐳 构建 Docker 镜像...${NC}"
        
        if ! command -v docker &> /dev/null; then
            echo -e "${RED}❌ 错误: 未安装 Docker${NC}"
            echo "请访问 https://www.docker.com/get-started 安装 Docker"
            exit 1
        fi
        
        echo ""
        echo -e "${GREEN}构建镜像: hmi-simulator${NC}"
        docker build -t hmi-simulator .
        
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✅ Docker 镜像构建成功！${NC}"
            echo ""
            echo -e "${YELLOW}启动容器:${NC}"
            echo "  docker run -d -p 8080:80 hmi-simulator"
            echo ""
            echo -e "${YELLOW}或使用 docker-compose:${NC}"
            echo "  docker-compose up -d"
            echo ""
            echo -e "${GREEN}访问: http://localhost:8080${NC}"
        else
            echo -e "${RED}❌ Docker 构建失败${NC}"
            exit 1
        fi
        ;;
        
    build-only)
        echo -e "${GREEN}✅ 构建完成！${NC}"
        echo ""
        echo -e "${BLUE}构建文件位于: dist/${NC}"
        echo ""
        echo -e "${YELLOW}预览构建结果:${NC}"
        echo "  npm run preview"
        echo ""
        echo -e "${YELLOW}手动部署文件:${NC}"
        echo "  将 dist/ 目录上传到你的服务器"
        ;;
        
    *)
        echo -e "${RED}❌ 未知的部署类型: $DEPLOY_TYPE${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 完成！${NC}"
