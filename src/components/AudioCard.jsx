import { FaPlay, FaMusic } from 'react-icons/fa'
import { useAudioPlayer } from '../App'
import { useTheme } from '../hooks/useTheme'

const AudioCard = ({ track }) => {
  const { playTrack, currentTrack, isPlaying } = useAudioPlayer()
  const { currentColor, colorClasses } = useTheme()
  
  const isCurrentTrack = currentTrack?.id === track.id

  const formatDuration = (duration) => {
    // If duration is already in MM:SS format, return as is
    if (typeof duration === 'string' && duration.includes(':')) {
      return duration
    }
    
    // If duration is in seconds, convert to MM:SS
    if (typeof duration === 'number') {
      const minutes = Math.floor(duration / 60)
      const seconds = Math.floor(duration % 60)
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
    
    // If it's a string that might be seconds
    const numDuration = parseFloat(duration)
    if (!isNaN(numDuration)) {
      const minutes = Math.floor(numDuration / 60)
      const seconds = Math.floor(numDuration % 60)
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
    
    // Return as is if we can't parse it
    return duration
  }

  // Inline styles for dynamic classes that might not work in production
  const currentTrackStyle = isCurrentTrack ? {
    background: `rgb(var(--current-color-900, 88 28 135) / 0.3)`
  } : {}

  const hoverOverlayStyle = {
    background: `linear-gradient(to right, rgb(var(--current-color-600, 147 51 234) / 0.1), rgb(219 39 119 / 0.1))`
  }

  return (
    <div className={`group relative bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 transition-all duration-300 hover:bg-gray-700/60 hover:scale-105 hover:shadow-xl border border-gray-700/50 ${isCurrentTrack ? `${colorClasses.border.ring} ring-2` : ''}`} style={currentTrackStyle}>
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
                : `bg-white/10 text-white ${colorClasses.hover.shadow}`
            } backdrop-blur-sm group-hover:text-white`}
          >
            <FaPlay className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Hover overlay */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={hoverOverlayStyle}></div>
    </div>
  )
}

export default AudioCard 