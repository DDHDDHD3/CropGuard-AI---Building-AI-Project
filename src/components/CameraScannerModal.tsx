import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  CameraOff, 
  RefreshCw, 
  X, 
  Check, 
  RotateCw, 
  Sparkles, 
  AlertCircle, 
  Upload,
  Focus
} from 'lucide-react';

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  isOpen,
  onClose,
  onCapture
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);

  // Check available devices
  useEffect(() => {
    if (!isOpen) return;

    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        setHasMultipleCameras(videoDevices.length > 1);
      }).catch(() => {
        setHasMultipleCameras(false);
      });
    }
  }, [isOpen]);

  // Start camera stream when open
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      setCameraError(null);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setIsLoading(true);
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access API is not supported in this browser environment.');
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsLoading(false);
    } catch (err: any) {
      console.warn('Camera access failed, fallback available:', err);
      setIsLoading(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera permissions in your browser or use your mobile device camera below.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on this device. You can upload an image or connect a webcam.');
      } else {
        setCameraError(err.message || 'Unable to start camera stream.');
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const toggleFacingMode = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const handleMobileFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        onCapture(dataUrl);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/90 border-b border-slate-700 text-white z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Live Field Leaf Camera</h2>
              <p className="text-[11px] text-slate-400">Position crop leaf in center of reticle</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!capturedImage && !cameraError && hasMultipleCameras && (
              <button
                onClick={toggleFacingMode}
                title="Flip Camera (Front/Rear)"
                className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewfinder / Video Canvas */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[320px] sm:min-h-[420px]">
          
          {/* Captured Image Review State */}
          {capturedImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={capturedImage} 
                alt="Captured Leaf" 
                className="max-h-[60vh] w-auto object-contain rounded-lg"
              />
              <div className="absolute top-3 left-3 bg-emerald-950/90 border border-emerald-500/50 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Snapshot Ready for Decomposition
              </div>
            </div>
          ) : cameraError ? (
            /* Error & Fallback State */
            <div className="p-6 text-center text-white max-w-md space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
                <CameraOff className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Direct Stream Restricted</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {cameraError}
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                {/* Fallback to device native camera input */}
                <input
                  type="file"
                  ref={mobileInputRef}
                  onChange={handleMobileFile}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                />
                <button
                  onClick={() => mobileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                  Take Photo with Device Camera App
                </button>
                <button
                  onClick={startCamera}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer border border-slate-700"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry Browser Camera Access
                </button>
              </div>
            </div>
          ) : (
            /* Live Stream Active Viewfinder */
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className="w-full h-full object-cover"
              />

              {/* Loading Spinner */}
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white gap-3">
                  <RefreshCw className="w-7 h-7 text-emerald-400 animate-spin" />
                  <span className="text-xs font-mono text-slate-300">Initializing camera lens...</span>
                </div>
              )}

              {/* Target Reticle Overlay */}
              {!isLoading && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                  {/* Bounding bracket frame */}
                  <div className="relative w-64 h-64 sm:w-80 sm:h-80 border-2 border-dashed border-emerald-400/70 rounded-2xl flex items-center justify-center">
                    {/* Corner accents */}
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
                    
                    {/* Center crosshair */}
                    <Focus className="w-8 h-8 text-emerald-400/60 animate-pulse" />

                    <div className="absolute -bottom-7 bg-black/75 px-3 py-1 rounded-full text-[11px] font-mono text-emerald-300 border border-emerald-500/30 backdrop-blur-sm whitespace-nowrap">
                      Align leaf blade within frame
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Action Controls Bar */}
        <div className="p-4 bg-slate-800 border-t border-slate-700 flex items-center justify-between gap-3 text-xs text-white">
          {capturedImage ? (
            <>
              <button
                onClick={handleRetake}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold transition-colors cursor-pointer"
              >
                <RotateCw className="w-4 h-4" />
                Retake Photo
              </button>

              <button
                onClick={handleConfirm}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Analyze Leaf Lesions
              </button>
            </>
          ) : !cameraError ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-slate-400 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Live Feed Active ({facingMode === 'environment' ? 'Rear Field Lens' : 'User Lens'})</span>
              </div>

              {/* Shutter Button */}
              <div className="flex items-center justify-center w-full sm:w-auto">
                <button
                  onClick={takeSnapshot}
                  disabled={isLoading}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-transform active:scale-95 shadow-lg cursor-pointer disabled:opacity-50"
                >
                  <div className="w-4 h-4 rounded-full border-2 border-slate-950 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-slate-950" />
                  </div>
                  <span>Capture Leaf Photo</span>
                </button>
              </div>

              {/* Mobile device camera file input fallback */}
              <div>
                <input
                  type="file"
                  ref={mobileInputRef}
                  onChange={handleMobileFile}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                />
                <button
                  onClick={() => mobileInputRef.current?.click()}
                  className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
                  title="Use native mobile camera app"
                >
                  System Camera
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-center cursor-pointer"
            >
              Close Camera
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
