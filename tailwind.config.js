/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Background gradients
    'bg-gradient-to-br',
    'from-gray-900',
    'to-gray-900',
    
    // Dynamic via colors
    'via-purple-900',
    'via-emerald-900',
    'via-teal-900',
    'via-rose-900',
    'via-orange-900',
    'via-yellow-900',
    'via-blue-900',
    'via-slate-900',
    'via-pink-900',
    'via-stone-900',
    'via-red-900',
    
    // Background colors
    'bg-purple-900',
    'bg-emerald-900',
    'bg-teal-900',
    'bg-rose-900',
    'bg-orange-900',
    'bg-yellow-900',
    'bg-blue-900',
    'bg-slate-900',
    'bg-pink-900',
    'bg-stone-900',
    'bg-red-900',
    
    // Fill colors for SVG
    'fill-purple-600',
    'fill-emerald-600',
    'fill-teal-600',
    'fill-rose-600',
    'fill-orange-600',
    'fill-yellow-600',
    'fill-blue-600',
    'fill-slate-600',
    'fill-pink-600',
    'fill-stone-600',
    'fill-red-600',
    
    // Opacity variants
    'fill-purple-600/60',
    'fill-emerald-600/60',
    'fill-teal-600/60',
    'fill-rose-600/60',
    'fill-orange-600/60',
    'fill-yellow-600/60',
    'fill-blue-600/60',
    'fill-slate-600/60',
    'fill-pink-600/60',
    'fill-stone-600/60',
    'fill-red-600/60',
    
    // From colors
    'from-purple-600',
    'from-emerald-600',
    'from-teal-600',
    'from-rose-600',
    'from-orange-600',
    'from-yellow-600',
    'from-blue-600',
    'from-slate-600',
    'from-pink-600',
    'from-stone-600',
    'from-red-600',
    
    // To colors
    'to-pink-600',
    'to-pink-400',
    
    // Ring colors
    'ring-purple-500',
    'ring-emerald-500',
    'ring-teal-500',
    'ring-rose-500',
    'ring-orange-500',
    'ring-yellow-500',
    'ring-blue-500',
    'ring-slate-500',
    'ring-pink-500',
    'ring-stone-500',
    'ring-red-500',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--primary-color-50)',
          100: 'var(--primary-color-100)',
          200: 'var(--primary-color-200)',
          300: 'var(--primary-color-300)',
          400: 'var(--primary-color-400)',
          500: 'var(--primary-color-500)',
          600: 'var(--primary-color-600)',
          700: 'var(--primary-color-700)',
          800: 'var(--primary-color-800)',
          900: 'var(--primary-color-900)',
        },
      },
    },
  },
  plugins: [],
}