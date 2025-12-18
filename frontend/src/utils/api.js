import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Categories
  getCategories: () => axios.get(`${API}/categories`),
  createCategory: (data) => axios.post(`${API}/categories`, data, { headers: getAuthHeaders() }),
  deleteCategory: (id) => axios.delete(`${API}/categories/${id}`, { headers: getAuthHeaders() }),

  // Products
  getProducts: (params) => axios.get(`${API}/products`, { params }),
  getProduct: (id) => axios.get(`${API}/products/${id}`),
  createProduct: (data) => axios.post(`${API}/products`, data, { headers: getAuthHeaders() }),
  updateProduct: (id, data) => axios.put(`${API}/products/${id}`, data, { headers: getAuthHeaders() }),
  deleteProduct: (id) => axios.delete(`${API}/products/${id}`, { headers: getAuthHeaders() }),
  addProductImage: (id, imageUrl) => {
    const formData = new FormData();
    formData.append('image_url', imageUrl);
    return axios.post(`${API}/products/${id}/images`, formData, { headers: getAuthHeaders() });
  },
  addProductDocument: (id, name, url, docType) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('url', url);
    formData.append('doc_type', docType);
    return axios.post(`${API}/products/${id}/documents`, formData, { headers: getAuthHeaders() });
  },
  deleteProductDocument: (productId, docId) => {
    return axios.delete(`${API}/products/${productId}/documents/${docId}`, { headers: getAuthHeaders() });
  },
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API}/upload-file`, formData, { 
      headers: { 
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      } 
    });
  },
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API}/upload-image`, formData, { 
      headers: { 
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      } 
    });
  },

  // Articles
  getArticles: (params) => axios.get(`${API}/articles`, { params }),
  getArticle: (id) => axios.get(`${API}/articles/${id}`),
  createArticle: (data) => axios.post(`${API}/articles`, data, { headers: getAuthHeaders() }),
  updateArticle: (id, data) => axios.put(`${API}/articles/${id}`, data, { headers: getAuthHeaders() }),
  deleteArticle: (id) => axios.delete(`${API}/articles/${id}`, { headers: getAuthHeaders() }),

  // Clients
  getClients: () => axios.get(`${API}/clients`),
  createClient: (data) => axios.post(`${API}/clients`, data, { headers: getAuthHeaders() }),
  deleteClient: (id) => axios.delete(`${API}/clients/${id}`, { headers: getAuthHeaders() }),

  // Reviews
  getReviews: () => axios.get(`${API}/reviews`),
  createReview: (data) => axios.post(`${API}/reviews`, data, { headers: getAuthHeaders() }),
  updateReview: (id, data) => axios.put(`${API}/reviews/${id}`, data, { headers: getAuthHeaders() }),
  deleteReview: (id) => axios.delete(`${API}/reviews/${id}`, { headers: getAuthHeaders() }),

  // Services
  getServices: (params) => axios.get(`${API}/services`, { params }),
  getService: (id) => axios.get(`${API}/services/${id}`),
  createService: (data) => axios.post(`${API}/services`, data, { headers: getAuthHeaders() }),
  updateService: (id, data) => axios.put(`${API}/services/${id}`, data, { headers: getAuthHeaders() }),
  deleteService: (id) => axios.delete(`${API}/services/${id}`, { headers: getAuthHeaders() }),

  // Gallery
  getGallery: (params) => axios.get(`${API}/gallery`, { params }),
  getGalleryCategories: () => axios.get(`${API}/gallery/categories`),
  getGalleryItem: (id) => axios.get(`${API}/gallery/${id}`),
  createGalleryItem: (data) => axios.post(`${API}/gallery`, data, { headers: getAuthHeaders() }),
  updateGalleryItem: (id, data) => axios.put(`${API}/gallery/${id}`, data, { headers: getAuthHeaders() }),
  deleteGalleryItem: (id) => axios.delete(`${API}/gallery/${id}`, { headers: getAuthHeaders() }),

  // Categories
  getCategories: (params) => axios.get(`${API}/categories`, { params }),
  getCategory: (id) => axios.get(`${API}/categories/${id}`),
  createCategory: (data) => axios.post(`${API}/categories`, data, { headers: getAuthHeaders() }),
  updateCategory: (id, data) => axios.put(`${API}/categories/${id}`, data, { headers: getAuthHeaders() }),
  deleteCategory: (id) => axios.delete(`${API}/categories/${id}`, { headers: getAuthHeaders() }),

  // Contact
  submitContact: (data) => axios.post(`${API}/contact`, data),
  getContactLeads: () => axios.get(`${API}/contact/leads`, { headers: getAuthHeaders() }),

  // Page Sections
  getPageSections: (pageName) => axios.get(`${API}/pages/${pageName}/sections`),
  createPageSection: (data) => axios.post(`${API}/pages/sections`, data, { headers: getAuthHeaders() }),
  updatePageSection: (id, data) => axios.put(`${API}/pages/sections/${id}`, data, { headers: getAuthHeaders() }),
  deletePageSection: (id) => axios.delete(`${API}/pages/sections/${id}`, { headers: getAuthHeaders() }),

  // AI
  generateContent: (prompt, contentType) => axios.post(`${API}/ai/generate-content`, { prompt, content_type: contentType }, { headers: getAuthHeaders() }),
  generateImage: (prompt) => axios.post(`${API}/ai/generate-image`, { prompt }, { headers: getAuthHeaders() }),

  // Theme
  getTheme: () => axios.get(`${API}/theme`),
  updateTheme: (data) => axios.put(`${API}/theme`, data, { headers: getAuthHeaders() }),

  // Site Settings
  getSettings: () => axios.get(`${API}/settings`),
  updateSettings: (data) => axios.put(`${API}/settings`, data, { headers: getAuthHeaders() }),

  // Backup
  getBackupStats: () => axios.get(`${API}/admin/backup/stats`, { headers: getAuthHeaders() }),
  downloadBackup: (format, includeMedia = false) => axios.get(`${API}/admin/backup`, { 
    params: { format, include_media: includeMedia },
    headers: getAuthHeaders(),
    responseType: 'arraybuffer'
  }),
};
