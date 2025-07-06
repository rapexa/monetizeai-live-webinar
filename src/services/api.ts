import { config } from '@/config/environment';

const API_BASE_URL = config.API_BASE_URL;

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  registered_at: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  phone: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface WebinarInfo {
  title: string;
  start_time: string;
  end_time: string;
  video_url: string;
  capacity: number;
  registered_count: number;
  is_live: boolean;
}

export interface ChatMessage {
  Username: string;
  Message: string;
  Timestamp: string;
  IsAdmin: boolean;
}

export interface ChatRequest {
  username: string;
  message: string;
}

export interface ChatResponse {
  messages: ChatMessage[];
}

export interface PostChatResponse {
  message: ChatMessage;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // User registration
  async registerUser(data: RegisterRequest): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Get webinar information
  async getWebinarInfo(): Promise<WebinarInfo> {
    return this.request<WebinarInfo>('/webinar');
  }

  // Get chat messages
  async getChatMessages(): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat');
  }

  // Post a chat message
  async postChatMessage(data: ChatRequest): Promise<PostChatResponse> {
    return this.request<PostChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService(); 