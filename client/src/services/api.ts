const API_BASE_URL = 'http://localhost:3001';

const getAuthToken = () => localStorage.getItem('authToken');

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const config: RequestInit = {
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

// User Profile API
export const userAPI = {
  getProfile: () => apiRequest('/user/profile'),
  updateProfile: (data: { displayName?: string; phone?: string }) =>
    apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Addresses API
export const addressAPI = {
  getAddresses: () => apiRequest('/user/addresses'),
  addAddress: (address: any) =>
    apiRequest('/user/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    }),
  updateAddress: (addressId: string, address: any) =>
    apiRequest(`/user/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(address),
    }),
  deleteAddress: (addressId: string) =>
    apiRequest(`/user/addresses/${addressId}`, {
      method: 'DELETE',
    }),
};

// Payment Methods API
export const paymentAPI = {
  getPaymentMethods: () => apiRequest('/user/payment-methods'),
  addPaymentMethod: (paymentMethod: any) =>
    apiRequest('/user/payment-methods', {
      method: 'POST',
      body: JSON.stringify(paymentMethod),
    }),
  deletePaymentMethod: (paymentId: string) =>
    apiRequest(`/user/payment-methods/${paymentId}`, {
      method: 'DELETE',
    }),
};

// Notifications API
export const notificationAPI = {
  getSettings: () => apiRequest('/user/notifications'),
  updateSettings: (settings: any) =>
    apiRequest('/user/notifications', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
};

// Orders API
export const orderAPI = {
  getOrders: () => apiRequest('/user/orders'),
  getOrder: (orderId: string) => apiRequest(`/user/orders/${orderId}`),
  createOrder: (orderData: any) =>
    apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
};