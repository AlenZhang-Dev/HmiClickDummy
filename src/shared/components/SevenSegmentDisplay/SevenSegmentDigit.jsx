import React from 'react';
import PropTypes from 'prop-types';
import { SEGMENT_MAP } from './segmentMap';

/**
 * 单个7段数码管数字显示组件
 * 使用 CSS 实现段位显示
 * 尺寸: w-12 h-20, 段宽度: 5px
 */
function SevenSegmentDigit({ char, activeColor, inactiveColor }) {
  const activeSegments = SEGMENT_MAP[char.toUpperCase()] || [];
  
  // 段位基础样式
  const segmentBase = "absolute rounded-sm transition-colors duration-100 ease-linear";
  
  // 获取段位颜色类
  const getSegmentClass = (segment) => 
    activeSegments.includes(segment) ? activeColor : inactiveColor;

  return (
    <div className="relative w-12 h-20">
      {/* A (Top) - 横向 */}
      <div className={`${segmentBase} w-[70%] h-[5px] top-0 left-1/2 -translate-x-1/2 ${getSegmentClass('A')}`} />
      
      {/* G (Middle) - 横向 */}
      <div className={`${segmentBase} w-[70%] h-[5px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${getSegmentClass('G')}`} />
      
      {/* D (Bottom) - 横向 */}
      <div className={`${segmentBase} w-[70%] h-[5px] bottom-0 left-1/2 -translate-x-1/2 ${getSegmentClass('D')}`} />

      {/* F (Top Left) - 纵向 */}
      <div className={`${segmentBase} w-[5px] h-[40%] top-[5px] left-0 ${getSegmentClass('F')}`} />
      
      {/* B (Top Right) - 纵向 */}
      <div className={`${segmentBase} w-[5px] h-[40%] top-[5px] right-0 ${getSegmentClass('B')}`} />
      
      {/* E (Bottom Left) - 纵向 */}
      <div className={`${segmentBase} w-[5px] h-[40%] bottom-[5px] left-0 ${getSegmentClass('E')}`} />
      
      {/* C (Bottom Right) - 纵向 */}
      <div className={`${segmentBase} w-[5px] h-[40%] bottom-[5px] right-0 ${getSegmentClass('C')}`} />
    </div>
  );
}

SevenSegmentDigit.propTypes = {
  char: PropTypes.string.isRequired,
  activeColor: PropTypes.string.isRequired,
  inactiveColor: PropTypes.string.isRequired,
};

export default SevenSegmentDigit;
