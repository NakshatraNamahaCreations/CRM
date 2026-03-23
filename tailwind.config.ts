import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        'brand-black': '#0A0A0A',
        'brand-gray':  '#555555',
        'brand-light': '#888888',
        'brand-border':'#E8E8E8',
        'brand-bg':    '#F5F5F5',
        'brand-pale':  '#FAFAFA',
        'brand-green': '#16A34A',
      },
      animation: {
        'fade-up':   'fadeUp 0.5s ease both',
        'pulse-dot': 'pulseDot 2s infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%':     { opacity: '0.4', transform: 'scale(1.5)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
