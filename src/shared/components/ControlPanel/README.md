# ControlPanel Component

## 📋 Overview

`ControlPanel` is a unified control interface for all HMI variants (AC Hammer, DC Hammer, and Industrial). It provides a comprehensive set of controls for power management, variant selection, status simulation, and variant-specific settings.

## 🎯 Purpose

- Centralize all user interaction controls in one component
- Provide variant-adaptive UI that shows/hides controls based on the active variant
- Simplify the main HMI component by extracting the entire control panel
- Maintain consistent styling and behavior across all variants

## 📦 Features

### Common Controls (All Variants)
- **Power Toggle**: Turn the HMI on/off
- **Variant Switcher**: Switch between AC Hammer, DC Hammer, and Industrial variants
- **Battery Level Simulator**: Adjust battery percentage (DC Hammer & Industrial)

### Hammer-Specific Controls (AC & DC)
- **Tool Status Simulator**: Simulate Normal, Warning, Error, Safety Error states
- **Mode Display**: Show current mode (Max/Soft) and speed percentage
- **Lock Status Indicator**: Display when safety interlock is active

### Industrial-Specific Controls
- **Status Indicators**: Toggle Kickback, Maintenance, NFC states
- **Max Torque Limit**: Set maximum torque boundary (0-99N)
- **Custom Torque Levels**: Configure C1, C2, C3 activation states
- **Cycle Count Simulator**: Adjust maintenance cycle count (0-12000)

## 🔧 Usage

```jsx
import ControlPanel from './src/shared/components/ControlPanel';

function MyHMI() {
  // ... state declarations ...
  
  return (
    <div>
      {/* HMI Display */}
      
      <ControlPanel
        // Power & Variant
        isOn={isOn}
        onTogglePower={togglePower}
        hmiVariant={hmiVariant}
        onVariantChange={setHmiVariant}
        
        // Hammer Controls
        toolStatus={toolStatus}
        onToolStatusChange={setToolStatus}
        mode={mode}
        isLocked={isLocked}
        
        // Battery
        batteryLevel={batteryLevel}
        onBatteryLevelChange={setBatteryLevel}
        
        // Industrial Controls
        indStatus={indStatus}
        onToggleIndStatus={toggleIndStatus}
        maxTorqueLimit={maxTorqueLimit}
        onMaxTorqueLimitChange={handleLimitChange}
        customLevels={customLevels}
        onToggleCustomLevelActivation={toggleCustomLevelActivation}
        cycleCount={cycleCount}
        onCycleCountChange={setCycleCount}
        isMaintenanceNeeded={isMaintenanceNeeded}
      />
    </div>
  );
}
```

## 📊 Props API

### Power & Variant Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOn` | `boolean` | ✅ | Current power state |
| `onTogglePower` | `function` | ✅ | Handler for power toggle |
| `hmiVariant` | `'standard' \| 'segmented' \| 'industrial'` | ✅ | Current HMI variant |
| `onVariantChange` | `function` | ✅ | Handler for variant selection |

### Hammer Control Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `toolStatus` | `'normal' \| 'warning' \| 'error' \| 'safety_error'` | ✅ | Current tool status |
| `onToolStatusChange` | `function` | ✅ | Handler for status change |
| `mode` | `'max' \| 'soft'` | ✅ | Current mode (for display) |
| `isLocked` | `boolean` | ✅ | Whether safety interlock is active |

### Battery Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `batteryLevel` | `number` | ✅ | Current battery percentage (0-100) |
| `onBatteryLevelChange` | `function` | ✅ | Handler for battery level change |

### Industrial Control Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `indStatus` | `object` | ✅ | Industrial status object with `isLocked`, `isKickback`, `isMaintenance`, `isNFC` |
| `onToggleIndStatus` | `function` | ✅ | Handler for industrial status toggles |
| `maxTorqueLimit` | `number` | ✅ | Maximum torque limit (0-99) |
| `onMaxTorqueLimitChange` | `function` | ✅ | Handler for torque limit change |
| `customLevels` | `object` | ✅ | Custom levels config (C1, C2, C3) |
| `onToggleCustomLevelActivation` | `function` | ✅ | Handler for custom level toggles |
| `cycleCount` | `number` | ✅ | Current cycle count (0-12000) |
| `onCycleCountChange` | `function` | ✅ | Handler for cycle count change |
| `isMaintenanceNeeded` | `boolean` | ✅ | Whether maintenance is needed |

## 🎨 Styling

The component uses Tailwind CSS classes with a dark slate theme:
- Background: `bg-slate-700`
- Borders: `border-slate-600`
- Text: Various slate shades for hierarchy
- Accent colors: Blue (active), Red (power off), Green (power on)

## 🔄 Variant Adaptation

The component automatically adapts its UI based on the `hmiVariant` prop using the variant registry's feature flags:

```jsx
const isIndustrial = hasFeature(hmiVariant, 'hasIndustrialStatus');
const hasSegmentedDisplay = hasFeature(hmiVariant, 'hasSegmentedDisplay');
```

- **Standard (AC Hammer)**: Shows hammer controls only
- **Segmented (DC Hammer)**: Shows hammer controls + battery level for DC variant
- **Industrial**: Shows industrial-specific controls (status indicators, torque settings, custom levels, cycle count)

## 📝 Implementation Notes

1. **Opacity Management**: Controls are automatically dimmed (`opacity-50`) and disabled (`pointer-events-none`) when `isOn` is `false`
2. **Battery Slider Color**: Uses `getBatterySliderColor()` utility to dynamically color the battery slider based on level
3. **Maintenance Logic**: The `isMaintenanceNeeded` flag is derived from `cycleCount >= 10000` OR manual toggle
4. **Responsive Layout**: Uses CSS Grid for button layouts (4 columns for hammer, 3 columns for industrial)

## 🚀 Benefits

- **Reduced Main Component Size**: Removes ~207 lines from main HMI component
- **Single Responsibility**: Handles all control panel logic independently
- **Reusability**: Can be used in any HMI-like interface
- **Maintainability**: Control panel changes isolated from display logic
- **Testability**: Easy to test control panel behavior independently

## 🔗 Dependencies

- `lucide-react`: Icons
- `PropTypes`: Type validation
- `../StatusButton`: Hammer and Industrial status buttons
- `../CustomLevelConfig`: Custom torque level configuration
- `../../utils/statusUtils`: Battery color utility
- `../../../variants/registry`: Feature flag helpers

## 📄 Related Files

- Main component: `Hmi.jsx`
- Status buttons: `src/shared/components/StatusButton/`
- Custom level config: `src/shared/components/CustomLevelConfig/`
- Variant registry: `src/variants/registry/`
