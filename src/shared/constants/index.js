/**
 * HMI Application Constants
 * 
 * Centralized constants for styling, thresholds, and configuration values.
 */

// ============================================================================
// MAINTENANCE & CYCLE THRESHOLDS
// ============================================================================

/**
 * Cycle count at which maintenance is required for Industrial variant
 */
export const MAINTENANCE_CYCLE_THRESHOLD = 10000;

/**
 * Maximum cycle count for Industrial variant
 */
export const MAX_CYCLE_COUNT = 12000;

// ============================================================================
// TORQUE LIMITS
// ============================================================================

/**
 * Maximum torque limit value for Industrial variant (in Newtons)
 */
export const MAX_TORQUE_LIMIT = 99;

/**
 * Minimum torque limit value
 */
export const MIN_TORQUE_LIMIT = 0;

// ============================================================================
// DEFAULT INITIAL VALUES
// ============================================================================

/**
 * Default battery level percentage on app start
 */
export const DEFAULT_BATTERY_LEVEL = 85;

/**
 * Default max torque limit on app start
 */
export const DEFAULT_MAX_TORQUE_LIMIT = 50;

/**
 * Default current torque selection on app start
 */
export const DEFAULT_TORQUE_SELECTION = 50;

/**
 * Default HMI variant on app start
 * Options: 'standard' (AC Hammer) | 'segmented' (DC Hammer) | 'industrial'
 */
export const DEFAULT_HMI_VARIANT = 'industrial';

/**
 * Default power state on app start
 */
export const DEFAULT_POWER_STATE = true;

/**
 * Default mode for Hammer variants
 * Options: 'max' | 'soft'
 */
export const DEFAULT_MODE = 'max';

/**
 * Default tool status on app start
 * Options: 'normal' | 'warning' | 'error' | 'safety_error'
 */
export const DEFAULT_TOOL_STATUS = 'normal';

/**
 * Default custom levels configuration for Industrial variant
 */
export const DEFAULT_CUSTOM_LEVELS = {
  C1: { isActive: true },
  C2: { isActive: true },
  C3: { isActive: false },
};

/**
 * Default industrial status indicators
 */
export const DEFAULT_IND_STATUS = {
  isLocked: false,      // Tool Lock
  isKickback: false,    // Kickback Control
  isMaintenance: false, // Maintenance Reminder
  isNFC: false,         // NFC Communication
};

/**
 * Default cycle count
 */
export const DEFAULT_CYCLE_COUNT = 0;

// ============================================================================
// CSS CLASS NAME PATTERNS
// ============================================================================

/**
 * Common container classes for the main app wrapper
 */
export const MAIN_CONTAINER_CLASSES = 
  'min-h-screen bg-slate-800 flex flex-col items-center justify-center p-4 font-sans select-none';

/**
 * Device casing wrapper classes
 */
export const DEVICE_CASING_CLASSES = 
  'relative w-full max-w-md bg-zinc-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-zinc-600';

/**
 * Top status bar container classes
 */
export const TOP_BAR_CONTAINER_CLASSES = 
  'relative z-0 bg-zinc-900 border-b-4 border-black';

/**
 * HMI screen display area classes
 * @param {boolean} isOn - Power state
 * @returns {string} Conditional class string
 */
export const getScreenDisplayClasses = (isOn) => 
  `relative bg-black p-8 transition-all duration-500 ${isOn ? 'opacity-100' : 'opacity-50 grayscale'}`;

/**
 * Hammer mode buttons container classes
 */
export const HAMMER_BUTTONS_CONTAINER_CLASSES = 
  'flex justify-between items-center gap-12';

/**
 * Power indicator container classes
 */
export const POWER_INDICATOR_CONTAINER_CLASSES = 
  'mt-6 flex justify-center';

/**
 * Power indicator text classes
 */
export const POWER_INDICATOR_TEXT_CLASSES = 
  'text-zinc-700 text-[10px] font-bold tracking-wider';

/**
 * Power LED classes
 * @param {boolean} isOn - Power state
 * @returns {string} Conditional class string
 */
export const getPowerLedClasses = (isOn) => 
  `w-1.5 h-1.5 rounded-full transition-colors duration-300 ${!isOn ? 'bg-red-900' : 'bg-green-500'}`;

/**
 * Lock overlay container classes
 */
export const LOCK_OVERLAY_CONTAINER_CLASSES = 
  'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none w-full text-center';

/**
 * Lock overlay badge classes
 */
export const LOCK_OVERLAY_BADGE_CLASSES = 
  'inline-block bg-red-600/20 border border-red-500/50 rounded px-3 py-1 backdrop-blur-sm mb-2';

/**
 * Lock overlay text classes
 */
export const LOCK_OVERLAY_TEXT_CLASSES = 
  'text-red-500 text-xs font-bold tracking-wider';

// ============================================================================
// CUSTOM STYLES (for <style> tag injection)
// ============================================================================

/**
 * Global custom CSS styles for HMI components
 * Includes animations, range input styling, and toggle switches
 */
export const CUSTOM_STYLES = `
  @keyframes blink-2hz {
    0%, 100% { opacity: 1; filter: brightness(1.2); }
    50% { opacity: 0.3; filter: brightness(0.8); }
  }
  .animate-blink-2hz {
    animation: blink-2hz 0.5s infinite;
  }

  /* Custom track style for battery range input */
  input[type=range]::-webkit-slider-runnable-track {
    height: 8px;
    border-radius: 4px;
  }
  
  /* Custom toggle switch style */
  .toggle-switch-container input:checked + .slider {
    background-color: #3b82f6; /* Blue 500 */
  }
  .toggle-switch-container input:focus + .slider {
    box-shadow: 0 0 1px #3b82f6;
  }
  .toggle-switch-container .slider {
    background-color: #475569; /* Slate 600 */
  }
`;

// ============================================================================
// VARIANT IDENTIFIERS
// ============================================================================

/**
 * HMI Variant type identifiers
 */
export const HMI_VARIANTS = {
  STANDARD: 'standard',    // AC Hammer
  SEGMENTED: 'segmented',  // DC Hammer
  INDUSTRIAL: 'industrial', // Industrial Tool
};

/**
 * Tool status type identifiers
 */
export const TOOL_STATUS_TYPES = {
  NORMAL: 'normal',
  WARNING: 'warning',
  ERROR: 'error',
  SAFETY_ERROR: 'safety_error',
};

/**
 * Mode type identifiers for Hammer variants
 */
export const MODE_TYPES = {
  MAX: 'max',
  SOFT: 'soft',
};

/**
 * Custom torque level identifiers
 */
export const CUSTOM_LEVEL_KEYS = ['C1', 'C2', 'C3'];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if maintenance is needed based on cycle count or manual flag
 * @param {number} cycleCount - Current cycle count
 * @param {boolean} isManualMaintenance - Manual maintenance flag
 * @returns {boolean} Whether maintenance is needed
 */
export const isMaintenanceNeeded = (cycleCount, isManualMaintenance) => {
  return cycleCount >= MAINTENANCE_CYCLE_THRESHOLD || isManualMaintenance;
};

/**
 * Check if tool is locked based on status
 * @param {string} toolStatus - Current tool status
 * @returns {boolean} Whether tool is locked
 */
export const isToolLocked = (toolStatus) => {
  return toolStatus === TOOL_STATUS_TYPES.ERROR || toolStatus === TOOL_STATUS_TYPES.SAFETY_ERROR;
};

/**
 * Check if interaction is disabled
 * @param {boolean} isOn - Power state
 * @param {boolean} isLocked - Hammer lock state
 * @param {boolean} isIndLocked - Industrial lock state
 * @returns {boolean} Whether interaction is disabled
 */
export const isInteractionDisabled = (isOn, isLocked, isIndLocked = false) => {
  return !isOn || isLocked || isIndLocked;
};
