/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 主色调 - 金色/琥珀色
        primary: {
          DEFAULT: '#D4A574',
          50: '#FDF8F3',
          100: '#F9EDE0',
          200: '#F0D9C0',
          300: '#E7C5A0',
          400: '#DEB98A',
          500: '#D4A574',
          600: '#C4894D',
          700: '#A66E35',
          800: '#7D5328',
          900: '#54381B',
        },
        // 科技蓝 - 用于状态指示
        tech: {
          DEFAULT: '#4A9EFF',
          light: '#7AB8FF',
          dark: '#2563EB',
        },
        success: {
          DEFAULT: '#22C55E',
          light: '#86EFAC',
          dark: '#16A34A',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          dark: '#D97706',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#FCA5A5',
          dark: '#DC2626',
        },
        // 深色主题色板 - Qoder纯黑风格
        dark: {
          bg: '#000000',
          surface: '#0a0a0a',
          card: '#0f0f0f',
          elevated: '#151515',
          border: 'rgba(255,255,255,0.05)',
          text: '#F5F5F5',
          muted: '#666666',
          subtle: '#404040',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'glow-gold': 'glowGold 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        glowGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 165, 116, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 165, 116, 0.6)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(212, 165, 116, 0.3)',
        'glow-gold-lg': '0 0 40px rgba(212, 165, 116, 0.5)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'inner-light': 'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(180deg, #000000 0%, #050505 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(15,15,15,0.9) 0%, rgba(10,10,10,0.95) 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4A574 0%, #C4894D 100%)',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
}
