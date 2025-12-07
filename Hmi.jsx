import React, { useState, useEffect, useMemo } from 'react';
import ModeButton from './src/shared/components/ModeButton';
import ControlPanel from './src/shared/components/ControlPanel';
import ACHammerScreenContent from './src/variants/ACHammer';
import DCHammerScreenContent from './src/variants/DCHammer';
import IndustrialScreenContent from './src/variants/Industrial';
import { hasFeature } from './src/variants/registry';
import { buildIndustrialProps, buildModeButtonProps, buildTopBarProps, buildControlPanelProps, buildStateObject } from './src/shared/utils/propsBuilder';
import {
  DEFAULT_POWER_STATE, DEFAULT_MODE, DEFAULT_HMI_VARIANT, DEFAULT_TOOL_STATUS, DEFAULT_BATTERY_LEVEL,
  DEFAULT_MAX_TORQUE_LIMIT, DEFAULT_CUSTOM_LEVELS, DEFAULT_TORQUE_SELECTION, DEFAULT_IND_STATUS, DEFAULT_CYCLE_COUNT,
  MAINTENANCE_CYCLE_THRESHOLD, HMI_VARIANTS, TOOL_STATUS_TYPES, MAIN_CONTAINER_CLASSES, DEVICE_CASING_CLASSES,
  TOP_BAR_CONTAINER_CLASSES, getScreenDisplayClasses, HAMMER_BUTTONS_CONTAINER_CLASSES, POWER_INDICATOR_CONTAINER_CLASSES,
  POWER_INDICATOR_TEXT_CLASSES, getPowerLedClasses, LOCK_OVERLAY_CONTAINER_CLASSES, LOCK_OVERLAY_BADGE_CLASSES,
  LOCK_OVERLAY_TEXT_CLASSES, CUSTOM_STYLES, isToolLocked, isInteractionDisabled as checkInteractionDisabled,
} from './src/shared/constants';

export default function ElectricToolHMI() {
  // State initialization
  const [isOn, setIsOn] = useState(DEFAULT_POWER_STATE);
  const [mode, setMode] = useState(DEFAULT_MODE);
  const [hmiVariant, setHmiVariant] = useState(DEFAULT_HMI_VARIANT);
  const [toolStatus, setToolStatus] = useState(DEFAULT_TOOL_STATUS);
  const [batteryLevel, setBatteryLevel] = useState(DEFAULT_BATTERY_LEVEL);
  const [maxTorqueLimit, setMaxTorqueLimit] = useState(DEFAULT_MAX_TORQUE_LIMIT);
  const [customLevels, setCustomLevels] = useState(DEFAULT_CUSTOM_LEVELS);
  const [currentTorqueSelection, setCurrentTorqueSelection] = useState(DEFAULT_TORQUE_SELECTION);
  const [indStatus, setIndStatus] = useState(DEFAULT_IND_STATUS);
  const [cycleCount, setCycleCount] = useState(DEFAULT_CYCLE_COUNT);
  
  // Derived states
  const isMaintenanceNeeded = cycleCount >= MAINTENANCE_CYCLE_THRESHOLD || indStatus.isMaintenance;
  const isLocked = isToolLocked(toolStatus);
  const isInteractionDisabled = checkInteractionDisabled(isOn, isLocked, hmiVariant === HMI_VARIANTS.INDUSTRIAL && indStatus.isLocked);

  
  // Effects
  useEffect(() => {
    if (hmiVariant === HMI_VARIANTS.INDUSTRIAL && indStatus.isKickback) {
      setToolStatus(TOOL_STATUS_TYPES.SAFETY_ERROR); 
    } else if (hmiVariant === HMI_VARIANTS.INDUSTRIAL && toolStatus === TOOL_STATUS_TYPES.SAFETY_ERROR && !indStatus.isKickback) {
      setToolStatus(TOOL_STATUS_TYPES.NORMAL);
    }
  }, [indStatus.isKickback, hmiVariant, toolStatus]);
  
  useEffect(() => {
    if (typeof currentTorqueSelection === 'number' && currentTorqueSelection > maxTorqueLimit) {
      setCurrentTorqueSelection(maxTorqueLimit);
    }
  }, [maxTorqueLimit, currentTorqueSelection]);

  // Event handlers
  const togglePower = () => setIsOn(!isOn);
  const handleModeSelect = (selectedMode) => !isInteractionDisabled && setMode(selectedMode);
  const toggleIndStatus = (key) => {
    if (isInteractionDisabled && !(key === 'isKickback' && indStatus.isKickback)) return;
    setIndStatus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCustomLevelActivation = (key) => {
    setCustomLevels(prev => {
      const newLevels = { ...prev, [key]: { ...prev[key], isActive: !prev[key].isActive } };
      if (currentTorqueSelection === key && !newLevels[key].isActive) {
        setCurrentTorqueSelection(maxTorqueLimit);
      }
      return newLevels;
    });
  };

  // Build state object for props builders (memoized)
  const state = useMemo(() => buildStateObject({
    isOn, togglePower, hmiVariant, setHmiVariant, mode, handleModeSelect, toolStatus, setToolStatus,
    isLocked, isInteractionDisabled, batteryLevel, setBatteryLevel, maxTorqueLimit, indStatus, setIndStatus,
    isMaintenanceNeeded, handleLimitChange: setMaxTorqueLimit, currentTorqueSelection, setCurrentTorqueSelection,
    customLevels, setCustomLevels, toggleIndStatus, toggleCustomLevelActivation, cycleCount, setCycleCount,
  }), [isOn, hmiVariant, mode, toolStatus, isLocked, isInteractionDisabled, batteryLevel, maxTorqueLimit,
      indStatus, isMaintenanceNeeded, currentTorqueSelection, customLevels, cycleCount]);

  return (
    <div className={MAIN_CONTAINER_CLASSES}>
      <style>{CUSTOM_STYLES}</style>
      <div className={DEVICE_CASING_CLASSES}>
        <div className={TOP_BAR_CONTAINER_CLASSES}>
          {(() => {
            const TopBarComponent = hmiVariant === 'segmented' ? DCHammerScreenContent : ACHammerScreenContent;
            const hasSegmentedDisplay = hasFeature(hmiVariant, 'hasSegmentedDisplay');
            return <TopBarComponent {...buildTopBarProps(state, hasSegmentedDisplay)} />;
          })()}
        </div>
        <div className={getScreenDisplayClasses(isOn)}>
          {hasFeature(hmiVariant, 'hasIndustrialStatus') ? (
            <IndustrialScreenContent {...buildIndustrialProps(state)} />
          ) : (
            <div className={HAMMER_BUTTONS_CONTAINER_CLASSES}>
              <ModeButton {...buildModeButtonProps(state, 'max')} />
              <ModeButton {...buildModeButtonProps(state, 'soft')} />
            </div>
          )}
          <div className={POWER_INDICATOR_CONTAINER_CLASSES}> 
            <div className="flex items-center gap-2">
              <span className={POWER_INDICATOR_TEXT_CLASSES}>POWER</span>
              <div className={getPowerLedClasses(isOn)}></div>
            </div>
          </div>
          {hmiVariant !== HMI_VARIANTS.INDUSTRIAL && isOn && isLocked && (
            <div className={LOCK_OVERLAY_CONTAINER_CLASSES}>
              <div className={LOCK_OVERLAY_BADGE_CLASSES}>
                <span className={LOCK_OVERLAY_TEXT_CLASSES}>SYSTEM LOCKED</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <ControlPanel {...buildControlPanelProps(state)} />
    </div>
  );
}

