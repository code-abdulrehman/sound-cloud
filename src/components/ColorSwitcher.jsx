import { useState, useEffect } from 'react'
import { FaPalette, FaTimes } from 'react-icons/fa'

const ColorSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState('teal')

  const colors = [
    { name: 'emerald', displayName: 'Emerald', preview: 'bg-emerald-500' },
    { name: 'teal', displayName: 'Teal', preview: 'bg-teal-500' },
    { name: 'rose', displayName: 'Rose', preview: 'bg-rose-500' },
    { name: 'orange', displayName: 'Orange', preview: 'bg-orange-500' },
    { name: 'yellow', displayName: 'Yellow', preview: 'bg-yellow-500' },
    { name: 'blue', displayName: 'Blue', preview: 'bg-blue-500' },
    { name: 'purple', displayName: 'Purple', preview: 'bg-purple-500' },
    { name: 'slate', displayName: 'Slate', preview: 'bg-slate-500' },
    { name: 'pink', displayName: 'Pink', preview: 'bg-pink-500' },
    { name: 'stone', displayName: 'Stone', preview: 'bg-stone-500' },
    { name: 'red', displayName: 'Red', preview: 'bg-red-500' },
  ]

  // Load saved color from localStorage on component mount
  useEffect(() => {
    const savedColor = localStorage.getItem('selectedColor')
    if (savedColor && colors.find(color => color.name === savedColor)) {
      setSelectedColor(savedColor)
      applyColorToRoot(savedColor)
    }
  }, [])

  const applyColorToRoot = (colorName) => {
    // Update CSS custom property for the color
    document.documentElement.style.setProperty('--primary-color', colorName)
    
    // Dispatch custom event for components to listen to color changes
    window.dispatchEvent(new CustomEvent('colorChanged', { detail: { color: colorName } }))
  }

  const handleColorChange = (colorName) => {
    setSelectedColor(colorName)
    localStorage.setItem('selectedColor', colorName)
    applyColorToRoot(colorName)
    setIsOpen(false)
  }

  const getButtonClasses = (colorName) => {
    if (colorName === 'purple') {
      return 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
    }
    if (colorName === 'emerald') {
      return 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/50'
    }
    if (colorName === 'teal') {
      return 'bg-teal-600 text-white shadow-lg shadow-teal-500/50'
    }
    if (colorName === 'rose') {
      return 'bg-rose-600 text-white shadow-lg shadow-rose-500/50'
    }
    if (colorName === 'orange') {
      return 'bg-orange-600 text-white shadow-lg shadow-orange-500/50'
    }
    if (colorName === 'yellow') {
      return 'bg-yellow-600 text-white shadow-lg shadow-yellow-500/50'
    }
    if (colorName === 'blue') {
      return 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
    }
    if (colorName === 'slate') {
      return 'bg-slate-600 text-white shadow-lg shadow-slate-500/50'
    }
    if (colorName === 'pink') {
      return 'bg-pink-600 text-white shadow-lg shadow-pink-500/50'
    }
    if (colorName === 'stone') {
      return 'bg-stone-600 text-white shadow-lg shadow-stone-500/50'
    }
    if (colorName === 'red') {
      return 'bg-red-600 text-white shadow-lg shadow-red-500/50'
    }
    return 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
  }

  const getColorClasses = (colorName, isSelected) => {
    if (isSelected) {
      if (colorName === 'purple') {
        return { border: 'border-purple-500', bg: 'bg-purple-900/30', text: 'text-purple-300' }
      }
      if (colorName === 'emerald') {
        return { border: 'border-emerald-500', bg: 'bg-emerald-900/30', text: 'text-emerald-300' }
      }
      if (colorName === 'teal') {
        return { border: 'border-teal-500', bg: 'bg-teal-900/30', text: 'text-teal-300' }
      }
      if (colorName === 'rose') {
        return { border: 'border-rose-500', bg: 'bg-rose-900/30', text: 'text-rose-300' }
      }
      if (colorName === 'orange') {
        return { border: 'border-orange-500', bg: 'bg-orange-900/30', text: 'text-orange-300' }
      }
      if (colorName === 'yellow') {
        return { border: 'border-yellow-500', bg: 'bg-yellow-900/30', text: 'text-yellow-300' }
      }
      if (colorName === 'blue') {
        return { border: 'border-blue-500', bg: 'bg-blue-900/30', text: 'text-blue-300' }
      }
      if (colorName === 'slate') {
        return { border: 'border-slate-500', bg: 'bg-slate-900/30', text: 'text-slate-300' }
      }
      if (colorName === 'pink') {
        return { border: 'border-pink-500', bg: 'bg-pink-900/30', text: 'text-pink-300' }
      }
      if (colorName === 'stone') {
        return { border: 'border-stone-500', bg: 'bg-stone-900/30', text: 'text-stone-300' }
      }
      if (colorName === 'red') {
        return { border: 'border-red-500', bg: 'bg-red-900/30', text: 'text-red-300' }
      }
    }
    return { border: 'border-gray-700/50', bg: 'bg-gray-800/50', text: 'text-gray-300' }
  }

  return (
    <>
      {/* Color Palette Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full transition-all duration-300 hover:scale-110 ${getButtonClasses(selectedColor)} backdrop-blur-sm`}
        title="Change Color Theme"
      >
        <FaPalette className="w-5 h-5" />
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Color Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-gray-900/95 backdrop-blur-md border-l border-gray-700/50 shadow-2xl z-[70] transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <h2 className="text-xl font-bold text-white">Color Themes</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-lg"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Color Options */}
        <div className="p-6">
          <p className="text-gray-300 text-sm mb-6">Choose your preferred color theme for the application</p>
          
          <div className="grid grid-cols-2 gap-3">
            {colors.map((color) => {
              const isSelected = selectedColor === color.name
              const colorClasses = getColorClasses(color.name, isSelected)
              
              return (
                <button
                  key={color.name}
                  onClick={() => handleColorChange(color.name)}
                  className={`group relative p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${colorClasses.border} ${colorClasses.bg} hover:border-gray-600`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-8 h-8 rounded-full ${color.preview} shadow-lg`}></div>
                    <span className={`text-sm font-medium ${colorClasses.text}`}>
                      {color.displayName}
                    </span>
                  </div>
                  
                  {isSelected && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50"></div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <p className="text-gray-400 text-xs">
              <span className="font-bold">Note:</span> Color preferences are saved locally and will persist across sessions.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default ColorSwitcher 