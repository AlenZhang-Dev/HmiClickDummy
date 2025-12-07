import React from 'react';
import PropTypes from 'prop-types';
import ModeButton from '../ModeButton';
import ACHammerScreenContent from '../../../variants/ACHammer';
import DCHammerScreenContent from '../../../variants/DCHammer';
import IndustrialScreenContent from '../../../variants/Industrial';
import { hasFeature } from '../../../variants/registry';

/**
 * HMIScreen Component
 * 
 * Main HMI screen display area with:
 * - Top status bar (variant-specific)
 * - Main content area (variant-specific)
 * - Power indicator
 * - Lock status overlay (for Hammer variants)
 */
const HMIScreen = ({
  // Global states
  isOn,
  hmiVariant,
  
  // Hammer variant states
  isLocked,
  mode,
  toolStatus,
  handleModeSelect,
  isInteractionDisabled,
  
  // Industrial variant states
  maxTorqueLimit,
  indStatus,
  setIndStatus,
  isMaintenanceNeeded,
  currentTorqueSelection,
  setCurrentTorqueSelection,
  customLevels,
  setCustomLevels,
  
  // Shared states
  batteryLevel,
}) => {
  return (
    <div className="relative w-full max-w-md bg-zinc-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-zinc-600">
      
      {/* Top Status Indicator Area (Top Bar / Status Area) */}
      <div className="relative z-0 bg-zinc-900 border-b-4 border-black">
        {(() => {
          // Get the appropriate status bar component for the current variant
          const TopBarComponent = hmiVariant === 'segmented' 
            ? DCHammerScreenContent 
            : ACHammerScreenContent; // AC Hammer and Industrial use same top bar
          
          return hasFeature(hmiVariant, 'hasSegmentedDisplay') ? (
            <TopBarComponent isOn={isOn} toolStatus={toolStatus} batteryLevel={batteryLevel} />
          ) : (
            <TopBarComponent isOn={isOn} toolStatus={toolStatus} />
          );
        })()}
      </div>

      {/* HMI Screen Display Area (Black Background) */}
      <div className={`relative bg-black p-8 transition-all duration-500 ${isOn ? 'opacity-100' : 'opacity-50 grayscale'}`}>
        
        {hasFeature(hmiVariant, 'hasIndustrialStatus') ? (
          // --- INDUSTRIAL TOOL HMI CONTENT ---
          <IndustrialScreenContent 
            maxLimit={maxTorqueLimit}
            indStatus={indStatus} 
            setIndStatus={setIndStatus}
            batteryLevel={batteryLevel} 
            isMaintenanceNeeded={isMaintenanceNeeded} 
            isInteractionDisabled={isInteractionDisabled}
            isOn={isOn}
            isLocked={isLocked}
            currentTorqueSelection={currentTorqueSelection}
            setCurrentTorqueSelection={setCurrentTorqueSelection}
            customLevels={customLevels}
            setCustomLevels={setCustomLevels}
          />
        ) : (
          // --- HAMMER TOOL HMI CONTENT (Max/Soft Buttons) ---
          <div className="flex justify-between items-center gap-12">
            <ModeButton 
              type="max"
              isActive={mode === 'max'}
              onClick={() => handleModeSelect('max')}
              disabled={isInteractionDisabled}
            />
            <ModeButton 
              type="soft"
              isActive={mode === 'soft'}
              onClick={() => handleModeSelect('soft')}
              disabled={isInteractionDisabled}
            />
          </div>
        )}

        {/* Bottom Auxiliary Indicator: Power Light (Shared) */}
        <div className="mt-6 flex justify-center"> 
          <div className="flex items-center gap-2">
            <span className="text-zinc-700 text-[10px] font-bold tracking-wider">POWER</span>
            <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300
              ${!isOn ? 'bg-red-900' : 'bg-green-500'}
            `}></div>
          </div>
        </div>

        {/* Lock status prompt (Only shown during Hammer Error/Safety Error) */}
        {hmiVariant !== 'industrial' && isOn && isLocked && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none w-full text-center">
            <div className="inline-block bg-red-600/20 border border-red-500/50 rounded px-3 py-1 backdrop-blur-sm mb-2">
              <span className="text-red-500 text-xs font-bold tracking-wider">SYSTEM LOCKED</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

HMIScreen.propTypes = {
  // Global states
  isOn: PropTypes.bool.isRequired,
  hmiVariant: PropTypes.string.isRequired,
  
  // Hammer variant states
  isLocked: PropTypes.bool,
  mode: PropTypes.oneOf(['max', 'soft']),
  toolStatus: PropTypes.oneOf(['normal', 'warning', 'error', 'safety_error']),
  handleModeSelect: PropTypes.func,
  isInteractionDisabled: PropTypes.bool,
  
  // Industrial variant states
  maxTorqueLimit: PropTypes.number,
  indStatus: PropTypes.object,
  setIndStatus: PropTypes.func,
  isMaintenanceNeeded: PropTypes.bool,
  currentTorqueSelection: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setCurrentTorqueSelection: PropTypes.func,
  customLevels: PropTypes.object,
  setCustomLevels: PropTypes.func,
  
  // Shared states
  batteryLevel: PropTypes.number.isRequired,
};

export default HMIScreen;
