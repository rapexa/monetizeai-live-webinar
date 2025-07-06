
import { useState } from "react";
import { X } from "lucide-react";

interface AdminPanelProps {
  isChatEnabled: boolean;
  setIsChatEnabled: (enabled: boolean) => void;
  pinnedMessage: string;
  setPinnedMessage: (message: string) => void;
  onClose: () => void;
}

const AdminPanel = ({ 
  isChatEnabled, 
  setIsChatEnabled, 
  pinnedMessage, 
  setPinnedMessage, 
  onClose 
}: AdminPanelProps) => {
  const [tempPinnedMessage, setTempPinnedMessage] = useState(pinnedMessage);

  const handleUpdatePinnedMessage = () => {
    setPinnedMessage(tempPinnedMessage);
  };

  const handleClearPinnedMessage = () => {
    setPinnedMessage("");
    setTempPinnedMessage("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl border border-purple-500/30 p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">پنل مدیریت</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Chat Controls */}
        <div className="space-y-6">
          <div>
            <label className="block text-white font-semibold mb-3">وضعیت چت</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsChatEnabled(true)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isChatEnabled 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                فعال
              </button>
              <button
                onClick={() => setIsChatEnabled(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !isChatEnabled 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                غیرفعال
              </button>
            </div>
          </div>

          <div>
            <label className="block text-white font-semibold mb-3">پیام پین‌شده</label>
            <textarea
              value={tempPinnedMessage}
              onChange={(e) => setTempPinnedMessage(e.target.value)}
              placeholder="پیام مهم برای نمایش در بالای چت..."
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows={3}
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleUpdatePinnedMessage}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
              >
                به‌روزرسانی
              </button>
              <button
                onClick={handleClearPinnedMessage}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
              >
                پاک کردن
              </button>
            </div>
          </div>

          <div>
            <label className="block text-white font-semibold mb-3">پیام‌های آماده</label>
            <div className="space-y-2">
              <button
                onClick={() => setTempPinnedMessage("🎯 لینک ثبت‌نام: MonetizeAI.com/register")}
                className="w-full text-left bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                لینک ثبت‌نام
              </button>
              <button
                onClick={() => setTempPinnedMessage("⚠️ تنها ۱۰ دقیقه برای پایان وبینار باقی مانده!")}
                className="w-full text-left bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                هشدار پایان
              </button>
              <button
                onClick={() => setTempPinnedMessage("🔥 تخفیف ویژه فقط برای شرکت‌کنندگان وبینار!")}
                className="w-full text-left bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                تخفیف ویژه
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
