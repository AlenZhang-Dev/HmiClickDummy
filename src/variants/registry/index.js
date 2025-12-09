import ACHammerScreenContent from '../ACHammer';
import DCHammerScreenContent from '../DCHammer';
import IndustrialScreenContent from '../Industrial';
import Fixing1ScreenContent from '../Fixing1';

/**
 * Variant Registry
 * 
 * Central registry for all HMI variants with their configurations and components.
 * This allows for dynamic variant loading and unified variant management.
 */

/**
 * Variant metadata and configuration
 */
export const VARIANTS = {
  AC_HAMMER: {
    id: 'standard',
    name: 'AC Hammer',
    displayName: 'AC Hammer',
    component: ACHammerScreenContent,
    description: 'AC-powered hammer with single solid status bar',
    features: {
      hasBatteryDisplay: false,
      hasSegmentedDisplay: false,
      hasModeSelection: true,
      hasCustomLevels: false,
      hasIndustrialStatus: false,
    },
  },
  DC_HAMMER: {
    id: 'segmented',
    name: 'DC Hammer',
    displayName: 'DC Hammer',
    component: DCHammerScreenContent,
    description: 'DC-powered hammer with 5-bar battery display',
    features: {
      hasBatteryDisplay: true,
      hasSegmentedDisplay: true,
      hasModeSelection: true,
      hasCustomLevels: false,
      hasIndustrialStatus: false,
    },
  },
  INDUSTRIAL: {
    id: 'industrial',
    name: 'Industrial',
    displayName: 'Industrial',
    component: IndustrialScreenContent,
    description: 'Professional industrial tool with 7-segment display and advanced features',
    features: {
      hasBatteryDisplay: true,
      hasSegmentedDisplay: false,
      hasModeSelection: false,
      hasCustomLevels: true,
      hasIndustrialStatus: true,
    },
  },
  FIXING_1: {
    id: 'fixing1',
    name: 'Fixing 1',
    displayName: 'Fixing 1',
    component: Fixing1ScreenContent,
    description: 'Vertical industrial panel with auto mode and 3-speed control (1:2.2 aspect ratio)',
    features: {
      hasBatteryDisplay: false,
      hasSegmentedDisplay: false,
      hasModeSelection: false,
      hasCustomLevels: false,
      hasIndustrialStatus: false,
      hasAutoMode: true,          // 🆕 Auto Slow Down / Auto Stop
      hasSpeedControl: true,      // 🆕 3-level speed control
    },
  },
};

/**
 * Get variant configuration by ID
 * @param {string} variantId - Variant ID ('standard', 'segmented', 'industrial')
 * @returns {Object|null} Variant configuration or null if not found
 */
export const getVariantById = (variantId) => {
  return Object.values(VARIANTS).find(v => v.id === variantId) || null;
};

/**
 * Get all available variants
 * @returns {Array} Array of variant configurations
 */
export const getAllVariants = () => {
  return Object.values(VARIANTS);
};

/**
 * Get variant IDs list
 * @returns {Array} Array of variant IDs
 */
export const getVariantIds = () => {
  return Object.values(VARIANTS).map(v => v.id);
};

/**
 * Check if a variant has a specific feature
 * @param {string} variantId - Variant ID
 * @param {string} featureName - Feature name from variant.features
 * @returns {boolean} Whether the variant has the feature
 */
export const hasFeature = (variantId, featureName) => {
  const variant = getVariantById(variantId);
  return variant ? variant.features[featureName] || false : false;
};

/**
 * Get the screen component for a variant
 * @param {string} variantId - Variant ID
 * @returns {React.Component|null} Screen component or null
 */
export const getVariantComponent = (variantId) => {
  const variant = getVariantById(variantId);
  return variant ? variant.component : null;
};

export default VARIANTS;
