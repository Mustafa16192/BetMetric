module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#050505',
        surface: {
          100: '#121212',
          200: '#1E1E1E'
        },
        'border-subtle': '#27272a',
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          tertiary: '#64748B'
        },
        profit: {
          start: '#22c55e',
          end: '#86efac'
        },
        burn: {
          start: '#ef4444',
          end: '#f97316'
        },
        zombie: {
          start: '#64748b',
          end: '#94a3b8'
        },
        ai: {
          start: '#8b5cf6',
          end: '#d946ef'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      backgroundImage: {
        'profit-flow': 'linear-gradient(90deg, #22c55e 0%, #86efac 100%)',
        'burn-flow': 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)',
        'zombie-flow': 'linear-gradient(90deg, #64748b 0%, #94a3b8 100%)',
        'ai-flow': 'linear-gradient(90deg, #8b5cf6 0%, #d946ef 100%)',
        'void-radial': 'radial-gradient(circle at top left, #1a1a1a 0%, #050505 55%)'
      },
      boxShadow: {
        glow: '0 0 25px rgba(34, 197, 94, 0.25)',
        'glow-burn': '0 0 30px rgba(239, 68, 68, 0.35)',
        'glow-ai': '0 0 30px rgba(217, 70, 239, 0.35)'
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { boxShadow: '0 0 0 rgba(34, 197, 94, 0.0)' },
          '50%': { boxShadow: '0 0 25px rgba(34, 197, 94, 0.45)' }
        },
        'pulse-ai': {
          '0%, 100%': { boxShadow: '0 0 0 rgba(217, 70, 239, 0.0)' },
          '50%': { boxShadow: '0 0 30px rgba(217, 70, 239, 0.45)' }
        },
        'pulse-zombie': {
          '0%, 100%': { borderColor: 'rgba(148, 163, 184, 0.2)' },
          '50%': { borderColor: 'rgba(148, 163, 184, 0.6)' }
        }
      },
      animation: {
        'pulse-neon': 'pulse-neon 2.5s ease-in-out infinite',
        'pulse-ai': 'pulse-ai 2s ease-in-out infinite',
        'pulse-zombie': 'pulse-zombie 2.2s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
