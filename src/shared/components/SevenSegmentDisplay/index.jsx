import React from 'react';
import PropTypes from 'prop-types';
import SevenSegmentDigit from './SevenSegmentDigit';

/**
 * 完整的2位7段数码管显示组件
 * 
 * 显示逻辑:
 * - 数字 0: 显示 'H ' (High Torque)
 * - 数字 1-9: 显示 ' 1' - ' 9' (前导空格，无前导零)
 * - 数字 10-99: 显示 '10' - '99'
 * - 字符串 'C1', 'C2', 'C3': 显示自定义级别
 * 
 * @param {Object} props
 * @param {number|string} props.value - 显示值 (0-99 或 'C1', 'C2', 'C3')
 * @param {string} props.activeColor - 激活段的 Tailwind 颜色类
 * @param {string} props.inactiveColor - 非激活段的 Tailwind 颜色类
 */
function SevenSegmentDisplay({ value, activeColor, inactiveColor }) {
  let displayString = '';
  
  if (typeof value === 'string') {
    // 自定义级别 C1, C2, C3
    if (value.length === 2) {
      displayString = value.toUpperCase();
    } else {
      displayString = '  '; // 错误情况
    }
  } else if (value === 0) {
    // 级别 0 显示 'H ' (High Torque)
    displayString = 'H '; 
  } else if (value >= 1 && value <= 9) {
    // 数字级别 1-9: 前导空格（无前导零）
    // 示例: 5 显示为 " 5" 而不是 "05"
    displayString = ' ' + String(value); 
  } else if (value >= 10 && value <= 99) {
    // 数字级别 10-99: 标准两位数显示
    displayString = String(value).slice(0, 2); 
  } else {
    // 默认或错误情况
    displayString = '  ';
  }
  
  const char1 = displayString[0] || ' ';
  const char2 = displayString[1] || ' ';
  
  return (
    <div className="flex items-center space-x-2">
      <SevenSegmentDigit 
        char={char1} 
        activeColor={activeColor} 
        inactiveColor={inactiveColor} 
      />
      <SevenSegmentDigit 
        char={char2} 
        activeColor={activeColor} 
        inactiveColor={inactiveColor} 
      />
    </div>
  );
}

SevenSegmentDisplay.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  activeColor: PropTypes.string,
  inactiveColor: PropTypes.string,
};

SevenSegmentDisplay.defaultProps = {
  activeColor: 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]',
  inactiveColor: 'bg-zinc-900/50',
};

export default SevenSegmentDisplay;
