# ✅ HMI 项目优化检查清单

> **快速参考**: 按顺序完成以下任务  
> **完整文档**: 查看 [OPTIMIZATION_PLAN.md](./OPTIMIZATION_PLAN.md)

---

## 📊 进度概览

- [ ] **阶段一**: 组件模块化 (0/7 任务完成)
- [ ] **阶段二**: 状态管理重构 (0/4 任务完成)
- [ ] **阶段三**: 自定义Hooks提取 (0/3 任务完成)
- [ ] **阶段四**: 类型安全增强 (0/2 任务完成)
- [ ] **阶段五**: 性能优化 (0/3 任务完成)

**总进度**: 0/19 任务完成 (0%)

---

## 🔴 阶段一：组件模块化 (Week 1)

### 任务 1.1: 提取共享组件

#### ☐ 1.1.1 - SevenSegmentDisplay 组件拆分
**优先级**: 🔴 高  
**预计时间**: 4 小时

**步骤**:
- [ ] 创建目录 `src/shared/components/SevenSegmentDisplay/`
- [ ] 创建 `segmentMap.js` - 提取段码映射
- [ ] 创建 `SevenSegmentDigit.jsx` - 单个数字组件
- [ ] 创建 `index.jsx` - 双位显示组件
- [ ] 添加 PropTypes
- [ ] 在 Hmi.jsx 中替换导入
- [ ] 测试显示功能

**验收标准**:
- ✓ 组件可独立导入使用
- ✓ 所有变体显示正常
- ✓ 主文件减少 ~100 行

---

#### ☐ 1.1.2 - ModeButton 组件独立化
**优先级**: 🔴 高  
**预计时间**: 2 小时

**步骤**:
- [ ] 创建目录 `src/shared/components/ModeButton/`
- [ ] 创建 `index.jsx`
- [ ] 提取样式计算逻辑
- [ ] 添加 PropTypes
- [ ] 在 Hmi.jsx 中替换导入
- [ ] 测试 Max/Soft 切换

**验收标准**:
- ✓ 按钮交互正常
- ✓ 禁用状态正确
- ✓ 主文件减少 ~50 行

---

#### ☐ 1.1.3 - StatusButton 组件完善
**优先级**: 🟡 中  
**预计时间**: 2 小时

**步骤**:
- [ ] 编辑 `src/shared/components/StatusButton/index.jsx`
- [ ] 从 Hmi.jsx 复制 StatusButton
- [ ] 从 Hmi.jsx 复制 IndStatusButton
- [ ] 合并为统一组件（通过 props 区分）
- [ ] 添加 PropTypes
- [ ] 在 Hmi.jsx 中替换导入
- [ ] 测试状态切换

**验收标准**:
- ✓ 两种按钮样式都正常
- ✓ 点击事件正确触发

---

#### ☐ 1.1.4 - CustomLevelConfig 组件提取
**优先级**: 🟡 中  
**预计时间**: 2 小时

**步骤**:
- [ ] 创建目录 `src/shared/components/CustomLevelConfig/`
- [ ] 创建 `index.jsx`
- [ ] 提取 Toggle Switch 样式
- [ ] 添加 PropTypes
- [ ] 在 Hmi.jsx 中替换导入
- [ ] 测试开关切换

---

### 任务 1.2: 提取变体组件

#### ☐ 1.2.1 - AC Hammer 变体模块
**优先级**: 🔴 高  
**预计时间**: 4 小时

**步骤**:
- [ ] 创建目录 `src/variants/ACHammer/`
- [ ] 创建 `ACHammerScreen.jsx` - 屏幕组件
- [ ] 创建 `useACHammerState.js` - 状态管理
- [ ] 创建 `constants.js` - 常量定义
- [ ] 创建 `index.jsx` - 统一导出
- [ ] 在 Hmi.jsx 中替换逻辑
- [ ] 测试 AC Hammer 变体

**验收标准**:
- ✓ AC Hammer 独立工作
- ✓ 模式切换正常
- ✓ 状态显示正确

---

#### ☐ 1.2.2 - DC Hammer 变体模块
**优先级**: 🔴 高  
**预计时间**: 4 小时

**步骤**:
- [ ] 创建目录 `src/variants/DCHammer/`
- [ ] 创建 `DCHammerScreen.jsx`
- [ ] 创建 `useDCHammerState.js`
- [ ] 创建 `batteryLogic.js` - 电池逻辑
- [ ] 创建 `index.jsx`
- [ ] 在 Hmi.jsx 中替换逻辑
- [ ] 测试 DC Hammer 变体

**验收标准**:
- ✓ DC Hammer 独立工作
- ✓ 5段电池显示正常
- ✓ 状态覆盖功能正确

---

#### ☐ 1.2.3 - Industrial 变体模块
**优先级**: 🔴 高  
**预计时间**: 6 小时

**步骤**:
- [ ] 创建目录 `src/variants/Industrial/`
- [ ] 创建 `IndustrialScreen.jsx`
- [ ] 创建 `useIndustrialState.js`
- [ ] 创建 `torqueLogic.js` - 扭矩逻辑
- [ ] 创建 `longPressLogic.js` - 长按逻辑
- [ ] 创建 `index.jsx`
- [ ] 在 Hmi.jsx 中替换逻辑
- [ ] 测试 Industrial 变体

**验收标准**:
- ✓ Industrial 独立工作
- ✓ 7段显示正常
- ✓ 扭矩调节功能正确
- ✓ 长按锁定功能正常

---

### 任务 1.3: 变体注册系统

#### ☐ 1.3.1 - 创建变体注册中心
**优先级**: 🔴 高  
**预计时间**: 3 小时

**步骤**:
- [ ] 创建目录 `src/variants/registry/`
- [ ] 创建 `index.js`
- [ ] 定义 HMI_VARIANTS 对象
- [ ] 实现 getVariant() 函数
- [ ] 实现 getAllVariants() 函数
- [ ] 实现 isValidVariant() 函数
- [ ] 在 Hmi.jsx 中使用注册系统
- [ ] 测试变体切换

**验收标准**:
- ✓ 三个变体都可动态加载
- ✓ 变体切换无 Bug
- ✓ 便于添加新变体

---

### 任务 1.4: 共享工具函数

#### ☐ 1.4.1 - 状态样式工具
**优先级**: 🟡 中  
**预计时间**: 2 小时

**步骤**:
- [ ] 创建目录 `src/shared/utils/`
- [ ] 创建 `statusStyles.js`
- [ ] 提取 TOOL_STATUS 常量
- [ ] 提取 getStatusColor()
- [ ] 提取 getSingleBarStyle()
- [ ] 提取 getSegmentBarStyle()
- [ ] 在组件中使用工具函数
- [ ] 测试样式显示

---

## 🟡 阶段二：状态管理重构 (Week 2)

### 任务 2.1: 使用 useReducer

#### ☐ 2.1.1 - 创建状态类型定义
**优先级**: 🔴 高  
**预计时间**: 2 小时

**步骤**:
- [ ] 创建目录 `src/core/state/`
- [ ] 创建 `types.js`
- [ ] 定义所有状态类型
- [ ] 添加 JSDoc 注释

---

#### ☐ 2.1.2 - 创建 Reducer
**优先级**: 🔴 高  
**预计时间**: 4 小时

**步骤**:
- [ ] 创建 `reducer.js`
- [ ] 定义 initialState
- [ ] 定义 ActionTypes
- [ ] 实现 hmiReducer 函数
- [ ] 处理所有 action 类型
- [ ] 测试 reducer 逻辑

---

#### ☐ 2.1.3 - 创建 Action Creators
**优先级**: 🔴 高  
**预计时间**: 2 小时

**步骤**:
- [ ] 创建 `actions.js`
- [ ] 为每个 action type 创建函数
- [ ] 添加 JSDoc 注释
- [ ] 导出所有 actions

---

#### ☐ 2.1.4 - 在主组件中使用 Reducer
**优先级**: 🔴 高  
**预计时间**: 4 小时

**步骤**:
- [ ] 在 Hmi.jsx 中导入 reducer
- [ ] 替换所有 useState 为 useReducer
- [ ] 更新所有事件处理器
- [ ] 更新子组件 props
- [ ] 全面测试功能

**验收标准**:
- ✓ 所有功能正常工作
- ✓ 状态管理集中化
- ✓ 代码更易维护

---

## 🟢 阶段三：自定义Hooks提取 (Week 2)

#### ☐ 3.1.1 - useToolStatus Hook
**优先级**: 🟡 中  
**预计时间**: 2 小时

**步骤**:
- [ ] 创建目录 `src/shared/hooks/`
- [ ] 创建 `useToolStatus.js`
- [ ] 实现 Hook 逻辑
- [ ] 在 Hammer 变体中使用
- [ ] 测试功能

---

#### ☐ 3.1.2 - useLongPress Hook
**优先级**: 🟡 中  
**预计时间**: 2 小时

**步骤**:
- [ ] 创建 `useLongPress.js`
- [ ] 实现长按检测逻辑
- [ ] 在 Industrial 变体中使用
- [ ] 测试长按功能

---

#### ☐ 3.1.3 - useInteractionDisabled Hook
**优先级**: 🟢 低  
**预计时间**: 1 小时

**步骤**:
- [ ] 创建 `useInteractionDisabled.js`
- [ ] 实现禁用逻辑
- [ ] 在所有变体中使用
- [ ] 测试禁用状态

---

## 🟢 阶段四：类型安全增强 (Week 3)

#### ☐ 4.1.1 - 添加 PropTypes
**优先级**: 🟡 中  
**预计时间**: 4 小时

**步骤**:
- [ ] 安装 `npm install prop-types`
- [ ] 为 SevenSegmentDisplay 添加 PropTypes
- [ ] 为 ModeButton 添加 PropTypes
- [ ] 为 StatusButton 添加 PropTypes
- [ ] 为所有变体组件添加 PropTypes
- [ ] 测试类型检查

---

#### ☐ 4.2.1 - 添加 JSDoc 注释
**优先级**: 🟢 低  
**预计时间**: 3 小时

**步骤**:
- [ ] 为所有组件添加 JSDoc
- [ ] 为所有函数添加参数说明
- [ ] 为所有 Hook 添加使用示例
- [ ] 验证 IDE 智能提示

---

## ⚡ 阶段五：性能优化 (Week 3)

#### ☐ 5.1.1 - 使用 React.memo
**优先级**: 🟡 中  
**预计时间**: 2 小时

**步骤**:
- [ ] 为 ModeButton 添加 memo
- [ ] 为 SevenSegmentDigit 添加 memo
- [ ] 为 StatusButton 添加 memo
- [ ] 使用 React DevTools 验证

---

#### ☐ 5.1.2 - 使用 useCallback
**优先级**: 🟡 中  
**预计时间**: 2 小时

**步骤**:
- [ ] 在主组件中优化回调
- [ ] 在变体组件中优化回调
- [ ] 验证依赖数组

---

#### ☐ 5.1.3 - 使用 useMemo
**优先级**: 🟢 低  
**预计时间**: 1 小时

**步骤**:
- [ ] 优化 batteryDisplay 计算
- [ ] 优化样式计算
- [ ] 验证性能提升

---

## 🎯 最终验收清单

### 代码质量
- [ ] 主文件 Hmi.jsx < 200 行
- [ ] 所有组件都有独立文件
- [ ] 所有组件都有 PropTypes
- [ ] 代码复用率 > 90%
- [ ] 无空目录

### 功能完整性
- [ ] AC Hammer 变体正常工作
- [ ] DC Hammer 变体正常工作
- [ ] Industrial 变体正常工作
- [ ] 变体切换无 Bug
- [ ] 所有控制功能正常

### 文档完整性
- [ ] 每个组件都有 README.md
- [ ] 所有 Hook 都有使用说明
- [ ] 更新主 README.md
- [ ] 更新架构图

### 性能指标
- [ ] 首次渲染 < 500ms
- [ ] 交互响应 < 100ms
- [ ] 无不必要重渲染
- [ ] Lighthouse 评分 > 90

---

## 📝 使用说明

### 如何使用此检查清单

1. **按顺序完成**: 从阶段一开始，逐个完成任务
2. **标记进度**: 完成后在 `[ ]` 中打勾 `[x]`
3. **记录问题**: 在任务下方添加遇到的问题
4. **更新进度**: 定期更新总进度概览

### 示例标记

```markdown
#### ☑ 1.1.1 - SevenSegmentDisplay 组件拆分 ✅
**完成日期**: 2025-12-07  
**实际用时**: 3.5 小时  
**问题记录**: 
- 段码映射需要额外处理 'C' 字符
- PropTypes 需要支持 number | string 联合类型

**步骤**:
- [x] 创建目录 `src/shared/components/SevenSegmentDisplay/`
- [x] 创建 `segmentMap.js` - 提取段码映射
- [x] 创建 `SevenSegmentDigit.jsx` - 单个数字组件
- [x] 创建 `index.jsx` - 双位显示组件
- [x] 添加 PropTypes
- [x] 在 Hmi.jsx 中替换导入
- [x] 测试显示功能
```

---

## 🚀 快速开始

### 第一步：创建分支
```bash
git checkout -b optimization/component-extraction
```

### 第二步：开始第一个任务
从 **任务 1.1.1** 开始：提取 SevenSegmentDisplay 组件

### 第三步：定期提交
```bash
git add .
git commit -m "feat: extract SevenSegmentDisplay component"
```

---

**上次更新**: 2025-12-06  
**当前阶段**: 阶段一 - 任务 1.1.1
