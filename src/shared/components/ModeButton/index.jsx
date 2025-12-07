import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * 模式按钮组件
 * 用于 Hammer 变体的模式选择 (Max/Soft)
 * Optimized with React.memo and useMemo for performance.
 * 
 * @param {Object} props
 * @param {'max'|'soft'} props.type - 按钮类型
 * @param {boolean} props.isActive - 是否激活状态
 * @param {Function} props.onClick - 点击回调
 * @param {boolean} props.disabled - 是否禁用
 */
const ModeButton = React.memo(({ type, isActive, onClick, disabled }) => {
  const isMax = type === 'max';
  const label = isMax ? '100%' : '70%';
  
  // Memoize style calculations
  const styles = useMemo(() => {
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

    return { containerStyle, contentStyle, barColor };
  }, [disabled, isActive]);

  const { containerStyle, contentStyle, barColor } = styles;

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
      {/* Icon Area - 三个渐变高度的条形图 */}
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
});

ModeButton.displayName = 'ModeButton';

ModeButton.propTypes = {
  type: PropTypes.oneOf(['max', 'soft']).isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

ModeButton.defaultProps = {
  disabled: false,
};

export default ModeButton;
