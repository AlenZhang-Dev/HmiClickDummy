import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Lock, ShieldAlert, ZapOff, Wrench, Info, Plus, Minus } from 'lucide-react';
import SevenSegmentDisplay from '../../shared/components/SevenSegmentDisplay';

/**
 * IndustrialScreenContent Component
 * 
 * Renders the screen display for Industrial variant with:
 * - 5 status indicator icons (Tool Lock, Kickback, Low Battery, Maintenance, NFC)
 * - 7-segment display for torque level
 * - Plus/Minus adjustment buttons with long-press lock functionality
 * 
 * @component
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
    };
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

IndustrialScreenContent.propTypes = {
    maxLimit: PropTypes.number.isRequired,
    indStatus: PropTypes.shape({
        isLocked: PropTypes.bool.isRequired,
        isKickback: PropTypes.bool.isRequired,
        isMaintenance: PropTypes.bool.isRequired,
        isNFC: PropTypes.bool.isRequired,
    }).isRequired,
    setIndStatus: PropTypes.func.isRequired,
    batteryLevel: PropTypes.number.isRequired,
    isMaintenanceNeeded: PropTypes.bool.isRequired,
    isInteractionDisabled: PropTypes.bool.isRequired,
    isOn: PropTypes.bool.isRequired,
    isLocked: PropTypes.bool.isRequired,
    currentTorqueSelection: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
    setCurrentTorqueSelection: PropTypes.func.isRequired,
    customLevels: PropTypes.objectOf(
        PropTypes.shape({
            isActive: PropTypes.bool.isRequired,
        })
    ).isRequired,
};

export default IndustrialScreenContent;
