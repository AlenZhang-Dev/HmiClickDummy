/**
 * Status and Battery Utility Functions
 * 
 * Shared utility functions for status colors and battery level calculations
 * used across HMI variants.
 */

/**
 * Get the status color class based on tool status
 * 
 * @param {string} toolStatus - Current tool status ('normal' | 'warning' | 'error' | 'safety_error')
 * @returns {string} Tailwind CSS class for the status color
 */
export const getStatusColor = (toolStatus) => {
    switch (toolStatus) {
        case 'normal': return 'bg-green-500';
        case 'warning': return 'bg-yellow-500';
        case 'error': 
        case 'safety_error': return 'bg-red-600';
        default: return 'bg-blue-100';
    }
};

/**
 * Get the battery slider track color based on battery level
 * 
 * @param {number} batteryLevel - Battery level percentage (0-100)
 * @returns {string} Hex color code for the slider track
 */
export const getBatterySliderColor = (batteryLevel) => {
    if (batteryLevel <= 1) {
        return '#ef4444'; // Red
    } else if (batteryLevel <= 20) {
        return '#f59e0b'; // Yellow
    }
    return '#10b981'; // Green (default)
};

/**
 * Battery level thresholds and colors
 */
export const BATTERY_THRESHOLDS = {
    CRITICAL: 1,
    WARNING: 20,
    COLORS: {
        CRITICAL: '#ef4444',
        WARNING: '#f59e0b',
        NORMAL: '#10b981',
    }
};

/**
 * Tool status types
 */
export const TOOL_STATUS = {
    NORMAL: 'normal',
    WARNING: 'warning',
    ERROR: 'error',
    SAFETY_ERROR: 'safety_error',
};
