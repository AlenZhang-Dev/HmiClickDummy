# Variant Registry

## Overview

The Variant Registry is a centralized system for managing HMI variants. It provides a unified interface for variant configuration, feature detection, and component loading.

## Architecture

```
src/variants/registry/
├── index.js           # Main registry module
└── README.md          # This file
```

## Variants

### Registered Variants

| Variant | ID | Display Name | Component |
|---------|-----|--------------|-----------|
| AC Hammer | `standard` | AC Hammer | ACHammerScreenContent |
| DC Hammer | `segmented` | DC Hammer | DCHammerScreenContent |
| Industrial | `industrial` | Industrial | IndustrialScreenContent |

## API Reference

### Constants

#### `VARIANTS`

Object containing all variant configurations.

```javascript
import { VARIANTS } from './src/variants/registry';

console.log(VARIANTS.AC_HAMMER.id); // 'standard'
console.log(VARIANTS.DC_HAMMER.displayName); // 'DC Hammer'
console.log(VARIANTS.INDUSTRIAL.features); // { hasBatteryDisplay: true, ... }
```

**Structure:**
```javascript
{
  AC_HAMMER: {
    id: string,
    name: string,
    displayName: string,
    component: React.Component,
    description: string,
    features: {
      hasBatteryDisplay: boolean,
      hasSegmentedDisplay: boolean,
      hasModeSelection: boolean,
      hasCustomLevels: boolean,
      hasIndustrialStatus: boolean,
    }
  },
  // ... DC_HAMMER, INDUSTRIAL
}
```

---

### Functions

#### `getVariantById(variantId)`

Get variant configuration by ID.

```javascript
import { getVariantById } from './src/variants/registry';

const variant = getVariantById('standard');
// Returns: { id: 'standard', name: 'AC Hammer', ... }
```

**Parameters:**
- `variantId` (string): Variant ID ('standard', 'segmented', 'industrial')

**Returns:**
- (Object|null): Variant configuration or null if not found

---

#### `getAllVariants()`

Get all available variants.

```javascript
import { getAllVariants } from './src/variants/registry';

const variants = getAllVariants();
// Returns: [{ id: 'standard', ... }, { id: 'segmented', ... }, { id: 'industrial', ... }]
```

**Returns:**
- (Array): Array of variant configurations

---

#### `getVariantIds()`

Get list of all variant IDs.

```javascript
import { getVariantIds } from './src/variants/registry';

const ids = getVariantIds();
// Returns: ['standard', 'segmented', 'industrial']
```

**Returns:**
- (Array): Array of variant ID strings

---

#### `hasFeature(variantId, featureName)`

Check if a variant has a specific feature.

```javascript
import { hasFeature } from './src/variants/registry';

const hasBattery = hasFeature('industrial', 'hasBatteryDisplay');
// Returns: true

const hasSegmented = hasFeature('standard', 'hasSegmentedDisplay');
// Returns: false
```

**Parameters:**
- `variantId` (string): Variant ID
- `featureName` (string): Feature name from variant.features

**Returns:**
- (boolean): Whether the variant has the feature

---

#### `getVariantComponent(variantId)`

Get the React component for a variant's screen content.

```javascript
import { getVariantComponent } from './src/variants/registry';

const Component = getVariantComponent('standard');
// Returns: ACHammerScreenContent (React Component)
```

**Parameters:**
- `variantId` (string): Variant ID

**Returns:**
- (React.Component|null): Screen component or null if not found

---

## Usage Examples

### Basic Variant Switching

```javascript
import { getVariantComponent } from './src/variants/registry';

function HMI() {
  const [variantId, setVariantId] = useState('standard');
  
  const ScreenComponent = getVariantComponent(variantId);
  
  return (
    <div>
      {ScreenComponent && (
        <ScreenComponent 
          isOn={isOn}
          toolStatus={toolStatus}
          // ... other props
        />
      )}
    </div>
  );
}
```

### Feature-Based Conditional Rendering

```javascript
import { hasFeature } from './src/variants/registry';

function ControlPanel({ variantId }) {
  return (
    <div>
      {hasFeature(variantId, 'hasBatteryDisplay') && (
        <BatterySlider />
      )}
      
      {hasFeature(variantId, 'hasModeSelection') && (
        <ModeSelector />
      )}
      
      {hasFeature(variantId, 'hasCustomLevels') && (
        <CustomLevelConfig />
      )}
    </div>
  );
}
```

### Dynamic Variant Selector

```javascript
import { getAllVariants } from './src/variants/registry';

function VariantSelector({ currentVariant, onChange }) {
  const variants = getAllVariants();
  
  return (
    <div>
      {variants.map(variant => (
        <button
          key={variant.id}
          onClick={() => onChange(variant.id)}
          className={currentVariant === variant.id ? 'active' : ''}
        >
          {variant.displayName}
        </button>
      ))}
    </div>
  );
}
```

### Variant Metadata Display

```javascript
import { getVariantById } from './src/variants/registry';

function VariantInfo({ variantId }) {
  const variant = getVariantById(variantId);
  
  if (!variant) return <div>Unknown variant</div>;
  
  return (
    <div>
      <h3>{variant.displayName}</h3>
      <p>{variant.description}</p>
      <h4>Features:</h4>
      <ul>
        {Object.entries(variant.features).map(([key, value]) => (
          <li key={key}>
            {key}: {value ? '✓' : '✗'}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Feature Flags

### Available Features

| Feature | Description | Variants |
|---------|-------------|----------|
| `hasBatteryDisplay` | Battery level display/control | DC Hammer, Industrial |
| `hasSegmentedDisplay` | 5-bar segmented display | DC Hammer |
| `hasModeSelection` | Max/Soft mode selection | AC Hammer, DC Hammer |
| `hasCustomLevels` | Custom torque levels (C1,C2,C3) | Industrial |
| `hasIndustrialStatus` | Industrial status indicators | Industrial |

## Adding New Variants

To add a new variant:

1. **Create the variant component** in `src/variants/YourVariant/`
2. **Import the component** in `registry/index.js`
3. **Add variant configuration** to `VARIANTS` object:

```javascript
import YourVariantScreenContent from '../YourVariant';

export const VARIANTS = {
  // ... existing variants
  YOUR_VARIANT: {
    id: 'your-variant-id',
    name: 'YourVariant',
    displayName: 'Your Variant',
    component: YourVariantScreenContent,
    description: 'Description of your variant',
    features: {
      hasBatteryDisplay: false,
      hasSegmentedDisplay: false,
      hasModeSelection: true,
      hasCustomLevels: false,
      hasIndustrialStatus: false,
      // Add custom features as needed
    },
  },
};
```

4. **No changes needed** in consuming code - the registry automatically includes the new variant!

## Benefits

### 1. Centralized Management
- Single source of truth for variant configurations
- Easy to add/remove/modify variants
- Clear variant capabilities documentation

### 2. Type Safety & Validation
- Consistent variant structure
- Feature flag system prevents errors
- Runtime variant validation

### 3. Dynamic Loading
- Components loaded on-demand
- Easy to implement code splitting
- Reduced initial bundle size potential

### 4. Maintainability
- Reduce if-else chains in main code
- Clear separation of concerns
- Self-documenting code

### 5. Extensibility
- Easy to add new variants
- Custom feature flags support
- Backward compatible

## Integration with Main App

### Before (Direct Imports)
```javascript
import ACHammerScreenContent from './src/variants/ACHammer';
import DCHammerScreenContent from './src/variants/DCHammer';
import IndustrialScreenContent from './src/variants/Industrial';

// ... multiple if-else checks for hmiVariant
{hmiVariant === 'standard' ? <ACHammerScreenContent /> :
 hmiVariant === 'segmented' ? <DCHammerScreenContent /> :
 <IndustrialScreenContent />}
```

### After (Registry)
```javascript
import { getVariantComponent } from './src/variants/registry';

const ScreenComponent = getVariantComponent(hmiVariant);
return <ScreenComponent {...props} />;
```

## Performance Considerations

1. **Memoization**: Consider memoizing variant lookups in performance-critical paths
2. **Code Splitting**: Can be extended to use dynamic imports for lazy loading
3. **Caching**: Variant configurations are static and can be cached

## Future Enhancements

Potential additions:
- Variant-specific prop validation
- Variant lifecycle hooks
- Plugin system for variant extensions
- Variant versioning support
- Internationalization support

## Version History

- **v1.0.0** - Initial implementation (Task 1.3.1)
  - Added variant registry system
  - Defined three core variants (AC Hammer, DC Hammer, Industrial)
  - Implemented feature flag system
  - Created comprehensive API
