import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Clock, Star, Trophy, DollarSign, Zap, CheckCircle, Calendar, ArrowRight, Eye } from "lucide-react";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [webinarInfo, setWebinarInfo] = useState({
    capacity: 500,
    registeredCount: 0
  });

  // Fetch webinar info on component mount
  useState(() => {
    const fetchWebinarInfo = async () => {
      try {
        const info = await apiService.getWebinarInfo();
        setWebinarInfo({
          capacity: info.capacity,
          registeredCount: info.registered_count
        });
      } catch (error) {
        console.error('Failed to fetch webinar info:', error);
      }
    };
    fetchWebinarInfo();
  });

  const remainingCapacity = webinarInfo.capacity - webinarInfo.registeredCount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await apiService.registerUser({
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone
      });
      
      // ذخیره اطلاعات در localStorage
      localStorage.setItem('registrationData', JSON.stringify({
        ...formData,
        registrationTime: new Date().toISOString(),
        userId: response.user.id
      }));
      
      toast({
        title: "ثبت‌نام موفق",
        description: "شما با موفقیت در وبینار ثبت‌نام شدید!",
      });
      
      navigate('/success');
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: "خطا در ثبت‌نام",
        description: "لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full filter blur-2xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur-sm rounded-full px-6 py-2 border border-purple-500/30">
              <Zap className="text-yellow-400" size={16} />
              <span className="text-white text-sm font-medium">فرصت طلایی محدود!</span>
            </div>
            
            <Button
              onClick={() => navigate('/webinar')}
              className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/40 hover:to-blue-600/40 backdrop-blur-sm border border-cyan-500/30 text-white px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <Eye size={16} className="mr-2" />
              مشاهده وبینار
            </Button>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            وبینار
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"> ساخت سیستم </span>
            پولسازی دلاری
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-6" dir="rtl" style={{unicodeBidi: 'embed'}}>
            با هوش مصنوعی در <span className="text-yellow-400">۷۵ دقیقه</span>!‎
          </h2>
          
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            یادبگیر چطور با هوش مصنوعی درآمد دلاری ایجاد کنی و سیستم‌های خودکار پولساز بسازی
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
          {/* Registration Form */}
          <div className="bg-black/40 backdrop-blur-lg border border-purple-500/30 shadow-2xl rounded-xl p-8 lg:min-h-[650px] lg:flex lg:flex-col lg:justify-center">
            <div className="text-center space-y-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full flex items-center gap-2">
                  <Users size={16} />
                  تنها {remainingCapacity} جا باقی مانده!
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white">
                ثبت‌نام رایگان
              </h2>
              <p className="text-gray-300">
                تمام اطلاعات شما محرمانه و امن نگهداری می‌شود
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${(webinarInfo.registeredCount / webinarInfo.capacity) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-400">
                {webinarInfo.registeredCount} نفر از {webinarInfo.capacity} نفر ثبت‌نام کردند
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    نام
                  </label>
                  <Input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="نام شما"
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    نام خانوادگی
                  </label>
                  <Input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="نام خانوادگی"
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  شماره تماس
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="09xxxxxxxxx"
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !formData.firstName || !formData.lastName || !formData.phone}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white py-4 text-lg font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    در حال ثبت‌نام...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>ثبت‌نام رایگان</span>
                    <ArrowRight size={20} />
                  </div>
                )}
              </Button>

              <div className="text-center pt-4">
                <p className="text-xs text-gray-400">
                  با ثبت‌نام، شما با 
                  <span className="text-purple-400"> قوانین و مقررات </span>
                  موافقت می‌کنید
                </p>
              </div>
            </form>
          </div>

          {/* Webinar Details */}
          <div className="space-y-6">
            {/* Time & Date Info */}
            <div className="bg-gradient-to-br from-purple-600/20 to-cyan-600/20 backdrop-blur-lg border border-purple-500/30 rounded-xl p-6" dir="rtl">
              <div className="flex items-center gap-3 mb-4 justify-end">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <Calendar className="text-white" size={24} />
                </div>
                <div className="text-right flex-1">
                  <h3 className="text-white font-bold text-lg">زمان برگزاری</h3>
                  <p className="text-gray-300">به‌روزرسانی براساس زمان ثبت‌نام</p>
                </div>
              </div>
              <div className="bg-black/30 rounded-lg p-4" dir="rtl">
                <div className="flex items-center gap-2 text-yellow-400 mb-2">
                  <Clock size={16} />
                  <span className="font-bold">۷۵ دقیقه فشرده و کاربردی</span>
                </div>
                <p className="text-gray-300 text-sm" dir="rtl" style={{unicodeBidi: 'embed'}}>
                  زمان دقیق برگزاری بعد از ثبت‌نام به شما اطلاع داده می‌شود‎
                </p>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="bg-black/40 backdrop-blur-lg border border-purple-500/30 rounded-xl p-6" dir="rtl">
              <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                چی یاد می‌گیری؟
                <Trophy className="text-yellow-400" size={24} />
              </h3>
              
              <div className="space-y-4">
                {[
                  {
                    icon: <DollarSign className="text-green-400" size={20} />,
                    title: "سیستم درآمدزایی خودکار",
                    description: "ایجاد سیستم‌هایی که ۲۴/۷ برات پول درمیارن"
                  },
                  {
                    icon: <Zap className="text-yellow-400" size={20} />,
                    title: "ابزارهای هوش مصنوعی پولساز",
                    description: "معرفی بهترین AI ابزارهای کسب درآمد"
                  },
                  {
                    icon: <Star className="text-purple-400" size={20} />,
                    title: "استراتژی‌های عملی و تست‌شده",
                    description: "روش‌هایی که هزاران نفر موفق شدن"
                  },
                  {
                    icon: <CheckCircle className="text-cyan-400" size={20} />,
                    title: "پلن عملی ۳۰ روزه",
                    description: "برنامه گام‌به‌گام برای شروع سریع"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/30 justify-end">
                    {item.icon}
                    <div className="text-right flex-1">
                      <h4 className="text-white font-semibold">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-lg rounded-2xl border border-red-500/30 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-400 font-bold text-lg">هشدار: ظرفیت در حال اتمام!</span>
          </div>
          <p className="text-white text-lg leading-relaxed" dir="rtl" style={{unicodeBidi: 'embed'}}>
            این وبینار تنها <span className="text-yellow-400 font-bold">یکبار</span> برگزار می‌شود و ضبط آن منتشر نخواهد شد‎. 
            <br />
            <span className="text-red-400">فرصت رو از دست نده!‎</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 