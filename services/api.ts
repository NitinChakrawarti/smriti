import axios from 'axios';
import { Link, ApiResponse, Stats } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  // Check if phone has Telegram linked
  checkTelegram: async (phoneNumber: string) => {
    const response = await api.post('/auth/check-telegram', { phoneNumber });
    return response.data;
  },

  // Request OTP
  requestOTP: async (phoneNumber: string, telegramId?: string) => {
    const response = await api.post('/auth/request-otp', { phoneNumber, telegramId });
    return response.data;
  },

  // Verify OTP and login/register
  verifyOTP: async (phoneNumber: string, otp: string, name?: string) => {
    const response = await api.post('/auth/verify-otp', { phoneNumber, otp, name });
    return response.data.data;
  },

  // Link Telegram account
  linkTelegram: async (phoneNumber: string, telegramId: string, telegramUsername?: string) => {
    const response = await api.post('/auth/link-telegram', { phoneNumber, telegramId, telegramUsername });
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  // Update current user's profile (e.g. email for reminders)
  updateMe: async (payload: { email?: string; name?: string }) => {
    const response = await api.patch('/auth/me', payload);
    return response.data.data;
  },

  // Legacy methods (kept for backward compatibility)
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data.data;
  },
};

export const linkApi = {
  // Add a new link
  addLink: async (url: string, source: 'telegram' | 'web' | 'pwa-share' = 'web'): Promise<Link> => {
    const response = await api.post<ApiResponse<Link>>('/links', { url, source });
    return response.data.data!;
  },

  // Save pasted text
  addText: async (text: string, source: 'web' = 'web'): Promise<Link> => {
    const response = await api.post<ApiResponse<Link>>('/links', { text, source });
    return response.data.data!;
  },

  // Upload a file (pdf/image) via multipart/form-data
  addFile: async (file: File, source: 'web' = 'web'): Promise<Link> => {
    const form = new FormData();
    form.append('file', file);
    form.append('source', source);
    const response = await api.post<ApiResponse<Link>>('/links', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data!;
  },

  // Get all links with filters
  getLinks: async (params?: {
    category?: string;
    tags?: string;
    readStatus?: boolean;
    search?: string;
    sortBy?: string;
    order?: string;
    page?: number;
    limit?: number;
  }): Promise<{ links: Link[]; pagination: any }> => {
    const response = await api.get<ApiResponse<Link[]>>('/links', { params });
    return {
      links: response.data.data || [],
      pagination: response.data.pagination,
    };
  },

  // Get single link
  getLink: async (id: string): Promise<Link> => {
    const response = await api.get<ApiResponse<Link>>(`/links/${id}`);
    return response.data.data!;
  },

  // Toggle read status
  toggleReadStatus: async (id: string, readStatus: boolean): Promise<Link> => {
    const response = await api.patch<ApiResponse<Link>>(`/links/${id}/read`, { readStatus });
    return response.data.data!;
  },

  // Delete link
  deleteLink: async (id: string): Promise<void> => {
    await api.delete(`/links/${id}`);
  },

  // Set a reminder (days from now)
  setReminder: async (id: string, days: number): Promise<Link> => {
    const response = await api.patch<ApiResponse<Link>>(`/links/${id}/reminder`, { days });
    return response.data.data!;
  },

  // Clear a reminder
  clearReminder: async (id: string): Promise<Link> => {
    const response = await api.delete<ApiResponse<Link>>(`/links/${id}/reminder`);
    return response.data.data!;
  },

  // Toggle keep (pin) flag
  setKeep: async (id: string, keep: boolean): Promise<Link> => {
    const response = await api.patch<ApiResponse<Link>>(`/links/${id}/keep`, { keep });
    return response.data.data!;
  },

  // Get statistics
  getStats: async (): Promise<Stats> => {
    const response = await api.get<ApiResponse<Stats>>('/links/stats');
    return response.data.data!;
  },
};

export default api;
