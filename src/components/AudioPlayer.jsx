import { useEffect, useRef, useState } from 'react'
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeDown, FaVolumeMute, FaExclamationTriangle } from 'react-icons/fa'
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
  const [audioError, setAudioError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastLoadedUrl, setLastLoadedUrl] = useState('')

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger keyboard controls if user is typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          if (currentTrack && !audioError) {
            togglePlay()
          }
          break
        case 'ArrowRight':
          e.preventDefault()
          playNext()
          break
        case 'ArrowLeft':
          e.preventDefault()
          playPrevious()
          break
        case 'ArrowUp':
          e.preventDefault()
          setVolume(prev => Math.min(1, prev + 0.1))
          break
        case 'ArrowDown':
          e.preventDefault()
          setVolume(prev => Math.max(0, prev - 0.1))
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [currentTrack, audioError, togglePlay, playNext, playPrevious, setVolume])

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    // Check if this is actually a new track by comparing URLs
    const isNewTrack = audio.src !== currentTrack.url && lastLoadedUrl !== currentTrack.url
    
    if (isNewTrack) {
      setAudioError(null)
      setIsLoading(true)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
      setLastLoadedUrl(currentTrack.url)
      
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
      setIsLoading(false)
      setLastLoadedUrl(currentTrack.url)
      
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
      // Only show loading for genuinely new tracks
      if (isNewTrack) {
        setHasSetInitialTime(false)
        setIsLoading(true)
        setAudioError(null)
      }
    }

    const handleError = (e) => {
      console.error('Audio loading error:', e)
      setIsLoading(false)
      setIsPlaying(false)
      setAudioError(`Failed to load audio file: ${currentTrack.name}`)
    }

    const handleLoadedData = () => {
      setIsLoading(false)
      setLastLoadedUrl(currentTrack.url)
    }

    const handlePlaying = () => {
      // Audio is actually playing, clear loading state
      setIsLoading(false)
      setLastLoadedUrl(currentTrack.url)
    }

    const handleWaiting = () => {
      // Only show loading if this is genuinely a new track
      if (isNewTrack) {
        setIsLoading(true)
      }
    }

    const handleCanPlayThrough = () => {
      // Audio can play through without buffering
      setIsLoading(false)
      setLastLoadedUrl(currentTrack.url)
    }

    // If the audio is already loaded and ready, don't show loading
    if (audio.readyState >= 1 && audio.src === currentTrack.url) {
      setIsLoading(false)
      setLastLoadedUrl(currentTrack.url)
      if (audio.duration) {
        setDuration(audio.duration)
      }
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('error', handleError)
    audio.addEventListener('loadeddata', handleLoadedData)
    audio.addEventListener('playing', handlePlaying)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('canplaythrough', handleCanPlayThrough)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('loadeddata', handleLoadedData)
      audio.removeEventListener('playing', handlePlaying)
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('canplaythrough', handleCanPlayThrough)
    }
  }, [currentTrack, isLoaded, hasSetInitialTime, volume, setCurrentTime, setDuration, setIsPlaying, lastLoadedUrl])

  // Reset hasSetInitialTime when track changes
  useEffect(() => {
    if (currentTrack && lastLoadedUrl !== currentTrack.url) {
      setHasSetInitialTime(false)
    }
  }, [currentTrack, lastLoadedUrl])

  // Play/pause effect
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack || audioError) return

    if (isPlaying) {
      // Don't show loading when just resuming playback
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Successfully started playing - clear any lingering loading state
          setIsLoading(false)
          setLastLoadedUrl(currentTrack.url)
        }).catch(error => {
          console.error('Error playing audio:', error)
          setIsPlaying(false)
          setIsLoading(false)
          setAudioError(`Playback failed: ${error.message}`)
        })
      }
    } else {
      audio.pause()
      // Don't set loading when just pausing
    }
  }, [isPlaying, currentTrack, audioError, setIsPlaying])

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
    if (!audio || !duration || audioError) return

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
  
  // Show loading only when genuinely loading a new track
  const showLoading = isLoading && (!lastLoadedUrl || lastLoadedUrl !== currentTrack.url)

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
          {/* Error message */}
          {audioError && (
            <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-3 mb-4 flex items-center">
              <FaExclamationTriangle className="text-red-400 mr-2" />
              <span className="text-red-200 text-sm">{audioError}</span>
              <button 
                onClick={() => {
                  setAudioError(null)
                  playNext()
                }}
                className="ml-auto text-red-400 hover:text-red-300 text-sm"
              >
                Skip Track
              </button>
            </div>
          )}

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
              <div className={`w-12 h-12 ${colorClasses.bg.gradient} rounded-lg flex items-center justify-center relative`}>
                {showLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                ) : audioError ? (
                  <FaExclamationTriangle className="text-white text-lg" />
                ) : (
                  <span className="text-white font-bold text-lg">
                    {currentTrack.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-semibold truncate">{currentTrack.name}</h3>
                <p className="text-gray-400 text-sm flex items-center">
                  {showLoading ? (
                    <>
                      <div className="animate-pulse w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                      Loading...
                    </>
                  ) : audioError ? (
                    <>
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                      Error loading file
                    </>
                  ) : isPlaying ? (
                    <>
                      <div className="animate-pulse w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      {`${formatTime(currentTime)} / ${formatTime(duration)}`}
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                      {`${formatTime(currentTime)} / ${formatTime(duration)}`}
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center md:space-x-6 space-x-4">
              <button
                onClick={playPrevious}
                className="text-gray-400 hover:text-white transition-colors duration-200 hover:scale-110 transform active:scale-95"
                disabled={showLoading}
                title="Previous track (Left Arrow)"
                aria-label="Previous track"
              >
                <FaStepBackward className="w-5 h-5" />
              </button>

              <button
                onClick={togglePlay}
                className={`w-14 h-14 ${colorClasses.bg.gradient} text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transform transition-all duration-200 shadow-lg ${colorClasses.hover.shadow} ${(showLoading || audioError) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl'} focus:outline-none focus:ring-4 focus:ring-purple-500/50`}
                disabled={showLoading || audioError}
                title={isPlaying ? "Pause (Spacebar)" : "Play (Spacebar)"}
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
              >
                {showLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                ) : isPlaying ? (
                  <FaPause className="w-6 h-6" />
                ) : (
                  <FaPlay className="w-6 h-6 ml-0.5" />
                )}
              </button>

              <button
                onClick={playNext}
                className="text-gray-400 hover:text-white transition-colors duration-200 hover:scale-110 transform active:scale-95"
                disabled={showLoading}
                title="Next track (Right Arrow)"
                aria-label="Next track"
              >
                <FaStepForward className="w-5 h-5" />
              </button>
            </div>

            {/* Volume control */}
            <div className="hidden md:flex items-center md:space-x-3 space-x-2 flex-1 justify-end">
              <button
                onClick={() => setVolume(volume === 0 ? 1 : 0)}
                className="text-gray-400 hover:text-white transition-colors duration-200 hover:scale-110 transform active:scale-95"
                title={`${volume === 0 ? 'Unmute' : 'Mute'} (Up/Down arrows to adjust)`}
                aria-label={`${volume === 0 ? 'Unmute' : 'Mute'} audio`}
              >
                <VolumeIcon className="w-4 h-4" />
              </button>
              <div 
                ref={volumeRef}
                className="md:w-24 w-20 h-2 bg-gray-700 rounded-full cursor-pointer group transition-all duration-200"
                onClick={handleVolumeChange}
                title="Click to adjust volume or use Up/Down arrow keys"
              >
                <div 
                  className={`h-full ${colorClasses.bg.gradientLight} rounded-full relative transition-all duration-150`}
                  style={{ width: `${volume * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg"></div>
                </div>
              </div>
              <span className="text-gray-400 text-xs w-8 text-right font-mono">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
          
          {/* Keyboard shortcuts indicator */}
          <div className="mt-2 text-center hidden md:block">
            <p className="text-gray-500 text-xs">
              Keyboard: <span className="text-gray-400">Space</span> play/pause • <span className="text-gray-400">←→</span> prev/next • <span className="text-gray-400">↑↓</span> volume
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default AudioPlayer 