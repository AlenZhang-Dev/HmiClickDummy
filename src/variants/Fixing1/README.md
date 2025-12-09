# Fixing 1 Variant

## 📐 尺寸规格
- **比例**: 1:2.2 (竖直长方形)
- **推荐尺寸**: 300×660px
- **方向**: 竖屏
- **无外框**: 无设备外壳边框，纯屏幕显示
- **无顶栏**: 不显示状态栏（与其他变体不同）

## 🎨 视觉风格
- **背景**: 深色 (zinc-900)
- **按钮背景**: 深灰色 (zinc-800)
- **边框**: 灰色 (zinc-600)
- **图标/文字**: 浅灰色 (zinc-400)
- **激活色**: 蓝色高亮 (blue-400/500/600)
- **风格**: 极简工业风、扁平化设计、无装饰边框

## 📋 功能描述

### 上半部分 - 模式控制
1. **两个模式图标** (横向排列，56×56px)
   - 🚫 Auto Slow Down (自动减速) - `CircleSlash` 图标
   - ⏸️ Auto Stop (自动停止) - `CirclePause` 图标
   - 当前激活模式显示蓝色文字 (blue-400)
   - 非交互式显示（仅状态指示）
   - 圆角边框设计 (rounded-lg)

2. **MODE 按钮** (大正方形 112×112px)
   - 图标: 齿轮 (Settings, 48px)
   - 文字: "MODE" (下方小字)
   - 功能: 在两种自动模式间切换
   - 悬停效果: 蓝色边框高亮
   - 激活效果: 背景变深 (zinc-700)

### 下半部分 - 速度控制
1. **三个速度档位按钮** (横向排列，56×56px)
   - 档位: **1、2、3** (大号粗体数字)
   - 间距: 24px (gap-6)
   - 当前档位特效:
     - 蓝色背景 (bg-blue-600)
     - 蓝色边框 (border-blue-500)
     - 发光阴影 (shadow-lg shadow-blue-500/50)
     - 白色文字 (text-white)
   - 非激活档位: 深灰背景，浅灰文字
   - 悬停效果: 蓝色边框渐变

2. **SPEED 按钮** (大正方形 112×112px)
   - 图标: 速度表 (Gauge, 48px)
   - 文字: "SPEED" (下方小字)
   - 功能: 循环切换速度档位 (1→2→3→1)
   - 悬停效果: 蓝色边框高亮
   - 激活效果: 背景变深 (zinc-700)

## 🎮 交互方式

### 模式图标 (只读显示)
```javascript
// 非交互式，仅根据 autoMode prop 显示状态
autoMode === 'slow_down' → CircleSlash 显示蓝色
autoMode === 'stop' → CirclePause 显示蓝色
```

### MODE 按钮 (可点击)
```javascript
// 切换自动模式
onClick → autoMode: 'slow_down' ⇄ 'stop'
// 触发 onAutoModeChange(newMode) 回调
```

### SPEED 按钮 (可点击)
```javascript
// 循环切换速度
onClick → speedLevel: 1 → 2 → 3 → 1
// 触发 onSpeedChange(newSpeed) 回调
```

### 速度档位按钮 (可点击)
```javascript
// 直接选择指定档位
onClick(1) → onSpeedChange(1)
onClick(2) → onSpeedChange(2)
onClick(3) → onSpeedChange(3)
```

### 禁用状态
当 `isInteractionDisabled={true}` 时：
- 所有按钮不可点击 (`cursor-not-allowed`)
- 整体透明度降低 50% (`opacity-50`)
- MODE 和 SPEED 按钮无悬停效果

## 📦 组件尺寸详细规格

| 元素 | 尺寸 (Tailwind) | 实际像素 | 说明 |
|------|----------------|---------|------|
| 模式图标容器 | `w-14 h-14` | 56×56px | 与速度按钮保持一致 ✅ |
| MODE 按钮 | `w-28 h-28` | 112×112px | 大正方形 |
| 速度档位按钮 | `w-14 h-14` | 56×56px | 三个小方块 |
| SPEED 按钮 | `w-28 h-28` | 112×112px | 大正方形 |
| Settings 图标 | `size={48}` | 48×48px | MODE 按钮内 |
| Gauge 图标 | `size={48}` | 48×48px | SPEED 按钮内 |
| CircleSlash 图标 | `size={28}` | 28×28px | Auto Slow Down |
| CirclePause 图标 | `size={28}` | 28×28px | Auto Stop |
| 上部图标间距 | `gap-8` | 32px | 两个模式图标 |
| 速度按钮间距 | `gap-6` | 24px | 三个速度档位 |
| 内边距 | `p-6` | 24px | 整体面板 |

## 📦 Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isOn` | `boolean` | ❌ | `true` | 工具电源状态，影响图标颜色 |
| `autoMode` | `'slow_down' \| 'stop'` | ❌ | `'slow_down'` | 当前自动模式 |
| `onAutoModeChange` | `function` | ❌ | `() => {}` | 模式切换回调 `(newMode) => void` |
| `speedLevel` | `1 \| 2 \| 3` | ❌ | `1` | 当前速度档位 |
| `onSpeedChange` | `function` | ❌ | `() => {}` | 速度切换回调 `(newLevel) => void` |
| `isInteractionDisabled` | `boolean` | ❌ | `false` | 是否禁用所有交互（按钮不可点击） |

## 💡 使用示例

### 基础用法
```jsx
import Fixing1ScreenContent from './src/variants/Fixing1';

function MyApp() {
  const [autoMode, setAutoMode] = useState('slow_down');
  const [speedLevel, setSpeedLevel] = useState(1);

  return (
    <div style={{ width: '300px', height: '660px' }}>
      <Fixing1ScreenContent
        isOn={true}
        autoMode={autoMode}
        onAutoModeChange={setAutoMode}
        speedLevel={speedLevel}
        onSpeedChange={setSpeedLevel}
        isInteractionDisabled={false}
      />
    </div>
  );
}
```

### 集成到 Hmi.jsx（主应用）
```jsx
import Fixing1ScreenContent from './variants/Fixing1';

// 在 Hmi.jsx 中
{hmiVariant === 'fixing1' && (
  <Fixing1ScreenContent
    isOn={isOn}
    autoMode={autoMode}
    onAutoModeChange={setAutoMode}
    speedLevel={speedLevel}
    onSpeedChange={setSpeedLevel}
    isInteractionDisabled={isLocked || !isOn}
  />
)}
```

### 禁用交互示例
```jsx
// 设备锁定时禁用所有按钮
<Fixing1ScreenContent
  isOn={isOn}
  autoMode={autoMode}
  speedLevel={speedLevel}
  isInteractionDisabled={isLocked}  // 锁定状态
/>
```

## 🎯 使用场景

适用于需要**竖屏显示**的固定式电动工具场景:
- ✅ 墙挂式工具控制面板
- ✅ 立式工作站触摸屏
- ✅ 工业自动化设备 HMI
- ✅ 手持竖屏移动设备
- ✅ 嵌入式系统显示界面

### 与其他变体的区别

| 特性 | Fixing1 | AC/DC Hammer | Industrial |
|------|---------|--------------|------------|
| 方向 | 竖屏 (1:2.2) | 横屏 | 横屏 |
| 顶部状态栏 | ❌ 无 | ✅ 有 | ✅ 有 |
| 外设备框 | ❌ 无 | ✅ 有 | ✅ 有 |
| 外部POWER指示 | ❌ 无 | ✅ 有 | ✅ 有 |
| 背景黑边 | ❌ 无 | ✅ 有 (p-8) | ✅ 有 (p-8) |
| 控制面板 | 只读显示 | 完全交互 | 完全交互 |
| Hammer信号模拟 | ❌ 无 | ✅ 有 | ✅ 有 |
| 主要交互 | 屏幕按钮 | 屏幕+控制面板 | 屏幕+控制面板 |

## 🔧 自定义建议

### 调整比例和尺寸
```jsx
// 方式1: 使用 aspect-ratio (推荐)
<div style={{ aspectRatio: '1 / 2.2', width: '300px' }}>
  <Fixing1ScreenContent {...props} />
</div>

// 方式2: 直接设置宽高
<div style={{ width: '300px', height: '660px' }}>
  <Fixing1ScreenContent {...props} />
</div>

// 方式3: 响应式容器
<div className="w-full max-w-sm" style={{ aspectRatio: '1/2.2' }}>
  <Fixing1ScreenContent {...props} />
</div>
```

### 修改颜色主题
编辑 `ScreenContent.jsx` 第 53-59 行的样式变量:
```javascript
// 深色主题 (默认)
const panelBgColor = 'bg-zinc-900';
const buttonBgColor = 'bg-zinc-800';
const buttonBorderColor = 'border-zinc-600';
const iconColor = isOn ? 'text-zinc-400' : 'text-zinc-700';
const activeIconColor = 'text-blue-400';
const activeButtonBg = 'bg-blue-600';

// 浅色主题示例
const panelBgColor = 'bg-gray-100';
const buttonBgColor = 'bg-white';
const buttonBorderColor = 'border-gray-300';
const iconColor = isOn ? 'text-gray-600' : 'text-gray-400';
const activeIconColor = 'text-indigo-600';
const activeButtonBg = 'bg-indigo-500';
```

### 调整按钮尺寸
```javascript
// 在 ScreenContent.jsx 中修改
// 模式图标: 第 67、78 行
className="w-14 h-14..."  // 改为 w-16 h-16 等

// MODE/SPEED 大按钮: 第 93、147 行  
className="w-28 h-28..."  // 改为 w-32 h-32 等

// 速度档位按钮: 第 122 行
className="w-14 h-14..."  // 改为 w-12 h-12 等
```

### 修改图标大小
```javascript
// Settings/Gauge 图标: 第 99、153 行
<Settings size={48} ... />  // 改为 size={56} 等

// CircleSlash/CirclePause 图标: 第 73、84 行
<CircleSlash size={28} ... />  // 改为 size={32} 等
```

## ⚙️ Feature Flags

在 `src/variants/registry/index.js` 中定义的特性:
```javascript
FIXING_1: {
  id: 'fixing1',
  name: 'Fixing 1',
  description: 'Vertical industrial layout (1:2.2)',
  features: {
    hasBatteryDisplay: false,      // 不显示电池电量
    hasSegmentedDisplay: false,    // 不使用七段数码管
    hasModeSelection: false,       // 自定义模式选择（内置）
    hasCustomLevels: false,        // 不使用自定义级别配置
    hasIndustrialStatus: false,    // 不显示工业状态指示器
    hasAutoMode: true,             // ✅ 支持自动模式 (Slow Down/Stop)
    hasSpeedControl: true,         // ✅ 支持速度控制 (1/2/3)
  }
}
```

### 在 Hmi.jsx 中的特殊处理
```javascript
// 1. 无设备外壳
className={hmiVariant === 'fixing1' ? '' : DEVICE_CASING_CLASSES}

// 2. 无黑色背景边距
{hmiVariant === 'fixing1' ? (
  <div className="relative transition-all duration-500">
    {variantContent}
  </div>
) : (
  <div className={getScreenDisplayClasses(hmiVariant)}>
    {variantContent}
  </div>
)}

// 3. 无顶部状态栏
{hmiVariant !== 'fixing1' && (
  <div className={TOP_BAR_CONTAINER_CLASSES}>...</div>
)}

// 4. 无外部 POWER 指示器
{hmiVariant !== 'fixing1' && (
  <div className={POWER_INDICATOR_CONTAINER_CLASSES}>...</div>
)}
```

### 在 ControlPanel 中的特殊处理
```javascript
// 1. 只读状态显示（不可交互）
{hmiVariant === 'fixing1' && (
  <div className="space-y-3">
    <div>Auto Mode: {autoMode === 'slow_down' ? 'Slow Down' : 'Stop'}</div>
    <div>Speed Level: {speedLevel}</div>
    <p className="text-xs italic">
      (Use on-screen buttons to control)
    </p>
  </div>
)}

// 2. 不显示 Hammer Signal Simulation
{!isIndustrial && hmiVariant !== 'fixing1' && (
  <div>Hammer Signal Simulation...</div>
)}
```

## 📊 布局比例参考

```
┌─────────────────┐  300px 宽
│     [🚫] [⏸️]   │ ← 模式图标 (各 56×56px, 间距 32px)
│                 │
│    ┌───────┐   │
│    │ ⚙️    │   │ ← MODE 按钮 (112×112px)
│    │ MODE  │   │
│    └───────┘   │
│                 │
├─────────────────┤ ← 分隔线 (border-zinc-700)
│                 │
│   [1] [2] [3]  │ ← 速度按钮 (各 56×56px, 间距 24px)
│                 │
│    ┌───────┐   │
│    │ 📊    │   │ ← SPEED 按钮 (112×112px)
│    │SPEED  │   │
│    └───────┘   │
│                 │
└─────────────────┘  660px 高
     (比例 1:2.2)
```

### 详细间距说明
- **整体内边距**: 24px (p-6)
- **上下区域间距**: 16px (space-y-6 中的 y 轴)
- **模式图标间距**: 32px (gap-8)
- **速度按钮间距**: 24px (gap-6)
- **分隔线上下边距**: 16px (my-4)

### 视觉层次
1. **一级元素**: MODE / SPEED 大按钮 (112×112px, 48px图标)
2. **二级元素**: 速度档位按钮 (56×56px, 数字)
3. **三级元素**: 模式状态图标 (56×56px, 28px图标)

## 🚀 版本历史

### v1.1.0 (2025-12-07)
- ✨ 调整模式图标容器尺寸: `w-12 h-12` → `w-14 h-14` (与速度按钮保持一致)
- 📝 完善文档，添加详细尺寸规格和使用说明
- 🎨 优化视觉层次和间距说明

### v1.0.0 (2025-12-07)
- 🎉 初始版本发布
- ✅ 实现双模式切换 (Auto Slow Down / Auto Stop)
- ✅ 实现三档速度控制 (1/2/3)
- ✅ 工业风深色主题
- ✅ 响应式交互设计
- ✅ 极简布局（无顶栏、无外框、无文字标签）
- ✅ 集成到主应用 Hmi.jsx
- ✅ 添加到 Design Variant 选择器
- ✅ 控制面板只读状态显示
- ✅ 移除 Hammer Signal Simulation

## 🔍 技术细节

### 依赖项
```json
{
  "react": "^18.x",
  "prop-types": "^15.x",
  "lucide-react": "^0.x"  // 图标库
}
```

### 使用的图标
- `Settings` (lucide-react) - MODE 按钮
- `Gauge` (lucide-react) - SPEED 按钮
- `CircleSlash` (lucide-react) - Auto Slow Down 状态
- `CirclePause` (lucide-react) - Auto Stop 状态

### Tailwind 配置要求
确保 `tailwind.config.js` 包含以下内容:
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      borderWidth: {
        '3': '3px',  // border-3 样式
      }
    }
  }
}
```

## ❓ 常见问题 FAQ

### Q1: 为什么模式图标不能点击？
**A**: 模式图标是**只读状态显示**，用于指示当前模式。要切换模式，请点击下方的 **MODE 大按钮**。

### Q2: 如何在 Control Panel 中控制 Fixing1？
**A**: Fixing1 的 Control Panel 是**只读显示**，所有控制必须通过**屏幕上的按钮**完成。这是设计决策，确保单一交互路径。

### Q3: 为什么 Fixing1 没有顶部状态栏？
**A**: Fixing1 采用极简设计，所有信息通过按钮状态显示（蓝色高亮 = 激活），无需额外状态栏。

### Q4: 如何调整图标和按钮的大小比例？
**A**: 参考上方 [🔧 自定义建议](#-自定义建议) 部分，可以修改 Tailwind 类名（如 `w-14 h-14`）和图标 `size` 属性。

### Q5: isInteractionDisabled 什么时候应该为 true？
**A**: 在以下情况下应禁用交互：
- 设备被锁定 (`isLocked === true`)
- 设备关闭 (`isOn === false`)
- 正在执行某些操作需要防止误操作时

### Q6: 为什么速度按钮有发光阴影效果？
**A**: 激活的速度档位使用 `shadow-lg shadow-blue-500/50` 创建蓝色发光效果，增强视觉反馈，符合工业 HMI 设计规范。

## 💡 最佳实践

### 1. 状态管理
```jsx
// ✅ 推荐: 在父组件统一管理状态
function ParentComponent() {
  const [autoMode, setAutoMode] = useState('slow_down');
  const [speedLevel, setSpeedLevel] = useState(1);
  
  return (
    <Fixing1ScreenContent
      autoMode={autoMode}
      onAutoModeChange={setAutoMode}
      speedLevel={speedLevel}
      onSpeedChange={setSpeedLevel}
    />
  );
}

// ❌ 避免: 组件内部不应维护状态（除非特殊需求）
```

### 2. 响应式设计
```jsx
// ✅ 推荐: 使用容器控制尺寸
<div className="w-full max-w-sm mx-auto" style={{ aspectRatio: '1/2.2' }}>
  <Fixing1ScreenContent {...props} />
</div>

// ❌ 避免: 直接修改组件内部样式
```

### 3. 交互禁用逻辑
```jsx
// ✅ 推荐: 明确的禁用条件
<Fixing1ScreenContent
  isInteractionDisabled={isLocked || !isOn || isProcessing}
/>

// ❌ 避免: 模糊的禁用逻辑
<Fixing1ScreenContent
  isInteractionDisabled={someComplexCondition}
/>
```

### 4. 回调处理
```jsx
// ✅ 推荐: 在回调中验证和处理
const handleSpeedChange = (newSpeed) => {
  if (newSpeed >= 1 && newSpeed <= 3) {
    setSpeedLevel(newSpeed);
    // 可选: 发送到后端、记录日志等
    console.log(`Speed changed to ${newSpeed}`);
  }
};

// ❌ 避免: 不验证直接设置
const handleSpeedChange = setSpeedLevel;  // 缺少验证
```

### 5. 可访问性
```jsx
// 组件内已包含 title 属性用于悬停提示
// 如需增强，可添加 aria-label
<div role="status" aria-label={`Current mode: ${autoMode}`}>
  <Fixing1ScreenContent {...props} />
</div>
```

## 📚 相关文件

- **组件源码**: `src/variants/Fixing1/ScreenContent.jsx`
- **注册配置**: `src/variants/registry/index.js`
- **主应用集成**: `Hmi.jsx`
- **控制面板**: `src/shared/components/ControlPanel/index.jsx`
- **常量定义**: `src/shared/constants/index.js`

---

**最后更新**: 2025-12-07  
**维护者**: Hmi Development Team  
**反馈**: 如有问题或建议，请提交 Issue 或 PR
