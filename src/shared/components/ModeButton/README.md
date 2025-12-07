# ModeButton Component

模式按钮组件 - 用于 Hammer 变体的模式选择界面。

## 功能特性

- ✅ 支持 Max / Soft 两种模式
- ✅ 激活/未激活状态切换
- ✅ 禁用状态支持
- ✅ 平滑过渡动画
- ✅ 三段式图标显示
- ✅ 自适应方形布局

## 使用方法

```jsx
import ModeButton from '@/shared/components/ModeButton';

function HammerScreen() {
  const [mode, setMode] = useState('max');
  const isDisabled = false;
  
  return (
    <div className="flex gap-4">
      <ModeButton 
        type="max"
        isActive={mode === 'max'}
        onClick={() => setMode('max')}
        disabled={isDisabled}
      />
      <ModeButton 
        type="soft"
        isActive={mode === 'soft'}
        onClick={() => setMode('soft')}
        disabled={isDisabled}
      />
    </div>
  );
}
```

## Props

| 属性 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `type` | `'max' \| 'soft'` | ✅ | - | 按钮类型 |
| `isActive` | `boolean` | ✅ | - | 是否激活 |
| `onClick` | `function` | ✅ | - | 点击回调 |
| `disabled` | `boolean` | ❌ | `false` | 是否禁用 |

## 显示逻辑

### Max 模式 (100%)
- 标签显示: `100%`
- 三个条形图高度: 35%, 65%, 100%
- 表示最大功率

### Soft 模式 (70%)
- 标签显示: `70%`
- 三个条形图高度: 35%, 50%, 65%
- 表示软启动模式

## 状态样式

### 激活状态
- 边框: `border-slate-300`
- 背景: `bg-zinc-800`
- 阴影: `shadow-[0_0_15px_rgba(255,255,255,0.1)]`
- 文本: `text-slate-200`

### 未激活状态
- 边框: `border-zinc-700`
- 背景: `bg-transparent`
- 透明度: `opacity-40` (hover: `opacity-60`)
- 文本: `text-zinc-600`

### 禁用状态
- **禁用 + 激活**: 暗灰色，60% 不透明度
- **禁用 + 未激活**: 极暗，20% 不透明度
- 鼠标: `cursor-not-allowed`

## 示例

### 基础用法

```jsx
<ModeButton 
  type="max"
  isActive={true}
  onClick={handleClick}
/>
```

### 禁用状态

```jsx
<ModeButton 
  type="soft"
  isActive={false}
  onClick={handleClick}
  disabled={true}
/>
```

### 完整示例

```jsx
function ACHammerScreen() {
  const [mode, setMode] = useState('max');
  const [isLocked, setIsLocked] = useState(false);
  
  return (
    <div className="flex justify-between items-center gap-12">
      <ModeButton 
        type="max"
        isActive={mode === 'max'}
        onClick={() => !isLocked && setMode('max')}
        disabled={isLocked}
      />
      <ModeButton 
        type="soft"
        isActive={mode === 'soft'}
        onClick={() => !isLocked && setMode('soft')}
        disabled={isLocked}
      />
    </div>
  );
}
```

## 依赖

- React
- PropTypes
- Tailwind CSS

## 适用场景

- AC Hammer 变体
- DC Hammer 变体
- 任何需要模式选择的界面

## 版本历史

- **v1.0.0** (2025-12-07): 初始版本，从 Hmi.jsx 提取
