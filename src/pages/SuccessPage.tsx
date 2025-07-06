import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, Calendar, MessageSquare, Gift, Star, Phone, ArrowLeft } from "lucide-react";

interface RegistrationData {
  firstName: string;
  lastName: string;
  phone: string;
  registrationTime: string;
}

const SuccessPage = () => {
  const navigate = useNavigate();
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [webinarInfo, setWebinarInfo] = useState({
    date: "",
    time: "",
    smsTime: "",
    scenario: 1
  });

  useEffect(() => {
    // دریافت اطلاعات ثبت‌نام از localStorage
    const savedData = localStorage.getItem('registrationData');
    if (!savedData) {
      navigate('/');
      return;
    }

    const data: RegistrationData = JSON.parse(savedData);
    setRegistrationData(data);

    // تعیین سناریو بر اساس زمان ثبت‌نام
    const registrationDate = new Date(data.registrationTime);
    const hour = registrationDate.getHours();
    
    let scenario = 1;
    let webinarDate = "";
    let webinarTime = "";
    let smsTime = "";

    if (hour >= 0 && hour <= 10) {
      // سناریو ۱: ۰۰:۰۰ تا ۱۰:۵۹ - وبینار امروز ۱۹:۰۰
      scenario = 1;
      webinarDate = "امروز";
      webinarTime = "۱۹:۰۰";
      smsTime = "۱۸:۳۰";
    } else if (hour >= 11 && hour <= 16) {
      // سناریو ۲: ۱۱:۰۰ تا ۱۶:۵۹ - وبینار فردا ۱۴:۰۰
      scenario = 2;
      webinarDate = "فردا";
      webinarTime = "۱۴:۰۰";
      smsTime = "۱۳:۳۰ فردا";
    } else {
      // سناریو ۳: ۱۷:۰۰ تا ۲۳:۵۹ - وبینار فردا ۱۹:۰۰
      scenario = 3;
      webinarDate = "فردا";
      webinarTime = "۱۹:۰۰";
      smsTime = "۱۸:۳۰ فردا";
    }

    setWebinarInfo({
      date: webinarDate,
      time: webinarTime,
      smsTime: smsTime,
      scenario: scenario
    });
  }, [navigate]);

  const getScenarioContent = () => {
    switch (webinarInfo.scenario) {
      case 1:
        return {
          title: "🕐 ثبت‌نامت با موفقیت انجام شد!‎",
          subtitle: `وبینار امروز ساعت ${webinarInfo.time} برگزار می‌شه‎.`,
          description: `لینک ورود، حدود ساعت ${webinarInfo.smsTime} برات پیامک می‌شه‎.`,
          cta: "آماده باش، فقط چند ساعت دیگه مونده!‎"
        };
      case 2:
        return {
          title: "🎉 ثبت‌نامت قطعی شد!‎",
          subtitle: `وبینار فردا ساعت ${webinarInfo.time} برگزار می‌شه‎.`,
          description: `لینک ورود، حدود ساعت ${webinarInfo.smsTime} برات پیامک می‌شه‎.`,
          cta: "فردا قراره مسیر پول‌سازی با AI رو شروع کنی!‎"
        };
      case 3:
        return {
          title: "✨ ثبت‌نام موفق بود!‎",
          subtitle: `وبینار فردا ساعت ${webinarInfo.time} برگزار می‌شه‎.`,
          description: `لینک ورود، حدود ساعت ${webinarInfo.smsTime} برات پیامک می‌شه‎.`,
          cta: "از همین حالا آماده شو برای یک تجربه متحول‌کننده‎."
        };
      default:
        return {
          title: "✅ ثبت‌نام موفق!‎",
          subtitle: "زمان وبینار به زودی اعلام می‌شود",
          description: "اطلاعات کامل از طریق پیامک ارسال خواهد شد",
          cta: "آماده باش برای تجربه‌ای فوق‌العاده!‎"
        };
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  if (!registrationData) {
    return null;
  }

  const content = getScenarioContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={handleBackClick}
          className="bg-black/50 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full hover:bg-black/70 transition-all duration-200 border border-white/20 shadow-lg hover:scale-110 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
        </button>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full filter blur-2xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="max-w-4xl w-full">
          {/* Smooth Success Animation */}
          <div className="text-center mb-8">
            <div className="mb-6">
              {/* Animated Check Icon */}
              <div className="relative inline-block">
                {/* Ripple Effect */}
                <div className="absolute inset-0 w-20 h-20 bg-green-500/30 rounded-full animate-ping mx-auto"></div>
                <div className="absolute inset-0 w-20 h-20 bg-green-500/20 rounded-full animate-pulse mx-auto"></div>
                
                {/* Main Icon Container */}
                <div 
                  className="relative w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/50"
                  style={{
                    animation: 'checkAppear 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards'
                  }}
                >
                  <CheckCircle 
                    className="text-white" 
                    size={40}
                    style={{
                      animation: 'checkReveal 0.8s ease-out 0.6s both'
                    }}
                  />
                </div>
              </div>

              <h2 
                className="text-4xl font-bold text-white mt-6" 
                dir="rtl" 
                style={{
                  unicodeBidi: 'embed',
                  animation: 'textFadeIn 0.8s ease-out 1s both'
                }}
              >
                تبریک!‎
              </h2>
            </div>
          </div>

          {/* Success Sound Effect */}
          <audio 
            autoPlay 
            style={{ display: 'none' }}
            onCanPlay={(e) => {
              const audio = e.target as HTMLAudioElement;
              audio.volume = 0.3;
              audio.play().catch(() => {
                // Handle autoplay restrictions silently
              });
            }}
          >
            <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSEELIHO8tiJOAgZZ7zn559NEAxQp+PwtmMcBjiR1/LMeSEELIHO8tiJOAgh" type="audio/wav" />
          </audio>

          {/* Elegant Animation Styles */}
          <style>{`
            @keyframes checkAppear {
              0% {
                opacity: 0;
                transform: scale(0) rotate(-180deg);
              }
              60% {
                opacity: 1;
                transform: scale(1.2) rotate(-10deg);
              }
              100% {
                opacity: 1;
                transform: scale(1) rotate(0deg);
              }
            }
            
            @keyframes checkReveal {
              0% {
                opacity: 0;
                transform: scale(0.3);
              }
              50% {
                opacity: 1;
                transform: scale(1.1);
              }
              100% {
                opacity: 1;
                transform: scale(1);
              }
            }
            
            @keyframes textFadeIn {
              0% {
                opacity: 0;
                transform: translateY(20px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>

          {/* Main Success Card */}
          <div className="bg-black/40 backdrop-blur-lg border border-green-500/30 shadow-2xl rounded-3xl p-8 text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" dir="rtl" style={{unicodeBidi: 'embed'}}>
              {content.title}
            </h1>
            
            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl p-6 mb-6 border border-green-500/30">
              <h2 className="text-xl md:text-2xl font-bold text-green-400 mb-2" dir="rtl" style={{unicodeBidi: 'embed'}}>
                {content.subtitle}
              </h2>
              <p className="text-lg text-green-300 mb-4" dir="rtl" style={{unicodeBidi: 'embed'}}>
                {content.description}
              </p>
              <p className="text-xl font-bold text-white" dir="rtl" style={{unicodeBidi: 'embed'}}>
                {content.cta}
              </p>
            </div>

            {/* User Info */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              <h3 className="text-white font-semibold mb-3">اطلاعات ثبت‌نام شما:</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-purple-600/20 rounded-lg p-3">
                  <div className="text-purple-400">نام</div>
                  <div className="text-white font-bold">{registrationData.firstName} {registrationData.lastName}</div>
                </div>
                <div className="bg-cyan-600/20 rounded-lg p-3">
                  <div className="text-cyan-400">شماره تماس</div>
                  <div className="text-white font-bold">{registrationData.phone}</div>
                </div>
                <div className="bg-green-600/20 rounded-lg p-3">
                  <div className="text-green-400">وضعیت</div>
                  <div className="text-white font-bold" dir="rtl" style={{unicodeBidi: 'embed'}}>تایید شده ✅</div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Instructions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-lg border border-purple-500/30 rounded-xl p-6" dir="rtl">
              <div className="flex items-center gap-3 mb-4 justify-end">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                  <MessageSquare className="text-white" size={24} />
                </div>
                <div className="text-right flex-1">
                  <h3 className="text-white font-bold text-lg">دریافت لینک ورود</h3>
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">مهم</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-purple-300">
                  <Phone size={16} />
                  <span className="text-sm">پیامک حاوی لینک ورود</span>
                </div>
                <div className="flex items-center gap-2 text-purple-300">
                  <Clock size={16} />
                  <span className="text-sm">زمان ارسال: {webinarInfo.smsTime}</span>
                </div>
                <p className="text-xs text-gray-400" dir="rtl" style={{unicodeBidi: 'embed'}}>
                  حتماً شماره تماست رو چک کن تا پیامک رو دریافت کنی‎
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 backdrop-blur-lg border border-cyan-500/30 rounded-xl p-6" dir="rtl">
              <div className="flex items-center gap-3 mb-4 justify-end">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-700 rounded-full flex items-center justify-center">
                  <Calendar className="text-white" size={24} />
                </div>
                <div className="text-right flex-1">
                  <h3 className="text-white font-bold text-lg">زمان وبینار</h3>
                  <span className="bg-cyan-600 text-white text-xs px-2 py-1 rounded">یادآوری</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-cyan-300 text-lg font-bold">
                  {webinarInfo.date} - ساعت {webinarInfo.time}
                </div>
                <div className="text-cyan-300 text-sm">
                  ⏰ مدت زمان: ۷۵ دقیقه فشرده
                </div>
                <p className="text-xs text-gray-400" dir="rtl" style={{unicodeBidi: 'embed'}}>
                  حتماً یه یادآوری برای خودت تنظیم کن‎
                </p>
              </div>
            </div>
          </div>

          {/* Special Bonuses */}
          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-lg border border-yellow-500/30 rounded-xl p-6 mb-8">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Gift className="text-yellow-400" size={24} />
                <h3 className="text-white font-bold text-xl" dir="rtl" style={{unicodeBidi: 'embed'}}>هدایای ویژه شرکت‌کنندگان</h3>
                <Gift className="text-yellow-400" size={24} />
              </div>
              <p className="text-yellow-300" dir="rtl" style={{unicodeBidi: 'embed'}}>فقط برای کسانی که تا آخر وبینار می‌مونن!‎</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  title: "چک‌لیست ۳۰ روزه",
                  description: "برنامه گام‌به‌گام موفقیت"
                },
                {
                  title: "ابزارهای رایگان AI",
                  description: "لیست کامل بهترین ابزارها"
                },
                {
                  title: "راهنمای عملی",
                  description: "فایل PDF کامل استراتژی‌ها"
                }
              ].map((bonus, index) => (
                <div key={index} className="bg-yellow-500/10 rounded-lg p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <Star className="text-yellow-400" size={20} />
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">{bonus.title}</h4>
                  <p className="text-yellow-300 text-xs">{bonus.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final Message */}
          <div className="text-center p-6 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-lg rounded-2xl border border-green-500/30">
            <h4 className="text-green-400 font-bold text-lg mb-2" dir="rtl" style={{unicodeBidi: 'embed'}}>
              🚀 آماده‌ای برای تحول در زندگی‌ت؟‎
            </h4>
            <p className="text-white leading-relaxed" dir="rtl" style={{unicodeBidi: 'embed'}}>
              تو رو به یک سفر هیجان‌انگیز به دنیای پولسازی با هوش مصنوعی دعوت می‌کنیم‎. 
              <br />
              <span className="text-green-400 font-semibold">این شروع یک دگرگونی بزرگه!‎</span>
            </p>
            <p className="text-gray-400 text-sm mt-4" dir="rtl" style={{unicodeBidi: 'embed'}}>
              لینک وبینار در زمان مقرر برایت پیامک خواهد شد‎
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage; 