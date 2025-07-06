import React from 'react';
import { X } from 'lucide-react';

interface EndWebinarModalProps {
  onClose: () => void;
}

const EndWebinarModal: React.FC<EndWebinarModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 md:p-8 max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            وبینار به پایان رسید
          </h2>
          <p className="text-gray-300 mb-6">
            ممنون از حضور شما در این وبینار. حالا می‌تونید با استفاده از تکنیک‌های یادگرفته، مسیر درآمد دلاری خودتون رو شروع کنید.
          </p>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
          >
            شروع مسیر من
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndWebinarModal;
