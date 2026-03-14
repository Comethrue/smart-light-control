import React from 'react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '../../stores/settingsStore';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  animate?: boolean;
  delay?: number;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  icon,
  onClick,
  animate = true,
  delay = 0,
  variant = 'default',
  hover = false,
}) => {
  const { darkMode } = useSettingsStore();
  
  const darkVariants = {
    default: 'bg-white/[0.03] backdrop-blur-sm border-white/10',
    elevated: 'bg-white/[0.05] backdrop-blur-sm border-white/10 shadow-card',
    outlined: 'bg-transparent border-white/10',
    gradient: 'bg-gradient-card backdrop-blur-sm border-white/10',
  };
  
  const lightVariants = {
    default: 'bg-white/90 backdrop-blur-md border-gray-200/50 shadow-sm',
    elevated: 'bg-white/90 backdrop-blur-md border-gray-200/50 shadow-lg',
    outlined: 'bg-transparent border-gray-200/50',
    gradient: 'bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-md border-gray-200/50 shadow-sm',
  };
  
  const variants = darkMode ? darkVariants : lightVariants;

  const cardContent = (
    <>
      {(title || icon) && (
        <div className="flex items-center gap-3 mb-4">
          {icon && <span className={darkMode ? 'text-primary' : 'text-blue-500'}>{icon}</span>}
          {title && (
            <h3 className={`text-base font-medium transition-colors duration-500 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {title}
            </h3>
          )}
        </div>
      )}
      {children}
    </>
  );

  const baseClasses = `
    ${variants[variant]}
    border rounded-2xl p-5
    transition-all duration-500
    ${onClick ? darkMode ? 'cursor-pointer hover:bg-dark-elevated active:scale-[0.99]' : 'cursor-pointer hover:bg-gray-50 active:scale-[0.99]' : ''}
    ${hover ? 'hover-lift' : ''}
    ${className}
  `;

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: delay * 0.1 }}
        className={baseClasses}
        onClick={onClick}
      >
        {cardContent}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} onClick={onClick}>
      {cardContent}
    </div>
  );
};
