import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'gold' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  className = '',
  fullWidth = false,
}) => {
  const variants = {
    primary: 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-primary/30',
    secondary: 'bg-white/[0.03] border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]',
    success: 'bg-success/10 border-success/20 text-success hover:bg-success/20',
    danger: 'bg-danger/10 border-danger/20 text-danger hover:bg-danger/20',
    ghost: 'bg-transparent border-transparent text-white/50 hover:text-white hover:bg-white/5',
    gold: 'bg-gradient-gold border-primary/20 text-black font-semibold hover:shadow-glow-gold',
    blue: 'bg-gradient-to-r from-blue-900 to-blue-800 border-blue-700/50 text-white font-medium hover:from-blue-800 hover:to-blue-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl border font-medium
        transition-all duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileTap={!disabled && !loading ? { scale: 0.97 } : undefined}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
};
