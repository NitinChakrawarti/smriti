import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // SmartSpace Brand Colors - More vibrant
        brand: {
          blue: '#142C4F',
          'blue-light': '#1e3d6b',
          'blue-dark': '#0a1829',
          orange: '#F7931E',
          'orange-light': '#FDBA3B',
          'orange-dark': '#e67e0e',
        },
        
        // Background colors with more depth
        background: {
          DEFAULT: '#0a0e14', // Darker, richer
          light: '#F5F7FA',
          card: '#13161d',
          elevated: '#1a1e27',
        },
        
        foreground: '#f5f5f7',
        
        // Card colors with more contrast
        card: {
          DEFAULT: '#13161d',
          hover: '#1a1e27',
          elevated: '#1f2430',
          light: '#FFFFFF',
        },
        
        // Border colors
        border: {
          DEFAULT: '#2a2e38',
          light: '#E5E7EB',
        },
        
        // Primary (Blue) - More vibrant
        primary: {
          DEFAULT: '#1e3d6b',
          hover: '#2a4d7c',
          light: '#3d5a8a',
          dark: '#142C4F',
        },
        
        // Secondary (Orange) - More saturated
        secondary: {
          DEFAULT: '#F7931E',
          hover: '#ff9d2e',
          light: '#FDBA3B',
          dark: '#e67e0e',
        },
        
        // Accent colors - More vibrant
        accent: {
          purple: '#a855f7',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          pink: '#ec4899',
          green: '#10b981',
          yellow: '#fbbf24',
        },
        
        // Text colors
        muted: {
          DEFAULT: '#9ca3af',
          foreground: '#6B7280',
        },
        
        // Status colors - More vibrant
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      
      // Spacing scale
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // Border radius
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      
      // Box shadows - More dramatic
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow': '0 0 30px rgba(247, 147, 30, 0.4)',
        'glow-lg': '0 0 60px rgba(247, 147, 30, 0.5)',
        'card': '0 8px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 12px 40px rgba(0, 0, 0, 0.5)',
        'neon': '0 0 20px rgba(247, 147, 30, 0.6), 0 0 40px rgba(247, 147, 30, 0.3)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      },
      
      // Backdrop blur
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },
      
      // Animations - More dynamic
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'gradient-flow': 'gradientFlow 3s ease infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(247, 147, 30, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(247, 147, 30, 0.6)' },
        },
        gradientFlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      
      // Typography
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
