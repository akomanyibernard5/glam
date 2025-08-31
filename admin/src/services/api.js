const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-glam.onrender.com';

const getAuthToken = () => localStorage.getItem('adminAuth');

const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
};

// Admin API endpoints
export const adminAPI = {
  // Dashboard stats
  getStats: () => apiRequest('/admin/stats'),
  
  // Products management
  getProducts: () => apiRequest('/admin/products'),
  createProduct: (productData) =>
    apiRequest('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),
  updateProduct: (productId, productData) =>
    apiRequest(`/admin/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),
  deleteProduct: (productId) =>
    apiRequest(`/admin/products/${productId}`, {
      method: 'DELETE',
    }),
  
  // Orders management
  getOrders: () => apiRequest('/admin/orders'),
  updateOrderStatus: (orderId, status) =>
    apiRequest(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  
  // Customers management
  getCustomers: () => apiRequest('/admin/customers'),
  
  // Analytics
  getAnalytics: (period = '30d') => apiRequest(`/admin/analytics?period=${period}`),
};

export default adminAPI;