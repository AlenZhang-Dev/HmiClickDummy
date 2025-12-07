# 🚀 HMI 优化快速参考

> **一页纸快速参考** - 最常用的命令和步骤

---

## 📋 优化阶段速览

```
Week 1: 组件模块化      → 主文件减少到 ~300 行
Week 2: 状态管理重构    → 主文件减少到 < 200 行
Week 3: 类型安全 + 性能 → 完成所有优化
```

---

## 🎯 当前任务 (从这里开始)

### ✅ 任务 1.1.1: 提取 SevenSegmentDisplay

```bash
# 1. 创建目录结构
mkdir -p src/shared/components/SevenSegmentDisplay

# 2. 创建文件
touch src/shared/components/SevenSegmentDisplay/{index.jsx,SevenSegmentDigit.jsx,segmentMap.js,README.md}

# 3. 编辑文件 (从 Hmi.jsx 复制相关代码)
# - segmentMap.js: 提取 segmentMap 对象
# - SevenSegmentDigit.jsx: 提取 SevenSegmentDigit 组件
# - index.jsx: 提取 SevenSegmentDisplay 组件

# 4. 在 Hmi.jsx 中导入
# import SevenSegmentDisplay from './src/shared/components/SevenSegmentDisplay';

# 5. 测试
npm run dev

# 6. 提交
git add .
git commit -m "feat: extract SevenSegmentDisplay component (Task 1.1.1)"
```

---

## 📂 完整目录结构速查

```
src/
├── core/state/              # 状态管理
│   ├── types.js
│   ├── reducer.js
│   └── actions.js
├── shared/
│   ├── components/          # 共享组件
│   │   ├── SevenSegmentDisplay/
│   │   ├── ModeButton/
│   │   ├── StatusButton/
│   │   └── CustomLevelConfig/
│   ├── hooks/               # 自定义 Hooks
│   ├── utils/               # 工具函数
│   └── styles/              # 样式常量
└── variants/                # 设备变体
    ├── ACHammer/
    ├── DCHammer/
    ├── Industrial/
    └── registry/
```

---

## 🔧 常用命令

### 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

### Git 工作流

```bash
# 查看当前分支
git branch

# 切换到优化分支
git checkout Optimization/Re-structure-module

# 创建新功能分支
git checkout -b feature/task-1.1.1

# 查看状态
git status

# 提交更改
git add .
git commit -m "feat: your message"

# 推送到远程
git push origin Optimization/Re-structure-module
```

### 文件操作

```bash
# 创建目录
mkdir -p src/shared/components/ComponentName

# 创建多个文件
touch src/shared/components/ComponentName/{index.jsx,README.md}

# 复制目录
cp -r src/variants/Industrial src/variants/NewVariant

# 查看文件内容
cat Hmi.jsx | grep "function SevenSegment"
```

---

## 📝 提交信息规范

```bash
# 新功能
git commit -m "feat: extract SevenSegmentDisplay component"

# Bug 修复
git commit -m "fix: correct battery display logic"

# 文档更新
git commit -m "docs: add README for ModeButton component"

# 重构
git commit -m "refactor: use useReducer for state management"

# 性能优化
git commit -m "perf: add React.memo to ModeButton"

# 测试
git commit -m "test: add unit tests for SevenSegmentDisplay"
```

---

## 📊 任务优先级

### 🔴 高优先级 (必须完成)

1. SevenSegmentDisplay 组件拆分
2. ModeButton 组件独立化
3. AC/DC/Industrial 变体模块
4. 变体注册系统
5. useReducer 状态管理

### 🟡 中优先级 (建议完成)

1. StatusButton 组件完善
2. CustomLevelConfig 组件提取
3. 自定义 Hooks 提取
4. PropTypes 添加

### 🟢 低优先级 (可选)

1. JSDoc 注释
2. React.memo 优化
3. useCallback/useMemo 优化

---

## ✅ 每日检查清单

### 开始工作前

- [ ] 查看 [OPTIMIZATION_CHECKLIST.md](./OPTIMIZATION_CHECKLIST.md)
- [ ] 确认当前任务
- [ ] 拉取最新代码 `git pull`

### 工作中

- [ ] 按照任务步骤执行
- [ ] 频繁保存和测试
- [ ] 遇到问题查阅 [OPTIMIZATION_PLAN.md](./OPTIMIZATION_PLAN.md)

### 完成任务后

- [ ] 运行 `npm run dev` 测试
- [ ] 检查所有变体功能
- [ ] 提交代码
- [ ] 在检查清单中标记完成 `[x]`

---

## 🆘 常见问题速查

### 导入路径问题

```javascript
// ❌ 错误
import Component from './Component';

// ✅ 正确 (使用绝对路径或相对路径)
import Component from '@/shared/components/Component';
import Component from '../../shared/components/Component';
```

### PropTypes 用法

```javascript
import PropTypes from 'prop-types';

Component.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  onClick: PropTypes.func,
  isActive: PropTypes.bool
};

Component.defaultProps = {
  isActive: false
};
```

### useReducer 基础

```javascript
import { useReducer } from 'react';

const [state, dispatch] = useReducer(reducer, initialState);

// 调用 action
dispatch({ type: 'ACTION_TYPE', payload: value });
```

---

## 📞 获取帮助

### 文档链接

- **总览**: [OPTIMIZATION_SUMMARY.md](./OPTIMIZATION_SUMMARY.md)
- **详细方案**: [OPTIMIZATION_PLAN.md](./OPTIMIZATION_PLAN.md)
- **任务清单**: [OPTIMIZATION_CHECKLIST.md](./OPTIMIZATION_CHECKLIST.md)
- **架构对比**: [ARCHITECTURE_COMPARISON.md](./ARCHITECTURE_COMPARISON.md)

### 问题排查顺序

1. 查看对应任务的详细步骤
2. 查看 OPTIMIZATION_PLAN.md 的代码示例
3. 查看 ARCHITECTURE_COMPARISON.md 的架构说明
4. 在 GitHub Issues 中提问

---

## 🎯 成功标准

### 每个任务完成后

- ✅ 功能正常工作
- ✅ 所有三个变体都正常
- ✅ 无控制台错误
- ✅ 代码已提交

### 每个阶段完成后

- ✅ 主文件行数达标
- ✅ 组件可独立导入
- ✅ 通过功能测试
- ✅ 文档已更新

---

## 📈 进度追踪

### Week 1 进度

```
□ Task 1.1.1 - SevenSegmentDisplay
□ Task 1.1.2 - ModeButton
□ Task 1.1.3 - StatusButton
□ Task 1.1.4 - CustomLevelConfig
□ Task 1.2.1 - AC Hammer
□ Task 1.2.2 - DC Hammer
□ Task 1.2.3 - Industrial
□ Task 1.3.1 - Registry
□ Task 1.4.1 - Utils

当前: 0/9 完成 (0%)
```

---

**最后更新**: 2025-12-06  
**下一个任务**: Task 1.1.1 - SevenSegmentDisplay

---

> 💡 **小贴士**: 将此文件添加到浏览器书签，随时快速查阅！
