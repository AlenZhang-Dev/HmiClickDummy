import React, { useState, useEffect } from 'react';
import { 
  Settings, Power, CheckCircle, AlertTriangle, XCircle, ShieldAlert, Layout,
  Lock, Shield, ZapOff, Wrench, Info, Plus, Minus
} from 'lucide-react';
import SevenSegmentDisplay from './src/shared/components/SevenSegmentDisplay';
import ModeButton from './src/shared/components/ModeButton';
import { StatusButton, IndStatusButton } from './src/shared/components/StatusButton';
import CustomLevelConfig from './src/shared/components/CustomLevelConfig';
import ACHammerScreenContent from './src/variants/ACHammer';
import DCHammerScreenContent from './src/variants/DCHammer';
import IndustrialScreenContent from './src/variants/Industrial';
import { getBatterySliderColor } from './src/shared/utils/statusUtils';
import { getVariantComponent, hasFeature } from './src/variants/registry';

// AC Hammer HMI Standard Component
export default function ElectricToolHMI() {
  // --- Global States ---
  const [isOn, setIsOn] = useState(true);      // Power status
  const [mode, setMode] = useState('max');     // Mode: 'max' | 'soft' (for Hammer variants)
  // hmiVariant: 'standard' (AC Hammer) | 'segmented' (DC Hammer) | 'industrial' (New)
  const [hmiVariant, setHmiVariant] = useState('industrial'); 
  
  // Tool status: 'normal' | 'warning' | 'error' | 'safety_error'
  const [toolStatus, setToolStatus] = useState('normal'); 
  const [batteryLevel, setBatteryLevel] = useState(85); // For DC Hammer and Industrial Low Battery Indicator

  // --- Industrial Tool States (New) ---
  // 1. Max Torque Limit (N): Set by control panel slider. The absolute maximum level.
  const [maxTorqueLimit, setMaxTorqueLimit] = useState(50);
  
  // 2. Custom Torque Levels State - SIMPLIFIED: only isActive remains
  const [customLevels, setCustomLevels] = useState({
      C1: { isActive: true },
      C2: { isActive: true },
      C3: { isActive: false },
  });

  // 3. Current Torque Selection: The selected setting (number 0-99 OR string key 'C1', 'C2', 'C3')
  const [currentTorqueSelection, setCurrentTorqueSelection] = useState(50); 
  
  // Status indicators for Industrial Tool 
  const [indStatus, setIndStatus] = useState({
    isLocked: false,          // Tool Lock (T)
    isKickback: false,        // Kickback Control Triggered (ShieldAlert)
    isMaintenance: false,     // Maintenance Reminder Simulation (Wrench)
    isNFC: false,             // NFC Communication Simulation (Info/i)
  });
  const [cycleCount, setCycleCount] = useState(0); // For Maintenance Reminder simulation (10000 limit)
  
  // Derived state for Maintenance logic (User can trigger it manually OR by cycle count)
  const isMaintenanceNeeded = cycleCount >= 10000 || indStatus.isMaintenance;
  
  // Check if locked (Error or Safety Error - used for Hammer variants)
  const isLocked = toolStatus === 'error' || toolStatus === 'safety_error';
  
  // 核心逻辑: 检查交互是否被禁用
  // Disabled if: 1. Power OFF (!isOn) OR 2. Hard lock (isLocked) OR 3. Industrial Tool Lock (indStatus.isLocked)
  const isInteractionDisabled = !isOn || isLocked || (hmiVariant === 'industrial' && indStatus.isLocked);

  
  // Effect to link Industrial Kickback state to overall toolStatus and top bar visualization
  useEffect(() => {
    if (hmiVariant === 'industrial' && indStatus.isKickback) {
      setToolStatus('safety_error'); 
    } else if (hmiVariant === 'industrial' && toolStatus === 'safety_error' && !indStatus.isKickback) {
      // 只有在 Kickback 被手动或自动取消后，才将状态重置为 normal
      // 这里的逻辑已经支持通过切换 indStatus.isKickback 来关闭 safety_error
      setToolStatus('normal');
    }
  }, [indStatus.isKickback, hmiVariant, toolStatus]);
  
  // Effect to ensure selection is valid if Max Limit changes
  useEffect(() => {
    // If current selection is a number and exceeds the new limit, cap it.
    if (typeof currentTorqueSelection === 'number' && currentTorqueSelection > maxTorqueLimit) {
        setCurrentTorqueSelection(maxTorqueLimit);
    }
  }, [maxTorqueLimit, currentTorqueSelection]); // Dependency array includes the states that change the limits

  // Handler for power toggle
  const togglePower = () => {
    setIsOn(!isOn);
  };

  /**
   * Handler for industrial status button toggles.
   * FIX: Added exception for 'isKickback' when active, allowing the button to be 
   * pressed to CLEAR the 'safety_error' state, which otherwise disables interaction.
   */
  const toggleIndStatus = (key) => {
      // 默认的禁用逻辑检查
      if (isInteractionDisabled) {
          // **豁免逻辑:** // 仅允许在 Kickback 已经触发 (ON) 的情况下，再次点击它来清除状态。
          if (key === 'isKickback' && indStatus.isKickback) {
              // 允许继续执行切换（即将其切换为 OFF）
          } else {
              // 其他所有在禁用状态下的点击都将被忽略
              return; 
          }
      }

      setIndStatus(prev => ({
          ...prev,
          [key]: !prev[key] // Toggle logic
      }));
  };

  // Handler for Max Torque Limit change (from control panel slider)
  const handleLimitChange = (newLimit) => {
      setMaxTorqueLimit(newLimit);
  };

  // Handler for custom level activation toggle (Simplified)
  const toggleCustomLevelActivation = (key) => {
      setCustomLevels(prev => {
          const newLevels = {
              ...prev,
              [key]: {
                  ...prev[key],
                  isActive: !prev[key].isActive
              }
          };

          // If the current selection is the one being toggled off, switch to max numeric limit
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

  // Determine the track color for the battery slider
  const sliderTrackColor = getBatterySliderColor(batteryLevel);


  return (
    <div className="min-h-screen bg-slate-800 flex flex-col items-center justify-center p-4 font-sans select-none">
      
      {/* Custom animation style: 2Hz blink (0.5s cycle) */}
      <style>{`
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
      `}</style>

      {/* --- Device Casing --- */}
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
                  maxLimit={maxTorqueLimit} // Max limit for boundary check
                  indStatus={indStatus} 
                  setIndStatus={setIndStatus} // Pass setter for long press logic
                  batteryLevel={batteryLevel} 
                  isMaintenanceNeeded={isMaintenanceNeeded} 
                  isInteractionDisabled={isInteractionDisabled}
                  isOn={isOn}
                  isLocked={isLocked}
                  
                  // New Props for Custom Torque
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

      {/* --- Interaction Control Panel --- */}
      <div className="mt-6 w-full max-w-md bg-slate-700 rounded-xl p-6 shadow-lg text-white space-y-6">
        
        {/* Power and Variant Control */}
        <div className="flex flex-col gap-4 pb-4 border-b border-slate-600">
          <div className="flex items-center justify-between">
             <h3 className="text-lg font-semibold flex items-center gap-2">
                {/* ICON SIZE ADJUSTED: 24 (Previous adjustment) */}
                <Settings size={24} /> Control Panel (控制面板)
            </h3>
            <button 
                onClick={togglePower}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${isOn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
                {/* ICON SIZE ADJUSTED: 20 (Previous adjustment) */}
                <Power size={20} />
                {isOn ? 'OFF' : 'ON'}
            </button>
          </div>

          {/* HMI Variant Switcher */}
          <div className="bg-slate-800 p-3 rounded-lg flex items-center justify-between">
             <span className="text-sm text-slate-400 flex items-center gap-2">
                {/* ICON SIZE ADJUSTED: 20 (Previous adjustment) */}
                <Layout size={20} /> Design Variant (设计媒体)
             </span>
             <div className="flex bg-slate-900 rounded p-1">
                <button 
                    onClick={() => setHmiVariant('standard')}
                    className={`px-3 py-1 text-xs font-bold rounded transition-all ${hmiVariant === 'standard' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    AC Hammer
                </button>
                <button 
                    onClick={() => setHmiVariant('segmented')}
                    className={`px-3 py-1 text-xs font-bold rounded transition-all ${hmiVariant === 'segmented' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    DC Hammer 
                </button>
                <button 
                    onClick={() => setHmiVariant('industrial')}
                    className={`px-3 py-1 text-xs font-bold rounded transition-all ${hmiVariant === 'industrial' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Industrial
                </button>
             </div>
          </div>
        </div>
        
        {/* --- Tool Status Simulator (Hammer) --- */}
        {!hasFeature(hmiVariant, 'hasIndustrialStatus') && (
           <div className={`transition-opacity duration-300 ${!isOn ? 'opacity-50 pointer-events-none' : ''}`}>
             <div className="text-slate-400 text-xs font-bold uppercase mb-3 tracking-wider">Hammer Signal Simulation (信号模拟)</div>
             <div className="grid grid-cols-4 gap-2">
               <StatusButton status="normal" currentStatus={toolStatus} onClick={() => setToolStatus('normal')} icon={<CheckCircle size={24} />} label="Normal" color="bg-green-600"/>
               <StatusButton status="warning" currentStatus={toolStatus} onClick={() => setToolStatus('warning')} icon={<AlertTriangle size={24} />} label="Warning" color="bg-yellow-600"/>
               <StatusButton status="error" currentStatus={toolStatus} onClick={() => setToolStatus('error')} icon={<XCircle size={24} />} label="Error" color="bg-red-600"/>
               <StatusButton status="safety_error" currentStatus={toolStatus} onClick={() => setToolStatus('safety_error')} icon={<ShieldAlert size={24} />} label="Safety" color="bg-red-800 animate-pulse"/>
             </div>
             <div className="flex items-center justify-center mt-4 p-2 bg-slate-800 rounded-lg">
               <span className="text-slate-400 text-xs font-bold tracking-wider mr-4">CURRENT MODE / SPEED:</span>
               <div className="flex items-center gap-2">
                 <span className="text-sm font-mono font-extrabold text-white">
                   {mode === 'max' ? '100%' : '70%'}
                 </span>
                 <span className={`text-[10px] font-bold tracking-wider ${mode === 'max' ? 'text-yellow-400' : 'text-blue-400'}`}>
                   ({mode === 'max' ? 'MAX' : 'SOFT'})
                 </span>
               </div>
             </div>
             <div className="mt-2 text-xs text-slate-400 text-center h-4">
               {isLocked && "⚠️ Safety Interlock Active: Controls Disabled"}
             </div>
             {/* Battery Level Simulation (DC Hammer) */}
             {hasFeature(hmiVariant, 'hasSegmentedDisplay') && (
                 <div className="pt-4 border-t border-slate-600 mt-4">
                     <div className="text-slate-400 text-xs font-bold uppercase mb-3 tracking-wider">DC Hammer: Battery Level ({batteryLevel}%)</div>
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
        )}
        
        {/* --- Industrial Tool Controls --- */}
        {hasFeature(hmiVariant, 'hasIndustrialStatus') && (
             <div className={`transition-opacity duration-300 ${!isOn ? 'opacity-50 pointer-events-none' : ''}`}>
                 <div className="text-slate-400 text-xs font-bold uppercase mb-3 tracking-wider">Industrial Signal Simulation (工业信号模拟)</div>
                 
                 {/* Status Indicators Toggle (Now 3 columns) */}
                 <div className="grid grid-cols-3 gap-2">
                    {/* Kickback 按钮现在是标准的 toggle，可以关闭 */}
                    <IndStatusButton statusKey="isKickback" isActive={indStatus.isKickback} onClick={toggleIndStatus} Icon={ShieldAlert} label="反冲触发 (Kickback)"/>
                    <IndStatusButton statusKey="isMaintenance" isActive={indStatus.isMaintenance} onClick={toggleIndStatus} Icon={Wrench} label="保养模拟"/>
                    <IndStatusButton statusKey="isNFC" isActive={indStatus.isNFC} onClick={toggleIndStatus} Icon={Info} label="NFC通讯"/>
                 </div>
                 
                 {/* Setting Slider - Max Torque LIMIT */}
                 <div className="pt-4 border-t border-slate-600 mt-4">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-3 tracking-wider">Max Torque Limit (最大扭矩限制: {maxTorqueLimit}N)</div>
                    <input
                        type="range"
                        min="0"
                        max="99"
                        step="1"
                        value={maxTorqueLimit}
                        onChange={(e) => handleLimitChange(parseInt(e.target.value))} // Use new limit handler
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

                {/* --- New Feature: Custom Torque Levels Configuration (Simplified) --- */}
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
                                onToggleActivation={toggleCustomLevelActivation}
                            />
                        ))}
                    </div>
                </div>

                {/* Battery Level Simulation (Reusing existing for visualization) */}
                 <div className="pt-4 border-t border-slate-600 mt-4">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-3 tracking-wider">Low Battery Sim ({batteryLevel}%)</div>
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
                        <span className={`${batteryLevel <= 1 ? 'text-red-400' : 'text-slate-400'}`}>&lt; 1% (Red)</span>
                        <span className={`${batteryLevel <= 20 && batteryLevel > 1 ? 'text-yellow-400' : 'text-slate-400'}`}>&lt; 20% (Yellow)</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* Cycle Count Simulation (New for Maintenance) */}
                 <div className="pt-4 border-t border-slate-600 mt-4">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-3 tracking-wider">Cycle Count ({cycleCount})</div>
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
                        <span className={`${isMaintenanceNeeded ? 'text-yellow-400 font-bold' : 'text-slate-400'}`}>10000 (Maintenance)</span>
                        <span>12000</span>
                    </div>
                </div>
             </div>
        )}
        
      </div>
    </div>
  );
}

