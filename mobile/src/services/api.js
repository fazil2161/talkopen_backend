import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/config';

// Set base URL
axios.defaults.baseURL = API_URL;

// Add token to requests
axios.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// User APIs
export const userAPI = {
  getProfile: (userId) => axios.get(`/users/${userId}`),
  updateProfile: (data) => axios.put('/users/profile', data),
  updateSettings: (data) => axios.put('/users/settings', data),
  getOnlineUsers: (filter) => axios.get(`/users/online?gender=${filter}`),
  blockUser: (userId) => axios.post(`/users/block/${userId}`),
  reportUser: (userId, reason) => axios.post(`/users/report/${userId}`, { reason })
};

// Payment APIs
export const paymentAPI = {
  createOrder: () => axios.post('/payment/create-order'),
  verifyPayment: (data) => axios.post('/payment/verify', data),
  getHistory: () => axios.get('/payment/history'),
  checkPremiumStatus: () => axios.get('/payment/premium-status')
};

// Follow APIs
export const followAPI = {
  followUser: (userId, metDuration) => axios.post(`/follows/${userId}`, { metDuration }),
  unfollowUser: (userId) => axios.delete(`/follows/${userId}`),
  getFollowers: () => axios.get('/follows/followers'),
  getFollowing: () => axios.get('/follows/following'),
  canChat: (userId) => axios.get(`/follows/can-chat/${userId}`)
};

// Message APIs
export const messageAPI = {
  sendMessage: (userId, content, messageType = 'text') => 
    axios.post(`/messages/${userId}`, { content, messageType }),
  getConversation: (userId) => axios.get(`/messages/conversation/${userId}`),
  getAllConversations: () => axios.get('/messages/conversations'),
  getUnreadCount: () => axios.get('/messages/unread-count'),
  deleteMessage: (messageId) => axios.delete(`/messages/${messageId}`)
};

// Streak APIs
export const streakAPI = {
  getStreak: () => axios.get('/streaks'),
  updateStreak: (callDuration) => axios.post('/streaks/update', { callDuration }),
  getLeaderboard: (limit = 50) => axios.get(`/streaks/leaderboard?limit=${limit}`),
  getWeeklyStats: () => axios.get('/streaks/weekly')
};

// Feed APIs
export const feedAPI = {
  getFeed: (page = 1, limit = 20) => axios.get(`/feed?page=${page}&limit=${limit}`),
  getMyActivities: (page = 1, limit = 20) => 
    axios.get(`/feed/my-activities?page=${page}&limit=${limit}`),
  createActivity: (data) => axios.post('/feed', data),
  deleteActivity: (activityId) => axios.delete(`/feed/${activityId}`)
};

export default {
  userAPI,
  paymentAPI,
  followAPI,
  messageAPI,
  streakAPI,
  feedAPI
};

