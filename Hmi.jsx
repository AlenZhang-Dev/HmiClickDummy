import React, { useState, useEffect } from 'react';
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

  // Build centralized state object for props builders
  const state = buildStateObject({
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
    handleLimitChange,
    currentTorqueSelection,
    setCurrentTorqueSelection,
    customLevels,
    setCustomLevels,
    toggleIndStatus,
    toggleCustomLevelActivation,
    cycleCount,
    setCycleCount,
  });

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
              
              const hasSegmentedDisplay = hasFeature(hmiVariant, 'hasSegmentedDisplay');
              const topBarProps = buildTopBarProps(state, hasSegmentedDisplay);
              
              return <TopBarComponent {...topBarProps} />;
            })()}
        </div>

        {/* HMI Screen Display Area (Black Background) */}
        <div className={`relative bg-black p-8 transition-all duration-500 ${isOn ? 'opacity-100' : 'opacity-50 grayscale'}`}>
          
          {hasFeature(hmiVariant, 'hasIndustrialStatus') ? (
              // --- INDUSTRIAL TOOL HMI CONTENT ---
              <IndustrialScreenContent {...buildIndustrialProps(state)} />
          ) : (
              // --- HAMMER TOOL HMI CONTENT (Max/Soft Buttons) ---
              <div className="flex justify-between items-center gap-12">
                <ModeButton {...buildModeButtonProps(state, 'max')} />
                <ModeButton {...buildModeButtonProps(state, 'soft')} />
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
      <ControlPanel {...buildControlPanelProps(state)} />
    </div>
  );
}

