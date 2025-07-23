import { useEffect, useRef, useState } from 'react'
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeDown, FaVolumeMute } from 'react-icons/fa'
import { useAudioPlayer } from '../App'
import { useTheme } from '../hooks/useTheme'

const AudioPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    isLoaded,
    audioRef,
    togglePlay,
    playNext,
    playPrevious,
    setVolume,
    setCurrentTime,
    setDuration,
    setIsPlaying
  } = useAudioPlayer()

  const { currentColor, colorClasses } = useTheme()
  const progressRef = useRef(null)
  const volumeRef = useRef(null)
  const [hasSetInitialTime, setHasSetInitialTime] = useState(false)

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      
      // Set saved time only once when the track loads
      if (isLoaded && !hasSetInitialTime) {
        const savedTime = localStorage.getItem('currentTime')
        if (savedTime && parseFloat(savedTime) > 0) {
          const timeToSet = parseFloat(savedTime)
          // Ensure the time is within bounds
          if (timeToSet < audio.duration) {
            audio.currentTime = timeToSet
            setCurrentTime(timeToSet)
          }
        }
        setHasSetInitialTime(true)
      }
    }

    const handleTimeUpdate = () => {
      // Only update if we're not seeking
      if (!audio.seeking) {
        setCurrentTime(audio.currentTime)
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      localStorage.setItem('currentTime', '0')
    }

    const handleCanPlay = () => {
      // Set volume from saved state
      audio.volume = volume
      
      // If the component loads with a saved time and it hasn't been set yet, set it
      if (isLoaded && !hasSetInitialTime) {
        const savedTime = localStorage.getItem('currentTime')
        if (savedTime && parseFloat(savedTime) > 0) {
          const timeToSet = parseFloat(savedTime)
          if (timeToSet < audio.duration) {
            audio.currentTime = timeToSet
            setCurrentTime(timeToSet)
          }
        }
        setHasSetInitialTime(true)
      }
    }

    const handleLoadStart = () => {
      setHasSetInitialTime(false)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('loadstart', handleLoadStart)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('loadstart', handleLoadStart)
    }
  }, [currentTrack, isLoaded, hasSetInitialTime, volume, setCurrentTime, setDuration, setIsPlaying])

  // Reset hasSetInitialTime when track changes
  useEffect(() => {
    setHasSetInitialTime(false)
  }, [currentTrack])

  // Play/pause effect
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    if (isPlaying) {
      // Small delay to ensure audio is ready
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing audio:', error)
          setIsPlaying(false)
        })
      }
    } else {
      audio.pause()
    }
  }, [isPlaying, currentTrack, setIsPlaying])

  // Volume effect
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = volume
    }
  }, [volume])

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleProgressChange = (e) => {
    const audio = audioRef.current
    if (!audio || !duration) return

    const rect = progressRef.current.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = percent * duration
    
    audio.currentTime = newTime
    setCurrentTime(newTime)
    
    // Save the new time immediately when user seeks
    localStorage.setItem('currentTime', newTime.toString())
  }

  const handleVolumeChange = (e) => {
    const rect = volumeRef.current.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    setVolume(Math.max(0, Math.min(1, percent)))
  }

  const getVolumeIcon = () => {
    if (volume === 0) return FaVolumeMute
    if (volume < 0.5) return FaVolumeDown
    return FaVolumeUp
  }

  const VolumeIcon = getVolumeIcon()

  if (!currentTrack) return null

  const progressPercent = duration ? (currentTime / duration) * 100 : 0

  return (
    <>
      {/* Audio element */}
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        preload="metadata"
      />

      {/* Fixed player at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-700/50 shadow-2xl z-50">
        <div className="container mx-auto px-4 py-4">
          {/* Progress bar */}
          <div 
            ref={progressRef}
            className="w-full h-1 bg-gray-700 rounded-full mb-4 cursor-pointer group"
            onClick={handleProgressChange}
          >
            <div 
              className={`h-full ${colorClasses.bg.gradientLight} rounded-full relative transition-all duration-150`}
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg"></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Track info */}
            <div className="flex items-center md:space-x-4 space-x-2 flex-1 min-w-0">
              <div className={`w-12 h-12 ${colorClasses.bg.gradient} rounded-lg flex items-center justify-center`}>
                <span className="text-white font-bold text-lg">
                  {currentTrack.name.charAt(0)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-semibold truncate">{currentTrack.name}</h3>
                <p className="text-gray-400 text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center md:space-x-6 space-x-2">
              <button
                onClick={playPrevious}
                className="text-gray-400 hover:text-white transition-colors duration-200 hover:scale-110 transform"
              >
                <FaStepBackward className="w-5 h-5" />
              </button>

              <button
                onClick={togglePlay}
                className={`w-12 h-12 ${colorClasses.bg.gradient} text-white rounded-full flex items-center justify-center hover:scale-110 transform transition-all duration-200 shadow-lg ${colorClasses.hover.shadow}`}
              >
                {isPlaying ? <FaPause className="w-5 h-5" /> : <FaPlay className="w-5 h-5 ml-1" />}
              </button>

              <button
                onClick={playNext}
                className="text-gray-400 hover:text-white transition-colors duration-200 hover:scale-110 transform"
              >
                <FaStepForward className="w-5 h-5" />
              </button>
            </div>

            {/* Volume control */}
            <div className="flex items-center md:space-x-3 space-x-1 flex-1 justify-end">
              <VolumeIcon className="text-gray-400 w-4 h-4" />
              <div 
                ref={volumeRef}
                className="md:w-24 w-20 h-1 bg-gray-700 rounded-full cursor-pointer group"
                onClick={handleVolumeChange}
              >
                <div 
                  className={`h-full ${colorClasses.bg.gradientLight} rounded-full relative transition-all duration-150`}
                  style={{ width: `${volume * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150"></div>
                </div>
              </div>
              <span className="text-gray-400 text-xs w-8 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AudioPlayer 