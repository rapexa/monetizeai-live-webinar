import React, { useRef, useEffect, useState } from "react";
import { Radio, Heart, Maximize2 } from "lucide-react";

interface VideoPlayerProps {
  onVideoEnd: () => void;
  videoUrl?: string;
}

const VideoPlayer = ({ onVideoEnd, videoUrl = "/video1.mp4" }: VideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [likeCount, setLikeCount] = useState(1923);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnded, setIsEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [savedTime, setSavedTime] = useState(0);
  const [isTimeRestored, setIsTimeRestored] = useState(false);
  const [isVideoInitialized, setIsVideoInitialized] = useState(false);
  const [liveAttendance, setLiveAttendance] = useState(2435);

  // Debug function to log current state
  const debugVideoState = () => {
    const video = videoRef.current;
    if (video) {
      console.log('Video State:', {
        currentTime: video.currentTime,
        duration: video.duration,
        paused: video.paused,
        muted: video.muted,
        volume: video.volume,
        readyState: video.readyState,
        networkState: video.networkState
      });
    }
  };

  // Save video time to localStorage
  const saveVideoTime = (time: number) => {
    try {
      localStorage.setItem('webinar_video_time', time.toString());
      localStorage.setItem('webinar_start_time', Date.now().toString());
    } catch (error) {
      console.error('Failed to save video time:', error);
    }
  };

  // Load video time from localStorage
  const loadVideoTime = () => {
    try {
      const savedTimeStr = localStorage.getItem('webinar_video_time');
      const startTimeStr = localStorage.getItem('webinar_start_time');
      
      if (savedTimeStr && startTimeStr) {
        const savedTime = parseFloat(savedTimeStr);
        const startTime = parseInt(startTimeStr);
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds
        
        // Only restore if less than 5 minutes have passed
        if (elapsedTime < 300) {
          setSavedTime(savedTime);
          setIsTimeRestored(true);
          console.log('Restoring video time:', savedTime, 'elapsed:', elapsedTime);
          return savedTime;
        } else {
          // Clear old data
          localStorage.removeItem('webinar_video_time');
          localStorage.removeItem('webinar_start_time');
          console.log('Cleared old video time data (elapsed:', elapsedTime, ')');
        }
      }
    } catch (error) {
      console.error('Failed to load video time:', error);
    }
    return 0;
  };

  // Generate random attendance number
  const generateAttendanceNumber = () => {
    const baseNumber = 2400;
    const randomVariation = Math.floor(Math.random() * 200) - 100; // -100 to +100
    return Math.max(baseNumber + randomVariation, 2300); // Minimum 2300
  };

  // Update attendance number periodically
  useEffect(() => {
    const updateAttendance = () => {
      setLiveAttendance(generateAttendanceNumber());
    };

    // Update every 30-60 seconds randomly
    const interval = setInterval(() => {
      updateAttendance();
    }, Math.random() * 30000 + 30000); // 30-60 seconds

    return () => clearInterval(interval);
  }, []);

  // Initialize video with static file
  useEffect(() => {
    setIsLoading(false);
    console.log('Using static video file:', videoUrl);
  }, [videoUrl]);

  // Restore video time once when component mounts
  useEffect(() => {
    if (!isTimeRestored && !isLoading) {
      const restoredTime = loadVideoTime();
      setSavedTime(restoredTime);
      setIsTimeRestored(true);
      console.log('Time restoration completed:', restoredTime);
    }
  }, [isLoading, isTimeRestored]);

  // Prevent pausing/stopping
  useEffect(() => {
    const el = videoRef.current;
    if (el) {
      el.onpause = () => { el.play(); };
      el.onseeking = () => { el.currentTime = el.currentTime; };
      el.onstalled = () => { el.play(); };
      el.oncontextmenu = e => e.preventDefault();
    }
  }, []);

  // Set video time immediately when video element is available
  useEffect(() => {
    const video = videoRef.current;
    if (video && savedTime > 0 && isTimeRestored) {
      console.log('Setting video time immediately:', savedTime);
      video.currentTime = savedTime;
      debugVideoState();
    }
  }, [savedTime, isTimeRestored]);

  // Set up video player (simplified for static file)
  useEffect(() => {
    const video = videoRef.current;
    if (video && !isLoading && isTimeRestored && !isVideoInitialized) {
      console.log('Setting up video player');
      debugVideoState();
      setIsVideoInitialized(true);
      
      // Set the video to the restored time if we have one
      if (savedTime > 0) {
        video.currentTime = savedTime;
        console.log('Set video to saved time:', savedTime);
      }
      
      // Video setup
      const setupVideo = async () => {
        try {
          video.controls = false;
          
          // If we have a saved time, set it and then play
          if (savedTime > 0) {
            video.currentTime = savedTime;
            console.log('Set video to saved time before playing:', savedTime);
            // Small delay to ensure the time is set
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          // Try to play the video
          await video.play();
          console.log('Video started playing successfully');
          debugVideoState();
          
          // Set up video event handlers
          const handleTimeUpdate = () => {
            // Save current time periodically
            if (video.currentTime > 0) {
              saveVideoTime(video.currentTime);
            }
          };
          
          video.addEventListener('timeupdate', handleTimeUpdate);
          
          return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
          };
        } catch (error) {
          console.log('Live stream autoplay prevented. User interaction required.');
          // Add a live stream start button
          const liveButton = document.createElement('button');
          liveButton.innerHTML = '🔴 شروع پخش زنده';
          liveButton.className = 'absolute inset-0 z-50 bg-black/70 backdrop-blur-sm text-white text-xl font-bold rounded-2xl hover:bg-red-600/20 transition-all duration-200 flex items-center justify-center border-2 border-red-500/50';
          liveButton.onclick = async () => {
            try {
              if (savedTime > 0) {
                video.currentTime = savedTime;
                await new Promise(resolve => setTimeout(resolve, 100));
              }
              await video.play();
              liveButton.remove();
            } catch (err) {
              console.error('Failed to start live stream:', err);
            }
          };
          containerRef.current?.appendChild(liveButton);
        }
      };
      setupVideo();
    }
  }, [isFullscreen, isLoading, isTimeRestored, savedTime, isVideoInitialized]);

  // Gradually increase likes
  useEffect(() => {
    const interval = setInterval(() => {
      setLikeCount(prev => prev + Math.floor(Math.random() * 8) + 1);
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current) {
          await containerRef.current.requestFullscreen({
            navigationUI: "hide"
          });
          // Enable screen orientation API for mobile
          if (screen.orientation && screen.orientation.lock) {
            try {
              await screen.orientation.lock('any');
            } catch (err) {
              console.log('Screen orientation lock not supported');
            }
          }
        }
      } else {
        if (screen.orientation && screen.orientation.unlock) {
          try {
            await screen.orientation.unlock();
          } catch (err) {
            console.log('Screen orientation unlock not supported');
          }
        }
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Cleanup effect for component unmounting
  useEffect(() => {
    return () => {
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.currentTime = 0;
        video.muted = true;
      }
    };
  }, []);

  const handleUnmute = () => {
    const video = videoRef.current;
    if (video && video.readyState >= 2) { // HAVE_CURRENT_DATA or higher
      try {
        video.muted = false;
        setIsMuted(false);
        
        // Check if video is still in document before trying to play
        if (document.contains(video)) {
          // Ensure video plays after unmuting
          video.play().catch(error => {
            console.log('Failed to play after unmuting:', error);
            // If play fails, just unmute without playing
            setIsMuted(false);
          });
        } else {
          console.log('Video element no longer in document, just unmuting');
          setIsMuted(false);
        }
      } catch (error) {
        console.log('Error during unmute:', error);
        // Fallback: just update the state
        setIsMuted(false);
      }
    } else {
      console.log('Video not ready for unmuting');
      // Still update the state even if video isn't ready
      setIsMuted(false);
    }
  };

  // Format attendance number with Persian digits
  const formatAttendanceNumber = (num: number) => {
    return num.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl group"
      style={{
        width: '100%',
        height: '100%',
        maxHeight: isFullscreen ? '100vh' : 'auto'
      }}
    >
      {/* Live Stream Indicator */}
      <div className="absolute top-1.5 sm:top-2 md:top-3 left-1.5 sm:left-2 md:left-3 bg-red-600/90 backdrop-blur-md border border-red-500/30 rounded-md sm:rounded-lg md:rounded-xl px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-2 shadow-lg z-30">
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 text-white text-xs sm:text-sm md:text-base font-medium">
          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-red-400 rounded-full animate-pulse"></div>
          <span className="font-semibold">LIVE</span>
        </div>
      </div>

      {/* Viewers Count */}
      <div className="absolute top-1.5 sm:top-2 md:top-3 right-1.5 sm:right-2 md:right-3 bg-black/70 backdrop-blur-md border border-white/20 rounded-md sm:rounded-lg md:rounded-xl px-1 sm:px-1.5 md:px-3 py-0.5 sm:py-1 md:py-2 shadow-lg z-30">
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 text-white text-xs sm:text-sm md:text-base font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye text-green-400 w-3 h-3 sm:w-4 sm:h-4">
            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span className="font-semibold text-xs sm:text-sm md:text-base">{formatAttendanceNumber(liveAttendance)}</span>
        </div>
      </div>

      {/* Main Video */}
      <div className="relative w-full h-full">
        <video
          key="live-video-stream"
          ref={videoRef}
          className="w-full aspect-video relative z-10"
          muted={isMuted}
          autoPlay={isTimeRestored && savedTime === 0}
          playsInline
          controls={false}
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          preload="auto"
          style={{
            objectFit: isFullscreen ? 'contain' : 'cover',
            backgroundColor: 'black'
          }}
          onLoadedMetadata={() => {
            if (savedTime > 0 && videoRef.current) {
              videoRef.current.currentTime = savedTime;
              console.log('Restored video time on metadata load:', savedTime);
            }
          }}
          onEnded={() => {
            console.log("Video ended event fired");
            setIsEnded(true);
            if (onVideoEnd) onVideoEnd();
          }}
          onError={e => {
            console.error("Video error:", e);
          }}
          onAbort={(e) => {
            console.log("Video abort event:", e);
          }}
          onSuspend={(e) => {
            console.log("Video suspend event:", e);
          }}
          src={videoUrl}
        >
          مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
        </video>
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
            <div className="text-white text-sm sm:text-base md:text-lg text-center px-4">در حال بارگذاری ویدیو...</div>
          </div>
        )}
        
        
        {/* Debug Button (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 z-50">
            <button
              onClick={() => {
                debugVideoState();
                console.log('localStorage data:', {
                  videoTime: localStorage.getItem('webinar_video_time'),
                  startTime: localStorage.getItem('webinar_start_time'),
                  chatHistory: localStorage.getItem('webinar_chat_history')
                });
              }}
              className="bg-red-600/80 text-white px-2 sm:px-3 py-1 rounded text-xs mr-1 sm:mr-2"
            >
              Debug
            </button>
            <button
              onClick={() => {
                const video = videoRef.current;
                if (video && savedTime > 0) {
                  video.currentTime = savedTime;
                  console.log('Manually set video time to:', savedTime);
                }
              }}
              className="bg-blue-600/80 text-white px-2 sm:px-3 py-1 rounded text-xs"
            >
              Set Time
            </button>
          </div>
        )}
        
        {/* Mute Overlay */}
        {isMuted && !isEnded && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
            <button
              onClick={handleUnmute}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-xl font-bold shadow-lg hover:scale-105 transition-all duration-200 text-center max-w-xs sm:max-w-md"
            >
              برای شنیدن صدا، روی دکمه زیر کلیک کنید
            </button>
          </div>
        )}
        
        {/* End Overlay */}
        {isEnded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50 p-4">
            <div className="text-white text-lg sm:text-xl md:text-2xl font-bold p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-700 to-cyan-700 shadow-2xl text-center">
              وبینار به اتمام رسید
            </div>
          </div>
        )}
      </div>

      {/* Corner Decorations - فقط در دسکتاپ */}
      <div className="hidden md:block absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg opacity-60"></div>
      <div className="hidden md:block absolute top-4 right-16 w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg opacity-60"></div>
      <div className="hidden md:block absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg opacity-60"></div>
      <div className="hidden md:block absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400 rounded-br-lg opacity-60"></div>

      {/* Live Stream Overlay - Prevents user interaction */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {/* Live stream message */}
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-black/70 backdrop-blur-md border border-red-500/30 rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 shadow-lg">
          <div className="flex items-center gap-1.5 sm:gap-2 text-white text-xs sm:text-sm">
            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-red-400 rounded-full animate-pulse"></div>
            <span className="font-medium">پخش زنده</span>
          </div>
        </div>
      </div>
      
      {/* Glow Effect - فقط در دسکتاپ */}
      <div className="hidden md:block absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      {/* Fullscreen Button - گوشه پایین راست موبایل */}
      <button
        onClick={toggleFullscreen}
        className="md:hidden absolute bottom-2 sm:bottom-3 right-2 sm:right-3 z-40 bg-black/70 backdrop-blur-sm text-white p-1.5 sm:p-2 rounded-full hover:bg-black/85 transition-all duration-200 border border-white/20 shadow-lg hover:scale-110"
      >
        <Maximize2 size={12} className="sm:w-3.5 sm:h-3.5" />
      </button>
    </div>
  );
};

export default VideoPlayer;
