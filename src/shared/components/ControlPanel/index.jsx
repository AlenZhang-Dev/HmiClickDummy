import React from 'react';
import PropTypes from 'prop-types';
import { Settings, Power, Layout } from 'lucide-react';
import { hasFeature } from '../../../variants/registry';
import HammerControlPanel from './HammerControlPanel';
import IndustrialControlPanel from './IndustrialControlPanel';

/**
 * ControlPanel Component
 * 
 * Main control panel that provides:
 * - Power control
 * - Variant switcher (AC Hammer / DC Hammer / Industrial)
 * - Variant-specific control panels
 */
const ControlPanel = ({
  // Global states
  isOn,
  togglePower,
  hmiVariant,
  setHmiVariant,
  
  // Hammer variant states
  isLocked,
  mode,
  toolStatus,
  setToolStatus,
  
  // Industrial variant states
  indStatus,
  toggleIndStatus,
  maxTorqueLimit,
  handleLimitChange,
  customLevels,
  toggleCustomLevelActivation,
  cycleCount,
  setCycleCount,
  isMaintenanceNeeded,
  
  // Shared states
  batteryLevel,
  setBatteryLevel,
}) => {
  return (
    <div className="mt-6 w-full max-w-md bg-slate-700 rounded-xl p-6 shadow-lg text-white space-y-6">
      
      {/* Power and Variant Control */}
      <div className="flex flex-col gap-4 pb-4 border-b border-slate-600">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings size={24} /> Control Panel (控制面板)
          </h3>
          <button 
            onClick={togglePower}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
              isOn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            <Power size={20} />
            {isOn ? 'OFF' : 'ON'}
          </button>
        </div>

        {/* HMI Variant Switcher */}
        <div className="bg-slate-800 p-3 rounded-lg flex items-center justify-between">
          <span className="text-sm text-slate-400 flex items-center gap-2">
            <Layout size={20} /> Design Variant (设计媒体)
          </span>
          <div className="flex bg-slate-900 rounded p-1">
            <button 
              onClick={() => setHmiVariant('standard')}
              className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                hmiVariant === 'standard' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              AC Hammer
            </button>
            <button 
              onClick={() => setHmiVariant('segmented')}
              className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                hmiVariant === 'segmented' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              DC Hammer 
            </button>
            <button 
              onClick={() => setHmiVariant('industrial')}
              className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                hmiVariant === 'industrial' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Industrial
            </button>
          </div>
        </div>
      </div>
      
      {/* Variant-specific Control Panel */}
      {hasFeature(hmiVariant, 'hasIndustrialStatus') ? (
        <IndustrialControlPanel
          isOn={isOn}
          indStatus={indStatus}
          toggleIndStatus={toggleIndStatus}
          maxTorqueLimit={maxTorqueLimit}
          handleLimitChange={handleLimitChange}
          customLevels={customLevels}
          toggleCustomLevelActivation={toggleCustomLevelActivation}
          batteryLevel={batteryLevel}
          setBatteryLevel={setBatteryLevel}
          cycleCount={cycleCount}
          setCycleCount={setCycleCount}
          isMaintenanceNeeded={isMaintenanceNeeded}
        />
      ) : (
        <HammerControlPanel
          isOn={isOn}
          isLocked={isLocked}
          mode={mode}
          hmiVariant={hmiVariant}
          toolStatus={toolStatus}
          setToolStatus={setToolStatus}
          batteryLevel={batteryLevel}
          setBatteryLevel={setBatteryLevel}
        />
      )}
      
    </div>
  );
};

ControlPanel.propTypes = {
  // Global states
  isOn: PropTypes.bool.isRequired,
  togglePower: PropTypes.func.isRequired,
  hmiVariant: PropTypes.string.isRequired,
  setHmiVariant: PropTypes.func.isRequired,
  
  // Hammer variant states
  isLocked: PropTypes.bool,
  mode: PropTypes.oneOf(['max', 'soft']),
  toolStatus: PropTypes.oneOf(['normal', 'warning', 'error', 'safety_error']),
  setToolStatus: PropTypes.func,
  
  // Industrial variant states
  indStatus: PropTypes.shape({
    isLocked: PropTypes.bool,
    isKickback: PropTypes.bool,
    isMaintenance: PropTypes.bool,
    isNFC: PropTypes.bool,
  }),
  toggleIndStatus: PropTypes.func,
  maxTorqueLimit: PropTypes.number,
  handleLimitChange: PropTypes.func,
  customLevels: PropTypes.object,
  toggleCustomLevelActivation: PropTypes.func,
  cycleCount: PropTypes.number,
  setCycleCount: PropTypes.func,
  isMaintenanceNeeded: PropTypes.bool,
  
  // Shared states
  batteryLevel: PropTypes.number.isRequired,
  setBatteryLevel: PropTypes.func.isRequired,
};

export default ControlPanel;
