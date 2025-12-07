# SevenSegmentDisplay Component

7段数码管显示组件 - 用于工业级HMI界面的数字显示。

## 功能特性

- ✅ 支持数字显示 (0-99)
- ✅ 支持字符显示 ('H', 'C1', 'C2', 'C3')
- ✅ 可自定义颜色
- ✅ 平滑过渡动画
- ✅ 响应式设计

## 使用方法

```jsx
import SevenSegmentDisplay from '@/shared/components/SevenSegmentDisplay';

// 显示数字
<SevenSegmentDisplay value={42} />

// 显示自定义级别
<SevenSegmentDisplay value="C1" />

// 自定义颜色
<SevenSegmentDisplay 
  value={5}
  activeColor="bg-red-500"
  inactiveColor="bg-gray-800"
/>
```

## Props

| 属性 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `number \| string` | ✅ | - | 显示值 (0-99 或 'C1', 'C2', 'C3') |
| `activeColor` | `string` | ❌ | `'bg-white shadow-[...]'` | 激活段的 Tailwind 类 |
| `inactiveColor` | `string` | ❌ | `'bg-zinc-900/50'` | 非激活段的 Tailwind 类 |

## 显示逻辑

- **0**: 显示 `H ` (High Torque)
- **1-9**: 显示 ` 1` - ` 9` (前导空格，无前导零)
- **10-99**: 显示 `10` - `99`
- **'C1', 'C2', 'C3'**: 显示自定义级别

## 文件结构

```
SevenSegmentDisplay/
├── index.jsx              # 主组件 (2位显示)
├── SevenSegmentDigit.jsx  # 单个数字组件
├── segmentMap.js          # 段码映射表
└── README.md              # 本文件
```

## 段位说明

7段数码管的段位定义:

```
 AAAA
F    B
F    B
 GGGG
E    C
E    C
 DDDD
```

- A: 顶部横向
- B: 右上纵向
- C: 右下纵向
- D: 底部横向
- E: 左下纵向
- F: 左上纵向
- G: 中间横向

## 示例

### 基础使用

```jsx
function IndustrialPanel() {
  const [torqueLevel, setTorqueLevel] = useState(25);
  
  return (
    <div className="bg-black p-4">
      <SevenSegmentDisplay value={torqueLevel} />
    </div>
  );
}
```

### 动态颜色

```jsx
function AlertDisplay({ value, isWarning }) {
  return (
    <SevenSegmentDisplay 
      value={value}
      activeColor={isWarning ? 'bg-yellow-400' : 'bg-green-400'}
    />
  );
}
```

## 依赖

- React
- PropTypes
- Tailwind CSS

## 版本历史

- **v1.0.0** (2025-12-07): 初始版本，从 Hmi.jsx 提取
