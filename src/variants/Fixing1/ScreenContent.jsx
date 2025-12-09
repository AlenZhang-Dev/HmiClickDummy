import React from 'react';
import PropTypes from 'prop-types';
import { Settings, Gauge, CircleSlash, CirclePause } from 'lucide-react';

/**
 * Fixing1ScreenContent Component
 * 
 * 竖直长方形工业风变体 (1:2.2比例)
 * 
 * 布局:
 * - 上半部分: 两个模式图标 + MODE按钮 (切换 Auto Slow Down/Auto Stop)
 * - 下半部分: 三个速度档位 (1/2/3) + SPEED按钮
 * 
 * @component
 * @param {boolean} isOn - 工具是否开启
 * @param {string} autoMode - 自动模式 ('slow_down' | 'stop')
 * @param {function} onAutoModeChange - 模式切换回调
 * @param {number} speedLevel - 当前速度档位 (1/2/3)
 * @param {function} onSpeedChange - 速度切换回调
 * @param {boolean} isInteractionDisabled - 是否禁用交互
 */
function Fixing1ScreenContent({ 
  isOn = true,
  autoMode = 'slow_down', // 'slow_down' or 'stop'
  onAutoModeChange = () => {},
  speedLevel = 1, // 1, 2, or 3
  onSpeedChange = () => {},
  isInteractionDisabled = false,
}) {
  
  // 切换自动模式
  const handleModeToggle = () => {
    if (isInteractionDisabled) return;
    const newMode = autoMode === 'slow_down' ? 'stop' : 'slow_down';
    onAutoModeChange(newMode);
  };

  // 切换速度档位 (循环 1 → 2 → 3 → 1)
  const handleSpeedToggle = () => {
    if (isInteractionDisabled) return;
    const newSpeed = speedLevel === 3 ? 1 : speedLevel + 1;
    onSpeedChange(newSpeed);
  };

  // 直接选择速度档位
  const handleSpeedSelect = (level) => {
    if (isInteractionDisabled) return;
    onSpeedChange(level);
  };

  // 样式变量
  const panelBgColor = 'bg-zinc-900';
  const iconColor = isOn ? 'text-zinc-400' : 'text-zinc-700';
  const activeIconColor = 'text-blue-400';
  const buttonBgColor = 'bg-zinc-800';
  const buttonBorderColor = 'border-zinc-600';
  const activeButtonBg = 'bg-blue-600';
  const disabledOpacity = isInteractionDisabled ? 'opacity-50' : 'opacity-100';

  return (
    <div className={`w-full h-full ${panelBgColor} flex flex-col items-center justify-between p-6 ${disabledOpacity} transition-opacity duration-300`}>
      
      {/* ========== 上半部分：模式区域 ========== */}
      <div className="w-full flex flex-col items-center space-y-6">
        
        {/* 顶部两个模式图标 */}
        <div className="w-full flex justify-center items-center gap-8">
          {/* Auto Slow Down 图标 */}
          <div 
            className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 ${buttonBorderColor} ${buttonBgColor} transition-all duration-300 ${
              autoMode === 'slow_down' ? activeIconColor : iconColor
            }`}
            title="Auto Slow Down"
          >
            <CircleSlash size={28} strokeWidth={2.5} />
          </div>

          {/* Auto Stop 图标 */}
          <div 
            className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 ${buttonBorderColor} ${buttonBgColor} transition-all duration-300 ${
              autoMode === 'stop' ? activeIconColor : iconColor
            }`}
            title="Auto Stop"
          >
            <CirclePause size={28} strokeWidth={2.5} />
          </div>
        </div>

        {/* MODE 大按钮 */}
        <button
          onClick={handleModeToggle}
          disabled={isInteractionDisabled}
          className={`w-28 h-28 flex flex-col items-center justify-center rounded-xl border-3 transition-all duration-200 ${
            isInteractionDisabled 
              ? `${buttonBgColor} ${buttonBorderColor} cursor-not-allowed` 
              : `${buttonBgColor} ${buttonBorderColor} hover:border-blue-500 active:bg-zinc-700 cursor-pointer`
          }`}
          title="Toggle Auto Mode"
        >
          <Settings 
            size={48} 
            strokeWidth={2} 
            className={`${isOn ? iconColor : 'text-zinc-700'} transition-colors duration-300`}
          />
          <span className={`mt-2 text-xs font-bold tracking-wider ${isOn ? 'text-zinc-400' : 'text-zinc-700'}`}>
            MODE
          </span>
        </button>
      </div>

      {/* ========== 分隔线 ========== */}
      <div className="w-full border-t border-zinc-700 my-4"></div>

      {/* ========== 下半部分：速度区域 ========== */}
      <div className="w-full flex flex-col items-center space-y-6">
        
        {/* 三个速度档位按钮 */}
        <div className="w-full flex justify-center items-center gap-6">
          {[1, 2, 3].map((level) => (
            <button
              key={level}
              onClick={() => handleSpeedSelect(level)}
              disabled={isInteractionDisabled}
              className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 transition-all duration-200 ${
                speedLevel === level
                  ? `${activeButtonBg} border-blue-500 shadow-lg shadow-blue-500/50`
                  : `${buttonBgColor} ${buttonBorderColor} hover:border-blue-400`
              } ${
                isInteractionDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
              title={`Speed Level ${level}`}
            >
              <span className={`text-2xl font-bold ${
                speedLevel === level ? 'text-white' : 'text-zinc-400'
              }`}>
                {level}
              </span>
            </button>
          ))}
        </div>

        {/* SPEED 大按钮 */}
        <button
          onClick={handleSpeedToggle}
          disabled={isInteractionDisabled}
          className={`w-28 h-28 flex flex-col items-center justify-center rounded-xl border-3 transition-all duration-200 ${
            isInteractionDisabled 
              ? `${buttonBgColor} ${buttonBorderColor} cursor-not-allowed` 
              : `${buttonBgColor} ${buttonBorderColor} hover:border-blue-500 active:bg-zinc-700 cursor-pointer`
          }`}
          title="Cycle Speed (1→2→3→1)"
        >
          <Gauge 
            size={48} 
            strokeWidth={2} 
            className={`${isOn ? iconColor : 'text-zinc-700'} transition-colors duration-300`}
          />
          <span className={`mt-2 text-xs font-bold tracking-wider ${isOn ? 'text-zinc-400' : 'text-zinc-700'}`}>
            SPEED
          </span>
        </button>
      </div>

    </div>
  );
}

Fixing1ScreenContent.propTypes = {
  isOn: PropTypes.bool,
  autoMode: PropTypes.oneOf(['slow_down', 'stop']),
  onAutoModeChange: PropTypes.func,
  speedLevel: PropTypes.oneOf([1, 2, 3]),
  onSpeedChange: PropTypes.func,
  isInteractionDisabled: PropTypes.bool,
};

Fixing1ScreenContent.defaultProps = {
  isOn: true,
  autoMode: 'slow_down',
  onAutoModeChange: () => {},
  speedLevel: 1,
  onSpeedChange: () => {},
  isInteractionDisabled: false,
};

export default Fixing1ScreenContent;
