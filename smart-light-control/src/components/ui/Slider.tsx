import React, { useCallback } from 'react';
import { motion } from 'framer-motion';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  label?: string;
  formatValue?: (value: number) => string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  onChangeEnd,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showValue = true,
  label,
  formatValue = (v) => `${v}%`,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value));
    },
    [onChange]
  );

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-3">
          {label && (
            <span className="text-sm text-gray-400">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-lg font-semibold text-primary tabular-nums">
              {formatValue(value)}
            </span>
          )}
        </div>
      )}
      <div className="relative h-8 flex items-center">
        {/* 轨道背景 */}
        <div className="absolute w-full h-1.5 bg-dark-elevated rounded-full overflow-hidden">
          {/* 填充条 */}
          <motion.div
            className="h-full bg-gradient-gold rounded-full"
            initial={false}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.1 }}
            style={{
              boxShadow: percentage > 0 ? '0 0 12px rgba(212, 165, 116, 0.5)' : 'none',
            }}
          />
        </div>
        
        {/* 原生滑块（用于交互） */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          onMouseUp={() => onChangeEnd?.(value)}
          onTouchEnd={() => onChangeEnd?.(value)}
          disabled={disabled}
          className={`
            absolute w-full h-8 opacity-0 cursor-pointer z-10
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
        />
        
        {/* 自定义滑块旋钮 */}
        <motion.div
          className={`
            absolute w-5 h-5 rounded-full bg-dark-text
            -ml-2.5 pointer-events-none
            border-2 border-primary
            ${disabled ? 'opacity-50' : ''}
          `}
          style={{ left: `${percentage}%` }}
          animate={{
            boxShadow: '0 0 12px rgba(212, 165, 116, 0.4)',
          }}
        />
      </div>
    </div>
  );
};
