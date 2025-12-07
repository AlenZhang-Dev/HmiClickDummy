import React from 'react';
import PropTypes from 'prop-types';

/**
 * ACHammerScreenContent Component
 * 
 * Renders the screen display for AC Hammer variant with a single solid bar
 * that changes color based on the tool status (Normal, Warning, Error, Safety Error).
 * 
 * @component
 * @param {boolean} isOn - Whether the tool is powered on
 * @param {string} toolStatus - Current tool status ('normal' | 'warning' | 'error' | 'safety_error')
 */
function ACHammerScreenContent({ isOn, toolStatus }) {
    /**
     * Get the status label text to display on the screen
     */
    const getStatusLabel = () => {
        switch (toolStatus) {
            case 'normal': return 'NORMAL';
            case 'warning': return 'WARNING';
            case 'error': return 'ERROR';
            case 'safety_error': return 'SAFETY STOP';
            default: return '';
        }
    };

    /**
     * Get the CSS classes for the single status bar
     */
    const getSingleBarClass = () => {
        if (!isOn) return 'bg-slate-400';
        
        let base = "";
        switch (toolStatus) {
            case 'normal': 
                base = 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]'; 
                break;
            case 'warning': 
                base = 'bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.4)]'; 
                break;
            case 'error': 
                base = 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]'; 
                break;
            case 'safety_error': 
                base = 'bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.8)] animate-blink-2hz'; 
                break;
            default: 
                base = 'bg-blue-100';
        }
        return base;
    };

    return (
        <div className={`h-16 flex items-center justify-center transition-colors duration-300 ${getSingleBarClass()}`}>
            <span className="text-slate-900/70 font-black tracking-widest text-xl mix-blend-multiply">
                {isOn ? getStatusLabel() : 'OFF'}
            </span>
        </div>
    );
}

ACHammerScreenContent.propTypes = {
    isOn: PropTypes.bool.isRequired,
    toolStatus: PropTypes.oneOf(['normal', 'warning', 'error', 'safety_error']).isRequired,
};

export default ACHammerScreenContent;
