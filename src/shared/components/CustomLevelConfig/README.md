# CustomLevelConfig Component

## Overview

The `CustomLevelConfig` component provides a toggle switch interface for enabling/disabling custom torque levels in the Industrial variant of the HMI simulator. Each custom level (C1, C2, C3) can be independently activated or deactivated.

## Features

- **Visual Feedback**: Active levels display with blue border and darker background
- **Toggle Switch**: Smooth animated toggle with peer-based styling
- **Bilingual Labels**: Shows Chinese text "自定义挡位开关" (Custom Level Switch)
- **Status Indicator**: Displays "启用" (Enabled) or "禁用" (Disabled) based on state

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `levelKey` | `string` | Yes | The level identifier (e.g., 'C1', 'C2', 'C3') |
| `levelData` | `object` | Yes | Configuration object containing level state |
| `levelData.isActive` | `boolean` | Yes | Whether this custom level is currently activated |
| `onToggleActivation` | `function` | Yes | Callback invoked when toggle switch is clicked |

## Usage Example

```jsx
import CustomLevelConfig from './src/shared/components/CustomLevelConfig';

function ControlPanel() {
  const [customLevels, setCustomLevels] = useState({
    C1: { isActive: true },
    C2: { isActive: false },
    C3: { isActive: true },
  });

  const handleToggleActivation = (levelKey) => {
    setCustomLevels(prev => ({
      ...prev,
      [levelKey]: { isActive: !prev[levelKey].isActive }
    }));
  };

  return (
    <div className="space-y-2">
      {['C1', 'C2', 'C3'].map((key) => (
        <CustomLevelConfig
          key={key}
          levelKey={key}
          levelData={customLevels[key]}
          onToggleActivation={handleToggleActivation}
        />
      ))}
    </div>
  );
}
```

## Styling

The component uses Tailwind CSS with the following conditional classes:

### Active State
- Border: `border-blue-700`
- Background: `bg-slate-800`

### Inactive State
- Border: `border-slate-700`
- Background: `bg-slate-700/50`

### Toggle Switch
- Uses peer-based styling for the checkbox toggle
- Smooth transitions with `after:transition-all`
- Focus ring with `peer-focus:ring-2 peer-focus:ring-blue-300`

## Integration Notes

1. **State Management**: The parent component must manage the `customLevels` state
2. **Callback Pattern**: Use the `onToggleActivation` callback to update level state
3. **Accessibility**: The checkbox input is screen-reader accessible with `sr-only` class
4. **Responsive**: The component adapts to container width with `flex-1` on the label

## Related Components

- Used exclusively in the **Industrial Variant** of the HMI simulator
- Appears in the Control Panel alongside other industrial-specific controls
- Works in conjunction with torque level selection system

## Version History

- **v1.0.0** - Initial extraction from monolithic `Hmi.jsx` (Task 1.1.4)
  - Extracted as shared component with PropTypes
  - Added comprehensive documentation
  - Maintained original functionality and styling
