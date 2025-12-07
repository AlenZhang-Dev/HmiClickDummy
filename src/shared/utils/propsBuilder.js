/**
 * Props Builder Utilities
 * 
 * Centralized prop construction for HMI variant components.
 * Reduces boilerplate and ensures consistency across the application.
 */

/**
 * Build props for Industrial variant screen content
 * @param {Object} state - Application state object
 * @returns {Object} Props object for IndustrialScreenContent
 */
export const buildIndustrialProps = (state) => {
  const {
    maxTorqueLimit,
    indStatus,
    setIndStatus,
    batteryLevel,
    isMaintenanceNeeded,
    isInteractionDisabled,
    isOn,
    isLocked,
    currentTorqueSelection,
    setCurrentTorqueSelection,
    customLevels,
    setCustomLevels,
  } = state;

  return {
    maxLimit: maxTorqueLimit,
    indStatus,
    setIndStatus,
    batteryLevel,
    isMaintenanceNeeded,
    isInteractionDisabled,
    isOn,
    isLocked,
    currentTorqueSelection,
    setCurrentTorqueSelection,
    customLevels,
    setCustomLevels,
  };
};

/**
 * Build props for Hammer variant mode buttons
 * @param {Object} state - Application state object
 * @param {string} type - Button type ('max' or 'soft')
 * @returns {Object} Props object for ModeButton
 */
export const buildModeButtonProps = (state, type) => {
  const { mode, isInteractionDisabled, handleModeSelect } = state;

  return {
    type,
    isActive: mode === type,
    onClick: () => handleModeSelect(type),
    disabled: isInteractionDisabled,
  };
};

/**
 * Build props for Top Bar components (AC/DC Hammer status bars)
 * @param {Object} state - Application state object
 * @param {boolean} hasSegmentedDisplay - Whether this is DC Hammer variant
 * @returns {Object} Props object for top bar component
 */
export const buildTopBarProps = (state, hasSegmentedDisplay) => {
  const { isOn, toolStatus, batteryLevel } = state;

  const baseProps = {
    isOn,
    toolStatus,
  };

  return hasSegmentedDisplay
    ? { ...baseProps, batteryLevel }
    : baseProps;
};

/**
 * Build props for ControlPanel component
 * @param {Object} state - Application state object
 * @returns {Object} Props object for ControlPanel
 */
export const buildControlPanelProps = (state) => {
  const {
    // Power & Variant
    isOn,
    togglePower,
    hmiVariant,
    setHmiVariant,
    
    // Hammer Controls
    toolStatus,
    setToolStatus,
    mode,
    isLocked,
    
    // Battery
    batteryLevel,
    setBatteryLevel,
    
    // Industrial Controls
    indStatus,
    toggleIndStatus,
    maxTorqueLimit,
    handleLimitChange,
    customLevels,
    toggleCustomLevelActivation,
    cycleCount,
    setCycleCount,
    isMaintenanceNeeded,
  } = state;

  return {
    // Power & Variant
    isOn,
    onTogglePower: togglePower,
    hmiVariant,
    onVariantChange: setHmiVariant,
    
    // Hammer Controls
    toolStatus,
    onToolStatusChange: setToolStatus,
    mode,
    isLocked,
    
    // Battery
    batteryLevel,
    onBatteryLevelChange: setBatteryLevel,
    
    // Industrial Controls
    indStatus,
    onToggleIndStatus: toggleIndStatus,
    maxTorqueLimit,
    onMaxTorqueLimitChange: handleLimitChange,
    customLevels,
    onToggleCustomLevelActivation: toggleCustomLevelActivation,
    cycleCount,
    onCycleCountChange: setCycleCount,
    isMaintenanceNeeded,
  };
};

/**
 * Build common state object from component state
 * Helper to gather all state and handlers in one place
 * @param {Object} params - All state values and handlers
 * @returns {Object} Centralized state object
 */
export const buildStateObject = (params) => {
  return { ...params };
};
