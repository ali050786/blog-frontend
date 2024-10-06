import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


// Request interceptor for adding the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error);
    if (error.response) {
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    return Promise.reject(error);
  }
);

export const articlesApi = {
  getAll: (page = 1, perPage = 10) => {
    console.log(`Fetching articles: page=${page}, perPage=${perPage}`);
    return api.get('/articles', {
      params: { page, per_page: perPage }
    });
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/articles/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching article:', error);
      throw error;
    }
  },
  create: (data) => {
    console.log('Creating article with data:', data);
    return api.post('/articles', data);
  },
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`),

  // Tag methods
  getTags: () => api.get('/tags'),
  createTag: (data) => api.post('/tags', data),
  updateTag: (id, data) => api.put(`/tags/${id}`, data),
  deleteTag: (id) => api.delete(`/tags/${id}`),

  // Category methods
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export const commentsApi = {
  getByArticle: (articleId) => api.get(`/articles/${articleId}/comments`),
  create: (articleId, data) => api.post(`/articles/${articleId}/comments`, data),
  update: (id, data) => api.put(`/comments/${id}`, data),
  delete: (id) => api.delete(`/comments/${id}`),
};


export const userApi = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data) {
        const { access_token, user_role, user_id } = response.data;
        localStorage.setItem('token', access_token);
        localStorage.setItem('userRole', user_role);
        localStorage.setItem('userId', user_id);
        return response.data;
      } else {
        throw new Error('Invalid login response structure');
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error.response ? error.response.data : error.message);
      throw error;
    }
  },
};




export default api;