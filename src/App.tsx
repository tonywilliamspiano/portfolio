import { useState } from 'react'
import './App.css'
import HappySadDetector from './components/HappySadDetector'

function App() {
  const [isDetectorOpen, setIsDetectorOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <button
        onClick={() => setIsDetectorOpen(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105"
      >
        Open Happy/Sad Detector
      </button>

      <HappySadDetector 
        isOpen={isDetectorOpen}
        onClose={() => setIsDetectorOpen(false)}
      />
    </div>
  )
}

export default App
