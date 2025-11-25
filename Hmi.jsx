import React, { useState, useEffect } from 'react';
import { 
  Settings, Power, CheckCircle, AlertTriangle, XCircle, ShieldAlert, Layout,
  Lock, Shield, ZapOff, Wrench, Info, Plus, Minus
} from 'lucide-react';

// --- Segment Map for 7-Segment Display ---
/**
 * Maps a character (0-9, H, C, space) to an array of active segments (A-G).
 * A=Top, B=TopRight, C=BottomRight, D=Bottom, E=BottomLeft, F=TopLeft, G=Middle
 * * AAAA
 * F    B
 * F    B
 * GGGG
 * E    C
 * E    C
 * DDDD
 */
const segmentMap = {
  ' ': [],
  '0': ['A', 'B', 'C', 'D', 'E', 'F'],
  '1': ['B', 'C'],
  '2': ['A', 'B', 'G', 'E', 'D'],
  '3': ['A', 'B', 'G', 'C', 'D'],
  '4': ['F', 'G', 'B', 'C'],
  '5': ['A', 'F', 'G', 'C', 'D'],
  '6': ['A', 'F', 'G', 'E', 'D', 'C'],
  '7': ['A', 'B', 'C'],
  '8': ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  '9': ['A', 'B', 'C', 'D', 'F', 'G'],
  'H': ['F', 'E', 'G', 'B', 'C'], // For Level 0 indicator ('H'igh)
  'C': ['A', 'F', 'E', 'D'], // For Custom Level
};

/**
 * A single 7-segment digit display component using CSS for segments.
 * Adjusted size to w-12 h-20 and segment thickness to 5px.
 */
function SevenSegmentDigit({ char, activeColor, inactiveColor }) {
  const activeSegments = segmentMap[char.toUpperCase()] || [];
  
  // Base classes for a segment shape
  // Note: Segment thickness reduced to 5px for smaller size
  const segmentBase = "absolute rounded-sm transition-colors duration-100 ease-linear";
  
  // Function to get the color class for a segment
  const getSegmentClass = (segment) => 
    activeSegments.includes(segment) ? activeColor : inactiveColor;

  return (
    // Outer container for the digit (Reduced size for smaller display)
    <div className="relative w-12 h-20"> 
      
      {/* A (Top) - Horizontal */}
      <div className={`${segmentBase} w-[70%] h-[5px] top-0 left-1/2 -translate-x-1/2 ${getSegmentClass('A')}`} />
      
      {/* G (Middle) - Horizontal */}
      <div className={`${segmentBase} w-[70%] h-[5px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${getSegmentClass('G')}`} />
      
      {/* D (Bottom) - Horizontal */}
      <div className={`${segmentBase} w-[70%] h-[5px] bottom-0 left-1/2 -translate-x-1/2 ${getSegmentClass('D')}`} />

      {/* F (Top Left) - Vertical - Top/Bottom offset adjusted to 5px */}
      <div className={`${segmentBase} w-[5px] h-[40%] top-[5px] left-0 ${getSegmentClass('F')}`} />
      
      {/* B (Top Right) - Vertical - Top/Bottom offset adjusted to 5px */}
      <div className={`${segmentBase} w-[5px] h-[40%] top-[5px] right-0 ${getSegmentClass('B')}`} />
      
      {/* E (Bottom Left) - Vertical - Top/Bottom offset adjusted to 5px */}
      <div className={`${segmentBase} w-[5px] h-[40%] bottom-[5px] left-0 ${getSegmentClass('E')}`} />
      
      {/* C (Bottom Right) - Vertical - Top/Bottom offset adjusted to 5px */}
      <div className={`${segmentBase} w-[5px] h-[40%] bottom-[5px] right-0 ${getSegmentClass('C')}`} />
      
    </div>
  );
}

/**
 * The full 2-digit 7-segment display wrapper.
 * NOTE: Updated logic for numeric values 1-9 to suppress leading zero.
 */
function SevenSegmentDisplay({ value, activeColor, inactiveColor }) {
    let displayString = '';
    
    if (typeof value === 'string') {
        // Custom Levels C1, C2, C3
        if (value.length === 2) {
            displayString = value.toUpperCase();
        } else {
            displayString = '  '; // Error case
        }
    } else if (value === 0) {
        // Level 0 displays 'H ' (High Torque)
        displayString = 'H '; 
    } else if (value >= 1 && value <= 9) {
        // Numeric levels 1-9: Suppress leading zero by adding a space
        // Example: 5 becomes " 5" instead of "05"
        displayString = ' ' + String(value); 
    } else if (value >= 10 && value <= 99) {
        // Numeric levels 10-99: Standard 2-digit display
        displayString = String(value).slice(0, 2); 
    } else {
        // Default or error case for numeric values outside [0, 99]
        displayString = '  ';
    }
    
    const char1 = displayString[0] || ' ';
    const char2 = displayString[1] || ' ';
    
    return (
        <div className="flex items-center space-x-2">
            <SevenSegmentDigit char={char1} activeColor={activeColor} inactiveColor={inactiveColor} />
            <SevenSegmentDigit char={char2} activeColor={activeColor} inactiveColor={inactiveColor} />
        </div>
    );
}
// --- End 7-Segment Components ---

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

  // Get status color class (Base color)
  const getStatusColor = () => {
     switch (toolStatus) {
      case 'normal': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': 
      case 'safety_error': return 'bg-red-600';
      default: return 'bg-blue-100';
    }
  };

  // Get full style for Standard (Single Bar) - AC Hammer
  const getSingleBarClass = () => {
    if (!isOn) return 'bg-slate-400';
    let base = "";
    switch (toolStatus) {
      case 'normal': base = 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]'; break;
      case 'warning': base = 'bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.4)]'; break;
      case 'error': base = 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]'; break;
      case 'safety_error': base = 'bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.8)] animate-blink-2hz'; break;
      default: base = 'bg-blue-100';
    }
    return base;
  };

  // Get style for a single bar in Segmented (5-Bar) - DC Hammer (Used for Status Override only)
  const getSegmentBarClass = () => {
    if (!isOn) return 'bg-slate-600 opacity-30'; 
    
    const baseColor = getStatusColor();
    const shadow = toolStatus === 'normal' ? 'shadow-[0_0_10px_rgba(34,197,94,0.5)]' :
                   toolStatus === 'warning' ? 'shadow-[0_0_10px_rgba(234,179,8,0.5)]' :
                   'shadow-[0_0_15px_rgba(220,38,38,0.6)]';
    
    const animation = toolStatus === 'safety_error' ? 'animate-blink-2hz' : '';
    
    return `${baseColor} ${shadow} ${animation}`;
  };

  // Get display text for status (for AC Hammer)
  const getStatusLabel = () => {
    switch (toolStatus) {
      case 'normal': return 'NORMAL';
      case 'warning': return 'WARNING';
      case 'error': return 'ERROR';
      case 'safety_error': return 'SAFETY STOP';
      default: return '';
    }
  };

  // Helper function for DC Hammer (Segmented) battery display logic
  const getBatteryDisplay = () => {
    let numActiveBars = 0;
    let activeBarColorClass = 'bg-green-500'; // Default green

    if (batteryLevel <= 0) {
      numActiveBars = 0;
      activeBarColorClass = 'bg-red-500'; 
    } else if (batteryLevel <= 1) { 
      numActiveBars = 1;
      activeBarColorClass = 'bg-red-500'; 
    } else if (batteryLevel <= 20) { 
      numActiveBars = 1;
      activeBarColorClass = 'bg-yellow-500'; 
    } else if (batteryLevel <= 40) { 
      numActiveBars = 2;
      activeBarColorClass = 'bg-green-500'; 
    } else if (batteryLevel <= 60) {
      numActiveBars = 3;
      activeBarColorClass = 'bg-green-500'; 
    } else if (batteryLevel <= 80) {
      numActiveBars = 4;
      activeBarColorClass = 'bg-green-500'; 
    } else {
      numActiveBars = 5;
      activeBarColorClass = 'bg-green-500'; 
    }
    
    return { numActiveBars, activeBarColorClass };
  };

  // Determine the track color for the battery slider
  let sliderTrackColor = '#10b981'; // Green (default)
  if (batteryLevel <= 1) {
      sliderTrackColor = '#ef4444'; // Red
  } else if (batteryLevel <= 20) {
      sliderTrackColor = '#f59e0b'; // Yellow
  }


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
            
            {hmiVariant === 'standard' ? (
                // --- STANDARD: Single Solid Bar (AC Hammer) ---
                <div className={`h-16 flex items-center justify-center transition-colors duration-300 ${getSingleBarClass()}`}>
                    <span className="text-slate-900/70 font-black tracking-widest text-xl mix-blend-multiply">
                        {isOn ? getStatusLabel() : 'OFF'}
                    </span>
                </div>
            ) : hmiVariant === 'segmented' ? (
                // --- SEGMENTED: 5 Bars Layout (DC Hammer: Battery or Status Override) ---
                <div className="h-16 flex items-center justify-center gap-3 px-8 bg-zinc-900">
                     {/* 5 independent Bars */}
                     {[1, 2, 3, 4, 5].map((i) => {
                         const isStatusOverride = toolStatus !== 'normal';
                         let barClass = '';
                         
                         if (isStatusOverride) {
                             // Priority 1: Status Override (Warning, Error, Safety)
                             barClass = getSegmentBarClass(); 
                         } else {
                             // Priority 2: Normal - Display Battery Level
                             const { numActiveBars, activeBarColorClass } = getBatteryDisplay();
                             const isBarActive = i <= numActiveBars;
                             
                             if (isBarActive) {
                                 let shadowColor = 'rgba(34,197,94,0.5)';
                                 if (activeBarColorClass.includes('yellow')) {
                                      shadowColor = 'rgba(234,179,8,0.5)';
                                 } else if (activeBarColorClass.includes('red')) {
                                     shadowColor = 'rgba(239,68,68,0.6)';
                                 }

                                 barClass = `${activeBarColorClass} shadow-[0_0_10px_${shadowColor}]`;
                             } else {
                                 barClass = 'bg-slate-600 opacity-30';
                             }
                         }

                         return (
                             <div 
                                key={i} 
                                className={`h-8 flex-1 rounded-sm transition-all duration-300 ${barClass}`}
                             />
                         );
                     })}
                </div>
            ) : (
                // --- INDUSTRIAL: Top Status Bar (Identical to Standard/Segmented Logic) ---
                <div className={`h-16 flex items-center justify-center transition-colors duration-300 ${getSingleBarClass()}`}>
                    <span className="text-slate-900/70 font-black tracking-widest text-xl mix-blend-multiply">
                        {isOn ? getStatusLabel() : 'OFF'}
                    </span>
                </div>
            )}
        </div>

        {/* HMI Screen Display Area (Black Background) */}
        <div className={`relative bg-black p-8 transition-all duration-500 ${isOn ? 'opacity-100' : 'opacity-50 grayscale'}`}>
          
          {hmiVariant === 'industrial' ? (
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
        
        {/* --- Tool Status Simulator (Hammer) --- (omitted for brevity) */}
        {hmiVariant !== 'industrial' && (
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
             {hmiVariant === 'segmented' && (
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
        {hmiVariant === 'industrial' && (
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

/**
 * Custom Level Configuration Component for Control Panel (Simplified)
 * Only contains the activation toggle.
 */
function CustomLevelConfig({ levelKey, levelData, onToggleActivation }) {

    return (
        <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${levelData.isActive ? 'border-blue-700 bg-slate-800' : 'border-slate-700 bg-slate-700/50'}`}>
            
            <span className="font-mono font-extrabold text-sm text-blue-300 w-10">
                {levelKey} 
            </span>
            <span className="text-xs text-slate-400 flex-1 ml-4">
                自定义挡位开关
            </span>
            
            {/* Toggle Switch */}
            <div className="toggle-switch-container flex items-center">
                <span className={`mr-2 text-sm font-medium ${levelData.isActive ? 'text-blue-400' : 'text-slate-500'}`}>
                    {levelData.isActive ? '启用' : '禁用'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={levelData.isActive} 
                        onChange={() => onToggleActivation(levelKey)} 
                        className="sr-only peer"
                    />
                    <div className="w-9 h-5 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:after:bg-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all slider"></div>
                </label>
            </div>
        </div>
    );
}


/**
 * --- Industrial Tool Screen Content (7-Segment Display and Icons) ---
 */
function IndustrialScreenContent({ 
    maxLimit, // The maximum allowed limit (N)
    indStatus, 
    setIndStatus,
    batteryLevel, 
    isMaintenanceNeeded,
    isInteractionDisabled, // True if Power OFF, Hard Error, OR Tool Lock ON
    isOn,
    isLocked,
    
    // New Props for Custom Torque
    currentTorqueSelection, // The selected setting (number 0-99 OR string key 'C1', 'C2', 'C3')
    setCurrentTorqueSelection,
    customLevels,
}) {
    
    // --- State Logic ---
    
    // Low Battery Logic
    let lowBatteryColor = 'text-zinc-700 opacity-40'; // Default: Off/Dark
    let lowBatteryShadow = '';
    
    if (batteryLevel <= 1) {
        lowBatteryColor = 'text-red-400'; 
        lowBatteryShadow = 'shadow-[0_0_15px_rgba(255,100,100,0.8)]'; 
    } else if (batteryLevel <= 20) {
        lowBatteryColor = 'text-yellow-300'; 
        lowBatteryShadow = 'shadow-[0_0_15px_rgba(255,255,0,0.6)]'; 
    }

    // --- Torque Selection Logic (Non-Circular Sequence) ---
    
    // Get the full sequence of BASE selectable values (only including active custom levels)
    const getFullSequence = () => {
        // Numeric levels: 0, 1, 2, ..., maxLimit
        const numericLevels = Array.from({ length: maxLimit + 1 }, (_, i) => i);
        
        // Active Custom Levels (Keys only, e.g., ['C1', 'C2', 'C3'])
        const activeCustomKeys = Object.keys(customLevels)
            .filter(key => customLevels[key].isActive)
            .sort(); // Sort to ensure C1, C2, C3 order
            
        // Full sequence of selection STATES: [0, 1, ..., maxLimit, 'C1', 'C2', 'C3']
        return [...numericLevels, ...activeCustomKeys];
    };
    
    const adjustCurrentTorqueSelection = (delta) => {
        if (isInteractionDisabled) return;

        const sequence = getFullSequence();
        const currentIndex = sequence.indexOf(currentTorqueSelection);
        
        const potentialNewIndex = currentIndex + delta;
        
        // 非循环边界检查：如果超出范围，则不执行任何操作
        if (potentialNewIndex >= 0 && potentialNewIndex < sequence.length) {
            const newSelection = sequence[potentialNewIndex];
            setCurrentTorqueSelection(newSelection);
        } 
    };
    
    // --- Tool Lock Long Press Logic ---
    const [lockTimer, setLockTimer] = useState(null);
    const LONG_PRESS_DELAY = 3000; // 3 seconds

    const toggleLock = () => {
        setIndStatus(prev => ({...prev, isLocked: !prev.isLocked}));
    };
    
    const handleLockMouseDown = (e) => {
        // 长按逻辑：只在电源关闭或硬件错误时禁用
        // 即使 Tool Lock 激活，也允许长按来解锁
        if (!isOn || isLocked) return; 

        e.preventDefault();
        setLockTimer(setTimeout(() => {
            toggleLock();
            setLockTimer(null); 
        }, LONG_PRESS_DELAY));
    };

    const handleLockMouseUp = () => {
        if (lockTimer) {
            clearTimeout(lockTimer);
            setLockTimer(null);
        }
    };
    
    const handlePlusMinusClick = (delta) => {
        // 点击操作：检查是否被禁用
        // 如果 Tool Lock 激活 (indStatus.isLocked)，则禁用点击调节
        if (isInteractionDisabled) return;
        
        // 如果正在长按，不执行点击操作
        if (!lockTimer) {
             adjustCurrentTorqueSelection(delta); 
        }
    }
    // --- End Long Press Logic ---


    // --- Display Logic ---
    // 根据选中的挡位类型，确定 HMI 上实际显示的字符或数字
    let hmiDisplayValue = currentTorqueSelection;

    // Icon definitions with dynamic styling
    const indicators = [
        // 1. Tool Lock (T)
        { Icon: Lock, isActive: indStatus.isLocked, label: 'T', 
          className: indStatus.isLocked ? 'text-white shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'text-zinc-700 opacity-40' 
        },
        
        // 2. Kickback Control (ShieldAlert) - RED when active
        { Icon: ShieldAlert, isActive: indStatus.isKickback, label: '', 
          className: indStatus.isKickback ? 'text-red-400 shadow-[0_0_15px_rgba(255,100,100,0.8)]' : 'text-zinc-700 opacity-40' 
        },
        
        // 3. Low Battery (ZapOff) - Dynamic color based on batteryLevel
        { Icon: ZapOff, isActive: lowBatteryColor.includes('red') || lowBatteryColor.includes('yellow'), label: '', 
          className: `${lowBatteryColor} ${lowBatteryShadow}`
        },
        
        // 4. Maintenance (Wrench) - YELLOW when needed
        { Icon: Wrench, isActive: isMaintenanceNeeded, label: '', 
          className: isMaintenanceNeeded ? 'text-yellow-300 shadow-[0_0_15px_rgba(255,255,0,0.6)]' : 'text-zinc-700 opacity-40' 
        },
        
        // 5. NFC Communication (Info/i) - Blue when active
        { Icon: Info, isActive: indStatus.isNFC, label: 'i', 
          className: indStatus.isNFC ? 'text-blue-400 shadow-[0_0_15px_rgba(100,100,255,0.6)]' : 'text-zinc-700 opacity-40' 
        },
    ];

    const iconBaseClass = "w-14 h-14 border border-zinc-700/50 rounded-lg flex items-center justify-center transition-all duration-300 bg-zinc-900/50";

    return (
        <div className="flex flex-col items-center justify-start space-y-6">
            
            {/* 1. Icon Indicators Row */}
            <div className="w-full flex justify-center items-center px-4">
                <div className="flex justify-between items-center w-full max-w-sm"> 
                    {indicators.map((ind, index) => (
                        <div 
                            key={index} 
                            className={`${iconBaseClass} ${ind.className}`}
                        >
                            <div className="relative">
                                <ind.Icon size={32} className="stroke-[2.5]"/>
                                {ind.label && (
                                    <span 
                                      className="absolute bottom-[-2px] right-[-2px] text-xs font-extrabold"
                                      style={{color: ind.isActive ? 'white' : '#52525B'}}
                                    >
                                        {ind.label}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Adjustment Buttons and Display */}
            <div className="flex items-center space-x-4 w-full justify-center mt-4">
                {/* Minus Button */}
                <button 
                    onClick={() => handlePlusMinusClick(-1)}
                    onMouseDown={handleLockMouseDown}
                    onMouseUp={handleLockMouseUp}
                    onTouchStart={handleLockMouseDown}
                    onTouchEnd={handleLockMouseUp}
                    // 不设置 disabled，让长按事件始终可以触发
                    // 通过 CSS 类名显示禁用状态
                    className={`w-20 h-20 rounded-xl border-2 border-zinc-700 bg-zinc-800 transition-all duration-150 shadow-md flex items-center justify-center text-zinc-400 hover:text-white 
                        ${isInteractionDisabled ? 'opacity-40' : 'active:bg-zinc-700'} cursor-pointer
                    `}
                >
                    <Minus size={40} className="stroke-[3]" />
                </button>

                {/* Torque Level Display (7-Segment) */}
                <div className="flex flex-col items-center">
                    <div className="w-36 h-24 bg-black p-1 rounded-sm border border-zinc-700/50 flex items-center justify-center">
                        <SevenSegmentDisplay 
                            value={hmiDisplayValue} // 使用 hmiDisplayValue (可能是数字或 'C1'/'C2'/'C3' 字符串)
                            activeColor="bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]" 
                            inactiveColor="bg-zinc-900/50" 
                        />
                    </div>
                </div>

                {/* Plus Button */}
                <button 
                    onClick={() => handlePlusMinusClick(1)}
                    onMouseDown={handleLockMouseDown}
                    onMouseUp={handleLockMouseUp}
                    onTouchStart={handleLockMouseDown}
                    onTouchEnd={handleLockMouseUp}
                    // 不设置 disabled，让长按事件始终可以触发
                    // 通过 CSS 类名显示禁用状态
                    className={`w-20 h-20 rounded-xl border-2 border-zinc-700 bg-zinc-800 transition-all duration-150 shadow-md flex items-center justify-center text-zinc-400 hover:text-white 
                        ${isInteractionDisabled ? 'opacity-40' : 'active:bg-zinc-700'} cursor-pointer
                    `}
                >
                    <Plus size={40} className="stroke-[3]" />
                </button>
            </div>
            
        </div>
    );
}


/**
 * Status simulation button on the Control Panel (For Hammer Variants)
 */
function StatusButton({ status, currentStatus, onClick, icon, label, color }) {
  const isSelected = status === currentStatus;
  
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200
        ${isSelected ? `${color} text-white scale-105 ring-2 ring-offset-2 ring-offset-slate-700 ring-white` : 'bg-slate-600 text-slate-300 hover:bg-slate-500'}
      `}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}

/**
 * Status toggle button on the Control Panel (For Industrial Variant)
 */
function IndStatusButton({ statusKey, isActive, onClick, Icon, label }) {
  
  return (
    <button
      onClick={() => onClick(statusKey)}
      className={`
        flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200
        ${isActive ? 'bg-blue-600 text-white scale-105 ring-2 ring-offset-2 ring-offset-slate-700 ring-white' : 'bg-slate-600 text-slate-300 hover:bg-slate-500'}
      `}
    >
      <div className="mb-1">
        <Icon size={24} />
      </div>
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}

/**
 * Mode Button Component (Inside HMI Screen - For Hammer Variants)
 */
function ModeButton({ type, isActive, onClick, disabled }) {
  const isMax = type === 'max';
  const label = isMax ? '100%' : '70%';
  
  let containerStyle = "";
  let contentStyle = "";
  let barColor = "";

  if (disabled) {
    if (isActive) {
        containerStyle = "border-zinc-600 bg-zinc-800 opacity-60 cursor-not-allowed";
        contentStyle = "text-zinc-500";
        barColor = "bg-zinc-500";
    } else {
        containerStyle = "border-zinc-800 bg-transparent opacity-20 cursor-not-allowed";
        contentStyle = "text-zinc-700";
        barColor = "bg-zinc-800";
    }
  } else {
    if (isActive) {
        containerStyle = "border-slate-300 bg-zinc-800 shadow-[0_0_15px_rgba(255,255,255,0.1)] cursor-pointer";
        contentStyle = "text-slate-200";
        barColor = "bg-slate-300";
    } else {
        containerStyle = "border-zinc-700 bg-transparent opacity-40 hover:opacity-60 cursor-pointer";
        contentStyle = "text-zinc-600";
        barColor = "bg-zinc-700";
    }
  }

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`
        flex-1 aspect-square rounded-sm border-[4px] 
        flex flex-col items-center justify-between p-3 
        transition-all duration-300 outline-none
        ${containerStyle}
      `}
    >
      
      {/* Icon Area */}
      <div className="flex items-end justify-center gap-1.5 h-1/2 w-full mt-2">
        {/* Bar 1 */}
        <div 
          className={`w-1/4 transition-colors duration-300 ${barColor}`} 
          style={{ 
            height: '35%', 
            clipPath: 'polygon(0 30%, 100% 0, 100% 100%, 0% 100%)'
          }} 
        />
        
        {/* Bar 2 */}
        <div 
          className={`w-1/4 transition-colors duration-300 ${barColor}`} 
          style={{ 
            height: isMax ? '65%' : '50%', 
            clipPath: 'polygon(0 30%, 100% 0, 100% 100%, 0% 100%)'
          }} 
        />
        
        {/* Bar 3 */}
        <div 
          className={`w-1/4 transition-colors duration-300 ${barColor}`} 
          style={{ 
            height: isMax ? '100%' : '65%',
            clipPath: 'polygon(0 30%, 100% 0, 100% 100%, 0% 100%)'
          }} 
        />
      </div>

      {/* Value Display */}
      <div className={`font-bold text-3xl font-mono tracking-tighter transition-colors duration-300 ${contentStyle}`}>
        {label}
      </div>
    </button>
  );
}