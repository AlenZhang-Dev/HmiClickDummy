# DC Hammer Variant Module

## Overview

The **DC Hammer** variant module provides the screen display component for the DC-powered (battery-operated) hammer tool in the HMI simulator. It features a 5-segmented bar display that can show either battery level or status override conditions.

## Architecture

```
src/variants/DCHammer/
├── index.js           # Main export file
├── ScreenContent.jsx  # Screen display component
└── README.md          # This file
```

## Components

### DCHammerScreenContent

The main screen display component for DC Hammer variant with dual-mode display logic.

**Features:**
- 5 segmented bar display
- Dual display modes: Battery Level or Status Override
- Priority-based rendering (Status > Battery)
- Dynamic color changes based on battery level or status
- 2Hz blinking animation for safety errors
- Smooth transitions between states

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOn` | `boolean` | Yes | Whether the tool is powered on |
| `toolStatus` | `string` | Yes | Current status: 'normal', 'warning', 'error', or 'safety_error' |
| `batteryLevel` | `number` | Yes | Battery level percentage (0-100) |

## Display Logic

### Priority System

The component uses a two-tier priority system for display:

1. **Status Override** (Priority 1)
   - Active when `toolStatus !== 'normal'`
   - All 5 bars show the same status color
   - Overrides battery display

2. **Battery Level** (Priority 2)
   - Active when `toolStatus === 'normal'`
   - Number of active bars indicates battery level
   - Color changes based on battery threshold

### Battery Display Mapping

| Battery Level | Active Bars | Color | Shadow |
|---------------|-------------|-------|--------|
| 0% | 0 | Red | Red glow |
| 1% | 1 | Red | Red glow |
| 2-20% | 1 | Yellow | Yellow glow |
| 21-40% | 2 | Green | Green glow |
| 41-60% | 3 | Green | Green glow |
| 61-80% | 4 | Green | Green glow |
| 81-100% | 5 | Green | Green glow |

### Status Override Colors

| Status | Color | Shadow | Animation |
|--------|-------|--------|-----------|
| Normal | Green | Green glow | None |
| Warning | Yellow | Yellow glow | None |
| Error | Red | Red glow | None |
| Safety Error | Red | Intense red glow | 2Hz blink |

## Usage Example

```jsx
import DCHammerScreenContent from './src/variants/DCHammer';

function MyHMI() {
  const [isOn, setIsOn] = useState(true);
  const [toolStatus, setToolStatus] = useState('normal');
  const [batteryLevel, setBatteryLevel] = useState(65);

  return (
    <div className="tool-screen">
      {/* Required CSS animation */}
      <style>{`
        @keyframes blink-2hz {
          0%, 100% { opacity: 1; filter: brightness(1.2); }
          50% { opacity: 0.3; filter: brightness(0.8); }
        }
        .animate-blink-2hz {
          animation: blink-2hz 0.5s infinite;
        }
      `}</style>
      
      <DCHammerScreenContent
        isOn={isOn}
        toolStatus={toolStatus}
        batteryLevel={batteryLevel}
      />
    </div>
  );
}
```

## Styling Dependencies

### Required Tailwind Classes
- Layout: `h-16`, `flex`, `items-center`, `justify-center`, `gap-3`, `px-8`
- Background: `bg-zinc-900`, `bg-slate-600`, `bg-green-500`, `bg-yellow-500`, `bg-red-500`
- Effects: `opacity-30`, custom shadows using `shadow-[]` notation
- Transitions: `transition-all duration-300`
- Sizing: `h-8`, `flex-1`
- Borders: `rounded-sm`

### Required CSS Animations
The parent component must include the `blink-2hz` animation:

```css
@keyframes blink-2hz {
  0%, 100% { opacity: 1; filter: brightness(1.2); }
  50% { opacity: 0.3; filter: brightness(0.8); }
}
.animate-blink-2hz {
  animation: blink-2hz 0.5s infinite;
}
```

## Design Specifications

- **Container Height**: 16 units (`h-16`)
- **Bar Height**: 8 units (`h-8`)
- **Bar Count**: 5 segmented bars
- **Gap**: 3 units between bars
- **Transitions**: Smooth 300ms transitions for all state changes
- **Shadows**: Contextual glows matching bar color

## Bar Rendering Logic

Each bar independently determines its visual state:

```jsx
{[1, 2, 3, 4, 5].map((i) => {
  // 1. Check if status override is active
  if (toolStatus !== 'normal') {
    // Show status color on all bars
  } else {
    // Show battery level
    // Bar is active if i <= numActiveBars
  }
})}
```

## Variant Comparison

| Feature | AC Hammer | DC Hammer | Industrial |
|---------|-----------|-----------|------------|
| Display Type | Single Bar | **5 Segmented Bars** | Single Bar + Icons |
| Battery Display | No | **Yes (Bar Count)** | Separate Icon |
| Status Override | Yes | **Yes (All Bars)** | Yes |
| Animation | Safety only | Safety only | Multiple |

## Integration Notes

1. **Stateless Component**: All state is managed by the parent
2. **No Side Effects**: Pure rendering component
3. **CSS Dependencies**: Requires parent to provide animation styles
4. **PropTypes**: Runtime validation included for all props
5. **Performance**: Uses React.memo internally (map with key props)

## Battery Level Control

When integrating with a control panel, use a range input:

```jsx
<input
  type="range"
  min="0"
  max="100"
  value={batteryLevel}
  onChange={(e) => setBatteryLevel(Number(e.target.value))}
  className="w-full"
/>
```

## Version History

- **v1.0.0** - Initial extraction from monolithic `Hmi.jsx` (Task 1.2.2)
  - Extracted as standalone variant module
  - Added comprehensive PropTypes
  - Encapsulated DC Hammer-specific dual-mode display logic
  - Maintained original battery visualization behavior
  - Preserved priority-based rendering system
