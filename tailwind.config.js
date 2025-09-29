/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#CCCCCC',
        accent: '#DDDDDD',
        text: '#333333',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'shimmer': 'shimmer 2s infinite linear',
        'attack-bounce': 'attackBounce 0.5s ease-in-out',
        'damage-shake': 'damageShake 0.5s ease-in-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        attackBounce: {
          '0%, 100%': { transform: 'translateX(0) scale(1)' },
          '50%': { transform: 'translateX(20px) scale(1.1)' },
        },
        damageShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-10px)' },
          '75%': { transform: 'translateX(10px)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { 
            transform: 'translateY(20px)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1'
          },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,255,255,0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255,255,255,0.8)' },
        },
        'scale-in': {
        '0%': { 
        transform: 'scale(0.8) translateY(20px)',
        opacity: '0'
        },
        '100%': { 
        transform: 'scale(1) translateY(0)',
        opacity: '1'
        },
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}