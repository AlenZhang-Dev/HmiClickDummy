# Shared Utilities

## Overview

This directory contains shared utility functions and constants used across the HMI simulator application.

## Files

### statusUtils.js

Status and battery-related utility functions.

**Exports:**

#### Functions

##### `getStatusColor(toolStatus)`

Returns the Tailwind CSS class for a given tool status.

```javascript
import { getStatusColor } from './src/shared/utils/statusUtils';

const color = getStatusColor('warning'); // Returns 'bg-yellow-500'
```

**Parameters:**
- `toolStatus` (string): One of 'normal', 'warning', 'error', or 'safety_error'

**Returns:** 
- (string): Tailwind CSS background color class

**Color Mapping:**
- `normal` → `bg-green-500`
- `warning` → `bg-yellow-500`
- `error` → `bg-red-600`
- `safety_error` → `bg-red-600`
- default → `bg-blue-100`

---

##### `getBatterySliderColor(batteryLevel)`

Returns the hex color code for the battery slider track based on battery level.

```javascript
import { getBatterySliderColor } from './src/shared/utils/statusUtils';

const color = getBatterySliderColor(15); // Returns '#f59e0b' (yellow)
```

**Parameters:**
- `batteryLevel` (number): Battery level percentage (0-100)

**Returns:**
- (string): Hex color code

**Color Logic:**
- ≤1%: `#ef4444` (red - critical)
- 2-20%: `#f59e0b` (yellow - warning)
- >20%: `#10b981` (green - normal)

---

#### Constants

##### `BATTERY_THRESHOLDS`

Battery level thresholds and color constants.

```javascript
import { BATTERY_THRESHOLDS } from './src/shared/utils/statusUtils';

console.log(BATTERY_THRESHOLDS.CRITICAL); // 1
console.log(BATTERY_THRESHOLDS.WARNING);  // 20
console.log(BATTERY_THRESHOLDS.COLORS.CRITICAL); // '#ef4444'
```

**Structure:**
```javascript
{
    CRITICAL: 1,
    WARNING: 20,
    COLORS: {
        CRITICAL: '#ef4444',
        WARNING: '#f59e0b',
        NORMAL: '#10b981',
    }
}
```

---

##### `TOOL_STATUS`

Tool status type constants.

```javascript
import { TOOL_STATUS } from './src/shared/utils/statusUtils';

setToolStatus(TOOL_STATUS.WARNING);
```

**Structure:**
```javascript
{
    NORMAL: 'normal',
    WARNING: 'warning',
    ERROR: 'error',
    SAFETY_ERROR: 'safety_error',
}
```

---

## Usage Example

### In a Component

```javascript
import React, { useState } from 'react';
import { 
    getStatusColor, 
    getBatterySliderColor, 
    TOOL_STATUS 
} from './src/shared/utils/statusUtils';

function MyComponent() {
    const [toolStatus, setToolStatus] = useState(TOOL_STATUS.NORMAL);
    const [batteryLevel, setBatteryLevel] = useState(85);

    const statusColorClass = getStatusColor(toolStatus);
    const sliderColor = getBatterySliderColor(batteryLevel);

    return (
        <div>
            <div className={statusColorClass}>
                Status: {toolStatus}
            </div>
            <input
                type="range"
                min="0"
                max="100"
                value={batteryLevel}
                onChange={(e) => setBatteryLevel(Number(e.target.value))}
                style={{
                    '--slider-color': sliderColor
                }}
            />
        </div>
    );
}
```

---

## Integration Notes

1. **Pure Functions**: All utility functions are pure (no side effects)
2. **No Dependencies**: No external dependencies, only JavaScript built-ins
3. **Type Safety**: Consider adding JSDoc types or TypeScript in the future
4. **Tree Shaking**: Named exports support tree shaking in bundlers

---

## Future Enhancements

Potential additions:
- Mode-related utilities
- Torque level calculation helpers
- Animation timing constants
- Color conversion utilities
- Validation helpers

---

## Version History

- **v1.0.0** - Initial extraction from `Hmi.jsx` (Task 1.4.1)
  - Added `getStatusColor` function
  - Added `getBatterySliderColor` function
  - Added `BATTERY_THRESHOLDS` constants
  - Added `TOOL_STATUS` constants
