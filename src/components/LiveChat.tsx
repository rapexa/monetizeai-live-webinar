import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle, Users, Pin, X } from "lucide-react";
import { apiService, ChatMessage as ApiChatMessage } from "@/services/api";

interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  isUser?: boolean;
  isAdmin?: boolean;
  replyTo?: string;
}

interface LiveChatProps {
  isEnabled: boolean;
  pinnedMessage: string;
  webinarDuration: number;
  isFullscreen?: boolean;
  onToggleFullscreenChat?: () => void;
  onWebinarEnd?: () => void;
}

const LiveChat = ({ isEnabled, pinnedMessage, webinarDuration, isFullscreen = false, onToggleFullscreenChat, onWebinarEnd }: LiveChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryRestored, setIsHistoryRestored] = useState(false);
  const [onlinePeople, setOnlinePeople] = useState(1247);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [userMessages, setUserMessages] = useState<Message[]>([]);
  const userMessageCount = userMessages.length;

  // Generate random online people count
  const generateOnlinePeople = () => {
    const baseNumber = 1200;
    const randomVariation = Math.floor(Math.random() * 200) - 100; // -100 to +100
    return Math.max(baseNumber + randomVariation, 1100); // Minimum 1100
  };

  // Update online people count periodically
  useEffect(() => {
    const updateOnlinePeople = () => {
      setOnlinePeople(generateOnlinePeople());
    };

    // Update every 20-40 seconds randomly
    const interval = setInterval(() => {
      updateOnlinePeople();
    }, Math.random() * 20000 + 20000); // 20-40 seconds

    return () => clearInterval(interval);
  }, []);

  // Format number with Persian digits
  const formatNumber = (num: number) => {
    return num.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
  };

  // پیام‌های کاربران و پاسخ‌های متناسب ادمین
  const userMessagesWithReplies = [
    {
      user: { username: "امیر", message: "روش شما تضمین شده؟ 🎯", isAdmin: false },
      adminReply: { username: "متخصص_هوش_مصنوعی", message: "بله امیر! بیش از ۱۲,۰۰۰ نفر نتایج عملی داشتن. نمونه‌های موفقیت رو دیدی؟ 📈", isAdmin: true }
    },
    {
      user: { username: "سارا", message: "۱۲۰۰$ این ماه! 🔥 فوق‌العاده", isAdmin: false },
      adminReply: { username: "متخصص_هوش_مصنوعی", message: "عالی سارا! 🚀 با تکنیک‌های پیشرفته تا ۵۰۰۰$ قابل دسترسه", isAdmin: true }
    },
    {
      user: { username: "علی", message: "صفر تجربه دارم. ممکنه؟", isAdmin: false },
      adminReply: { username: "متخصص_هوش_مصنوعی", message: "مخصوص مبتدیان طراحی شده! راهنمای گام به گام داری ✅", isAdmin: true }
    },
    {
      user: { username: "نرگس", message: "دسترسی به دوره چطوره؟ 💎", isAdmin: false },
      adminReply: { username: "متخصص_هوش_مصنوعی", message: "لینک ویژه در انتها! محتوای برتر فقط برای شرکت‌کنندگان 🎁", isAdmin: true }
    },
    {
      user: { username: "رضا", message: "خیلی جذابه! ولی واقعی هست؟", isAdmin: false },
      adminReply: { username: "متخصص_هوش_مصنوعی", message: "۱۰۰٪ روش‌های تست شده. نتایج واقعی، نه تبلیغات! رویکرد مبتنی بر داده 📊", isAdmin: true }
    },
    {
      user: { username: "مینا", message: "از ۶ ماه پیش فعال هستم ✨", isAdmin: false },
      adminReply: { username: "متخصص_هوش_مصنوعی", message: "عالی! استراتژی‌های رشد امشب به اشتراک می‌گذاریم 🎯💰", isAdmin: true }
    },
    {
      user: { username: "حسام", message: "لینک ثبت‌نام کجاست؟ ⚡", isAdmin: false },
      adminReply: { username: "متخصص_هوش_مصنوعی", message: "پایان وبینار! بهترین پیشنهاد فقط برای بینندگان زنده 🎪", isAdmin: true }
    },
    {
      user: { username: "فریبا", message: "چقدر طول می‌کشه نتیجه بگیرم؟", isAdmin: false },
      adminReply: { username: "متخصص_هوش_مصنوعی", message: "درآمد اول: ۷-۱۰ روز! بعضی‌ها همون هفته اول 🚀", isAdmin: true }
    },
    {
      user: { username: "محسن", message: "بودجه کمی دارم. شدنیه؟", isAdmin: false },
      adminReply: { username: "متخصص_هوش_مصنوعی", message: "شروع با ۳۰-۵۰$! سرمایه‌گذاری کم، بازدهی بالا 💡", isAdmin: true }
    },
    {
      user: { username: "لیلا", message: "پشتیبانی طولانی مدت؟", isAdmin: false },
      adminReply: { username: "متخصص_هوش_مصنوعی", message: "تیم پشتیبانی ۲۴/۷! دسترسی به جامعه خصوصی هم داری 🤝", isAdmin: true }
    }
  ];

  // پیام‌های اضافی بدون ریپلای
  const additionalMessages = [
    { username: "آرش", message: "محتوای وبینار فوق‌العاده بود! 🔥", isAdmin: false },
    { username: "مریم", message: "آماده‌ام شروع کنم! انگیزه ۱۰۰٪ ✊", isAdmin: false },
    { username: "بهزاد", message: "بهترین سرمایه‌گذاری عمرم بود! بازدهی عالی 📈", isAdmin: false },
    { username: "الناز", message: "کیفیت آموزش عالی بود ⭐ حرفه‌ای", isAdmin: false },
    { username: "کامیار", message: "جلسه واقعاً تاثیرگذار بود! ممنون 🙏", isAdmin: false },
    { username: "نگین", message: "از فردا شروع می‌کنم!", isAdmin: false },
    { username: "سینا", message: "چطور می‌تونم با شما ارتباط بگیرم؟ 📱", isAdmin: false },
    { username: "پانیذ", message: "۶ ماهه شرکت کردم، نتایج عالی گرفتم 💪", isAdmin: false },
    { username: "یاسر", message: "پشتیبانی خیلی خوب بود، ممنون از تیم شما", isAdmin: false },
    { username: "ندا", message: "سوالاتم کامل جواب داده شد، عالی بود", isAdmin: false },
    { username: "شهاب", message: "منتظر وبینار بعدی هستم!", isAdmin: false },
    { username: "سمیرا", message: "خیلی کاربردی و مفید بود، ممنون", isAdmin: false },
    { username: "مهسا", message: "همه چیز واضح و شفاف توضیح داده شد", isAdmin: false },
    { username: "فرهاد", message: "از این به بعد با انگیزه ادامه می‌دم!", isAdmin: false },
  ];

  // Normal Persian names for fake users
  const persianNames = [
    "علی", "زهرا", "محمد", "فاطمه", "حسین", "مریم", "رضا", "سارا", "امیر", "نگین",
    "مهدی", "سمیرا", "سینا", "مهسا", "آرمان", "نرگس", "پریسا", "کامران", "الهام", "سعید",
    "نیلوفر", "شایان", "فرزانه", "پویان", "شادی", "یاسر", "ندا", "آیدا", "شهاب", "فرهاد"
  ];

  // تشخیص اسکرول دستی کاربر
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
      setIsUserScrolling(!isAtBottom);
    }
  };

  const scrollToBottom = (force = false) => {
    const container = messagesContainerRef.current;
    if (container && (!isUserScrolling || force)) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    if (!isUserScrolling) {
      scrollToBottom();
    }
  }, [messages]);

  // Generate a base set of fake messages with normal Persian names
  function generateBaseMessages(count = 10): Message[] {
    const baseMessages: Message[] = [];
    for (let i = 0; i < count; i++) {
      const name = persianNames[Math.floor(Math.random() * persianNames.length)];
      baseMessages.push({
        id: `base-${i}-${Date.now()}`,
        username: name,
        message: additionalMessages[Math.floor(Math.random() * additionalMessages.length)].message,
        timestamp: new Date(Date.now() - (count - i) * 60000), // spread out in the past
        isAdmin: false,
      });
    }
    return baseMessages;
  }

  // Helper to get current user name from localStorage
  function getCurrentUserName() {
    try {
      const reg = JSON.parse(localStorage.getItem('registrationData') || '{}');
      if (reg.firstName && reg.lastName) return reg.firstName + ' ' + reg.lastName;
      if (reg.firstName) return reg.firstName;
      return 'کاربر';
    } catch {
      return 'کاربر';
    }
  }

  // Fetch and combine messages
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let cancelled = false;
    async function fetchAndCombine() {
      let realMessages: Message[] = [];
      try {
        const response = await apiService.getChatMessages();
        realMessages = response.messages?.map((msg: any) => ({
          id: (msg.Timestamp || Date.now()) + Math.random().toString(),
          username: msg.Username || msg.username || 'کاربر',
          message: msg.Message || msg.message || '',
          timestamp: msg.Timestamp ? new Date(msg.Timestamp) : new Date(),
          isAdmin: msg.IsAdmin || msg.is_admin || false,
        })) || [];
      } catch (e) {}
      let all: Message[];
      if (isEnabled) {
        const baseMessages = generateBaseMessages(10);
        all = [...baseMessages, ...realMessages, ...userMessages];
      } else {
        all = [...realMessages, ...userMessages];
      }
      all.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      if (!cancelled) setMessages(all);
    }
    fetchAndCombine();
    interval = setInterval(fetchAndCombine, 3000);
    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
  }, [isEnabled, userMessages]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const username = getCurrentUserName();
    const msgObj: Message = {
      id: 'user-' + Date.now(),
      username,
      message: newMessage,
      timestamp: new Date(),
      isUser: true,
    };
    setUserMessages(prev => [...prev, msgObj]);
    setNewMessage("");
    try {
      await apiService.postChatMessage({ username, message: newMessage });
    } catch (e) {
      // ignore error, already added locally
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // کلاس‌های کانتینر بر اساس حالت فول‌اسکرین
  const containerClasses = isFullscreen 
    ? "w-full h-full bg-black/20 backdrop-blur-md border-0 rounded-none"
    : "bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl md:rounded-3xl shadow-2xl h-[600px]";

  // Save chat messages to localStorage
  const saveChatHistory = (messages: Message[]) => {
    try {
      const chatHistory = {
        messages: messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString()
        })),
        savedAt: Date.now()
      };
      localStorage.setItem('webinar_chat_history', JSON.stringify(chatHistory));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  };

  // Load chat messages from localStorage
  const loadChatHistory = (): Message[] => {
    try {
      const savedHistory = localStorage.getItem('webinar_chat_history');
      if (savedHistory) {
        const chatHistory = JSON.parse(savedHistory);
        const savedAt = chatHistory.savedAt;
        const currentTime = Date.now();
        const elapsedTime = (currentTime - savedAt) / 1000; // Convert to seconds
        
        // Convert saved messages back to Message objects
        const restoredMessages: Message[] = chatHistory.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        
        console.log('Restoring chat history:', {
          messageCount: restoredMessages.length,
          elapsedTime,
          savedAt: new Date(savedAt)
        });
        
        return restoredMessages;
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
    return [];
  };

  // Clear chat history (when webinar ends)
  const clearChatHistory = () => {
    try {
      localStorage.removeItem('webinar_chat_history');
      localStorage.removeItem('webinar_video_time');
      localStorage.removeItem('webinar_start_time');
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
  };

  return (
    <div className={`${containerClasses} flex flex-col overflow-hidden`}>
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-purple-600/15 to-cyan-600/15 backdrop-blur-md border-b border-gray-600/40 p-2.5 sm:p-3 md:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <MessageCircle className="text-white w-3 h-3 sm:w-3" size={12} />
            </div>
            <div>
              <h3 className="text-white font-bold text-xs sm:text-sm md:text-base tracking-wide">💬 چت زنده</h3>
              <div className="flex items-center gap-2 sm:gap-3 text-xs">
                <div className="flex items-center gap-1 sm:gap-1.5 text-green-400">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
                  <span className="font-medium text-xs">آنلاین</span>
                </div>
                <span className="text-gray-500">•</span>
                <div className="flex items-center gap-1 sm:gap-1.5 text-cyan-400">
                  <Users size={8} className="sm:w-2.5 sm:h-2.5" />
                  <span className="font-medium text-xs">{formatNumber(onlinePeople)}</span>
                </div>
                {isHistoryRestored && messages.length > 0 && (
                  <>
                    <span className="text-gray-500">•</span>
                    <div className="flex items-center gap-1 sm:gap-1.5 text-green-400">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-400 rounded-full"></div>
                      <span className="font-medium text-xs">تاریخچه بازیابی شد</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {isFullscreen && (
            <button
              onClick={onToggleFullscreenChat}
              className="text-white/60 hover:text-white transition-all duration-200 hover:bg-white/10 p-1 sm:p-1.5 rounded-lg"
            >
              <X size={14} className="sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Pinned Message */}
      {pinnedMessage && (
        <div className="bg-gradient-to-r from-yellow-500/15 to-orange-500/15 border-b border-yellow-500/40 p-2.5 sm:p-3 backdrop-blur-sm">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-1 sm:p-1.5 rounded-md sm:rounded-lg shadow-md">
              <Pin className="text-white w-3 h-3 sm:w-3" size={12} />
            </div>
            <div className="flex-1">
              <div className="text-yellow-300 text-xs font-bold mb-1 sm:mb-1.5 tracking-wide">📌 پیام مهم</div>
              <p className="text-yellow-200 text-xs leading-relaxed font-medium">{pinnedMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-2.5 sm:p-3 md:p-4 space-y-2 sm:space-y-3 scrollbar-thin scrollbar-thumb-purple-500/60 scrollbar-track-gray-800/20 hover:scrollbar-thumb-purple-500/80 transition-colors"
        onScroll={handleScroll}
      >
        {isLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-24 sm:h-32">
            <div className="text-gray-400 text-xs sm:text-sm">در حال بارگذاری پیام‌ها...</div>
          </div>
        ) : (
          [...messages.slice(-15)].reverse().map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} group`}
            >
              <div className={`max-w-[90%] sm:max-w-[85%] transition-all duration-300 group-hover:scale-[1.02] ${
                message.isUser 
                  ? 'bg-gradient-to-br from-purple-500/90 to-purple-600/90 backdrop-blur-sm rounded-xl sm:rounded-2xl rounded-br-md shadow-lg shadow-purple-500/20' 
                  : message.isAdmin
                  ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-xl sm:rounded-2xl rounded-bl-md shadow-lg shadow-cyan-500/10'
                  : 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-600/30 rounded-xl sm:rounded-2xl rounded-bl-md shadow-lg'
              } p-2.5 sm:p-3`}>
                {message.replyTo && (
                  <div className="text-xs text-cyan-300 mb-1.5 sm:mb-2 bg-cyan-500/20 backdrop-blur-sm rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 sm:py-1.5 border border-cyan-400/30">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <span className="text-cyan-400">↳</span>
                      <span className="text-gray-300 italic">"{message.replyTo}"</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 sm:gap-2.5 mb-1.5 sm:mb-2">
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                    message.isUser 
                      ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white' 
                      : message.isAdmin
                      ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-gray-900'
                      : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                  }`}>
                    {message.isAdmin ? '👑' : (message.username?.charAt(0) || '?')}
                  </div>
                  <span className={`font-semibold text-xs ${
                    message.isUser ? 'text-purple-100' : message.isAdmin ? 'text-cyan-200' : 'text-gray-200'
                  }`}>
                    {message.username}
                  </span>
                  {message.isAdmin && (
                    <span className="bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-200 text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-cyan-400/50 backdrop-blur-sm font-medium">ادمین</span>
                  )}
                </div>
                <p className="text-white text-xs leading-relaxed mb-1.5 sm:mb-2 font-medium">{message.message}</p>
                <span className="text-xs text-gray-400">
                  {isNaN(new Date(message.timestamp).getTime()) ? '-' :
                    new Date(message.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-2.5 sm:p-3 md:p-4 border-t border-gray-600/40 bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-md">
        <div className="flex gap-2 sm:gap-3 mb-1.5 sm:mb-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="پیام خود را بنویسید..."
            className="flex-1 bg-gray-700/60 backdrop-blur-sm text-white rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-gray-700/80 border border-gray-600/40 transition-all duration-200"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          >
            <Send size={12} className="sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400 font-medium">
            {userMessageCount} پیام ارسال شده
          </span>
          <div className="flex items-center gap-1 sm:gap-1.5 text-gray-400">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
            <span className="font-medium text-xs">آنلاین</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
