// --- Global Config ---
const API_URL = 'http://localhost:3000/api';

// --- Lib: api.js ---
export const api = {
  request: async (method, endpoint, body = null, token) => {
    const url = `${API_URL}${endpoint}`;
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const config = { method, headers };
    if (body) {
      config.body = JSON.stringify(body);
    }
    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData.msg);
        throw new Error(errorData.msg || 'Something went wrong');
      }
      if (response.status === 204) {
        return null;
      }
      return response.json();
    } catch (err) {
      console.error('API Error:', err);
      throw err;
    }
  },
};
