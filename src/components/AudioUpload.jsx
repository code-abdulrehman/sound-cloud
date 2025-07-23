import { useState, useRef } from 'react'
import { FaUpload, FaPlay, FaTimes, FaMusic } from 'react-icons/fa'
import { useAudioPlayer } from '../App'
import { useTheme } from '../hooks/useTheme'

const AudioUpload = () => {
  const { playTrack, uploadedTracks, addUploadedTrack, removeUploadedTrack } = useAudioPlayer()
  const { colorClasses } = useTheme()
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getAudioDuration = (file) => {
    return new Promise((resolve) => {
      const audio = new Audio()
      audio.onloadedmetadata = () => {
        resolve(audio.duration)
      }
      audio.onerror = () => {
        resolve(0)
      }
      audio.src = URL.createObjectURL(file)
    })
  }

  const handleFileSelect = async (files) => {
    setIsProcessing(true)
    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('audio/') && file.size <= 50 * 1024 * 1024 // 50MB limit
    )

    if (validFiles.length === 0) {
      alert('Please select valid audio files (max 50MB each)')
      setIsProcessing(false)
      return
    }

    const processedFiles = []
    for (const file of validFiles) {
      try {
        const duration = await getAudioDuration(file)
        const url = URL.createObjectURL(file)
        const track = {
          id: Date.now() + Math.random(),
          name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
          duration: formatDuration(duration),
          url: url,
          description: `Uploaded file: ${file.name}`,
          isUploaded: true,
          originalFile: file
        }
        processedFiles.push(track)
        addUploadedTrack(track)
      } catch (error) {
        console.error('Error processing file:', file.name, error)
      }
    }

    setIsProcessing(false)

    // Auto-play the first uploaded file if it's the only one
    if (processedFiles.length === 1 && uploadedTracks.length === 0) {
      playTrack(processedFiles[0])
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const playNow = (track) => {
    playTrack(track)
  }

  const removeFile = (trackId) => {
    // Clean up object URL to prevent memory leaks
    const removedTrack = uploadedTracks.find(track => track.id === trackId)
    if (removedTrack?.url) {
      URL.revokeObjectURL(removedTrack.url)
    }
    removeUploadedTrack(trackId)
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
      <h2 className={`text-2xl font-bold mb-4 ${colorClasses.text.primary}`}>
        <FaUpload className="inline mr-2" />
        Upload Audio Files
      </h2>
      
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragging 
            ? `${colorClasses.border.primary} bg-gray-700/50` 
            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="audio/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        
        {isProcessing ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-purple-500 mb-4"></div>
            <p className="text-gray-300">Processing files...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <FaUpload className={`text-4xl mb-4 ${isDragging ? colorClasses.text.primary : 'text-gray-400'}`} />
            <p className="text-gray-300 text-lg mb-2">
              Drop audio files here or click to browse
            </p>
            <p className="text-gray-500 text-sm">
              Supports MP3, WAV, OGG, M4A (max 50MB each)
            </p>
          </div>
        )}
      </div>

      {/* Uploaded Files List */}
      {uploadedTracks.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            Uploaded Files ({uploadedTracks.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {uploadedTracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3 hover:bg-gray-700/70 transition-all duration-200"
              >
                <div className="flex items-center flex-1 min-w-0">
                  <FaMusic className={`${colorClasses.text.primary} mr-3 flex-shrink-0`} />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-white font-medium truncate">{track.name}</h4>
                    <p className="text-gray-400 text-sm">{track.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => playNow(track)}
                    className={`p-2 rounded-full ${colorClasses.bg.primary} text-white hover:scale-110 transform transition-all duration-200 shadow-lg`}
                    title="Play Now"
                  >
                    <FaPlay className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeFile(track.id)}
                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 hover:scale-110 transform transition-all duration-200"
                    title="Remove"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-4 p-4 bg-gray-700/30 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Tips:</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Use keyboard controls: Space (play/pause), ← → (prev/next), ↑ ↓ (volume)</li>
          <li>• Uploaded files are temporary and will be lost when you refresh the page</li>
          <li>• Multiple files can be uploaded at once</li>
          <li>• Files will automatically be included in the next/previous navigation</li>
        </ul>
      </div>
    </div>
  )
}

export default AudioUpload 