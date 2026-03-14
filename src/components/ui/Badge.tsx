import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'gold';
  size?: 'sm' | 'md';
  dot?: boolean;
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
}) => {
  const variants = {
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
    info: 'bg-tech/10 text-tech border-tech/20',
    default: 'bg-dark-elevated text-gray-400 border-dark-border',
    gold: 'bg-primary/10 text-primary border-primary/20',
  };

  const dotColors = {
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    info: 'bg-tech',
    default: 'bg-dark-muted',
    gold: 'bg-primary',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-lg border font-medium
        ${variants[variant]}
        ${sizes[size]}
      `}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span
              className={`
                absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping
                ${dotColors[variant]}
              `}
            />
          )}
          <span
            className={`
              relative inline-flex rounded-full h-2 w-2
              ${dotColors[variant]}
            `}
          />
        </span>
      )}
      {children}
    </span>
  );
};
