import { FaPlay, FaMusic } from 'react-icons/fa'
import { useAudioPlayer } from '../App'
import { useTheme } from '../hooks/useTheme'

const AudioCard = ({ track }) => {
  const { playTrack, currentTrack, isPlaying } = useAudioPlayer()
  const { currentColor, colorClasses } = useTheme()
  
  const isCurrentTrack = currentTrack?.id === track.id

  const formatDuration = (duration) => {
    return duration
  }

  const getGroupHoverClasses = (colorName) => {
    switch (colorName) {
      case 'emerald': return 'group-hover:bg-emerald-600'
      case 'teal': return 'group-hover:bg-teal-600'
      case 'rose': return 'group-hover:bg-rose-600'
      case 'orange': return 'group-hover:bg-orange-600'
      case 'yellow': return 'group-hover:bg-yellow-600'
      case 'blue': return 'group-hover:bg-blue-600'
      case 'purple': return 'group-hover:bg-purple-600'
      case 'slate': return 'group-hover:bg-slate-600'
      case 'pink': return 'group-hover:bg-pink-600'
      case 'stone': return 'group-hover:bg-stone-600'
      case 'red': return 'group-hover:bg-red-600'
      default: return 'group-hover:bg-purple-600'
    }
  }

  return (
    <div className={`group relative bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 transition-all duration-300 hover:bg-gray-700/60 hover:scale-105 hover:shadow-xl border border-gray-700/50 ${isCurrentTrack ? `${colorClasses.border.ring} ring-2 bg-${currentColor}-900/30` : ''}`}>
      <div className="flex items-center justify-between" data-meta={track.discription}>
        <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap w-[60%]">
          <h3 className={`font-semibold text-lg mb-1 overflow-hidden text-ellipsis whitespace-nowrap w-[60%] ${isCurrentTrack ? colorClasses.text.primaryLight : 'text-white'}`}>
            {track.name}
          </h3>
          <p className="text-gray-400 text-sm flex items-center">
            <FaMusic className="mr-1" />
            {formatDuration(track.duration)}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {isCurrentTrack && isPlaying && (
            <div className="flex items-center space-x-0.5">
              <div className={`w-0.5 ${colorClasses.bg.primaryLight} animate-bounce`} style={{height: '10px', animationDelay: '0ms', animationDuration: '270ms'}}></div>
              <div className={`w-0.5 ${colorClasses.bg.primaryLight} animate-bounce`} style={{height: '16px', animationDelay: '100ms', animationDuration: '300ms'}}></div>
              <div className={`w-0.5 ${colorClasses.bg.primaryLight} animate-bounce`} style={{height: '10px', animationDelay: '150ms', animationDuration: '400ms'}}></div>
              <div className={`w-0.5 ${colorClasses.bg.primaryLight} animate-bounce`} style={{height: '16px', animationDelay: '200ms', animationDuration: '450ms'}}></div>
              <div className={`w-0.5 ${colorClasses.bg.primaryLight} animate-bounce`} style={{height: '10px', animationDelay: '250ms', animationDuration: '400ms'}}></div>
              <div className={`w-0.5 ${colorClasses.bg.primaryLight} animate-bounce`} style={{height: '16px', animationDelay: '150ms', animationDuration: '450ms'}}></div>
              <div className={`w-0.5 ${colorClasses.bg.primaryLight} animate-bounce`} style={{height: '10px', animationDelay: '100ms', animationDuration: '350ms'}}></div>
              </div>
          )}
          
          <button
            onClick={() => playTrack(track)}
            className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
              isCurrentTrack 
                ? `${colorClasses.bg.primary} text-white shadow-lg ${colorClasses.shadow.primary}` 
                : `bg-white/10 text-white ${colorClasses.hover.bgLight} ${colorClasses.hover.shadow}`
            } backdrop-blur-sm ${getGroupHoverClasses(currentColor)} group-hover:text-white`}
          >
            <FaPlay className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Hover overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r from-${currentColor}-600/10 to-pink-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
    </div>
  )
}

export default AudioCard 