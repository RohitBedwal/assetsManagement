// src/utils/api.js
const API_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Get authentication headers for API requests
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Make authenticated API request
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle authentication errors
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
      throw new Error('Authentication expired');
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return { data, response };
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * Fetch user's RMA requests
 */
export const fetchMyRMARequests = async () => {
  try {
    const { data } = await apiRequest('/api/rma/my-requests');
    return data.requests || data.data || [];
  } catch (error) {
    throw new Error(`Failed to fetch RMA requests: ${error.message}`);
  }
};

/**
 * Fetch all RMA requests (Admin only)
 */
export const fetchAllRMARequests = async () => {
  try {
    const { data } = await apiRequest('/api/rma/admin/all');
    return data.requests || data.data || [];
  } catch (error) {
    throw new Error(`Failed to fetch all RMA requests: ${error.message}`);
  }
};

/**
 * Update RMA status (Admin only)
 */
export const updateRMAStatus = async (rmaId, status, adminNotes = '') => {
  try {
    const { data } = await apiRequest(`/api/rma/admin/update/${rmaId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, adminNotes }),
    });
    return data;
  } catch (error) {
    throw new Error(`Failed to update RMA status: ${error.message}`);
  }
};

/**
 * Submit new RMA request
 */
export const submitRMARequest = async (rmaData) => {
  try {
    const { data } = await apiRequest('/api/rma/submit', {
      method: 'POST',
      body: JSON.stringify(rmaData),
    });
    return data;
  } catch (error) {
    throw new Error(`Failed to submit RMA request: ${error.message}`);
  }
};