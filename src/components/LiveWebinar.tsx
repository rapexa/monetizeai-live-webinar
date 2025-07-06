import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import LiveChat from "./LiveChat";
import CountdownTimer from "./CountdownTimer";
import AdminPanel from "./AdminPanel";
import EndWebinarModal from "./EndWebinarModal";
import ViewerCounter from "./ViewerCounter";
import { Play, Users, Calendar, Star, MessageCircle, ArrowLeft } from "lucide-react";
import { apiService } from "@/services/api";

const VIDEO1_URL = "/video1.mp4";
const VIDEO2_URL = "/video1.mp4"; // Change to '/video2.mp4' when available

function getCurrentWebinarSlot() {
  const now = new Date();
  const hour = now.getHours();
  if (hour >= 14 && hour < 17) return 1;
  if (hour >= 18 && hour < 22) return 2;
  return 0;
}

const LiveWebinar: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(70 * 60); // 70 minutes in seconds
  const [isWebinarEnded, setIsWebinarEnded] = useState(false);
  const [isChatEnabled, setIsChatEnabled] = useState(true);
  const [showCTA, setShowCTA] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [webinarInfo, setWebinarInfo] = useState({
    title: "وبینار ساخت سیستم پولسازی دلاری با هوش مصنوعی",
    startTime: new Date(),
    endTime: new Date(Date.now() + 75 * 60 * 1000),
    isLive: true
  });
  const slot = getCurrentWebinarSlot();
  let videoUrl = null;
  if (slot === 1) videoUrl = VIDEO1_URL;
  if (slot === 2) videoUrl = VIDEO2_URL;

  // Fetch webinar info on component mount
  useEffect(() => {
    const fetchWebinarInfo = async () => {
      try {
        const info = await apiService.getWebinarInfo();
        setWebinarInfo({
          title: info.title,
          startTime: new Date(info.start_time),
          endTime: new Date(info.end_time),
          isLive: info.is_live
        });
        
        // Calculate time left based on end time
        const now = new Date();
        const endTime = new Date(info.end_time);
        const timeLeftSeconds = Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000));
        setTimeLeft(timeLeftSeconds);
      } catch (error) {
        console.error('Failed to fetch webinar info:', error);
      }
    };
    
    fetchWebinarInfo();
  }, []);

  // Show CTA only in last 15 minutes (900 seconds)
  useEffect(() => {
    if (timeLeft <= 15 * 60) {
      setShowCTA(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsWebinarEnded(true);
      
      // Don't clear localStorage immediately when timer ends
      // Let the video component handle it when video actually ends
      console.log('Webinar timer ended, but keeping video active');
      
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleTimeUpdate = (newTime: number) => {
    setTimeLeft(newTime);
  };

  const handleVideoEnd = () => {
    // Clear localStorage when webinar ends
    try {
      localStorage.removeItem('webinar_chat_history');
      localStorage.removeItem('webinar_video_time');
      localStorage.removeItem('webinar_start_time');
      console.log('Cleared webinar localStorage data');
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
    
    setShowEndModal(true);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  let pinnedMessage = null;
  if (slot === 1 || slot === 2) {
    // Calculate minutes left in the slot
    const now = new Date();
    let endHour = slot === 1 ? 17 : 22;
    const end = new Date(now);
    end.setHours(endHour, 0, 0, 0);
    const minutesLeft = Math.floor((end.getTime() - now.getTime()) / 60000);
    if (minutesLeft <= 15 && minutesLeft >= 0) {
      pinnedMessage = '⏰ فقط ۱۵ دقیقه تا پایان وبینار باقی مانده!';
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-gray-900 to-purple-950 text-white overflow-x-hidden">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={handleBackClick}
          className="bg-black/50 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full hover:bg-black/70 transition-all duration-200 border border-white/20 shadow-lg hover:scale-110 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-24 sm:w-32 md:w-72 h-24 sm:h-32 md:h-72 bg-purple-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
          <div className="absolute top-20 sm:top-40 right-5 sm:right-20 w-32 sm:w-48 md:w-96 h-32 sm:h-48 md:h-96 bg-cyan-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-10 sm:bottom-20 left-1/2 transform -translate-x-1/2 w-28 sm:w-40 md:w-80 h-28 sm:h-40 md:h-80 bg-pink-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10">
          {/* Hero Section */}
          <div className="container mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-6 md:py-12">
            {/* Header with Premium Look */}
            <div className="text-center mb-4 sm:mb-6 md:mb-12">
              <div className="max-w-4xl mx-auto mb-4 sm:mb-6 md:mb-8">
                <h1 className="text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 md:mb-4 leading-tight px-2 sm:px-4">
                  {webinarInfo.title}
                </h1>
                <h2 className="text-xs sm:text-sm md:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-4 sm:mb-6" dir="rtl" style={{unicodeBidi: 'embed'}}>
                  با هوش مصنوعی در <span className="text-yellow-400">۷۵ دقیقه</span>!‎
                </h2>
              </div>

              {/* Webinar Section */}
              <div className="max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto mb-4 sm:mb-6 md:mb-8">
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                      <Play className="text-purple-400 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white">وبینار زنده</h3>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-1.5 sm:px-2 md:px-4 py-1 md:py-2">
                      <div className="w-1 sm:w-1.5 md:w-2 h-1 sm:h-1.5 md:h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-400 text-xs sm:text-sm font-semibold">LIVE</span>
                    </div>
                  </div>
                  {videoUrl ? (
                    <VideoPlayer onVideoEnd={handleVideoEnd} videoUrl={videoUrl} />
                  ) : (
                    <div className="flex flex-col items-center justify-center min-h-[300px] py-12">
                      <div className="text-2xl md:text-3xl font-bold text-red-400 mb-4">وبینار به پایان رسیده است</div>
                      <div className="text-gray-300 text-lg mb-6">در حال حاضر پخش زنده‌ای وجود ندارد. لطفاً در ساعات اعلام‌شده مراجعه کنید.</div>
                      <button
                        className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-xl text-lg font-bold shadow-lg hover:scale-105 transition-all duration-200"
                        onClick={() => window.open('https://sianacademy.com/ai/', '_blank')}
                      >
                        شروع مسیر من
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Section - Responsive Layout */}
              <div className="max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto mb-4 sm:mb-6 md:mb-8">
                <LiveChat 
                  isEnabled={!!videoUrl}
                  pinnedMessage={pinnedMessage}
                  webinarDuration={70 * 60}
                  onWebinarEnd={isWebinarEnded ? () => {} : undefined}
                />
              </div>

              {/* End Modal */}
              {showEndModal && (
                <EndWebinarModal onClose={() => setShowEndModal(false)} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* End Webinar Modal */}
      {isWebinarEnded && (
        <EndWebinarModal 
          onClose={() => {
            setIsWebinarEnded(false);
            // Only clear localStorage when user closes the modal
            try {
              localStorage.removeItem('webinar_chat_history');
              localStorage.removeItem('webinar_video_time');
              localStorage.removeItem('webinar_start_time');
              console.log('Cleared webinar localStorage data (user closed modal)');
            } catch (error) {
              console.error('Failed to clear localStorage:', error);
            }
          }} 
        />
      )}
    </div>
  );
};

export default LiveWebinar;
