import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('acf_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const heroAPI = {
  getSlides: () => api.get('/hero'),
  getAllSlides: () => api.get('/hero/all'),
  createSlide: (data) => api.post('/hero', data),
  updateSlide: (id, data) => api.put(`/hero/${id}`, data),
  deleteSlide: (id) => api.delete(`/hero/${id}`),
};

export const programsAPI = {
  getPrograms: () => api.get('/programs'),
  getAllPrograms: () => api.get('/programs/all'),
  createProgram: (data) => api.post('/programs', data),
  updateProgram: (id, data) => api.put(`/programs/${id}`, data),
  deleteProgram: (id) => api.delete(`/programs/${id}`),
};

export const galleryAPI = {
  getGallery: (params) => api.get('/gallery', { params }),
  getAllGallery: () => api.get('/gallery/all'),
  uploadImage: (data) => api.post('/gallery', data),
  updateImage: (id, data) => api.put(`/gallery/${id}`, data),
  deleteImage: (id) => api.delete(`/gallery/${id}`),
};

export const teamAPI = {
  getTeam: () => api.get('/team'),
  getAllTeam: () => api.get('/team/all'),
  createMember: (data) => api.post('/team', data),
  updateMember: (id, data) => api.put(`/team/${id}`, data),
  deleteMember: (id) => api.delete(`/team/${id}`),
};

export const newsAPI = {
  getNews: (params) => api.get('/news', { params }),
  getAllNews: () => api.get('/news/all'),
  getNewsById: (id) => api.get(`/news/${id}`),
  createNews: (data) => api.post('/news', data),
  updateNews: (id, data) => api.put(`/news/${id}`, data),
  deleteNews: (id) => api.delete(`/news/${id}`),
};

export const contactAPI = {
  submit: (data) => api.post('/contacts', data),
  getContacts: (params) => api.get('/contacts', { params }),
  updateStatus: (id, data) => api.put(`/contacts/${id}`, data),
  deleteContact: (id) => api.delete(`/contacts/${id}`),
};

export const donationAPI = {
  create: (data) => api.post('/donations', data),
  verify: (ref) => api.get(`/donations/verify/${ref}`),
  getDonations: (params) => api.get('/donations', { params }),
};

export const statsAPI = {
  getPublic: () => api.get('/stats/public'),
  getDashboard: () => api.get('/stats/dashboard'),
};

export const settingsAPI = {
  getPublic: () => api.get('/settings'),
  getAll: () => api.get('/settings/all'),
  update: (data) => api.put('/settings', data),
};

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export default api;
