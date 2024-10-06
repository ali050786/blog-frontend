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

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = (data && data.error) || response.statusText;
    return Promise.reject(error);
  }
  return data;
};

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

const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const errorMessage = error.response.data.error || 'An unknown error occurred';
    const errorDetails = error.response.data.details || '';
    throw new Error(`${errorMessage}${errorDetails ? ': ' + errorDetails : ''}`);
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error('No response received from server');
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error('Error setting up the request');
  }
};

export const articlesApi = {
  getAll: async (page = 1, perPage = 10, category, author, tag) => {
    try {
      const response = await api.get('/articles', {
        params: { page, per_page: perPage, category, author, tag }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  getBySlug: async (slug) => {
    try {
      const response = await api.get(`/articles/slug/${slug}`);
      console.log(response.data)
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/articles/id/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  create: async (data) => {
    if (!data.title || !data.content || !data.category_id || !data.tag_ids) {
      throw new Error('Missing required fields for article creation');
    }
    try {
      const response = await api.post('/articles', data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.put(`/articles/${id}`, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/articles/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export const tagsApi = {
  getAll: async () => {
    try {
      const response = await api.get('/tags');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  create: async (data) => {
    try {
      const response = await api.post('/tags', data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.put(`/tags/${id}`, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  delete: async (id) => {
    try {
      await api.delete(`/tags/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  }
};

export const categoriesApi = {
  getAll: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  create: async (data) => {
    try {
      const response = await api.post('/categories', data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.put(`/categories/${id}`, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  delete: async (id) => {
    try {
      await api.delete(`/categories/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  }
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
      handleApiError(error);
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      handleApiError(error);
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
      handleApiError(error);
    }
  },

  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default api;