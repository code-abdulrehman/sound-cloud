import { useState, useEffect } from 'react'
import { FaMusic, FaUpload } from 'react-icons/fa'
import { BsMoonStarsFill } from "react-icons/bs";
import { useAudioPlayer } from '../App'
import AudioCard from './AudioCard'
import AudioUpload from './AudioUpload'
import { useTheme } from '../hooks/useTheme'

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('islamic')
  const { musicData, currentTrack } = useAudioPlayer()
  const { currentColor, colorClasses } = useTheme()

  // Load saved tab from localStorage on component mount
  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab')
    if (savedTab && (savedTab === 'islamic' || savedTab === 'songs' || savedTab === 'uploads')) {
      setActiveTab(savedTab)
    }
  }, [])

  // Set the correct tab based on the current track when component mounts or currentTrack changes
  useEffect(() => {
    if (currentTrack) {
      // Check if the current track is in the Islamic category
      const isInIslamic = musicData.islamic.some(track => track.id === currentTrack.id)
      // Check if the current track is in the Songs category
      const isInSongs = musicData.songs.some(track => track.id === currentTrack.id)
      // Check if it's an uploaded track
      const isUploaded = currentTrack.isUploaded
      
      if (isInIslamic) {
        setActiveTab('islamic')
        localStorage.setItem('activeTab', 'islamic')
      } else if (isInSongs) {
        setActiveTab('songs')
        localStorage.setItem('activeTab', 'songs')
      } else if (isUploaded) {
        setActiveTab('uploads')
        localStorage.setItem('activeTab', 'uploads')
      }
    }
  }, [currentTrack, musicData])

  // Handle tab change and save to localStorage
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    localStorage.setItem('activeTab', tab)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8 z-100 relative">
        <h1 className={`text-4xl md:text-5xl font-bold text-white mb-4 ${colorClasses.text.gradient} flex justify-center gap-2 items-baseline`}>
            SoundCloud <sub className="text-sm text-gray-400 font-medium"><small>01</small></sub>
        </h1>
        <p className="text-gray-300 text-lg">Discover and enjoy beautiful audio content</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 border border-gray-700/50">
          <button
            onClick={() => handleTabChange('islamic')}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
              activeTab === 'islamic'
                ? `${colorClasses.bg.primary} text-white`
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <BsMoonStarsFill className="inline mr-2" />
            Islamic
          </button>
          <button
            onClick={() => handleTabChange('songs')}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
              activeTab === 'songs'
                ? `${colorClasses.bg.primary} text-white`
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <FaMusic className="inline mr-2" />
            Songs
          </button>
          <button
            onClick={() => handleTabChange('uploads')}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
              activeTab === 'uploads'
                ? `${colorClasses.bg.primary} text-white`
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <FaUpload className="inline mr-2" />
            Uploads
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'uploads' ? (
        <div className="max-w-4xl mx-auto">
          <AudioUpload />
        </div>
      ) : (
        <>
          {/* Music Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {musicData[activeTab].map((track) => (
              <AudioCard key={track.id} track={track} />
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <div className={`text-2xl font-bold ${colorClasses.text.primary}`}>{musicData.islamic.length}</div>
                <div className="text-sm text-gray-400">Islamic</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <div className={`text-2xl font-bold ${colorClasses.text.primary}`}>{musicData.songs.length}</div>
                <div className="text-sm text-gray-400">Songs</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <div className={`text-2xl font-bold ${colorClasses.text.primary}`}>{musicData.islamic.length + musicData.songs.length}</div>
                <div className="text-sm text-gray-400">Total</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <div className={`text-2xl font-bold ${colorClasses.text.primary}`}>∞</div>
                <div className="text-sm text-gray-400">Hours</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                <span className="font-bold">Note:</span> This is a demo website for a music player.Don't expect to find any copyrighted content here.
              </p>
              <p className="text-gray-400 text-sm mt-2"> 
                 Made with ❤️ by <a href="https://github.com/code-abdulrehman" className={`${colorClasses.text.primary} ${colorClasses.hover.text} animate-bounce font-bold`}>AR</a>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default HomePage 