import React from 'react';
import PropTypes from 'prop-types';

/**
 * CustomLevelConfig Component
 * 
 * Displays a custom level configuration panel with an activation toggle switch.
 * Used in the Industrial variant to enable/disable custom torque levels (C1, C2, C3).
 * 
 * @component
 * @param {string} levelKey - The level identifier (e.g., 'C1', 'C2', 'C3')
 * @param {Object} levelData - The level configuration data
 * @param {boolean} levelData.isActive - Whether this custom level is currently activated
 * @param {Function} onToggleActivation - Callback function when toggle is clicked
 */
function CustomLevelConfig({ levelKey, levelData, onToggleActivation }) {
    return (
        <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
            levelData.isActive 
                ? 'border-blue-700 bg-slate-800' 
                : 'border-slate-700 bg-slate-700/50'
        }`}>
            
            <span className="font-mono font-extrabold text-sm text-blue-300 w-10">
                {levelKey} 
            </span>
            <span className="text-xs text-slate-400 flex-1 ml-4">
                自定义挡位开关
            </span>
            
            {/* Toggle Switch */}
            <div className="toggle-switch-container flex items-center">
                <span className={`mr-2 text-sm font-medium ${
                    levelData.isActive ? 'text-blue-400' : 'text-slate-500'
                }`}>
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

CustomLevelConfig.propTypes = {
    levelKey: PropTypes.string.isRequired,
    levelData: PropTypes.shape({
        isActive: PropTypes.bool.isRequired,
    }).isRequired,
    onToggleActivation: PropTypes.func.isRequired,
};

export default CustomLevelConfig;
