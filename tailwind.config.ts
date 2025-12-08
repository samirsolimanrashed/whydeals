import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        'background-alt': 'rgb(var(--background-alt) / <alpha-value>)', // New alternate background
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        'primary-blue': '#2563EB', // Blue 600 - Vibrant Royal Blue
        'navy-dark': '#020C1B', // Deepest Navy
        'violet-accent': '#7C3AED', // Violet 600
        'success-green': '#10B981', // Emerald 500
        'neutral-white': '#FFFFFF',
        'neutral-black': '#0A192F', // Deep Navy Black
        'neutral-gray-light': '#F1F5F9', // Slate 100
        'neutral-gray-medium': '#64748B', // Slate 500
        'warning-orange': '#F59E0B', // Amber 500
        'error-red': '#EF4444', // Red 500
        // Keep nested structure for compatibility
        surface: 'rgb(var(--surface) / <alpha-value>)',
        blue: '#2563EB',
        DEFAULT: '#2563EB',
      },
      navy: {
        dark: '#020C1B', // Deepest Navy
        DEFAULT: '#0A192F', // Deep Navy
        light: '#112240', // Light Navy
      },
      violet: {
        accent: '#7C3AED',
        DEFAULT: '#7C3AED',
      },
      success: {
        green: '#10B981',
        DEFAULT: '#10B981',
      },
      neutral: {
        white: '#FFFFFF',
        black: '#0A192F',
        gray: {
          light: '#F1F5F9',
          medium: '#64748B',
        },
      },
      warning: {
        orange: '#F59E0B',
        DEFAULT: '#F59E0B',
      },
      error: {
        red: '#EF4444',
        DEFAULT: '#EF4444',
      },
    },
  },
  plugins: [],
}
export default config

