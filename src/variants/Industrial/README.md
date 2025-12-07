# Industrial Variant Module

## Overview

The **Industrial** variant module provides the most advanced screen display component for professional-grade industrial tools in the HMI simulator. It features a sophisticated 7-segment display for torque level control, multiple status indicators, and intelligent long-press functionality for tool lock management.

## Architecture

```
src/variants/Industrial/
├── index.js           # Main export file
├── ScreenContent.jsx  # Screen display component
└── README.md          # This file
```

## Components

### IndustrialScreenContent

The main screen display component for Industrial variant with advanced features.

**Features:**
- **7-Segment Torque Display**: Shows numeric (0-99) or custom levels (C1, C2, C3)
- **5 Status Indicators**: Tool Lock, Kickback Control, Low Battery, Maintenance, NFC
- **Plus/Minus Adjustment**: Non-circular torque level control
- **Long-Press Lock**: 3-second press to toggle Tool Lock
- **Smart Disable Logic**: Context-aware interaction control
- **Custom Level Support**: Dynamic sequence based on active custom levels

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `maxLimit` | `number` | Yes | Maximum torque limit (N) |
| `indStatus` | `object` | Yes | Industrial status object with isLocked, isKickback, isMaintenance, isNFC |
| `setIndStatus` | `function` | Yes | Setter for industrial status |
| `batteryLevel` | `number` | Yes | Battery level percentage (0-100) |
| `isMaintenanceNeeded` | `boolean` | Yes | Whether maintenance is required |
| `isInteractionDisabled` | `boolean` | Yes | Whether interactions are disabled (Power OFF, Error, or Tool Lock) |
| `isOn` | `boolean` | Yes | Whether the tool is powered on |
| `isLocked` | `boolean` | Yes | Whether hard error/safety error lock is active |
| `currentTorqueSelection` | `number\|string` | Yes | Current torque selection (0-99 or 'C1', 'C2', 'C3') |
| `setCurrentTorqueSelection` | `function` | Yes | Setter for torque selection |
| `customLevels` | `object` | Yes | Custom levels configuration (C1, C2, C3 with isActive) |

## Status Indicators

### 1. Tool Lock (T)
- **Icon**: Lock
- **Label**: "T"
- **Active State**: White glow
- **Inactive State**: Dark gray
- **Activation**: 3-second long press on Plus/Minus buttons

### 2. Kickback Control
- **Icon**: ShieldAlert
- **Active State**: Red glow (`text-red-400`)
- **Inactive State**: Dark gray
- **Purpose**: Indicates kickback protection is triggered

### 3. Low Battery
- **Icon**: ZapOff
- **States**:
  - ≤1%: Red glow (critical)
  - 2-20%: Yellow glow (warning)
  - >20%: Dark gray (normal)
- **Dynamic**: Color changes based on battery level

### 4. Maintenance Reminder
- **Icon**: Wrench
- **Active State**: Yellow glow (`text-yellow-300`)
- **Inactive State**: Dark gray
- **Trigger**: Cycle count ≥10,000 or manual activation

### 5. NFC Communication
- **Icon**: Info (with "i" label)
- **Active State**: Blue glow (`text-blue-400`)
- **Inactive State**: Dark gray
- **Purpose**: Simulates NFC communication status

## Torque Level Control

### Sequence Logic

The component generates a dynamic sequence of selectable torque levels:

```javascript
// Example with maxLimit=50, C1 and C2 active:
[0, 1, 2, ..., 50, 'C1', 'C2']
```

**Non-Circular Navigation:**
- Plus button: Move forward (stop at end)
- Minus button: Move backward (stop at start)
- Boundary protection: No wrap-around

### Custom Levels

Custom levels (C1, C2, C3) are:
- Dynamically included based on `customLevels[key].isActive`
- Always sorted (C1 → C2 → C3)
- Appended after numeric levels
- Displayed as "C1", "C2", "C3" on 7-segment display

## Long-Press Lock Feature

### Activation
1. Press and hold Plus or Minus button
2. Wait 3 seconds
3. Tool Lock toggles (on → off or off → on)
4. Visual feedback on Lock indicator

### Behavior
- **When Power OFF**: Long-press disabled
- **When Hard Error/Safety Error**: Long-press disabled
- **When Tool Lock Active**: Long-press allowed (to unlock)
- **During Long-Press**: Click events are suppressed

### Implementation
```jsx
const LONG_PRESS_DELAY = 3000; // 3 seconds

// On mouse/touch down: start timer
// On mouse/touch up: clear timer
// After 3s: toggle lock state
```

## Interaction Disable Logic

Interactions are disabled when:
- `isInteractionDisabled === true` (Power OFF, Error, or Tool Lock)

**Disabled Interactions:**
- Plus/Minus clicks
- Torque level adjustment
- Long-press for lock (if Power OFF or Hard Error)

**Visual Feedback:**
- Buttons show `opacity-40` when disabled
- Cursor remains pointer (for long-press unlock)

## Usage Example

```jsx
import IndustrialScreenContent from './src/variants/Industrial';

function MyHMI() {
  const [maxTorqueLimit, setMaxTorqueLimit] = useState(50);
  const [currentTorqueSelection, setCurrentTorqueSelection] = useState(25);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [indStatus, setIndStatus] = useState({
    isLocked: false,
    isKickback: false,
    isMaintenance: false,
    isNFC: false,
  });
  const [customLevels, setCustomLevels] = useState({
    C1: { isActive: true },
    C2: { isActive: true },
    C3: { isActive: false },
  });

  const isMaintenanceNeeded = indStatus.isMaintenance;
  const isInteractionDisabled = !isOn || isLocked || indStatus.isLocked;

  return (
    <IndustrialScreenContent
      maxLimit={maxTorqueLimit}
      indStatus={indStatus}
      setIndStatus={setIndStatus}
      batteryLevel={batteryLevel}
      isMaintenanceNeeded={isMaintenanceNeeded}
      isInteractionDisabled={isInteractionDisabled}
      isOn={isOn}
      isLocked={isLocked}
      currentTorqueSelection={currentTorqueSelection}
      setCurrentTorqueSelection={setCurrentTorqueSelection}
      customLevels={customLevels}
    />
  );
}
```

## Styling Dependencies

### Required Tailwind Classes
- Layout: `flex`, `flex-col`, `space-y-6`, `items-center`, `justify-center`
- Sizing: `w-14`, `h-14`, `w-20`, `h-20`, `w-36`, `h-24`
- Colors: `bg-zinc-900`, `bg-zinc-800`, `bg-black`, `text-zinc-400`, `text-white`
- Borders: `border`, `border-2`, `border-zinc-700`, `rounded-lg`, `rounded-xl`
- Effects: `shadow-md`, `opacity-40`, custom shadows with `shadow-[]`
- Transitions: `transition-all duration-150`, `duration-300`
- States: `hover:text-white`, `active:bg-zinc-700`

### Required Icons (Lucide React)
- Lock
- ShieldAlert
- ZapOff
- Wrench
- Info
- Plus
- Minus

### Required Components
- `SevenSegmentDisplay` from `../../shared/components/SevenSegmentDisplay`

## State Management

### Internal State
- `lockTimer`: Timer for long-press detection

### External State (via props)
- `indStatus`: All industrial-specific status flags
- `currentTorqueSelection`: Current torque level
- `customLevels`: Custom level configuration

## Event Handling

### Click Events
- `handlePlusMinusClick(delta)`: Adjust torque level
- Disabled during long-press
- Disabled when `isInteractionDisabled`

### Long-Press Events
- `handleLockMouseDown`: Start long-press timer
- `handleLockMouseUp`: Cancel or complete long-press
- Works on both mouse and touch devices

## Performance Considerations

1. **Memoization**: Consider wrapping in React.memo for large apps
2. **Timer Cleanup**: Automatically clears timeout on unmount
3. **Sequence Calculation**: Recalculates only when dependencies change
4. **Icon Mapping**: Pre-defined array for efficient rendering

## Accessibility

- Button elements for keyboard navigation
- Clear visual feedback for all states
- High contrast colors for status indicators
- Touch-friendly button sizes (20×20, 14×14)

## Version History

- **v1.0.0** - Initial extraction from monolithic `Hmi.jsx` (Task 1.2.3)
  - Extracted as standalone variant module
  - Added comprehensive PropTypes validation
  - Encapsulated all Industrial-specific logic
  - Maintained long-press lock functionality
  - Preserved custom torque level system
  - Documented all features and behaviors
