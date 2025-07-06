// Webinar localStorage utility functions

export interface WebinarStorage {
  videoTime: number;
  startTime: number;
  chatHistory: any[];
  savedAt: number;
}

// Save video time to localStorage
export const saveVideoTime = (time: number): void => {
  try {
    localStorage.setItem('webinar_video_time', time.toString());
    localStorage.setItem('webinar_start_time', Date.now().toString());
  } catch (error) {
    console.error('Failed to save video time:', error);
  }
};

// Load video time from localStorage
export const loadVideoTime = (): number => {
  try {
    const savedTimeStr = localStorage.getItem('webinar_video_time');
    const startTimeStr = localStorage.getItem('webinar_start_time');
    
    if (savedTimeStr && startTimeStr) {
      const savedTime = parseFloat(savedTimeStr);
      const startTime = parseInt(startTimeStr);
      const currentTime = Date.now();
      const elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds
      
      // Calculate the current video time based on elapsed real time
      const currentVideoTime = savedTime + elapsedTime;
      
      console.log('Restoring video time:', {
        savedTime,
        elapsedTime,
        currentVideoTime
      });
      
      return Math.max(0, currentVideoTime);
    }
  } catch (error) {
    console.error('Failed to load video time:', error);
  }
  return 0;
};

// Save chat history to localStorage
export const saveChatHistory = (messages: any[]): void => {
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

// Load chat history from localStorage
export const loadChatHistory = (): any[] => {
  try {
    const savedHistory = localStorage.getItem('webinar_chat_history');
    if (savedHistory) {
      const chatHistory = JSON.parse(savedHistory);
      const savedAt = chatHistory.savedAt;
      const currentTime = Date.now();
      const elapsedTime = (currentTime - savedAt) / 1000; // Convert to seconds
      
      // Convert saved messages back to Message objects
      const restoredMessages = chatHistory.messages.map((msg: any) => ({
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

// Clear all webinar data from localStorage
export const clearWebinarData = (): void => {
  try {
    localStorage.removeItem('webinar_chat_history');
    localStorage.removeItem('webinar_video_time');
    localStorage.removeItem('webinar_start_time');
    console.log('Cleared webinar localStorage data');
  } catch (error) {
    console.error('Failed to clear webinar data:', error);
  }
};

// Check if webinar data exists in localStorage
export const hasWebinarData = (): boolean => {
  try {
    return !!(localStorage.getItem('webinar_video_time') && localStorage.getItem('webinar_start_time'));
  } catch (error) {
    console.error('Failed to check webinar data:', error);
    return false;
  }
}; 