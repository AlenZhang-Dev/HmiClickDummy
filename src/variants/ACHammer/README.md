# AC Hammer Variant Module

## Overview

The **AC Hammer** variant module provides the screen display component for the AC-powered hammer tool in the HMI simulator. It features a single solid status bar that changes color and displays text based on the tool's operational status.

## Architecture

```
src/variants/ACHammer/
├── index.js           # Main export file
├── ScreenContent.jsx  # Screen display component
└── README.md          # This file
```

## Components

### ACHammerScreenContent

The main screen display component for AC Hammer variant.

**Features:**
- Single solid bar display
- Dynamic color changes based on status
- Text status labels (NORMAL, WARNING, ERROR, SAFETY STOP)
- 2Hz blinking animation for safety errors
- Power OFF state support

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOn` | `boolean` | Yes | Whether the tool is powered on |
| `toolStatus` | `string` | Yes | Current status: 'normal', 'warning', 'error', or 'safety_error' |

## Status Display Logic

### Visual States

1. **Power OFF** (`isOn = false`)
   - Background: Gray (`bg-slate-400`)
   - Text: "OFF"

2. **Normal** (`toolStatus = 'normal'`)
   - Background: Green with glow (`bg-green-500`)
   - Shadow: Soft green glow
   - Text: "NORMAL"

3. **Warning** (`toolStatus = 'warning'`)
   - Background: Yellow with glow (`bg-yellow-500`)
   - Shadow: Soft yellow glow
   - Text: "WARNING"

4. **Error** (`toolStatus = 'error'`)
   - Background: Red with glow (`bg-red-600`)
   - Shadow: Soft red glow
   - Text: "ERROR"

5. **Safety Error** (`toolStatus = 'safety_error'`)
   - Background: Red with intense glow (`bg-red-600`)
   - Shadow: Intense red glow
   - Animation: 2Hz blinking (requires CSS animation in parent)
   - Text: "SAFETY STOP"

## Usage Example

```jsx
import ACHammerScreenContent from './src/variants/ACHammer';

function MyHMI() {
  const [isOn, setIsOn] = useState(true);
  const [toolStatus, setToolStatus] = useState('normal');

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
      
      <ACHammerScreenContent
        isOn={isOn}
        toolStatus={toolStatus}
      />
    </div>
  );
}
```

## Styling Dependencies

### Required Tailwind Classes
- Color utilities: `bg-slate-400`, `bg-green-500`, `bg-yellow-500`, `bg-red-600`
- Shadow utilities: Custom shadows using `shadow-[]` notation
- Text utilities: `text-slate-900/70`, `font-black`, `tracking-widest`
- Transition: `transition-colors duration-300`

### Required CSS Animations
The parent component must include the `blink-2hz` animation for safety error states:

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

- **Height**: 16 units (`h-16`)
- **Layout**: Centered flex container
- **Text**: Uppercase, bold, large tracking
- **Transitions**: Smooth color changes (300ms)
- **Shadows**: Contextual glows matching status color

## Variant Comparison

| Feature | AC Hammer | DC Hammer | Industrial |
|---------|-----------|-----------|------------|
| Display Type | Single Bar | 5 Segmented Bars | Single Bar + Icons |
| Status Text | Yes | No | Yes |
| Battery Display | No | Yes | Separate Icon |
| Animation | Safety only | Safety only | Multiple |

## Integration Notes

1. **Stateless Component**: All state is managed by the parent
2. **No Side Effects**: Pure rendering component
3. **CSS Dependencies**: Requires parent to provide animation styles
4. **PropTypes**: Runtime validation included for all props

## Version History

- **v1.0.0** - Initial extraction from monolithic `Hmi.jsx` (Task 1.2.1)
  - Extracted as standalone variant module
  - Added comprehensive PropTypes
  - Encapsulated AC Hammer-specific display logic
  - Maintained original visual design and behavior
