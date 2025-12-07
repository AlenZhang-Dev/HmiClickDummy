# StatusButton Components

状态按钮组件 - 用于控制面板的状态模拟和切换。

## 组件列表

### 1. StatusButton
用于 **Hammer 变体**（AC/DC）的状态模拟按钮。

### 2. IndStatusButton  
用于 **Industrial 变体**的状态切换按钮。

---

## StatusButton (Hammer 变体)

### 功能特性

- ✅ 状态选择和显示
- ✅ 选中/未选中状态
- ✅ 自定义颜色
- ✅ 图标 + 标签显示
- ✅ 平滑过渡动画

### 使用方法

```jsx
import { StatusButton } from '@/shared/components/StatusButton';
import { CheckCircle, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';

function HammerControlPanel() {
  const [toolStatus, setToolStatus] = useState('normal');
  
  return (
    <div className="grid grid-cols-4 gap-2">
      <StatusButton 
        status="normal" 
        currentStatus={toolStatus}
        onClick={() => setToolStatus('normal')}
        icon={<CheckCircle size={24} />}
        label="Normal"
        color="bg-green-600"
      />
      <StatusButton 
        status="warning" 
        currentStatus={toolStatus}
        onClick={() => setToolStatus('warning')}
        icon={<AlertTriangle size={24} />}
        label="Warning"
        color="bg-yellow-600"
      />
      <StatusButton 
        status="error" 
        currentStatus={toolStatus}
        onClick={() => setToolStatus('error')}
        icon={<XCircle size={24} />}
        label="Error"
        color="bg-red-600"
      />
      <StatusButton 
        status="safety_error" 
        currentStatus={toolStatus}
        onClick={() => setToolStatus('safety_error')}
        icon={<ShieldAlert size={24} />}
        label="Safety"
        color="bg-red-800 animate-pulse"
      />
    </div>
  );
}
```

### Props

| 属性 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `status` | `string` | ✅ | 此按钮代表的状态值 |
| `currentStatus` | `string` | ✅ | 当前激活的状态 |
| `onClick` | `function` | ✅ | 点击回调 |
| `icon` | `ReactNode` | ✅ | 图标组件 |
| `label` | `string` | ✅ | 按钮标签 |
| `color` | `string` | ✅ | 激活时的背景颜色类 |

---

## IndStatusButton (Industrial 变体)

### 功能特性

- ✅ 状态切换（开/关）
- ✅ 激活/未激活视觉反馈
- ✅ Lucide 图标支持
- ✅ 蓝色主题
- ✅ 缩放动画

### 使用方法

```jsx
import { IndStatusButton } from '@/shared/components/StatusButton';
import { ShieldAlert, Wrench, Info } from 'lucide-react';

function IndustrialControlPanel() {
  const [indStatus, setIndStatus] = useState({
    isKickback: false,
    isMaintenance: false,
    isNFC: false
  });
  
  const toggleIndStatus = (key) => {
    setIndStatus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  return (
    <div className="grid grid-cols-3 gap-2">
      <IndStatusButton 
        statusKey="isKickback"
        isActive={indStatus.isKickback}
        onClick={toggleIndStatus}
        Icon={ShieldAlert}
        label="反冲触发 (Kickback)"
      />
      <IndStatusButton 
        statusKey="isMaintenance"
        isActive={indStatus.isMaintenance}
        onClick={toggleIndStatus}
        Icon={Wrench}
        label="保养模拟"
      />
      <IndStatusButton 
        statusKey="isNFC"
        isActive={indStatus.isNFC}
        onClick={toggleIndStatus}
        Icon={Info}
        label="NFC通讯"
      />
    </div>
  );
}
```

### Props

| 属性 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `statusKey` | `string` | ✅ | 状态键名 |
| `isActive` | `boolean` | ✅ | 是否激活 |
| `onClick` | `function` | ✅ | 点击回调（接收 statusKey） |
| `Icon` | `Component` | ✅ | Lucide 图标组件 |
| `label` | `string` | ✅ | 按钮标签 |

---

## 导入方式

```jsx
// 导入 StatusButton (默认导出)
import StatusButton from '@/shared/components/StatusButton';

// 导入 StatusButton (命名导出)
import { StatusButton } from '@/shared/components/StatusButton';

// 导入 IndStatusButton (命名导出)
import { IndStatusButton } from '@/shared/components/StatusButton';

// 同时导入两者
import { StatusButton, IndStatusButton } from '@/shared/components/StatusButton';
```

---

## 状态样式

### StatusButton 状态

| 状态 | 未选中 | 选中 |
|------|--------|------|
| 背景 | `bg-slate-600` | 自定义颜色（如 `bg-green-600`） |
| 文本 | `text-slate-300` | `text-white` |
| 缩放 | `scale-100` | `scale-105` |
| 光环 | 无 | `ring-2 ring-white` |
| Hover | `hover:bg-slate-500` | - |

### IndStatusButton 状态

| 状态 | 未激活 | 激活 |
|------|--------|------|
| 背景 | `bg-slate-600` | `bg-blue-600` |
| 文本 | `text-slate-300` | `text-white` |
| 缩放 | `scale-100` | `scale-105` |
| 光环 | 无 | `ring-2 ring-white` |
| Hover | `hover:bg-slate-500` | - |

---

## 完整示例

### Hammer 变体控制面板

```jsx
import { StatusButton } from '@/shared/components/StatusButton';
import { CheckCircle, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';

function HammerControls({ toolStatus, setToolStatus, isOn }) {
  return (
    <div className={`transition-opacity ${!isOn ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="text-slate-400 text-xs font-bold uppercase mb-3">
        Hammer Signal Simulation (信号模拟)
      </div>
      <div className="grid grid-cols-4 gap-2">
        <StatusButton 
          status="normal" 
          currentStatus={toolStatus} 
          onClick={() => setToolStatus('normal')} 
          icon={<CheckCircle size={24} />} 
          label="Normal" 
          color="bg-green-600"
        />
        <StatusButton 
          status="warning" 
          currentStatus={toolStatus} 
          onClick={() => setToolStatus('warning')} 
          icon={<AlertTriangle size={24} />} 
          label="Warning" 
          color="bg-yellow-600"
        />
        <StatusButton 
          status="error" 
          currentStatus={toolStatus} 
          onClick={() => setToolStatus('error')} 
          icon={<XCircle size={24} />} 
          label="Error" 
          color="bg-red-600"
        />
        <StatusButton 
          status="safety_error" 
          currentStatus={toolStatus} 
          onClick={() => setToolStatus('safety_error')} 
          icon={<ShieldAlert size={24} />} 
          label="Safety" 
          color="bg-red-800 animate-pulse"
        />
      </div>
    </div>
  );
}
```

### Industrial 变体控制面板

```jsx
import { IndStatusButton } from '@/shared/components/StatusButton';
import { ShieldAlert, Wrench, Info } from 'lucide-react';

function IndustrialControls({ indStatus, toggleIndStatus, isOn }) {
  return (
    <div className={`transition-opacity ${!isOn ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="text-slate-400 text-xs font-bold uppercase mb-3">
        Industrial Signal Simulation (工业信号模拟)
      </div>
      <div className="grid grid-cols-3 gap-2">
        <IndStatusButton 
          statusKey="isKickback" 
          isActive={indStatus.isKickback} 
          onClick={toggleIndStatus} 
          Icon={ShieldAlert} 
          label="反冲触发 (Kickback)"
        />
        <IndStatusButton 
          statusKey="isMaintenance" 
          isActive={indStatus.isMaintenance} 
          onClick={toggleIndStatus} 
          Icon={Wrench} 
          label="保养模拟"
        />
        <IndStatusButton 
          statusKey="isNFC" 
          isActive={indStatus.isNFC} 
          onClick={toggleIndStatus} 
          Icon={Info} 
          label="NFC通讯"
        />
      </div>
    </div>
  );
}
```

---

## 依赖

- React
- PropTypes
- Tailwind CSS
- Lucide React (图标)

---

## 适用场景

### StatusButton
- AC Hammer 控制面板
- DC Hammer 控制面板
- 任何需要状态选择的界面

### IndStatusButton
- Industrial 控制面板
- 任何需要开关切换的界面

---

## 版本历史

- **v1.0.0** (2025-12-07): 初始版本，从 Hmi.jsx 提取
  - 提取 StatusButton 组件
  - 提取 IndStatusButton 组件
  - 添加 PropTypes 类型检查
  - 统一命名导出和默认导出
