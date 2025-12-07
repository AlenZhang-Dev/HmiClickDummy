# 🎯 HMI 项目优化方案

> **项目**: Electric Tool HMI Simulator  
> **当前分支**: `Optimization/Re-structure-module`  
> **优化目标**: 提升代码复用性和可维护性  
> **预计工期**: 2-3 周

---

## 📋 目录

1. [优化方案总览](#优化方案总览)
2. [阶段一：组件模块化](#阶段一组件模块化)
3. [阶段二：状态管理重构](#阶段二状态管理重构)
4. [阶段三：自定义Hooks提取](#阶段三自定义hooks提取)
5. [阶段四：类型安全增强](#阶段四类型安全增强)
6. [阶段五：性能优化](#阶段五性能优化)
7. [实施时间表](#实施时间表)

---

## 优化方案总览

### 当前问题

| 问题类型 | 严重程度 | 影响范围 |
|---------|---------|---------|
| 单文件巨石架构 (1068行) | 🔴 严重 | 可维护性、协作效率 |
| 组件未拆分复用 | 🔴 严重 | 代码复用、测试能力 |
| 状态管理分散 (15+ useState) | 🟡 中等 | 状态追踪、调试 |
| 缺少类型定义 | 🟡 中等 | 类型安全、IDE支持 |
| 空目录结构 | 🟢 轻微 | 架构完整性 |

### 优化目标

- ✅ 主文件行数从 1068 行减少到 < 200 行 (↓ 81%)
- ✅ 组件复用率从 0% 提升到 90%+
- ✅ 新变体开发时间缩短 70%
- ✅ 实现单元测试能力
- ✅ 降低协作冲突率 80%

---

## 阶段一：组件模块化

### 📦 1.1 提取共享组件

#### **任务 1.1.1: SevenSegmentDisplay 组件拆分**

**目标**: 将7段数码管组件从 `Hmi.jsx` 提取到独立模块

**文件结构**:
```
src/shared/components/SevenSegmentDisplay/
├── index.jsx                    # 主组件导出
├── SevenSegmentDigit.jsx        # 单个数字组件
├── segmentMap.js                # 段码映射表
└── README.md                    # 组件文档
```

**实施步骤**:
1. 创建 `segmentMap.js` - 提取段码映射数据
2. 创建 `SevenSegmentDigit.jsx` - 提取单个数字组件
3. 创建 `index.jsx` - 提取双位显示组件
4. 添加 PropTypes 类型检查
5. 编写组件文档

**代码示例** (`src/shared/components/SevenSegmentDisplay/segmentMap.js`):
```javascript
/**
 * 7段数码管段码映射表
 * 段位定义: A=上, B=右上, C=右下, D=下, E=左下, F=左上, G=中
 */
export const SEGMENT_MAP = {
  ' ': [],
  '0': ['A', 'B', 'C', 'D', 'E', 'F'],
  '1': ['B', 'C'],
  '2': ['A', 'B', 'G', 'E', 'D'],
  '3': ['A', 'B', 'G', 'C', 'D'],
  '4': ['F', 'G', 'B', 'C'],
  '5': ['A', 'F', 'G', 'C', 'D'],
  '6': ['A', 'F', 'G', 'E', 'D', 'C'],
  '7': ['A', 'B', 'C'],
  '8': ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  '9': ['A', 'B', 'C', 'D', 'F', 'G'],
  'H': ['F', 'E', 'G', 'B', 'C'],
  'C': ['A', 'F', 'E', 'D'],
};
```

**预期收益**:
- ✅ 可在其他项目中直接复用
- ✅ 便于单独测试显示逻辑
- ✅ 降低主文件复杂度 (~100行)

---

#### **任务 1.1.2: ModeButton 组件独立化**

**目标**: 提取模式按钮组件

**文件结构**:
```
src/shared/components/ModeButton/
├── index.jsx          # 主组件
├── styles.js          # 样式配置
└── README.md
```

**实施步骤**:
1. 创建独立组件文件
2. 提取样式计算逻辑
3. 添加 PropTypes
4. 优化禁用状态处理

**代码框架**:
```javascript
import PropTypes from 'prop-types';

export default function ModeButton({ 
  type,           // 'max' | 'soft'
  isActive,       // boolean
  onClick,        // function
  disabled        // boolean
}) {
  // 组件逻辑
}

ModeButton.propTypes = {
  type: PropTypes.oneOf(['max', 'soft']).isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};
```

---

#### **任务 1.1.3: StatusButton 组件完善**

**目标**: 完善空的 StatusButton 组件

**文件路径**: `src/shared/components/StatusButton/index.jsx`

**实施步骤**:
1. 从 `Hmi.jsx` 复制 StatusButton 和 IndStatusButton
2. 合并为统一组件，通过 props 区分变体
3. 添加类型定义
4. 导出两个命名导出

**代码框架**:
```javascript
// StatusButton for Hammer variants
export function StatusButton({ status, currentStatus, onClick, icon, label, color }) {
  // ...
}

// IndStatusButton for Industrial variant
export function IndStatusButton({ statusKey, isActive, onClick, Icon, label }) {
  // ...
}
```

---

#### **任务 1.1.4: CustomLevelConfig 组件提取**

**文件结构**:
```
src/shared/components/CustomLevelConfig/
├── index.jsx
└── README.md
```

**重点优化**:
- 提取 Toggle Switch 样式到组件内部
- 添加回调函数类型检查
- 优化激活/禁用状态视觉反馈

---

### 📦 1.2 提取变体组件

#### **任务 1.2.1: AC Hammer 变体模块**

**文件结构**:
```
src/variants/ACHammer/
├── index.jsx                 # 主组件导出
├── ACHammerScreen.jsx        # 屏幕显示组件
├── ACHammerControls.jsx      # 控制面板组件
├── useACHammerState.js       # 状态管理 Hook
├── constants.js              # 变体常量
└── README.md
```

**状态管理示例** (`useACHammerState.js`):
```javascript
export function useACHammerState() {
  const [mode, setMode] = useState('max');
  const [toolStatus, setToolStatus] = useState('normal');
  
  const handleModeSelect = (selectedMode, isDisabled) => {
    if (isDisabled) return;
    setMode(selectedMode);
  };
  
  const getStatusLabel = () => {
    switch (toolStatus) {
      case 'normal': return 'NORMAL';
      case 'warning': return 'WARNING';
      case 'error': return 'ERROR';
      case 'safety_error': return 'SAFETY STOP';
      default: return '';
    }
  };
  
  return {
    mode,
    toolStatus,
    setToolStatus,
    handleModeSelect,
    getStatusLabel
  };
}
```

**屏幕组件示例** (`ACHammerScreen.jsx`):
```javascript
import ModeButton from '../../shared/components/ModeButton';

export default function ACHammerScreen({ 
  mode, 
  onModeSelect, 
  isDisabled,
  isOn 
}) {
  return (
    <div className="flex justify-between items-center gap-12">
      <ModeButton 
        type="max"
        isActive={mode === 'max'}
        onClick={() => onModeSelect('max')}
        disabled={isDisabled}
      />
      <ModeButton 
        type="soft"
        isActive={mode === 'soft'}
        onClick={() => onModeSelect('soft')}
        disabled={isDisabled}
      />
    </div>
  );
}
```

---

#### **任务 1.2.2: DC Hammer 变体模块**

**文件结构**:
```
src/variants/DCHammer/
├── index.jsx
├── DCHammerScreen.jsx
├── DCHammerControls.jsx
├── useDCHammerState.js
├── batteryLogic.js           # 电池显示逻辑
└── README.md
```

**电池逻辑提取** (`batteryLogic.js`):
```javascript
/**
 * 计算电池条显示
 * @param {number} batteryLevel - 电池电量百分比 (0-100)
 * @returns {{numActiveBars: number, activeBarColorClass: string}}
 */
export function calculateBatteryDisplay(batteryLevel) {
  if (batteryLevel <= 0) {
    return { numActiveBars: 0, activeBarColorClass: 'bg-red-500' };
  } else if (batteryLevel <= 1) {
    return { numActiveBars: 1, activeBarColorClass: 'bg-red-500' };
  } else if (batteryLevel <= 20) {
    return { numActiveBars: 1, activeBarColorClass: 'bg-yellow-500' };
  } else if (batteryLevel <= 40) {
    return { numActiveBars: 2, activeBarColorClass: 'bg-green-500' };
  } else if (batteryLevel <= 60) {
    return { numActiveBars: 3, activeBarColorClass: 'bg-green-500' };
  } else if (batteryLevel <= 80) {
    return { numActiveBars: 4, activeBarColorClass: 'bg-green-500' };
  } else {
    return { numActiveBars: 5, activeBarColorClass: 'bg-green-500' };
  }
}

/**
 * 获取电池滑块轨道颜色
 */
export function getBatterySliderColor(batteryLevel) {
  if (batteryLevel <= 1) return '#ef4444';      // Red
  if (batteryLevel <= 20) return '#f59e0b';     // Yellow
  return '#10b981';                              // Green
}
```

---

#### **任务 1.2.3: Industrial 变体模块**

**文件结构**:
```
src/variants/Industrial/
├── index.jsx
├── IndustrialScreen.jsx
├── IndustrialControls.jsx
├── useIndustrialState.js
├── torqueLogic.js            # 扭矩选择逻辑
├── longPressLogic.js         # 长按锁定逻辑
└── README.md
```

**扭矩逻辑提取** (`torqueLogic.js`):
```javascript
/**
 * 生成可选扭矩序列
 * @param {number} maxLimit - 最大扭矩限制 (0-99)
 * @param {Object} customLevels - 自定义级别配置
 * @returns {Array} 完整的可选序列
 */
export function generateTorqueSequence(maxLimit, customLevels) {
  // 数字级别: 0, 1, 2, ..., maxLimit
  const numericLevels = Array.from({ length: maxLimit + 1 }, (_, i) => i);
  
  // 激活的自定义级别
  const activeCustomKeys = Object.keys(customLevels)
    .filter(key => customLevels[key].isActive)
    .sort();
  
  return [...numericLevels, ...activeCustomKeys];
}

/**
 * 调整扭矩选择（非循环）
 */
export function adjustTorqueSelection(currentSelection, delta, sequence) {
  const currentIndex = sequence.indexOf(currentSelection);
  const newIndex = currentIndex + delta;
  
  if (newIndex >= 0 && newIndex < sequence.length) {
    return sequence[newIndex];
  }
  
  return currentSelection; // 保持不变
}
```

**长按逻辑提取** (`longPressLogic.js`):
```javascript
import { useState, useCallback } from 'react';

export function useLongPress(callback, delay = 3000) {
  const [timer, setTimer] = useState(null);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    const timeoutId = setTimeout(() => {
      callback();
      setTimer(null);
    }, delay);
    setTimer(timeoutId);
  }, [callback, delay]);

  const handleMouseUp = useCallback(() => {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
  }, [timer]);

  return {
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onTouchStart: handleMouseDown,
    onTouchEnd: handleMouseUp,
    isLongPressing: timer !== null
  };
}
```

---

### 📦 1.3 变体注册系统

#### **任务 1.3.1: 创建变体注册中心**

**文件**: `src/variants/registry/index.js`

**代码实现**:
```javascript
import ACHammerScreen from '../ACHammer';
import DCHammerScreen from '../DCHammer';
import IndustrialScreen from '../Industrial';

/**
 * HMI 变体注册表
 * 用于动态加载和切换不同的设备界面
 */
export const HMI_VARIANTS = {
  standard: {
    id: 'standard',
    name: 'AC Hammer',
    displayName: 'AC Hammer',
    Component: ACHammerScreen,
    description: '交流锤钻标准界面 - 单条状态栏显示',
    features: ['Mode Selection (Max/Soft)', 'Single Status Bar', 'Power Indicator']
  },
  
  segmented: {
    id: 'segmented',
    name: 'DC Hammer',
    displayName: 'DC Hammer',
    Component: DCHammerScreen,
    description: '直流锤钻界面 - 5段电池显示',
    features: ['Mode Selection (Max/Soft)', '5-Bar Battery Display', 'Status Override']
  },
  
  industrial: {
    id: 'industrial',
    name: 'Industrial',
    displayName: 'Industrial Tool',
    Component: IndustrialScreen,
    description: '工业级工具界面 - 7段数码管显示',
    features: [
      '7-Segment Display',
      'Torque Level Control',
      'Custom Torque Levels',
      'Advanced Status Indicators',
      'Tool Lock System',
      'Kickback Protection'
    ]
  }
};

/**
 * 获取变体配置
 */
export function getVariant(variantId) {
  return HMI_VARIANTS[variantId];
}

/**
 * 获取所有变体列表
 */
export function getAllVariants() {
  return Object.values(HMI_VARIANTS);
}

/**
 * 验证变体ID是否有效
 */
export function isValidVariant(variantId) {
  return variantId in HMI_VARIANTS;
}
```

**使用示例** (在主组件中):
```javascript
import { HMI_VARIANTS, getVariant } from './variants/registry';

function ElectricToolHMI() {
  const [hmiVariant, setHmiVariant] = useState('industrial');
  
  const currentVariant = getVariant(hmiVariant);
  const VariantComponent = currentVariant.Component;
  
  return (
    <div>
      {/* ... */}
      <VariantComponent {...variantProps} />
      {/* ... */}
    </div>
  );
}
```

---

### 📦 1.4 共享工具函数

#### **任务 1.4.1: 状态样式工具**

**文件**: `src/shared/utils/statusStyles.js`

**代码实现**:
```javascript
/**
 * 工具状态类型
 */
export const TOOL_STATUS = {
  NORMAL: 'normal',
  WARNING: 'warning',
  ERROR: 'error',
  SAFETY_ERROR: 'safety_error'
};

/**
 * 获取状态基础颜色类
 */
export function getStatusColor(status) {
  switch (status) {
    case TOOL_STATUS.NORMAL:
      return 'bg-green-500';
    case TOOL_STATUS.WARNING:
      return 'bg-yellow-500';
    case TOOL_STATUS.ERROR:
    case TOOL_STATUS.SAFETY_ERROR:
      return 'bg-red-600';
    default:
      return 'bg-blue-100';
  }
}

/**
 * 获取单条状态栏样式（AC Hammer / Industrial 顶部栏）
 */
export function getSingleBarStyle(isOn, status) {
  if (!isOn) return 'bg-slate-400';
  
  switch (status) {
    case TOOL_STATUS.NORMAL:
      return 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]';
    case TOOL_STATUS.WARNING:
      return 'bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.4)]';
    case TOOL_STATUS.ERROR:
      return 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]';
    case TOOL_STATUS.SAFETY_ERROR:
      return 'bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.8)] animate-blink-2hz';
    default:
      return 'bg-blue-100';
  }
}

/**
 * 获取分段条样式（DC Hammer）
 */
export function getSegmentBarStyle(isOn, status) {
  if (!isOn) return 'bg-slate-600 opacity-30';
  
  const baseColor = getStatusColor(status);
  const shadow = status === TOOL_STATUS.NORMAL 
    ? 'shadow-[0_0_10px_rgba(34,197,94,0.5)]'
    : status === TOOL_STATUS.WARNING
    ? 'shadow-[0_0_10px_rgba(234,179,8,0.5)]'
    : 'shadow-[0_0_15px_rgba(220,38,38,0.6)]';
  
  const animation = status === TOOL_STATUS.SAFETY_ERROR ? 'animate-blink-2hz' : '';
  
  return `${baseColor} ${shadow} ${animation}`;
}
```

---

## 阶段二：状态管理重构

### 📊 2.1 使用 useReducer 重构全局状态

#### **任务 2.1.1: 创建状态类型定义**

**文件**: `src/core/state/types.js`

**代码实现**:
```javascript
/**
 * 应用状态类型定义
 */

// 电源状态
export const PowerState = {
  isOn: Boolean
};

// 变体类型
export const VariantType = {
  STANDARD: 'standard',
  SEGMENTED: 'segmented',
  INDUSTRIAL: 'industrial'
};

// 工具状态
export const ToolStatus = {
  NORMAL: 'normal',
  WARNING: 'warning',
  ERROR: 'error',
  SAFETY_ERROR: 'safety_error'
};

// 工业变体状态指示器
export const IndustrialStatus = {
  isLocked: Boolean,
  isKickback: Boolean,
  isMaintenance: Boolean,
  isNFC: Boolean
};

// 自定义扭矩级别
export const CustomLevel = {
  isActive: Boolean
};
```

---

#### **任务 2.1.2: 创建 Reducer**

**文件**: `src/core/state/reducer.js`

**代码实现**:
```javascript
import { TOOL_STATUS } from '../../shared/utils/statusStyles';

// 初始状态
export const initialState = {
  // 电源状态
  power: {
    isOn: true
  },
  
  // 当前变体
  variant: {
    type: 'industrial' // 'standard' | 'segmented' | 'industrial'
  },
  
  // Hammer 变体状态（standard & segmented 共享）
  hammer: {
    mode: 'max',              // 'max' | 'soft'
    toolStatus: TOOL_STATUS.NORMAL
  },
  
  // DC Hammer 特有状态
  dcHammer: {
    batteryLevel: 85          // 0-100
  },
  
  // Industrial 变体状态
  industrial: {
    torque: {
      maxLimit: 50,           // 0-99
      currentSelection: 5     // 数字或 'C1', 'C2', 'C3'
    },
    customLevels: {
      C1: { isActive: true },
      C2: { isActive: true },
      C3: { isActive: false }
    },
    status: {
      isLocked: false,
      isKickback: false,
      isMaintenance: false,
      isNFC: false
    },
    maintenance: {
      cycleCount: 0
    },
    battery: {
      level: 85               // 0-100
    }
  }
};

// Action Types
export const ActionTypes = {
  // 电源控制
  TOGGLE_POWER: 'TOGGLE_POWER',
  
  // 变体切换
  SET_VARIANT: 'SET_VARIANT',
  
  // Hammer 控制
  SET_MODE: 'SET_MODE',
  SET_TOOL_STATUS: 'SET_TOOL_STATUS',
  
  // DC Hammer 控制
  SET_BATTERY_LEVEL: 'SET_BATTERY_LEVEL',
  
  // Industrial 控制
  SET_MAX_TORQUE_LIMIT: 'SET_MAX_TORQUE_LIMIT',
  SET_CURRENT_TORQUE: 'SET_CURRENT_TORQUE',
  TOGGLE_CUSTOM_LEVEL: 'TOGGLE_CUSTOM_LEVEL',
  TOGGLE_IND_STATUS: 'TOGGLE_IND_STATUS',
  SET_CYCLE_COUNT: 'SET_CYCLE_COUNT',
  SET_IND_BATTERY: 'SET_IND_BATTERY'
};

// Reducer 函数
export function hmiReducer(state, action) {
  switch (action.type) {
    case ActionTypes.TOGGLE_POWER:
      return {
        ...state,
        power: { isOn: !state.power.isOn }
      };
    
    case ActionTypes.SET_VARIANT:
      return {
        ...state,
        variant: { type: action.payload }
      };
    
    case ActionTypes.SET_MODE:
      return {
        ...state,
        hammer: { ...state.hammer, mode: action.payload }
      };
    
    case ActionTypes.SET_TOOL_STATUS:
      return {
        ...state,
        hammer: { ...state.hammer, toolStatus: action.payload }
      };
    
    case ActionTypes.SET_BATTERY_LEVEL:
      return {
        ...state,
        dcHammer: { ...state.dcHammer, batteryLevel: action.payload }
      };
    
    case ActionTypes.SET_MAX_TORQUE_LIMIT: {
      const newLimit = action.payload;
      let newSelection = state.industrial.torque.currentSelection;
      
      // 如果当前选择超过新限制，自动调整
      if (typeof newSelection === 'number' && newSelection > newLimit) {
        newSelection = newLimit;
      }
      
      return {
        ...state,
        industrial: {
          ...state.industrial,
          torque: {
            maxLimit: newLimit,
            currentSelection: newSelection
          }
        }
      };
    }
    
    case ActionTypes.SET_CURRENT_TORQUE:
      return {
        ...state,
        industrial: {
          ...state.industrial,
          torque: {
            ...state.industrial.torque,
            currentSelection: action.payload
          }
        }
      };
    
    case ActionTypes.TOGGLE_CUSTOM_LEVEL: {
      const levelKey = action.payload;
      const newCustomLevels = {
        ...state.industrial.customLevels,
        [levelKey]: {
          ...state.industrial.customLevels[levelKey],
          isActive: !state.industrial.customLevels[levelKey].isActive
        }
      };
      
      // 如果禁用了当前选中的自定义级别，切换到最大数字级别
      let newSelection = state.industrial.torque.currentSelection;
      if (newSelection === levelKey && !newCustomLevels[levelKey].isActive) {
        newSelection = state.industrial.torque.maxLimit;
      }
      
      return {
        ...state,
        industrial: {
          ...state.industrial,
          customLevels: newCustomLevels,
          torque: {
            ...state.industrial.torque,
            currentSelection: newSelection
          }
        }
      };
    }
    
    case ActionTypes.TOGGLE_IND_STATUS: {
      const statusKey = action.payload;
      return {
        ...state,
        industrial: {
          ...state.industrial,
          status: {
            ...state.industrial.status,
            [statusKey]: !state.industrial.status[statusKey]
          }
        }
      };
    }
    
    case ActionTypes.SET_CYCLE_COUNT:
      return {
        ...state,
        industrial: {
          ...state.industrial,
          maintenance: { cycleCount: action.payload }
        }
      };
    
    case ActionTypes.SET_IND_BATTERY:
      return {
        ...state,
        industrial: {
          ...state.industrial,
          battery: { level: action.payload }
        }
      };
    
    default:
      return state;
  }
}
```

---

#### **任务 2.1.3: 创建 Action Creators**

**文件**: `src/core/state/actions.js`

**代码实现**:
```javascript
import { ActionTypes } from './reducer';

// 电源控制
export const togglePower = () => ({
  type: ActionTypes.TOGGLE_POWER
});

// 变体切换
export const setVariant = (variantType) => ({
  type: ActionTypes.SET_VARIANT,
  payload: variantType
});

// Hammer 控制
export const setMode = (mode) => ({
  type: ActionTypes.SET_MODE,
  payload: mode
});

export const setToolStatus = (status) => ({
  type: ActionTypes.SET_TOOL_STATUS,
  payload: status
});

// DC Hammer 控制
export const setBatteryLevel = (level) => ({
  type: ActionTypes.SET_BATTERY_LEVEL,
  payload: level
});

// Industrial 控制
export const setMaxTorqueLimit = (limit) => ({
  type: ActionTypes.SET_MAX_TORQUE_LIMIT,
  payload: limit
});

export const setCurrentTorque = (selection) => ({
  type: ActionTypes.SET_CURRENT_TORQUE,
  payload: selection
});

export const toggleCustomLevel = (levelKey) => ({
  type: ActionTypes.TOGGLE_CUSTOM_LEVEL,
  payload: levelKey
});

export const toggleIndStatus = (statusKey) => ({
  type: ActionTypes.TOGGLE_IND_STATUS,
  payload: statusKey
});

export const setCycleCount = (count) => ({
  type: ActionTypes.SET_CYCLE_COUNT,
  payload: count
});

export const setIndBattery = (level) => ({
  type: ActionTypes.SET_IND_BATTERY,
  payload: level
});
```

---

#### **任务 2.1.4: 在主组件中使用 Reducer**

**代码示例** (`Hmi.jsx` 重构后):
```javascript
import { useReducer, useEffect } from 'react';
import { hmiReducer, initialState } from './core/state/reducer';
import * as actions from './core/state/actions';
import { getVariant } from './variants/registry';

export default function ElectricToolHMI() {
  const [state, dispatch] = useReducer(hmiReducer, initialState);
  
  // 解构状态
  const { power, variant, hammer, dcHammer, industrial } = state;
  
  // 事件处理器
  const handlePowerToggle = () => dispatch(actions.togglePower());
  const handleVariantChange = (type) => dispatch(actions.setVariant(type));
  const handleModeChange = (mode) => dispatch(actions.setMode(mode));
  
  // 获取当前变体配置
  const currentVariant = getVariant(variant.type);
  const VariantComponent = currentVariant.Component;
  
  // ... 渲染逻辑
}
```

---

## 阶段三：自定义Hooks提取

### 🎣 3.1 创建共享 Hooks

#### **任务 3.1.1: useToolStatus Hook**

**文件**: `src/shared/hooks/useToolStatus.js`

**代码实现**:
```javascript
import { useState, useCallback } from 'react';
import { TOOL_STATUS } from '../utils/statusStyles';

/**
 * 工具状态管理 Hook
 * 适用于 Hammer 变体（Standard/Segmented）
 */
export function useToolStatus(initialStatus = TOOL_STATUS.NORMAL) {
  const [status, setStatus] = useState(initialStatus);
  
  const updateStatus = useCallback((newStatus) => {
    if (Object.values(TOOL_STATUS).includes(newStatus)) {
      setStatus(newStatus);
    }
  }, []);
  
  const isLocked = status === TOOL_STATUS.ERROR || status === TOOL_STATUS.SAFETY_ERROR;
  
  const getStatusLabel = useCallback(() => {
    switch (status) {
      case TOOL_STATUS.NORMAL: return 'NORMAL';
      case TOOL_STATUS.WARNING: return 'WARNING';
      case TOOL_STATUS.ERROR: return 'ERROR';
      case TOOL_STATUS.SAFETY_ERROR: return 'SAFETY STOP';
      default: return '';
    }
  }, [status]);
  
  return {
    status,
    setStatus: updateStatus,
    isLocked,
    getStatusLabel
  };
}
```

---

#### **任务 3.1.2: useLongPress Hook**

**文件**: `src/shared/hooks/useLongPress.js`

**代码实现**:
```javascript
import { useState, useCallback, useRef } from 'react';

/**
 * 长按检测 Hook
 * @param {Function} callback - 长按触发的回调函数
 * @param {number} delay - 长按延迟时间（毫秒）
 * @param {Object} options - 配置选项
 */
export function useLongPress(callback, delay = 3000, options = {}) {
  const {
    shouldPreventDefault = true,
    onStart = () => {},
    onCancel = () => {}
  } = options;

  const [isLongPressing, setIsLongPressing] = useState(false);
  const timeoutRef = useRef(null);

  const start = useCallback((event) => {
    if (shouldPreventDefault && event.target) {
      event.preventDefault();
    }

    onStart();
    setIsLongPressing(true);

    timeoutRef.current = setTimeout(() => {
      callback();
      setIsLongPressing(false);
      timeoutRef.current = null;
    }, delay);
  }, [callback, delay, shouldPreventDefault, onStart]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setIsLongPressing(false);
      onCancel();
    }
  }, [onCancel]);

  const handlers = {
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: cancel
  };

  return {
    handlers,
    isLongPressing
  };
}
```

**使用示例**:
```javascript
function MyComponent() {
  const { handlers, isLongPressing } = useLongPress(
    () => console.log('Long press detected!'),
    3000
  );
  
  return (
    <button {...handlers}>
      {isLongPressing ? 'Hold...' : 'Press me'}
    </button>
  );
}
```

---

#### **任务 3.1.3: useInteractionDisabled Hook**

**文件**: `src/shared/hooks/useInteractionDisabled.js`

**代码实现**:
```javascript
import { useMemo } from 'react';

/**
 * 交互禁用状态计算 Hook
 * 统一管理所有禁用交互的条件
 */
export function useInteractionDisabled({
  isOn,
  isLocked,
  toolLockActive = false
}) {
  return useMemo(() => {
    return !isOn || isLocked || toolLockActive;
  }, [isOn, isLocked, toolLockActive]);
}
```

---

## 阶段四：类型安全增强

### 🛡️ 4.1 添加 PropTypes

#### **任务 4.1.1: 为所有组件添加 PropTypes**

**安装依赖**:
```bash
npm install prop-types
```

**实施清单**:
- [ ] SevenSegmentDisplay
- [ ] SevenSegmentDigit
- [ ] ModeButton
- [ ] StatusButton
- [ ] IndStatusButton
- [ ] CustomLevelConfig
- [ ] ACHammerScreen
- [ ] DCHammerScreen
- [ ] IndustrialScreen

**示例** (`src/shared/components/ModeButton/index.jsx`):
```javascript
import PropTypes from 'prop-types';

function ModeButton({ type, isActive, onClick, disabled }) {
  // 组件实现
}

ModeButton.propTypes = {
  type: PropTypes.oneOf(['max', 'soft']).isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

ModeButton.defaultProps = {
  disabled: false
};

export default ModeButton;
```

---

### 🛡️ 4.2 TypeScript 迁移准备（可选）

#### **任务 4.2.1: 添加 JSDoc 注释**

为未来可能的 TypeScript 迁移做准备，先添加详细的 JSDoc 注释。

**示例**:
```javascript
/**
 * 7段数码管显示组件
 * @param {Object} props - 组件属性
 * @param {number|string} props.value - 显示值（0-99 或 'C1', 'C2', 'C3'）
 * @param {string} props.activeColor - 激活段的颜色类
 * @param {string} props.inactiveColor - 非激活段的颜色类
 * @returns {JSX.Element}
 */
function SevenSegmentDisplay({ value, activeColor, inactiveColor }) {
  // ...
}
```

---

## 阶段五：性能优化

### ⚡ 5.1 React 性能优化

#### **任务 5.1.1: 使用 React.memo 优化组件**

**目标组件**:
- `ModeButton` - 频繁重渲染
- `SevenSegmentDigit` - 数字变化时避免不必要渲染
- `StatusButton` - 状态切换时优化

**实施示例**:
```javascript
import React from 'react';

const ModeButton = React.memo(({ type, isActive, onClick, disabled }) => {
  // 组件实现
}, (prevProps, nextProps) => {
  // 自定义比较逻辑
  return prevProps.isActive === nextProps.isActive &&
         prevProps.disabled === nextProps.disabled;
});

export default ModeButton;
```

---

#### **任务 5.1.2: 使用 useCallback 优化回调**

**在主组件中**:
```javascript
import { useCallback } from 'react';

function ElectricToolHMI() {
  const [state, dispatch] = useReducer(hmiReducer, initialState);
  
  const handlePowerToggle = useCallback(() => {
    dispatch(actions.togglePower());
  }, []);
  
  const handleModeChange = useCallback((mode) => {
    dispatch(actions.setMode(mode));
  }, []);
  
  // ...
}
```

---

#### **任务 5.1.3: 使用 useMemo 优化计算**

**示例**:
```javascript
import { useMemo } from 'react';

function DCHammerScreen({ batteryLevel, toolStatus }) {
  const batteryDisplay = useMemo(() => {
    return calculateBatteryDisplay(batteryLevel);
  }, [batteryLevel]);
  
  const sliderColor = useMemo(() => {
    return getBatterySliderColor(batteryLevel);
  }, [batteryLevel]);
  
  // ...
}
```

---

### ⚡ 5.2 样式优化

#### **任务 5.2.1: 提取静态样式到常量**

**文件**: `src/shared/styles/constants.js`

**代码实现**:
```javascript
// 设备外壳样式
export const DEVICE_CASING = 'relative w-full max-w-md bg-zinc-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-zinc-600';

// 屏幕背景样式
export const SCREEN_BASE = 'relative bg-black p-8 transition-all duration-500';

// 控制面板样式
export const CONTROL_PANEL_BASE = 'mt-6 w-full max-w-md bg-slate-700 rounded-xl p-6 shadow-lg text-white space-y-6';

// 图标尺寸
export const ICON_SIZES = {
  small: 16,
  medium: 20,
  large: 24,
  xlarge: 32,
  xxlarge: 40
};
```

---

## 实施时间表

### 📅 第 1 周：组件模块化

| 日期 | 任务 | 负责人 | 状态 |
|------|------|--------|------|
| Day 1 | 1.1.1 - 1.1.2: 提取 SevenSegment & ModeButton | - | ⏳ 待开始 |
| Day 2 | 1.1.3 - 1.1.4: 完善 StatusButton & CustomLevelConfig | - | ⏳ 待开始 |
| Day 3 | 1.2.1: AC Hammer 变体模块 | - | ⏳ 待开始 |
| Day 4 | 1.2.2: DC Hammer 变体模块 | - | ⏳ 待开始 |
| Day 5 | 1.2.3: Industrial 变体模块 | - | ⏳ 待开始 |
| Day 6 | 1.3.1: 创建变体注册系统 | - | ⏳ 待开始 |
| Day 7 | 1.4.1: 提取共享工具函数 & 测试 | - | ⏳ 待开始 |

**Week 1 里程碑**: ✅ 完成组件模块化，主文件从 1068 行减少到 ~300 行

---

### 📅 第 2 周：状态管理重构

| 日期 | 任务 | 负责人 | 状态 |
|------|------|--------|------|
| Day 8 | 2.1.1: 创建状态类型定义 | - | ⏳ 待开始 |
| Day 9 | 2.1.2: 创建 Reducer | - | ⏳ 待开始 |
| Day 10 | 2.1.3: 创建 Action Creators | - | ⏳ 待开始 |
| Day 11 | 2.1.4: 在主组件中使用 Reducer | - | ⏳ 待开始 |
| Day 12 | 3.1.1 - 3.1.3: 提取自定义 Hooks | - | ⏳ 待开始 |
| Day 13 | 集成测试 & Bug 修复 | - | ⏳ 待开始 |
| Day 14 | 代码审查 & 文档更新 | - | ⏳ 待开始 |

**Week 2 里程碑**: ✅ 完成状态管理重构，主文件减少到 < 200 行

---

### 📅 第 3 周：类型安全 & 性能优化

| 日期 | 任务 | 负责人 | 状态 |
|------|------|--------|------|
| Day 15-16 | 4.1.1: 为所有组件添加 PropTypes | - | ⏳ 待开始 |
| Day 17 | 4.2.1: 添加 JSDoc 注释 | - | ⏳ 待开始 |
| Day 18 | 5.1.1 - 5.1.3: React 性能优化 | - | ⏳ 待开始 |
| Day 19 | 5.2.1: 样式优化 | - | ⏳ 待开始 |
| Day 20 | 全面测试 & 性能测试 | - | ⏳ 待开始 |
| Day 21 | 最终代码审查 & 部署准备 | - | ⏳ 待开始 |

**Week 3 里程碑**: ✅ 完成所有优化，项目准备发布

---

## 验收标准

### ✅ 代码质量指标

- [ ] 主文件 `Hmi.jsx` < 200 行
- [ ] 所有组件都有独立文件
- [ ] 所有组件都有 PropTypes 或 TypeScript 类型
- [ ] 代码复用率 > 90%
- [ ] 所有目录都有内容（无空目录）
- [ ] 状态管理使用 useReducer
- [ ] 至少 5 个自定义 Hooks

### ✅ 功能完整性

- [ ] 所有三个变体正常工作
- [ ] 变体切换无 Bug
- [ ] 所有控制功能正常
- [ ] 视觉效果与原版一致

### ✅ 文档完整性

- [ ] 每个组件都有 README.md
- [ ] 所有 Hook 都有使用说明
- [ ] 更新主 README.md
- [ ] 更新架构图

### ✅ 性能指标

- [ ] 首次渲染时间 < 500ms
- [ ] 交互响应 < 100ms
- [ ] 无不必要的重渲染
- [ ] Lighthouse 性能评分 > 90

---

## 风险管理

### ⚠️ 潜在风险

1. **状态迁移风险**
   - **风险**: useReducer 迁移可能破坏现有功能
   - **缓解**: 分步迁移，每步都进行功能测试

2. **组件拆分过细**
   - **风险**: 过度拆分导致 props drilling
   - **缓解**: 使用 Context API 或保持适当的组件层级

3. **时间估算不准确**
   - **风险**: 某些任务比预期复杂
   - **缓解**: 预留 20% 缓冲时间

---

## 下一步行动

### 🚀 立即开始

1. **创建功能分支**
   ```bash
   git checkout -b optimization/component-extraction
   ```

2. **开始第一个任务**
   - 任务 1.1.1: 提取 SevenSegmentDisplay

3. **设置开发环境**
   ```bash
   npm install prop-types
   npm run dev
   ```

---

## 附录

### 📚 参考资源

- [React Hooks 官方文档](https://react.dev/reference/react)
- [useReducer 最佳实践](https://react.dev/reference/react/useReducer)
- [组件设计原则](https://react.dev/learn/thinking-in-react)
- [性能优化指南](https://react.dev/reference/react/memo)

### 🛠️ 工具推荐

- **代码质量**: ESLint + Prettier
- **组件文档**: Storybook (可选)
- **性能分析**: React DevTools Profiler
- **类型检查**: PropTypes 或 TypeScript

---

**文档版本**: v1.0  
**创建日期**: 2025-12-06  
**最后更新**: 2025-12-06  
**维护者**: Development Team
