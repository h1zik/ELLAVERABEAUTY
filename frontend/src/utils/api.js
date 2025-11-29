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
};
