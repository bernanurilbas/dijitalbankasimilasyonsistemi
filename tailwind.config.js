/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: 'var(--brand-bg)',
          card: 'var(--brand-card)',
          border: 'var(--brand-border)',
          primary: 'var(--brand-primary)',
          accent: 'var(--brand-accent)',
          success: 'var(--brand-success)',
          danger: 'var(--brand-danger)',
          warning: 'var(--brand-warning)',
          gold: 'var(--brand-gold)',
          textPrimary: 'var(--brand-text-primary)',
          textSecondary: 'var(--brand-text-secondary)',
          textMuted: 'var(--brand-text-muted)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
