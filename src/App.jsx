import { useState, useRef, useEffect, createContext, useContext } from 'react'
import HomePage from './components/HomePage'
import AudioPlayer from './components/AudioPlayer'
import ColorSwitcher from './components/ColorSwitcher'
import { musicData } from './musicData'
import { useTheme } from './hooks/useTheme'

// Audio Player Context
const AudioPlayerContext = createContext()

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext)
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider')
  }
  return context
}

function App() {
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const audioRef = useRef(null)
  const { currentColor } = useTheme()

  // Load saved track, time, and volume from localStorage on app start
  useEffect(() => {
    const savedTrack = localStorage.getItem('currentTrack')
    const savedTime = localStorage.getItem('currentTime')
    const savedVolume = localStorage.getItem('volume')
    const savedIsPlaying = localStorage.getItem('isPlaying')
    
    if (savedTrack) {
      try {
        const track = JSON.parse(savedTrack)
        setCurrentTrack(track)
        
        if (savedTime) {
          setCurrentTime(parseFloat(savedTime))
        }
        
        if (savedVolume) {
          setVolume(parseFloat(savedVolume))
        }
        
        // Don't auto-play when page loads, just restore the state
        if (savedIsPlaying === 'true') {
          // We'll handle this in AudioPlayer component after audio is loaded
          setIsPlaying(false) // Start paused, user can click play if they want
        }
      } catch (error) {
        console.error('Error loading saved track:', error)
        // Clear corrupted data
        localStorage.removeItem('currentTrack')
        localStorage.removeItem('currentTime')
        localStorage.removeItem('isPlaying')
      }
    }
    
    setIsLoaded(true)
  }, [])

  // Save current track to localStorage
  useEffect(() => {
    if (currentTrack && isLoaded) {
      localStorage.setItem('currentTrack', JSON.stringify(currentTrack))
    }
  }, [currentTrack, isLoaded])

  // Save current time to localStorage (throttled to avoid too many writes)
  useEffect(() => {
    if (isLoaded && currentTrack) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('currentTime', currentTime.toString())
      }, 1000) // Save every second instead of on every update

      return () => clearTimeout(timeoutId)
    }
  }, [currentTime, isLoaded, currentTrack])

  // Save volume to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('volume', volume.toString())
    }
  }, [volume, isLoaded])

  // Save playing state to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('isPlaying', isPlaying.toString())
    }
  }, [isPlaying, isLoaded])

  const playTrack = (track) => {
    // If it's a new track, reset the time
    if (!currentTrack || currentTrack.id !== track.id) {
      setCurrentTime(0)
      localStorage.setItem('currentTime', '0')
    }
    
    setCurrentTrack(track)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const playNext = () => {
    if (!currentTrack) return
    
    const allTracks = [...musicData.islamic, ...musicData.songs]
    const currentIndex = allTracks.findIndex(track => track.id === currentTrack.id)
    const nextIndex = (currentIndex + 1) % allTracks.length
    
    playTrack(allTracks[nextIndex])
  }

  const playPrevious = () => {
    if (!currentTrack) return
    
    const allTracks = [...musicData.islamic, ...musicData.songs]
    const currentIndex = allTracks.findIndex(track => track.id === currentTrack.id)
    const prevIndex = currentIndex === 0 ? allTracks.length - 1 : currentIndex - 1
    
    playTrack(allTracks[prevIndex])
  }

  const contextValue = {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    isLoaded,
    musicData,
    audioRef,
    playTrack,
    togglePlay,
    playNext,
    playPrevious,
    setVolume,
    setCurrentTime,
    setDuration,
    setIsPlaying
  }

  // Inline style for dynamic background using CSS custom properties
  const backgroundStyle = {
    background: `linear-gradient(to bottom right, rgb(17 24 39), var(--current-color-900, rgb(88 28 135)), rgb(17 24 39))`
  }

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      <div className="min-h-screen relative" style={backgroundStyle}>
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" style={{fill: `var(--current-color-600, rgb(147 51 234))`, opacity: 0.6}}></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" style={{fill: `var(--current-color-600, rgb(147 51 234))`}}></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-gray-900/40"></path>
          </svg>
        </div>
        <div className="pb-20">
          <HomePage />
        </div>
        <AudioPlayer />
        <ColorSwitcher />
      </div>
    </AudioPlayerContext.Provider>
  )
}

export default App
