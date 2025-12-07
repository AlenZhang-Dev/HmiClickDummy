# ControlPanel Component

## Overview
The `ControlPanel` is a comprehensive control interface for the HMI simulator that provides power management, variant switching, and variant-specific simulation controls.

## Structure
```
ControlPanel/
├── index.jsx                    # Main ControlPanel component
├── HammerControlPanel.jsx       # Control panel for Hammer variants
├── IndustrialControlPanel.jsx   # Control panel for Industrial variant
└── README.md                    # This file
```

## Components

### ControlPanel (Main)
The root control panel component that orchestrates:
- Power on/off control
- Variant switcher (AC Hammer / DC Hammer / Industrial)
- Rendering variant-specific control panels

**Props:**
```javascript
{
  // Global states
  isOn: bool,
  togglePower: func,
  hmiVariant: string,
  setHmiVariant: func,
  
  // Hammer variant states
  isLocked: bool,
  mode: 'max' | 'soft',
  toolStatus: 'normal' | 'warning' | 'error' | 'safety_error',
  setToolStatus: func,
  
  // Industrial variant states
  indStatus: object,
  toggleIndStatus: func,
  maxTorqueLimit: number,
  handleLimitChange: func,
  customLevels: object,
  toggleCustomLevelActivation: func,
  cycleCount: number,
  setCycleCount: func,
  isMaintenanceNeeded: bool,
  
  // Shared states
  batteryLevel: number,
  setBatteryLevel: func,
}
```

### HammerControlPanel
Control panel for AC Hammer and DC Hammer variants.

**Features:**
- Status simulation buttons (Normal, Warning, Error, Safety)
- Current mode/speed display
- Safety interlock status message
- Battery level slider (DC Hammer only)

**Props:**
```javascript
{
  isOn: bool,
  isLocked: bool,
  mode: 'max' | 'soft',
  hmiVariant: string,
  toolStatus: string,
  setToolStatus: func,
  batteryLevel: number,
  setBatteryLevel: func,
}
```

### IndustrialControlPanel
Control panel for Industrial Tool variant.

**Features:**
- Status indicator toggles (Kickback, Maintenance, NFC)
- Max torque limit slider (0-99N)
- Custom torque levels configuration (C1, C2, C3)
- Battery level simulation
- Cycle count simulation (with maintenance threshold at 10,000)

**Props:**
```javascript
{
  isOn: bool,
  indStatus: object,
  toggleIndStatus: func,
  maxTorqueLimit: number,
  handleLimitChange: func,
  customLevels: object,
  toggleCustomLevelActivation: func,
  batteryLevel: number,
  setBatteryLevel: func,
  cycleCount: number,
  setCycleCount: func,
  isMaintenanceNeeded: bool,
}
```

## Usage Example

```javascript
import ControlPanel from './src/shared/components/ControlPanel';

function MyHMI() {
  const [isOn, setIsOn] = useState(true);
  const [hmiVariant, setHmiVariant] = useState('industrial');
  // ... other states

  return (
    <div>
      {/* HMI Device Display */}
      
      <ControlPanel
        isOn={isOn}
        togglePower={() => setIsOn(!isOn)}
        hmiVariant={hmiVariant}
        setHmiVariant={setHmiVariant}
        // ... other props
      />
    </div>
  );
}
```

## Variant Detection
The component uses the `hasFeature()` function from the variant registry to determine which control panel to render:

```javascript
{hasFeature(hmiVariant, 'hasIndustrialStatus') ? (
  <IndustrialControlPanel {...props} />
) : (
  <HammerControlPanel {...props} />
)}
```

## Styling
All components use Tailwind CSS classes with:
- Slate color palette for backgrounds
- Conditional opacity based on power state
- Responsive grid layouts
- Custom slider styling for range inputs

## Integration
This component is designed to work seamlessly with:
- Variant Registry system
- StatusButton components
- CustomLevelConfig component
- Status utility functions

## Benefits
✅ **Separation of Concerns**: Each variant has its own dedicated control panel
✅ **Reusability**: Control panels can be used independently
✅ **Maintainability**: Easy to modify variant-specific controls
✅ **Type Safety**: PropTypes validation for all props
✅ **Code Reduction**: Removed ~150 lines from main Hmi.jsx file
