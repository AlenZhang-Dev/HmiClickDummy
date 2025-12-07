import React, { useState, useEffect, useMemo } from 'react';
import ModeButton from './src/shared/components/ModeButton';
import ControlPanel from './src/shared/components/ControlPanel';
import ACHammerScreenContent from './src/variants/ACHammer';
import DCHammerScreenContent from './src/variants/DCHammer';
import IndustrialScreenContent from './src/variants/Industrial';
import { getVariantComponent, hasFeature } from './src/variants/registry';
import { 
  buildIndustrialProps, 
  buildModeButtonProps, 
  buildTopBarProps, 
  buildControlPanelProps,
  buildStateObject 
} from './src/shared/utils/propsBuilder';
import {
  DEFAULT_POWER_STATE,
  DEFAULT_MODE,
  DEFAULT_HMI_VARIANT,
  DEFAULT_TOOL_STATUS,
  DEFAULT_BATTERY_LEVEL,
  DEFAULT_MAX_TORQUE_LIMIT,
  DEFAULT_CUSTOM_LEVELS,
  DEFAULT_TORQUE_SELECTION,
  DEFAULT_IND_STATUS,
  DEFAULT_CYCLE_COUNT,
  MAINTENANCE_CYCLE_THRESHOLD,
  HMI_VARIANTS,
  TOOL_STATUS_TYPES,
  MAIN_CONTAINER_CLASSES,
  DEVICE_CASING_CLASSES,
  TOP_BAR_CONTAINER_CLASSES,
  getScreenDisplayClasses,
  HAMMER_BUTTONS_CONTAINER_CLASSES,
  POWER_INDICATOR_CONTAINER_CLASSES,
  POWER_INDICATOR_TEXT_CLASSES,
  getPowerLedClasses,
  LOCK_OVERLAY_CONTAINER_CLASSES,
  LOCK_OVERLAY_BADGE_CLASSES,
  LOCK_OVERLAY_TEXT_CLASSES,
  CUSTOM_STYLES,
  isToolLocked,
  isInteractionDisabled as checkInteractionDisabled,
} from './src/shared/constants';

// AC Hammer HMI Standard Component
export default function ElectricToolHMI() {
  // --- Global States ---
  const [isOn, setIsOn] = useState(DEFAULT_POWER_STATE);
  const [mode, setMode] = useState(DEFAULT_MODE);
  const [hmiVariant, setHmiVariant] = useState(DEFAULT_HMI_VARIANT);
  const [toolStatus, setToolStatus] = useState(DEFAULT_TOOL_STATUS);
  const [batteryLevel, setBatteryLevel] = useState(DEFAULT_BATTERY_LEVEL);

  // --- Industrial Tool States ---
  const [maxTorqueLimit, setMaxTorqueLimit] = useState(DEFAULT_MAX_TORQUE_LIMIT);
  const [customLevels, setCustomLevels] = useState(DEFAULT_CUSTOM_LEVELS);
  const [currentTorqueSelection, setCurrentTorqueSelection] = useState(DEFAULT_TORQUE_SELECTION);
  const [indStatus, setIndStatus] = useState(DEFAULT_IND_STATUS);
  const [cycleCount, setCycleCount] = useState(DEFAULT_CYCLE_COUNT);
  
  // Derived states
  const isMaintenanceNeeded = cycleCount >= MAINTENANCE_CYCLE_THRESHOLD || indStatus.isMaintenance;
  const isLocked = isToolLocked(toolStatus);
  const isInteractionDisabled = checkInteractionDisabled(
    isOn, 
    isLocked, 
    hmiVariant === HMI_VARIANTS.INDUSTRIAL && indStatus.isLocked
  );

  
  // Effect to link Industrial Kickback state to overall toolStatus and top bar visualization
  useEffect(() => {
    if (hmiVariant === HMI_VARIANTS.INDUSTRIAL && indStatus.isKickback) {
      setToolStatus(TOOL_STATUS_TYPES.SAFETY_ERROR); 
    } else if (hmiVariant === HMI_VARIANTS.INDUSTRIAL && toolStatus === TOOL_STATUS_TYPES.SAFETY_ERROR && !indStatus.isKickback) {
      setToolStatus(TOOL_STATUS_TYPES.NORMAL);
    }
  }, [indStatus.isKickback, hmiVariant, toolStatus]);
  
  // Effect to ensure selection is valid if Max Limit changes
  useEffect(() => {
    if (typeof currentTorqueSelection === 'number' && currentTorqueSelection > maxTorqueLimit) {
      setCurrentTorqueSelection(maxTorqueLimit);
    }
  }, [maxTorqueLimit, currentTorqueSelection]);

  // Handler for power toggle
  const togglePower = () => {
    setIsOn(!isOn);
  };

  /**
   * Handler for industrial status button toggles.
   * Special handling for Kickback: allows clearing even when interaction is disabled.
   */
  const toggleIndStatus = (key) => {
    if (isInteractionDisabled) {
      // Allow Kickback to be turned off even when disabled
      if (key === 'isKickback' && indStatus.isKickback) {
        // Continue to toggle
      } else {
        return;
      }
    }

    setIndStatus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handler for custom level activation toggle
  const toggleCustomLevelActivation = (key) => {
    setCustomLevels(prev => {
      const newLevels = {
        ...prev,
        [key]: {
          ...prev[key],
          isActive: !prev[key].isActive
        }
      };

      // If current selection is being toggled off, switch to max limit
      if (currentTorqueSelection === key && !newLevels[key].isActive) {
        setCurrentTorqueSelection(maxTorqueLimit);
      }

      return newLevels;
    });
  };
  
  // Mode selection handler (for Hammer variants - unused in Industrial)
  const handleModeSelect = (selectedMode) => {
    if (isInteractionDisabled) return;
    setMode(selectedMode);
  };

  // Build centralized state object for props builders (memoized for performance)
  const state = useMemo(() => buildStateObject({
    // Power & Variant
    isOn,
    togglePower,
    hmiVariant,
    setHmiVariant,
    
    // Hammer Controls
    mode,
    handleModeSelect,
    toolStatus,
    setToolStatus,
    isLocked,
    isInteractionDisabled,
    
    // Battery
    batteryLevel,
    setBatteryLevel,
    
    // Industrial Controls
    maxTorqueLimit,
    indStatus,
    setIndStatus,
    isMaintenanceNeeded,
    handleLimitChange: setMaxTorqueLimit,
    currentTorqueSelection,
    setCurrentTorqueSelection,
    customLevels,
    setCustomLevels,
    toggleIndStatus,
    toggleCustomLevelActivation,
    cycleCount,
    setCycleCount,
  }), [
    isOn, hmiVariant, mode, toolStatus, isLocked, isInteractionDisabled,
    batteryLevel, maxTorqueLimit, indStatus, isMaintenanceNeeded,
    currentTorqueSelection, customLevels, cycleCount,
  ]);

  return (
    <div className={MAIN_CONTAINER_CLASSES}>
      
      {/* Custom animation style: 2Hz blink (0.5s cycle) */}
      <style>{CUSTOM_STYLES}</style>

      {/* --- Device Casing --- */}
      <div className={DEVICE_CASING_CLASSES}>
        
        {/* Top Status Indicator Area (Top Bar / Status Area) */}
        <div className={TOP_BAR_CONTAINER_CLASSES}>
            {(() => {
              // Get the appropriate status bar component for the current variant
              const TopBarComponent = hmiVariant === 'segmented' 
                ? DCHammerScreenContent 
                : ACHammerScreenContent; // AC Hammer and Industrial use same top bar
              
              const hasSegmentedDisplay = hasFeature(hmiVariant, 'hasSegmentedDisplay');
              const topBarProps = buildTopBarProps(state, hasSegmentedDisplay);
              
              return <TopBarComponent {...topBarProps} />;
            })()}
        </div>

        {/* HMI Screen Display Area (Black Background) */}
        <div className={getScreenDisplayClasses(isOn)}>
          
          {hasFeature(hmiVariant, 'hasIndustrialStatus') ? (
              // --- INDUSTRIAL TOOL HMI CONTENT ---
              <IndustrialScreenContent {...buildIndustrialProps(state)} />
          ) : (
              // --- HAMMER TOOL HMI CONTENT (Max/Soft Buttons) ---
              <div className={HAMMER_BUTTONS_CONTAINER_CLASSES}>
                <ModeButton {...buildModeButtonProps(state, 'max')} />
                <ModeButton {...buildModeButtonProps(state, 'soft')} />
              </div>
          )}

          {/* Bottom Auxiliary Indicator: Power Light (Shared) */}
          <div className={POWER_INDICATOR_CONTAINER_CLASSES}> 
            <div className="flex items-center gap-2">
               <span className={POWER_INDICATOR_TEXT_CLASSES}>POWER</span>
               <div className={getPowerLedClasses(isOn)}></div>
            </div>
          </div>

          {/* Lock status prompt (Only shown during Hammer Error/Safety Error) */}
          {hmiVariant !== HMI_VARIANTS.INDUSTRIAL && isOn && isLocked && (
            <div className={LOCK_OVERLAY_CONTAINER_CLASSES}>
              <div className={LOCK_OVERLAY_BADGE_CLASSES}>
                <span className={LOCK_OVERLAY_TEXT_CLASSES}>SYSTEM LOCKED</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Interaction Control Panel --- */}
      <ControlPanel {...buildControlPanelProps(state)} />
    </div>
  );
}

