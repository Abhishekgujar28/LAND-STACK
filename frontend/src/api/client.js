/**
 * Land Stack Centralized API Client
 * Connects frontend to Node.js / Express backend
 * Strictly Database-Only (Cookie-based HttpOnly Supabase JWT session + Bearer token fallback)
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.token = null;
    try {
      this.token = sessionStorage.getItem('ls_access_token');
    } catch {
      // ignore storage error
    }
  }

  setToken(token) {
    this.token = token;
    try {
      if (token) {
        sessionStorage.setItem('ls_access_token', token);
      } else {
        sessionStorage.removeItem('ls_access_token');
      }
    } catch {
      // ignore
    }
  }

  getToken() {
    return this.token;
  }

  async request(endpoint, options = {}) {
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const url = `${this.baseUrl}/${cleanEndpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      credentials: 'include', // Ensure HttpOnly cookies are automatically sent with all requests
      ...options,
      headers,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // If probing session on mount (/auth/me) and unauthenticated, return null silently
        if (response.status === 401 && cleanEndpoint === 'auth/me') {
          return null;
        }

        const errMsg = data?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        const err = new Error(errMsg);
        err.status = response.status;
        err.code = data?.error?.code;
        throw err;
      }

      return data?.data !== undefined ? data.data : data;
    } catch (error) {
      if (!(error.status === 401 && cleanEndpoint === 'auth/me')) {
        console.error(`[API Client Error] ${options.method || 'GET'} ${url}:`, error.message);
      }
      throw error;
    }
  }

  get(endpoint, params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString();
    const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(fullEndpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  }

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  }

  patch(endpoint, body) {
    return this.request(endpoint, { method: 'PATCH', body });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(BASE_URL);
export default apiClient;
