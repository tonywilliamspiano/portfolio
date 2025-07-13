import { useState } from 'react';

interface HappySadDetectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const HappySadDetector: React.FC<HappySadDetectorProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex flex-col items-center z-50 transition-all duration-300">
      {/* Header */}
      <div className="w-full p-6 flex items-center">
        <button 
          onClick={onClose}
          className="text-white hover:text-gray-300 transition-colors mr-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="black">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white text-2xl font-semibold">Happy/Sad Detector</h1>
      </div>

      {/* Camera View */}
      <div className="relative w-full max-w-lg aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden shadow-xl mx-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">Camera preview will appear here</p>
        </div>
        
        {/* Capture Button */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <button 
            className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 focus:outline-none transform transition-transform hover:scale-105 active:scale-95"
            onClick={() => {
              // Capture functionality will be implemented later
              console.log('Capture image');
            }}
          >
            <span className="sr-only">Capture photo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HappySadDetector; 