
import { useRef, useEffect, useState } from "react";
import { X, Minimize2, MessageCircle, Eye } from "lucide-react";
import LiveChat from "./LiveChat";
import ViewerCounter from "./ViewerCounter";

interface FullscreenVideoProps {
  onClose: () => void;
  onVideoEnd: () => void;
  videoUrl: string;
}

const FullscreenVideo = ({ onClose, onVideoEnd, videoUrl }: FullscreenVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play();
      
      const handleEnded = () => {
        onVideoEnd();
      };

      video.addEventListener('ended', handleEnded);
      
      return () => {
        video.removeEventListener('ended', handleEnded);
      };
    }
  }, [onVideoEnd]);

  useEffect(() => {
    // قفل کردن اسکرول و فعال‌سازی فول‌اسکرین واقعی
    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;
    const originalPosition = document.body.style.position;
    
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = '0';
    document.body.style.left = '0';
    
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100vh';

    // تشخیص تغییر جهت
    const handleOrientationChange = () => {
      setTimeout(() => {
        setIsPortrait(window.innerHeight > window.innerWidth);
      }, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;
      document.body.style.position = originalPosition;
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.left = '';
      
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  // کنترل ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black w-screen h-screen overflow-hidden">
      {/* Header - کم‌حجم و شفاف */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/70 to-transparent p-2 md:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-red-600/90 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              <span>🔴 LIVE</span>
            </div>
            {!isPortrait && (
              <div className="hidden md:block text-white text-sm font-bold">MonetizeAI Workshop</div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full border border-white/20 text-xs flex items-center gap-1">
              <Eye size={12} />
              <ViewerCounter showLabel={false} />
            </div>
            <button
              onClick={onClose}
              className="bg-black/60 backdrop-blur-sm text-white p-1.5 rounded-full border border-white/20 hover:bg-white/10 transition-colors"
            >
              <Minimize2 size={14} />
            </button>
            <button
              onClick={onClose}
              className="bg-red-600/80 backdrop-blur-sm text-white p-1.5 rounded-full border border-red-500/30 hover:bg-red-700 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Video - کاملاً تمام صفحه */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-10"
        autoPlay
        muted={false}
        playsInline
        controlsList="nodownload nofullscreen noremoteplaybook"
        disablePictureInPicture
        style={{ pointerEvents: 'none' }}
      >
        <source src={videoUrl} type="video/mp4" />
        مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
      </video>

      {/* دکمه چت شناور */}
      {!isChatVisible && (
        <button
          onClick={() => setIsChatVisible(true)}
          className={`fixed z-50 bg-gradient-to-r from-purple-600/90 to-cyan-600/90 backdrop-blur-sm text-white p-3 rounded-full shadow-2xl border border-white/20 hover:scale-105 transition-all duration-300 ${
            isPortrait 
              ? 'bottom-6 right-4' 
              : 'bottom-4 right-4'
          }`}
        >
          <MessageCircle size={20} />
        </button>
      )}

      {/* چت شناور - تطبیق با جهت صفحه */}
      {isChatVisible && (
        <div className={`fixed z-40 bg-black/40 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl ${
          isPortrait 
            ? 'bottom-4 left-4 right-4 h-80' 
            : 'top-16 right-4 w-80 h-96'
        }`}>
          <LiveChat 
            isEnabled={true}
            pinnedMessage=""
            webinarDuration={70 * 60}
            isFullscreen={true}
            onToggleFullscreenChat={() => setIsChatVisible(false)}
          />
        </div>
      )}

      {/* Footer مینیمال - فقط در دسکتاپ landscape */}
      {!isPortrait && (
        <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/70 to-transparent p-2">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h3 className="font-bold text-sm mb-1">راز کسب درآمد دلاری با هوش مصنوعی</h3>
              <p className="text-gray-300 text-xs">توسط تیم متخصص MonetizeAI</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-600/80 to-cyan-600/80 text-white px-3 py-1 rounded-full font-semibold text-xs">
              Full HD
            </div>
          </div>
        </div>
      )}

      {/* تزئینات گوشه‌ها - فقط در landscape */}
      {!isPortrait && (
        <>
          <div className="absolute top-16 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-lg opacity-60"></div>
          <div className="absolute top-16 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400/60 rounded-tr-lg opacity-60"></div>
          <div className="absolute bottom-12 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400/60 rounded-bl-lg opacity-60"></div>
          <div className="absolute bottom-12 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400/60 rounded-br-lg opacity-60"></div>
        </>
      )}
    </div>
  );
};

export default FullscreenVideo;
