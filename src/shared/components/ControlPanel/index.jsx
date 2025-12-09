import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  Settings, Power, Layout, CheckCircle, AlertTriangle, XCircle, ShieldAlert, Wrench, Info
} from 'lucide-react';
import { StatusButton, IndStatusButton } from '../StatusButton';
import CustomLevelConfig from '../CustomLevelConfig';
import { getBatterySliderColor } from '../../utils/statusUtils';
import { hasFeature } from '../../../variants/registry';

/**
 * ControlPanel Component
 * 
 * Unified control panel for all HMI variants.
 * Provides controls for power, variant selection, status simulation, and variant-specific settings.
 * Optimized with React.memo and useMemo for performance.
 * 
 * @component
 */
const ControlPanel = React.memo(({
  // Power & Variant
  isOn,
  onTogglePower,
  hmiVariant,
  onVariantChange,
  
  // Hammer Controls
  toolStatus,
  onToolStatusChange,
  mode,
  isLocked,
  
  // Battery (DC Hammer & Industrial)
  batteryLevel,
  onBatteryLevelChange,
  
  // Industrial Controls
  indStatus,
  onToggleIndStatus,
  maxTorqueLimit,
  onMaxTorqueLimitChange,
  customLevels,
  onToggleCustomLevelActivation,
  cycleCount,
  onCycleCountChange,
  isMaintenanceNeeded,
  
  // Fixing1 Controls
  autoMode,
  onAutoModeChange,
  speedLevel,
  onSpeedChange,
}) => {
  // Memoize expensive calculations
  const sliderTrackColor = useMemo(
    () => getBatterySliderColor(batteryLevel),
    [batteryLevel]
  );
  
  const isIndustrial = useMemo(
    () => hasFeature(hmiVariant, 'hasIndustrialStatus'),
    [hmiVariant]
  );
  
  const hasSegmentedDisplay = useMemo(
    () => hasFeature(hmiVariant, 'hasSegmentedDisplay'),
    [hmiVariant]
  );

  return (
    <div className="w-full max-w-md bg-slate-700 rounded-xl p-6 shadow-lg text-white space-y-6">
      
      {/* Power and Variant Control */}
      <div className="flex flex-col gap-4 pb-4 border-b border-slate-600">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings size={24} /> Control Panel (控制面板)
          </h3>
          <button 
            onClick={onTogglePower}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
              isOn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            <Power size={20} />
            {isOn ? 'OFF' : 'ON'}
          </button>
        </div>

        {/* HMI Variant Switcher */}
        <div className="bg-slate-800 p-3 rounded-lg">
          <span className="text-sm text-slate-400 flex items-center gap-2 mb-2">
            <Layout size={20} /> Design Variant (设计媒体)
          </span>
          <div className="flex flex-wrap gap-2 bg-slate-900 rounded p-2">
            <button 
              onClick={() => onVariantChange('standard')}
              className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                hmiVariant === 'standard' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              AC Hammer
            </button>
            <button 
              onClick={() => onVariantChange('segmented')}
              className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                hmiVariant === 'segmented' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              DC Hammer 
            </button>
            <button 
              onClick={() => onVariantChange('industrial')}
              className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                hmiVariant === 'industrial' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Industrial
            </button>
            <button 
              onClick={() => onVariantChange('fixing1')}
              className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                hmiVariant === 'fixing1' 
                  ? 'bg-purple-600 text-white shadow' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Fixing 1
            </button>
          </div>
        </div>
      </div>
      
      {/* --- Tool Status Simulator (Hammer) --- */}
      {!isIndustrial && hmiVariant !== 'fixing1' && (
        <div className={`transition-opacity duration-300 ${!isOn ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="text-slate-400 text-xs font-bold uppercase mb-3 tracking-wider">
            Hammer Signal Simulation (信号模拟)
          </div>
          <div className="grid grid-cols-4 gap-2">
            <StatusButton 
              status="normal" 
              currentStatus={toolStatus} 
              onClick={() => onToolStatusChange('normal')} 
              icon={<CheckCircle size={24} />} 
              label="Normal" 
              color="bg-green-600"
            />
            <StatusButton 
              status="warning" 
              currentStatus={toolStatus} 
              onClick={() => onToolStatusChange('warning')} 
              icon={<AlertTriangle size={24} />} 
              label="Warning" 
              color="bg-yellow-600"
            />
            <StatusButton 
              status="error" 
              currentStatus={toolStatus} 
              onClick={() => onToolStatusChange('error')} 
              icon={<XCircle size={24} />} 
              label="Error" 
              color="bg-red-600"
            />
            <StatusButton 
              status="safety_error" 
              currentStatus={toolStatus} 
              onClick={() => onToolStatusChange('safety_error')} 
              icon={<ShieldAlert size={24} />} 
              label="Safety" 
              color="bg-red-800 animate-pulse"
            />
          </div>
          <div className="flex items-center justify-center mt-4 p-2 bg-slate-800 rounded-lg">
            <span className="text-slate-400 text-xs font-bold tracking-wider mr-4">
              CURRENT MODE / SPEED:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-extrabold text-white">
                {mode === 'max' ? '100%' : '70%'}
              </span>
              <span className={`text-[10px] font-bold tracking-wider ${
                mode === 'max' ? 'text-yellow-400' : 'text-blue-400'
              }`}>
                ({mode === 'max' ? 'MAX' : 'SOFT'})
              </span>
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-400 text-center h-4">
            {isLocked && "⚠️ Safety Interlock Active: Controls Disabled"}
          </div>
          
          {/* Battery Level Simulation (DC Hammer) */}
          {hasSegmentedDisplay && (
            <div className="pt-4 border-t border-slate-600 mt-4">
              <div className="text-slate-400 text-xs font-bold uppercase mb-3 tracking-wider">
                DC Hammer: Battery Level ({batteryLevel}%)
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={batteryLevel}
                onChange={(e) => onBatteryLevelChange(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${sliderTrackColor} 0%, ${sliderTrackColor} ${batteryLevel}%, #475569 ${batteryLevel}%, #475569 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0%</span>
                <span>20%</span>
                <span>40%</span>
                <span>60%</span>
                <span>80%</span>
                <span>100%</span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* --- Industrial Tool Controls --- */}
      {isIndustrial && (
        <div className={`transition-opacity duration-300 ${!isOn ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="text-slate-400 text-xs font-bold uppercase mb-3 tracking-wider">
            Industrial Signal Simulation (工业信号模拟)
          </div>
          
          {/* Status Indicators Toggle */}
          <div className="grid grid-cols-3 gap-2">
            <IndStatusButton 
              statusKey="isKickback" 
              isActive={indStatus.isKickback} 
              onClick={onToggleIndStatus} 
              Icon={ShieldAlert} 
              label="反冲触发 (Kickback)"
            />
            <IndStatusButton 
              statusKey="isMaintenance" 
              isActive={indStatus.isMaintenance} 
              onClick={onToggleIndStatus} 
              Icon={Wrench} 
              label="保养模拟"
            />
            <IndStatusButton 
              statusKey="isNFC" 
              isActive={indStatus.isNFC} 
              onClick={onToggleIndStatus} 
              Icon={Info} 
              label="NFC通讯"
            />
          </div>
          
          {/* Setting Slider - Max Torque LIMIT */}
          <div className="pt-4 border-t border-slate-600 mt-4">
            <div className="text-slate-400 text-xs font-bold uppercase mb-3 tracking-wider">
              Max Torque Limit (最大扭矩限制: {maxTorqueLimit}N)
            </div>
            <input
              type="range"
              min="0"
              max="99"
              step="1"
              value={maxTorqueLimit}
              onChange={(e) => onMaxTorqueLimitChange(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #60a5fa 0%, #60a5fa ${maxTorqueLimit}%, #475569 ${maxTorqueLimit}%, #475569 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0 ('H')</span>
              <span>99</span>
            </div>
          </div>

          {/* Custom Torque Levels Configuration */}
          <div className="pt-4 border-t border-slate-600 mt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                CUSTOM TORQUE (自定义扭矩开关)
              </span>
            </div>

            {/* Custom Level Activation Toggles (C1, C2, C3) */}
            <div className="space-y-3">
              {['C1', 'C2', 'C3'].map(key => (
                <CustomLevelConfig 
                  key={key}
                  levelKey={key}
                  levelData={customLevels[key]}
                  onToggleActivation={onToggleCustomLevelActivation}
                />
              ))}
            </div>
          </div>

          {/* Battery Level Simulation */}
          <div className="pt-4 border-t border-slate-600 mt-4">
            <div className="text-slate-400 text-xs font-bold uppercase mb-3 tracking-wider">
              Low Battery Sim ({batteryLevel}%)
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={batteryLevel}
              onChange={(e) => onBatteryLevelChange(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${sliderTrackColor} 0%, ${sliderTrackColor} ${batteryLevel}%, #475569 ${batteryLevel}%, #475569 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span className={`${batteryLevel <= 1 ? 'text-red-400' : 'text-slate-400'}`}>
                &lt; 1% (Red)
              </span>
              <span className={`${batteryLevel <= 20 && batteryLevel > 1 ? 'text-yellow-400' : 'text-slate-400'}`}>
                &lt; 20% (Yellow)
              </span>
              <span>100%</span>
            </div>
          </div>

          {/* Cycle Count Simulation */}
          <div className="pt-4 border-t border-slate-600 mt-4">
            <div className="text-slate-400 text-xs font-bold uppercase mb-3 tracking-wider">
              Cycle Count ({cycleCount})
            </div>
            <input
              type="range"
              min="0"
              max="12000"
              step="100"
              value={cycleCount}
              onChange={(e) => onCycleCountChange(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #a78bfa 0%, #a78bfa ${(cycleCount/12000)*100}%, #475569 ${(cycleCount/12000)*100}%, #475569 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0</span>
              <span className={`${isMaintenanceNeeded ? 'text-yellow-400 font-bold' : 'text-slate-400'}`}>
                10000 (Maintenance)
              </span>
              <span>12000</span>
            </div>
          </div>
        </div>
      )}
      
      {/* --- Fixing1 Variant Status Display (Read-only) --- */}
      {hmiVariant === 'fixing1' && (
        <div className="transition-opacity duration-300">
          <div className="text-slate-400 text-xs font-bold uppercase mb-3 tracking-wider">
            Fixing 1 Status (Fixing 1 状态) - 仅显示
          </div>
          
          {/* Auto Mode Display */}
          <div className="mb-4">
            <div className="text-slate-300 text-xs font-semibold mb-2">Auto Mode (自动模式)</div>
            <div className="grid grid-cols-2 gap-2">
              <div
                className={`px-4 py-2 rounded-lg text-sm font-bold text-center transition-all cursor-not-allowed ${
                  autoMode === 'slow_down'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                🚫 Auto Slow Down
              </div>
              <div
                className={`px-4 py-2 rounded-lg text-sm font-bold text-center transition-all cursor-not-allowed ${
                  autoMode === 'stop'
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                ⏸️ Auto Stop
              </div>
            </div>
            <div className="mt-1 text-xs text-slate-500 italic text-center">
              点击面板上的 MODE 按钮切换
            </div>
          </div>
          
          {/* Speed Level Display */}
          <div>
            <div className="text-slate-300 text-xs font-semibold mb-2">Speed Level (速度档位)</div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((level) => (
                <div
                  key={level}
                  className={`px-4 py-3 rounded-lg text-lg font-bold text-center transition-all cursor-not-allowed ${
                    speedLevel === level
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {level}
                </div>
              ))}
            </div>
            <div className="mt-2 text-center">
              <span className="text-xs text-slate-400">Current Speed: </span>
              <span className="text-sm font-bold text-purple-400">LEVEL {speedLevel}</span>
            </div>
            <div className="mt-1 text-xs text-slate-500 italic text-center">
              点击面板上的数字按钮或 SPEED 按钮切换
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
});

ControlPanel.displayName = 'ControlPanel';

ControlPanel.propTypes = {
  // Power & Variant
  isOn: PropTypes.bool.isRequired,
  onTogglePower: PropTypes.func.isRequired,
  hmiVariant: PropTypes.oneOf(['standard', 'segmented', 'industrial', 'fixing1']).isRequired,
  onVariantChange: PropTypes.func.isRequired,
  
  // Hammer Controls
  toolStatus: PropTypes.oneOf(['normal', 'warning', 'error', 'safety_error']).isRequired,
  onToolStatusChange: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['max', 'soft']).isRequired,
  isLocked: PropTypes.bool.isRequired,
  
  // Battery (DC Hammer & Industrial)
  batteryLevel: PropTypes.number.isRequired,
  onBatteryLevelChange: PropTypes.func.isRequired,
  
  // Industrial Controls
  indStatus: PropTypes.shape({
    isLocked: PropTypes.bool.isRequired,
    isKickback: PropTypes.bool.isRequired,
    isMaintenance: PropTypes.bool.isRequired,
    isNFC: PropTypes.bool.isRequired,
  }).isRequired,
  onToggleIndStatus: PropTypes.func.isRequired,
  maxTorqueLimit: PropTypes.number.isRequired,
  onMaxTorqueLimitChange: PropTypes.func.isRequired,
  customLevels: PropTypes.objectOf(
    PropTypes.shape({
      isActive: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onToggleCustomLevelActivation: PropTypes.func.isRequired,
  cycleCount: PropTypes.number.isRequired,
  onCycleCountChange: PropTypes.func.isRequired,
  isMaintenanceNeeded: PropTypes.bool.isRequired,
  
  // Fixing1 Controls
  autoMode: PropTypes.oneOf(['slow_down', 'stop']),
  onAutoModeChange: PropTypes.func,
  speedLevel: PropTypes.oneOf([1, 2, 3]),
  onSpeedChange: PropTypes.func,
};

export default ControlPanel;
