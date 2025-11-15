/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'atlas-blue': '#1E3A5F',
        'atlas-blue-light': '#0066CC',
        'atlas-text': '#333333',
        'atlas-gray': '#f5f5f5',
        'atlas-success': '#10b981',
        'atlas-warning': '#fbbf24',
        'atlas-error': '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Courier New', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
}
