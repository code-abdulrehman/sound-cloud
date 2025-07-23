import { useState, useEffect } from 'react'

export const useTheme = () => {
  const [currentColor, setCurrentColor] = useState(localStorage.getItem('selectedColor') ||'purple')

  // Color RGB values for CSS custom properties
  const colorValues = {
    purple: { 600: '147 51 234', 900: '88 28 135' },
    emerald: { 600: '5 150 105', 900: '6 78 59' },
    teal: { 600: '13 148 136', 900: '19 78 74' },
    rose: { 600: '225 29 72', 900: '136 19 55' },
    orange: { 600: '234 88 12', 900: '154 52 18' },
    yellow: { 600: '202 138 4', 900: '113 63 18' },
    blue: { 600: '37 99 235', 900: '30 58 138' },
    slate: { 600: '71 85 105', 900: '15 23 42' },
    pink: { 600: '219 39 119', 900: '131 24 67' },
    stone: { 600: '87 83 78', 900: '28 25 23' },
    red: { 600: '220 38 38', 900: '127 29 29' }
  }

  useEffect(() => {
    // Load saved color from localStorage
    const savedColor = localStorage.getItem('selectedColor')
    if (savedColor) {
      setCurrentColor(savedColor)
    }
    else {
      setCurrentColor('purple')
    }

    // Listen for color changes from ColorSwitcher
    const handleColorChange = (event) => {
      setCurrentColor(event.detail.color)
    }

    window.addEventListener('colorChanged', handleColorChange)

    return () => {
      window.removeEventListener('colorChanged', handleColorChange)
    }
  }, [])

  // Update CSS custom properties when color changes
  useEffect(() => {
    const colorValue = colorValues[currentColor] || colorValues.purple
    const root = document.documentElement
    
    root.style.setProperty('--primary-color-600', colorValue[600])
    root.style.setProperty('--primary-color-900', colorValue[900])
    
    // Also set individual color values for dynamic usage
    root.style.setProperty('--current-color-600', `rgb(${colorValue[600]})`)
    root.style.setProperty('--current-color-900', `rgb(${colorValue[900]})`)
  }, [currentColor, colorValues])

  // Color class mappings for each color
  const colorMappings = {
    purple: {
      bg: {
        primary: 'bg-purple-600',
        primaryDark: 'bg-purple-900',
        primaryLight: 'bg-purple-500',
        gradient: 'bg-gradient-to-br from-purple-500 via-gray-900 to-purple-500',
        gradientLight: 'bg-gradient-to-r from-purple-800/40 to-purple-600',
      },
      text: {
        primary: 'text-purple-400',
        primaryLight: 'text-purple-300',
        gradient: 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent',
      },
      border: {
        primary: 'border-purple-500',
        ring: 'ring-purple-500',
      },
      shadow: {
        primary: 'shadow-purple-500/50',
      },
      hover: {
        bg: 'hover:bg-purple-600',
        bgLight: 'hover:bg-purple-600/10',
        text: 'hover:text-purple-300',
        shadow: 'hover:shadow-purple-500/50',
      }
    },
    emerald: {
      bg: {
        primary: 'bg-emerald-600',
        primaryDark: 'bg-emerald-900',
        primaryLight: 'bg-emerald-500',
        gradient: 'bg-gradient-to-br from-emerald-500 via-gray-900 to-emerald-500',
        gradientLight: 'bg-gradient-to-r from-emerald-800/40 to-emerald-600',
      },
      text: {
        primary: 'text-emerald-400',
        primaryLight: 'text-emerald-300',
        gradient: 'bg-gradient-to-r from-emerald-400 to-pink-400 bg-clip-text text-transparent',
      },
      border: {
        primary: 'border-emerald-500',
        ring: 'ring-emerald-500',
      },
      shadow: {
        primary: 'shadow-emerald-500/50',
      },
      hover: {
        bg: 'hover:bg-emerald-600',
        bgLight: 'hover:bg-emerald-600/10',
        text: 'hover:text-emerald-300',
        shadow: 'hover:shadow-emerald-500/50',
      }
    },
    teal: {
      bg: {
        primary: 'bg-teal-600',
        primaryDark: 'bg-teal-900',
        primaryLight: 'bg-teal-500',
        gradient: 'bg-gradient-to-br from-teal-500 via-gray-900 to-teal-500',
        gradientLight: 'bg-gradient-to-r from-teal-800/40 to-teal-600',
      },
      text: {
        primary: 'text-teal-400',
        primaryLight: 'text-teal-300',
        gradient: 'bg-gradient-to-r from-teal-400 to-pink-400 bg-clip-text text-transparent',
      },
      border: {
        primary: 'border-teal-500',
        ring: 'ring-teal-500',
      },
      shadow: {
        primary: 'shadow-teal-500/50',
      },
      hover: {
        bg: 'hover:bg-teal-600',
        bgLight: 'hover:bg-teal-600/10',
        text: 'hover:text-teal-300',
        shadow: 'hover:shadow-teal-500/50',
      }
    },
    rose: {
      bg: {
        primary: 'bg-rose-600',
        primaryDark: 'bg-rose-900',
        primaryLight: 'bg-rose-500',
        gradient: 'bg-gradient-to-br from-rose-500 via-gray-900 to-rose-500',
        gradientLight: 'bg-gradient-to-r from-rose-800/40 to-rose-600',
      },
      text: {
        primary: 'text-rose-400',
        primaryLight: 'text-rose-300',
        gradient: 'bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent',
      },
      border: {
        primary: 'border-rose-500',
        ring: 'ring-rose-500',
      },
      shadow: {
        primary: 'shadow-rose-500/50',
      },
      hover: {
        bg: 'hover:bg-rose-600',
        bgLight: 'hover:bg-rose-600/10',
        text: 'hover:text-rose-300',
        shadow: 'hover:shadow-rose-500/50',
      }
    },
    orange: {
      bg: {
        primary: 'bg-orange-600',
        primaryDark: 'bg-orange-900',
        primaryLight: 'bg-orange-500',
        gradient: 'bg-gradient-to-br from-orange-500 via-gray-900 to-orange-500',
        gradientLight: 'bg-gradient-to-r from-orange-800/40 to-orange-600',
      },
      text: {
        primary: 'text-orange-400',
        primaryLight: 'text-orange-300',
        gradient: 'bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent',
      },
      border: {
        primary: 'border-orange-500',
        ring: 'ring-orange-500',
      },
      shadow: {
        primary: 'shadow-orange-500/50',
      },
      hover: {
        bg: 'hover:bg-orange-600',
        bgLight: 'hover:bg-orange-600/10',
        text: 'hover:text-orange-300',
        shadow: 'hover:shadow-orange-500/50',
      }
    },
    yellow: {
      bg: {
        primary: 'bg-yellow-600',
        primaryDark: 'bg-yellow-900',
        primaryLight: 'bg-yellow-500',
        gradient: 'bg-gradient-to-br from-yellow-500 via-gray-900 to-yellow-500',
        gradientLight: 'bg-gradient-to-r from-yellow-800/40 to-yellow-600',
      },
      text: {
        primary: 'text-yellow-400',
        primaryLight: 'text-yellow-300',
        gradient: 'bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent',
      },
      border: {
        primary: 'border-yellow-500',
        ring: 'ring-yellow-500',
      },
      shadow: {
        primary: 'shadow-yellow-500/50',
      },
      hover: {
        bg: 'hover:bg-yellow-600',
        bgLight: 'hover:bg-yellow-600/10',
        text: 'hover:text-yellow-300',
        shadow: 'hover:shadow-yellow-500/50',
      }
    },
    blue: {
      bg: {
        primary: 'bg-blue-600',
        primaryDark: 'bg-blue-900',
        primaryLight: 'bg-blue-500',
        gradient: 'bg-gradient-to-br from-blue-500 via-gray-900 to-blue-500',
        gradientLight: 'bg-gradient-to-r from-blue-800/40 to-blue-600',
      },
      text: {
        primary: 'text-blue-400',
        primaryLight: 'text-blue-300',
        gradient: 'bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent',
      },
      border: {
        primary: 'border-blue-500',
        ring: 'ring-blue-500',
      },
      shadow: {
        primary: 'shadow-blue-500/50',
      },
      hover: {
        bg: 'hover:bg-blue-600',
        bgLight: 'hover:bg-blue-600/10',
        text: 'hover:text-blue-300',
        shadow: 'hover:shadow-blue-500/50',
      }
    },
    slate: {
      bg: {
        primary: 'bg-slate-600',
        primaryDark: 'bg-slate-900',
        primaryLight: 'bg-slate-500',
        gradient: 'bg-gradient-to-br from-slate-500 via-gray-900 to-slate-500',
        gradientLight: 'bg-gradient-to-r from-slate-800/40 to-slate-600',
      },
      text: {
        primary: 'text-slate-400',
        primaryLight: 'text-slate-300',
        gradient: 'bg-gradient-to-r from-slate-400 to-pink-400 bg-clip-text text-transparent',
      },
      border: {
        primary: 'border-slate-500',
        ring: 'ring-slate-500',
      },
      shadow: {
        primary: 'shadow-slate-500/50',
      },
      hover: {
        bg: 'hover:bg-slate-600',
        bgLight: 'hover:bg-slate-600/10',
        text: 'hover:text-slate-300',
        shadow: 'hover:shadow-slate-500/50',
      }
    },
    pink: {
      bg: {
        primary: 'bg-pink-600',
        primaryDark: 'bg-pink-900',
        primaryLight: 'bg-pink-500',
        gradient: 'bg-gradient-to-br from-pink-500 via-gray-900 to-pink-500',
        gradientLight: 'bg-gradient-to-r from-pink-800/40 to-pink-600',
      },
      text: {
        primary: 'text-pink-400',
        primaryLight: 'text-pink-300',
        gradient: 'bg-gradient-to-r from-pink-400 to-pink-400 bg-clip-text text-transparent',
      },
      border: {
        primary: 'border-pink-500',
        ring: 'ring-pink-500',
      },
      shadow: {
        primary: 'shadow-pink-500/50',
      },
      hover: {
        bg: 'hover:bg-pink-600',
        bgLight: 'hover:bg-pink-600/10',
        text: 'hover:text-pink-300',
        shadow: 'hover:shadow-pink-500/50',
      }
    },
    stone: {
      bg: {
        primary: 'bg-stone-600',
        primaryDark: 'bg-stone-900',
        primaryLight: 'bg-stone-500',
        gradient: 'bg-gradient-to-br from-stone-500 via-gray-900 to-stone-500',
        gradientLight: 'bg-gradient-to-r from-stone-800/40 to-stone-600',
      },
      text: {
        primary: 'text-stone-400',
        primaryLight: 'text-stone-300',
        gradient: 'bg-gradient-to-r from-stone-400 to-pink-400 bg-clip-text text-transparent',
      },
      border: {
        primary: 'border-stone-500',
        ring: 'ring-stone-500',
      },
      shadow: {
        primary: 'shadow-stone-500/50',
      },
      hover: {
        bg: 'hover:bg-stone-600',
        bgLight: 'hover:bg-stone-600/10',
        text: 'hover:text-stone-300',
        shadow: 'hover:shadow-stone-500/50',
      }
    },
    red: {
      bg: {
        primary: 'bg-red-600',
        primaryDark: 'bg-red-900',
        primaryLight: 'bg-red-500',
        gradient: 'bg-gradient-to-br from-red-500 via-gray-900 to-red-500',
        gradientLight: 'bg-gradient-to-r from-red-800/40 to-red-600',
      },
      text: {
        primary: 'text-red-400',
        primaryLight: 'text-red-300',
        gradient: 'bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent',
      },
      border: {
        primary: 'border-red-500',
        ring: 'ring-red-500',
      },
      shadow: {
        primary: 'shadow-red-500/50',
      },
      hover: {
        bg: 'hover:bg-red-600',
        bgLight: 'hover:bg-red-600/10',
        text: 'hover:text-red-300',
        shadow: 'hover:shadow-red-500/50',
      }
    }
  }

  const colorClasses = colorMappings[currentColor] || colorMappings.purple

  return {
    currentColor,
    colorClasses
  }
} 