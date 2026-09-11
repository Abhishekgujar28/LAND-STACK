/**
 * Land Stack Centralized API Client
 * Connects frontend to Node.js / Express backend
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/${endpoint.replace(/^\/+/, '')}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const config = {
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
        throw new Error(data?.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data?.data !== undefined ? data.data : data;
    } catch (error) {
      console.error(`[API Client Error] ${options.method || 'GET'} ${url}:`, error.message);
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


// Fallback data sets to maintain synchronous render stability while async APIs resolve
const parcelsData = [];
const ownershipData = [];
const encumbrancesData = [];
const restrictionsData = [];
const taxRecordsData = [];
const courtCasesData = [];
const zoningData = [];
const parcelDocumentsData = [];
const mutationsData = [];
const mutationTimelineData = [];
const talathiQueueData = [];
const tehsildarQueueData = [];
const sroAuditsData = [];
const applicationsData = [];
const applicationTypesData = [];
const grievancesData = [];
const documentsData = [];
const notificationsData = [];
const watchlistData = [];
const citizensData = [{ id: 'CIT-001', name: 'Aarav Patil', localName: 'आरव पाटील', mobile: '+91 98230 45891', email: 'aarav.patil@example.com' }];
const governmentRolesData = [];
const governmentUsersData = [];
const nationalStats = {};
const nationalBenchmarksData = [];
const statePMUData = {};
const stateAnalytics = [];
const districtRankingsData = [];
const adminSystemData = {};
const governmentServicesData = [];
const statesData = [];
const districtsData = [];
const tehsilsData = [];
const villagesData = [];
const departments = [];
const services = [];
const news = [];
const notices = [];

export const apiClient = new ApiClient(BASE_URL);
export default apiClient;
