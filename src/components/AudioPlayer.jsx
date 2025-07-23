import { useEffect, useRef } from 'react'
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeDown, FaVolumeMute } from 'react-icons/fa'
import { useAudioPlayer } from '../App'

const AudioPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    audioRef,
    togglePlay,
    playNext,
    playPrevious,
    setVolume,
    setCurrentTime,
    setDuration,
    setIsPlaying
  } = useAudioPlayer()

  const progressRef = useRef(null)
  const volumeRef = useRef(null)

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      // Set saved time when track loads
      const savedTime = localStorage.getItem('currentTime')
      if (savedTime) {
        audio.currentTime = parseFloat(savedTime)
        setCurrentTime(parseFloat(savedTime))
      }
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      // Just stop playing when track ends, don't auto-play next
      setIsPlaying(false)
    }

    const handleCanPlay = () => {
      if (isPlaying) {
        audio.play().catch(console.error)
      }
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('canplay', handleCanPlay)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('canplay', handleCanPlay)
    }
  }, [currentTrack, isPlaying, setCurrentTime, setDuration, setIsPlaying])

  // Play/pause effect
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    if (isPlaying) {
      audio.play().catch(console.error)
    } else {
      audio.pause()
    }
  }, [isPlaying, currentTrack])

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
              className="h-full bg-gradient-to-r from-purple-800/40 to-purple-600 rounded-full relative transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg"></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Track info */}
            <div className="flex items-center md:space-x-4 space-x-2 flex-1 min-w-0">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-gray-900 to-purple-500 rounded-lg flex items-center justify-center">
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
                className="w-12 h-12 bg-gradient-to-br from-purple-500 via-gray-900 to-purple-500 text-white rounded-full flex items-center justify-center hover:scale-110 transform transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
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
                  className="h-full bg-gradient-to-r from-purple-800/40 to-purple-600 rounded-full relative transition-all duration-150"
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