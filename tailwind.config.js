/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'cyber': ['Orbitron', 'monospace'],
        'display': ['Sora', 'system-ui', 'sans-serif'],
      },
      colors: {
        'eco': {
          '50': '#f0fdf4',
          '100': '#dcfce7',
          '200': '#bbf7d0',
          '300': '#86efac',
          '400': '#4ade80',
          '500': '#22c55e',
          '600': '#16a34a',
          '700': '#15803d',
          '800': '#166534',
          '900': '#14532d',
          '950': '#052e16',
        },
        'neon': {
          'green': '#39ff14',
          'cyan': '#00ffff',
          'purple': '#bf00ff',
          'pink': '#ff007f',
          'orange': '#ff8c00',
        },
        'asphalt': {
          '50': '#f8fafc',
          '100': '#f1f5f9',
          '200': '#e2e8f0',
          '300': '#cbd5e1',
          '400': '#94a3b8',
          '500': '#64748b',
          '600': '#475569',
          '700': '#334155',
          '800': '#1e293b',
          '900': '#0f172a',
          '950': '#020617',
        },
        'cyber': {
          'dark': '#0a0a0a',
          'darker': '#050505',
          'light': '#1a1a1a',
          'lighter': '#2a2a2a',
        }
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': {
            boxShadow: '0 0 5px #39ff14, 0 0 10px #39ff14, 0 0 15px #39ff14',
          },
          '50%': {
            boxShadow: '0 0 10px #39ff14, 0 0 20px #39ff14, 0 0 30px #39ff14',
          }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow': {
          'from': {
            textShadow: '0 0 5px #39ff14, 0 0 10px #39ff14, 0 0 15px #39ff14',
          },
          'to': {
            textShadow: '0 0 10px #39ff14, 0 0 20px #39ff14, 0 0 30px #39ff14',
          }
        }
      },
      boxShadow: {
        'neon': '0 0 5px #39ff14, 0 0 10px #39ff14, 0 0 15px #39ff14',
        'neon-cyan': '0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff',
        'neon-purple': '0 0 5px #bf00ff, 0 0 10px #bf00ff, 0 0 15px #bf00ff',
      },
      backgroundImage: {
        'gradient-cyber': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        'gradient-eco': 'linear-gradient(135deg, #052e16 0%, #166534 100%)',
        'gradient-neon': 'linear-gradient(135deg, #39ff14 0%, #00ffff 100%)',
      }
    },
  },
  plugins: [],
}