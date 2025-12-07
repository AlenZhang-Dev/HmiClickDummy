import React from 'react';
import PropTypes from 'prop-types';

/**
 * 状态模拟按钮（用于 Hammer 变体）
 * 在控制面板中显示和切换工具状态
 * 
 * @param {Object} props
 * @param {string} props.status - 此按钮代表的状态值
 * @param {string} props.currentStatus - 当前激活的状态
 * @param {Function} props.onClick - 点击回调
 * @param {ReactNode} props.icon - 图标组件
 * @param {string} props.label - 按钮标签
 * @param {string} props.color - 激活时的背景颜色类
 */
export function StatusButton({ status, currentStatus, onClick, icon, label, color }) {
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

StatusButton.propTypes = {
  status: PropTypes.string.isRequired,
  currentStatus: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

/**
 * 状态切换按钮（用于 Industrial 变体）
 * 在控制面板中切换工业工具的状态指示器
 * 
 * @param {Object} props
 * @param {string} props.statusKey - 状态键名
 * @param {boolean} props.isActive - 是否激活
 * @param {Function} props.onClick - 点击回调
 * @param {Component} props.Icon - Lucide 图标组件
 * @param {string} props.label - 按钮标签
 */
export function IndStatusButton({ statusKey, isActive, onClick, Icon, label }) {
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

IndStatusButton.propTypes = {
  statusKey: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  Icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
};

// 默认导出 StatusButton，命名导出两者
export default StatusButton;
