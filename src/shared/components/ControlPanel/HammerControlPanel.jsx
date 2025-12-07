import React from 'react';
import PropTypes from 'prop-types';
import { CheckCircle, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';
import { StatusButton } from '../StatusButton';
import { getBatterySliderColor } from '../../utils/statusUtils';
import { hasFeature } from '../../../variants/registry';

/**
 * HammerControlPanel Component
 * 
 * Control panel for Hammer variants (AC Hammer & DC Hammer)
 * Provides status simulation, mode display, and battery control (for DC variant)
 */
const HammerControlPanel = ({
  isOn,
  isLocked,
  mode,
  hmiVariant,
  toolStatus,
  setToolStatus,
  batteryLevel,
  setBatteryLevel
}) => {
  const sliderTrackColor = getBatterySliderColor(batteryLevel);

  return (
    <div className={`transition-opacity duration-300 ${!isOn ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="text-slate-400 text-xs font-bold uppercase mb-3 tracking-wider">
        Hammer Signal Simulation (信号模拟)
      </div>
      
      {/* Status buttons grid */}
      <div className="grid grid-cols-4 gap-2">
        <StatusButton 
          status="normal" 
          currentStatus={toolStatus} 
          onClick={() => setToolStatus('normal')} 
          icon={<CheckCircle size={24} />} 
          label="Normal" 
          color="bg-green-600"
        />
        <StatusButton 
          status="warning" 
          currentStatus={toolStatus} 
          onClick={() => setToolStatus('warning')} 
          icon={<AlertTriangle size={24} />} 
          label="Warning" 
          color="bg-yellow-600"
        />
        <StatusButton 
          status="error" 
          currentStatus={toolStatus} 
          onClick={() => setToolStatus('error')} 
          icon={<XCircle size={24} />} 
          label="Error" 
          color="bg-red-600"
        />
        <StatusButton 
          status="safety_error" 
          currentStatus={toolStatus} 
          onClick={() => setToolStatus('safety_error')} 
          icon={<ShieldAlert size={24} />} 
          label="Safety" 
          color="bg-red-800 animate-pulse"
        />
      </div>
      
      {/* Current mode display */}
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
      
      {/* Lock status message */}
      <div className="mt-2 text-xs text-slate-400 text-center h-4">
        {isLocked && "⚠️ Safety Interlock Active: Controls Disabled"}
      </div>
      
      {/* Battery Level Simulation (DC Hammer only) */}
      {hasFeature(hmiVariant, 'hasSegmentedDisplay') && (
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
            onChange={(e) => setBatteryLevel(parseInt(e.target.value))}
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
  );
};

HammerControlPanel.propTypes = {
  isOn: PropTypes.bool.isRequired,
  isLocked: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['max', 'soft']).isRequired,
  hmiVariant: PropTypes.string.isRequired,
  toolStatus: PropTypes.oneOf(['normal', 'warning', 'error', 'safety_error']).isRequired,
  setToolStatus: PropTypes.func.isRequired,
  batteryLevel: PropTypes.number.isRequired,
  setBatteryLevel: PropTypes.func.isRequired,
};

export default HammerControlPanel;
