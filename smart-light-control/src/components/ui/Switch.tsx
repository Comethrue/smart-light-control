import React from 'react';
import { motion } from 'framer-motion';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  size = 'md',
}) => {
  const sizes = {
    sm: { track: 'w-9 h-5', thumb: 'w-4 h-4', translate: 16 },
    md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 20 },
    lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 28 },
  };

  const currentSize = sizes[size];

  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        className={`
          relative inline-flex items-center
          ${currentSize.track} rounded-full
          transition-all duration-300
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${checked 
            ? 'bg-primary shadow-glow-gold' 
            : 'bg-dark-elevated border border-dark-border'
          }
        `}
        onClick={() => !disabled && onChange(!checked)}
      >
        <motion.div
          className={`
            ${currentSize.thumb} rounded-full shadow-md
            absolute left-0.5
            ${checked ? 'bg-dark-bg' : 'bg-dark-muted'}
          `}
          animate={{
            x: checked ? currentSize.translate : 0,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
      {label && (
        <span className="text-white text-sm">
          {label}
        </span>
      )}
    </label>
  );
};
