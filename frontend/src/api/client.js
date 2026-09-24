/**
 * Land Stack Centralized API Client
 * Connects frontend to Node.js / Express backend
 * Strictly Database-Only (Cookie-based HttpOnly Supabase JWT session + Bearer token fallback)
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://land-stack.onrender.com/api/v1';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.accessToken = null;
    this.refreshToken = null;
    this.isRefreshing = false;
    this.refreshPromise = null;
    this.onSessionExpiredCallback = null;

    // Centralized In-Flight Promise Deduplication & TTL Data Cache
    this.inFlightRequests = new Map();
    this.dataCache = new Map();
    this.DEFAULT_TTL_MS = 30 * 1000; // 30 seconds

    try {
      this.accessToken = sessionStorage.getItem('ls_access_token');
      this.refreshToken = sessionStorage.getItem('ls_refresh_token');
    } catch {
      // ignore storage access errors
    }
  }

  clearCache() {
    this.dataCache.clear();
    this.inFlightRequests.clear();
  }

  setSession({ accessToken, refreshToken }) {
    this.accessToken = accessToken || null;
    this.refreshToken = refreshToken || null;
    try {
      if (accessToken) {
        sessionStorage.setItem('ls_access_token', accessToken);
      } else {
        sessionStorage.removeItem('ls_access_token');
      }

      if (refreshToken) {
        sessionStorage.setItem('ls_refresh_token', refreshToken);
      } else {
        sessionStorage.removeItem('ls_refresh_token');
      }
    } catch {
      // ignore storage error
    }
  }

  setToken(token) {
    this.setSession({ accessToken: token, refreshToken: this.refreshToken });
  }

  clearSession() {
    this.accessToken = null;
    this.refreshToken = null;
    this.isRefreshing = false;
    this.refreshPromise = null;
    this.clearCache();
    try {
      sessionStorage.removeItem('ls_access_token');
      sessionStorage.removeItem('ls_refresh_token');
    } catch {
      // ignore
    }
  }

  getToken() {
    return this.accessToken;
  }

  onSessionExpired(callback) {
    this.onSessionExpiredCallback = callback;
  }

  async _executeRefresh() {
    const refreshUrl = `${this.baseUrl}/auth/refresh`;
    const correlationId = `bb-ref-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    
    try {
      const response = await fetch(refreshUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-ID': correlationId,
        },
        credentials: 'include',
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      const text = await response.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        // non-json
      }

      if (!response.ok || !data) {
        throw new Error(data?.error?.message || `Refresh failed with HTTP ${response.status}`);
      }

      const newAccessToken = data?.data?.accessToken || data?.accessToken;
      const newRefreshToken = data?.data?.refreshToken || data?.refreshToken || this.refreshToken;

      if (newAccessToken) {
        this.setSession({ accessToken: newAccessToken, refreshToken: newRefreshToken });
      }

      return newAccessToken;
    } catch (err) {
      console.warn('[API Client] Session refresh failed:', err.message);
      this.clearSession();
      if (this.onSessionExpiredCallback) {
        this.onSessionExpiredCallback();
      }
      throw err;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  async request(endpoint, options = {}) {
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const url = `${this.baseUrl}/${cleanEndpoint}`;
    const method = (options.method || 'GET').toUpperCase();
    const isGet = method === 'GET';

    // 1. Data Cache Check (GET requests only)
    if (isGet && !options.bypassCache && !options._isRetry) {
      const cached = this.dataCache.get(url);
      if (cached && cached.expiresAt > Date.now()) {
        return cached.data;
      }

      // 2. In-Flight Promise Deduplication (GET requests only)
      if (this.inFlightRequests.has(url)) {
        return this.inFlightRequests.get(url);
      }
    }

    // 3. Dispatch new request
    const execute = async () => {
      const correlationId = options.correlationId || `bb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

      const headers = {
        'Content-Type': 'application/json',
        'X-Correlation-ID': correlationId,
        ...options.headers,
      };

      if (this.accessToken && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${this.accessToken}`;
      }

      const config = {
        credentials: 'include', // Automatically transmit HttpOnly cookies
        ...options,
        headers,
      };

      if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
      }

      try {
        const response = await fetch(url, config);
        const rawText = await response.text();
        let data = null;
        try {
          data = rawText ? JSON.parse(rawText) : null;
        } catch {
          data = rawText;
        }

        if (!response.ok) {
          // Special case: Initial mount probe to /auth/me returns null silently if unauthenticated
          if (response.status === 401 && cleanEndpoint === 'auth/me') {
            return null;
          }

          // Check if 401 should trigger token refresh & retry
          const isAuthEndpoint =
            cleanEndpoint.startsWith('auth/login') ||
            cleanEndpoint.startsWith('auth/government/login') ||
            cleanEndpoint.startsWith('auth/citizen') ||
            cleanEndpoint.startsWith('auth/refresh') ||
            cleanEndpoint.startsWith('auth/logout') ||
            cleanEndpoint === 'auth/me';

          if (response.status === 401 && !options._isRetry && !isAuthEndpoint) {
            console.warn(`[API Client] 401 received on ${cleanEndpoint}. Refreshing session...`);
            
            if (!this.isRefreshing) {
              this.isRefreshing = true;
              this.refreshPromise = this._executeRefresh();
            }

            try {
              const freshToken = await this.refreshPromise;
              // Retry the original request with the fresh token
              const retryHeaders = {
                ...options.headers,
                'Authorization': freshToken ? `Bearer ${freshToken}` : undefined,
              };
              return this.request(endpoint, {
                ...options,
                _isRetry: true,
                headers: retryHeaders,
              });
            } catch (refreshErr) {
              const err = new Error('Session expired. Please log in again.');
              err.status = 401;
              err.code = 'SESSION_EXPIRED';
              throw err;
            }
          }

          const errMsg = data?.error?.message || data?.message || `HTTP ${response.status}: ${response.statusText}`;
          const err = new Error(errMsg);
          err.status = response.status;
          err.code = data?.error?.code || data?.code || 'HTTP_ERROR';
          err.correlationId = response.headers.get('x-correlation-id') || correlationId;
          throw err;
        }

        const result = data?.data !== undefined ? data.data : data;

        // On successful GET, store in data cache
        if (isGet && !options.bypassCache) {
          const ttl = options.ttl || this.DEFAULT_TTL_MS;
          this.dataCache.set(url, {
            data: result,
            expiresAt: Date.now() + ttl,
          });
        } else if (!isGet) {
          // On successful mutating request (POST, PUT, DELETE), invalidate cache
          this.clearCache();
        }

        return result;
      } catch (error) {
        if (!(error.status === 401 && cleanEndpoint === 'auth/me')) {
          console.error(`[API Client Error] ${options.method || 'GET'} ${url}:`, error.message);
        }
        throw error;
      } finally {
        if (isGet) {
          this.inFlightRequests.delete(url);
        }
      }
    };

    if (isGet && !options.bypassCache && !options._isRetry) {
      const promise = execute();
      this.inFlightRequests.set(url, promise);
      return promise;
    }

    return execute();
  }

  get(endpoint, params = {}, options = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString();
    const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(fullEndpoint, { method: 'GET', ...options });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { method: 'POST', body, ...options });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { method: 'PUT', body, ...options });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { method: 'PATCH', body, ...options });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

export const apiClient = new ApiClient(BASE_URL);
export default apiClient;
