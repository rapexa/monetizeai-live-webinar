
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  timeLeft: number;
}

const CountdownTimer = ({ timeLeft }: CountdownTimerProps) => {
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="relative bg-gradient-to-br from-red-900/40 to-orange-900/40 backdrop-blur-sm border border-red-500/30 rounded-3xl p-8 text-center overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10 animate-pulse"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
            <Clock className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white mb-1">وبینار زنده در حال پخش!</h2>
            <p className="text-red-400 text-sm font-semibold">⚡ فرصت محدود برای تماشا</p>
          </div>
        </div>
        
        {/* Countdown Display */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {/* Hours */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-red-500/30 rounded-2xl p-4 min-w-[80px]">
            <div className="text-3xl md:text-4xl font-black text-red-400 mb-1">
              {String(hours).padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-300 font-semibold">ساعت</div>
          </div>

          <div className="text-red-400 text-2xl font-bold animate-pulse">:</div>

          {/* Minutes */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-red-500/30 rounded-2xl p-4 min-w-[80px]">
            <div className="text-3xl md:text-4xl font-black text-red-400 mb-1">
              {String(minutes).padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-300 font-semibold">دقیقه</div>
          </div>

          <div className="text-red-400 text-2xl font-bold animate-pulse">:</div>

          {/* Seconds */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-red-500/30 rounded-2xl p-4 min-w-[80px]">
            <div className="text-3xl md:text-4xl font-black text-red-400 mb-1">
              {String(seconds).padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-300 font-semibold">ثانیه</div>
          </div>
        </div>
        
        {/* Warning Message */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-yellow-300 text-sm md:text-base font-semibold mb-2">
            ⚠️ هشدار: دسترسی محدود!
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            این وبینار فقط یکبار پخش می‌شود و بعد از پایان، دیگر در دسترس نخواهد بود. 
            <span className="text-yellow-400 font-bold"> الان یا هیچ‌وقت!</span>
          </p>
        </div>
      </div>

      {/* Animated Border */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-20 animate-pulse"></div>
    </div>
  );
};

export default CountdownTimer;
