import { useState, useRef, useEffect } from 'react';

interface HappySadDetectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const HappySadDetector: React.FC<HappySadDetectorProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !capturedImage) {
      console.log('Starting camera...');
      startCamera();
    }
    return () => {
      console.log('Cleaning up camera...');
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" }
      });
      console.log('Camera access granted, setting up video stream...');
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    console.log('Attempting to capture photo...');
    if (videoRef.current) {
      // Wait for video to be ready
      if (!videoRef.current.videoWidth) {
        console.log('Video not ready yet, waiting...');
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      console.log(`Canvas created with dimensions: ${canvas.width}x${canvas.height}`);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        try {
          ctx.drawImage(videoRef.current, 0, 0);
          const imageData = canvas.toDataURL('image/jpeg');
          console.log('Photo captured successfully');
          setCapturedImage(imageData);
          stopCamera();
        } catch (error) {
          console.error('Error capturing photo:', error);
        }
      }
    } else {
      console.error('Video reference not found');
    }
  };

  const retakePhoto = () => {
    console.log('Retaking photo...');
    setCapturedImage(null);
    startCamera();
  };

  const analyzePhoto = () => {
    console.log('Starting analysis...');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log('Analysis complete');
    }, 1000);
  };

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
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              onLoadedMetadata={() => console.log('Video metadata loaded')}
              onPlay={() => console.log('Video started playing')}
            />
            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <button 
                className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 focus:outline-none transform transition-transform hover:scale-105 active:scale-95"
                onClick={capturePhoto}
              >
                <span className="sr-only">Capture photo</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="absolute inset-0 w-full h-full object-cover"
              onLoad={() => console.log('Captured image loaded')}
            />
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
              <button 
                className="px-6 py-3 bg-gray-800 text-black rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
                onClick={retakePhoto}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retake
              </button>
              <button 
                className="px-6 py-3 bg-blue-600 text-black rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                onClick={analyzePhoto}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Analyze
              </button>
            </div>
          </>
        )}
        
        {/* Happiness Score */}
        {capturedImage && !isLoading && (
          <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg px-4 py-2 shadow-lg">
            <p className="text-xl font-semibold text-gray-900">90% Happy</p>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white">Analyzing...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HappySadDetector; 