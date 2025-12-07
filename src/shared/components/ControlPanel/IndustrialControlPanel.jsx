import React from 'react';
import PropTypes from 'prop-types';
import { ShieldAlert, Wrench, Info } from 'lucide-react';
import { IndStatusButton } from '../StatusButton';
import CustomLevelConfig from '../CustomLevelConfig';
import { getBatterySliderColor } from '../../utils/statusUtils';

/**
 * IndustrialControlPanel Component
 * 
 * Control panel for Industrial Tool variant
 * Provides status indicators, torque limit control, custom levels, battery, and cycle count
 */
const IndustrialControlPanel = ({
  isOn,
  indStatus,
  toggleIndStatus,
  maxTorqueLimit,
  handleLimitChange,
  customLevels,
  toggleCustomLevelActivation,
  batteryLevel,
  setBatteryLevel,
  cycleCount,
  setCycleCount,
  isMaintenanceNeeded
}) => {
  const sliderTrackColor = getBatterySliderColor(batteryLevel);

  return (
    <div className={`transition-opacity duration-300 ${!isOn ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="text-slate-400 text-xs font-bold uppercase mb-3 tracking-wider">
        Industrial Signal Simulation (工业信号模拟)
      </div>
      
      {/* Status Indicators Toggle (3 columns) */}
      <div className="grid grid-cols-3 gap-2">
        <IndStatusButton 
          statusKey="isKickback" 
          isActive={indStatus.isKickback} 
          onClick={toggleIndStatus} 
          Icon={ShieldAlert} 
          label="反冲触发 (Kickback)"
        />
        <IndStatusButton 
          statusKey="isMaintenance" 
          isActive={indStatus.isMaintenance} 
          onClick={toggleIndStatus} 
          Icon={Wrench} 
          label="保养模拟"
        />
        <IndStatusButton 
          statusKey="isNFC" 
          isActive={indStatus.isNFC} 
          onClick={toggleIndStatus} 
          Icon={Info} 
          label="NFC通讯"
        />
      </div>
      
      {/* Max Torque Limit Slider */}
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
          onChange={(e) => handleLimitChange(parseInt(e.target.value))}
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
        <div className="space-y-3">
          {['C1', 'C2', 'C3'].map(key => (
            <CustomLevelConfig 
              key={key}
              levelKey={key}
              levelData={customLevels[key]}
              onToggleActivation={toggleCustomLevelActivation}
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
          onChange={(e) => setBatteryLevel(parseInt(e.target.value))}
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
          onChange={(e) => setCycleCount(parseInt(e.target.value))}
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
  );
};

IndustrialControlPanel.propTypes = {
  isOn: PropTypes.bool.isRequired,
  indStatus: PropTypes.shape({
    isLocked: PropTypes.bool.isRequired,
    isKickback: PropTypes.bool.isRequired,
    isMaintenance: PropTypes.bool.isRequired,
    isNFC: PropTypes.bool.isRequired,
  }).isRequired,
  toggleIndStatus: PropTypes.func.isRequired,
  maxTorqueLimit: PropTypes.number.isRequired,
  handleLimitChange: PropTypes.func.isRequired,
  customLevels: PropTypes.object.isRequired,
  toggleCustomLevelActivation: PropTypes.func.isRequired,
  batteryLevel: PropTypes.number.isRequired,
  setBatteryLevel: PropTypes.func.isRequired,
  cycleCount: PropTypes.number.isRequired,
  setCycleCount: PropTypes.func.isRequired,
  isMaintenanceNeeded: PropTypes.bool.isRequired,
};

export default IndustrialControlPanel;
