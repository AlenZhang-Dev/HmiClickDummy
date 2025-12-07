# HMIScreen Component

## Overview
The `HMIScreen` component encapsulates the entire HMI device display area, including the top status bar, main content area, power indicator, and lock status overlay.

## Purpose
Separates the device UI rendering logic from the main application, making Hmi.jsx cleaner and more focused on state management.

## Structure
```
HMIScreen/
├── index.jsx     # HMI screen component
└── README.md     # This file
```

## Features
- **Top Status Bar**: Variant-specific status indicators (AC/DC Hammer bars or Industrial bar)
- **Main Content Area**: 
  - Hammer variants: Max/Soft mode buttons
  - Industrial variant: 7-segment display with controls
- **Power Indicator**: Visual power status light
- **Lock Overlay**: Security lock message for Hammer variants when in error state

## Props

```javascript
{
  // Global states
  isOn: bool,                      // Power state
  hmiVariant: string,              // Variant ID ('standard', 'segmented', 'industrial')
  
  // Hammer variant states
  isLocked: bool,                  // Lock state (error/safety error)
  mode: 'max' | 'soft',           // Current mode
  toolStatus: string,              // Status ('normal', 'warning', 'error', 'safety_error')
  handleModeSelect: func,          // Mode selection handler
  isInteractionDisabled: bool,     // Overall interaction disable flag
  
  // Industrial variant states
  maxTorqueLimit: number,          // Max torque limit (0-99)
  indStatus: object,               // Industrial status indicators
  setIndStatus: func,              // Industrial status setter
  isMaintenanceNeeded: bool,       // Maintenance flag
  currentTorqueSelection: number|string,  // Current torque selection
  setCurrentTorqueSelection: func, // Torque selection setter
  customLevels: object,            // Custom levels (C1, C2, C3)
  setCustomLevels: func,           // Custom levels setter
  
  // Shared states
  batteryLevel: number,            // Battery level (0-100)
}
```

## Usage Example

```javascript
import HMIScreen from './src/shared/components/HMIScreen';

function App() {
  const [isOn, setIsOn] = useState(true);
  const [hmiVariant, setHmiVariant] = useState('industrial');
  // ... other states

  return (
    <div>
      <HMIScreen
        isOn={isOn}
        hmiVariant={hmiVariant}
        batteryLevel={batteryLevel}
        // ... other props
      />
      
      {/* Control Panel */}
    </div>
  );
}
```

## Variant Rendering Logic

The component intelligently renders different content based on the variant:

### Top Bar
- **AC Hammer & Industrial**: Single-bar status display (`ACHammerScreenContent`)
- **DC Hammer**: 5-bar battery display with battery level (`DCHammerScreenContent`)

### Main Content
- **Hammer Variants**: Max/Soft mode buttons
- **Industrial Variant**: Full industrial screen with 7-segment display

### Lock Overlay
- Only shown for **Hammer variants** when:
  - Power is ON
  - Tool is in locked state (error or safety_error)

## Styling
- Device casing: Zinc-800 background with rounded corners and border
- Top bar: Zinc-900 with black bottom border
- Main screen: Black background with opacity/grayscale effects when powered off
- Responsive sizing with max-width constraint

## Dependencies
- ModeButton component
- ACHammerScreenContent
- DCHammerScreenContent
- IndustrialScreenContent
- Variant registry (for feature detection)

## Benefits
✅ **Encapsulation**: All device UI in one component
✅ **Separation**: UI rendering separate from state management
✅ **Reusability**: Can be used in different contexts (testing, demos)
✅ **Maintainability**: Easier to modify device appearance
✅ **Code Reduction**: Simplified main Hmi.jsx file
