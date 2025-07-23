import { useState, useRef, useEffect, createContext, useContext } from 'react'
import HomePage from './components/HomePage'
import AudioPlayer from './components/AudioPlayer'
import { musicData } from './musicData'

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
  const audioRef = useRef(null)

  // Load saved track from localStorage on app start
  useEffect(() => {
    const savedTrack = localStorage.getItem('currentTrack')
    const savedTime = localStorage.getItem('currentTime')
    
    if (savedTrack) {
      const track = JSON.parse(savedTrack)
      setCurrentTrack(track)
      if (savedTime) {
        setCurrentTime(parseFloat(savedTime))
      }
    }
  }, [])

  // Save current track and time to localStorage
  useEffect(() => {
    if (currentTrack) {
      localStorage.setItem('currentTrack', JSON.stringify(currentTrack))
    }
  }, [currentTrack])

  useEffect(() => {
    localStorage.setItem('currentTime', currentTime.toString())
  }, [currentTime])

  const playTrack = (track) => {
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

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative">
        <div className="absolute top-0 left-0 w-full h-full z-0"> 
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" class="fill-purple-600/60"></path><path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" class="fill-purple-600"></path><path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" class="fill-gray-900/40"></path></svg>
          </div>
        <div className="pb-24 z-10"> {/* Add padding bottom for fixed player */}
          <HomePage />
        </div>
        <AudioPlayer />
      </div>
    </AudioPlayerContext.Provider>
  )
}

export default App
