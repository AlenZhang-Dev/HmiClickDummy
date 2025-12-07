import React from 'react';
import PropTypes from 'prop-types';

/**
 * DCHammerScreenContent Component
 * 
 * Renders the screen display for DC Hammer variant with 5 segmented bars.
 * Displays battery level when tool status is normal, or status override when there are errors/warnings.
 * 
 * @component
 * @param {boolean} isOn - Whether the tool is powered on
 * @param {string} toolStatus - Current tool status ('normal' | 'warning' | 'error' | 'safety_error')
 * @param {number} batteryLevel - Battery level percentage (0-100)
 */
function DCHammerScreenContent({ isOn, toolStatus, batteryLevel }) {
    /**
     * Get the status color for status override mode
     */
    const getStatusColor = () => {
        switch (toolStatus) {
            case 'normal': return 'bg-green-500';
            case 'warning': return 'bg-yellow-500';
            case 'error': 
            case 'safety_error': return 'bg-red-600';
            default: return 'bg-blue-100';
        }
    };

    /**
     * Get style for a single bar in status override mode
     */
    const getSegmentBarClass = () => {
        if (!isOn) return 'bg-slate-600 opacity-30'; 
        
        const baseColor = getStatusColor();
        const shadow = toolStatus === 'normal' ? 'shadow-[0_0_10px_rgba(34,197,94,0.5)]' :
                       toolStatus === 'warning' ? 'shadow-[0_0_10px_rgba(234,179,8,0.5)]' :
                       'shadow-[0_0_15px_rgba(220,38,38,0.6)]';
        
        const animation = toolStatus === 'safety_error' ? 'animate-blink-2hz' : '';
        
        return `${baseColor} ${shadow} ${animation}`;
    };

    /**
     * Helper function for battery display logic
     * Returns the number of active bars and their color based on battery level
     */
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

    return (
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
    );
}

DCHammerScreenContent.propTypes = {
    isOn: PropTypes.bool.isRequired,
    toolStatus: PropTypes.oneOf(['normal', 'warning', 'error', 'safety_error']).isRequired,
    batteryLevel: PropTypes.number.isRequired,
};

export default DCHammerScreenContent;
