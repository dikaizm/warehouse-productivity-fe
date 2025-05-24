import { DateRange } from "react-day-picker";
import { ReportFilterParams } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create an API client class to handle token refresh
class ApiClient {
  private static instance: ApiClient;
  private refreshPromise: Promise<string | null> | null = null;

  private constructor() {}

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private async refreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${API_URL}/api/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        return data.accessToken;
      }
      return null;
    } catch (error) {
      console.error('Error refreshing token:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      return null;
    }
  }

  private async getValidToken(): Promise<string | null> {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      window.location.href = '/login';
      return null;
    }
    return accessToken;
  }

  async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const accessToken = await this.getValidToken();
    if (!accessToken) {
      throw new Error('No access token found');
    }

    // Add authorization header
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`
    };

    // Make the initial request
    let response = await fetch(url, { ...options, headers });

    // If unauthorized, try to refresh the token
    if (response.status === 401) {
      // Ensure only one refresh request is made at a time
      if (!this.refreshPromise) {
        this.refreshPromise = this.refreshToken();
      }
      
      const newAccessToken = await this.refreshPromise;
      this.refreshPromise = null; // Reset the promise

      if (newAccessToken) {
        // Retry the request with the new token
        headers['Authorization'] = `Bearer ${newAccessToken}`;
        response = await fetch(url, { ...options, headers });
      } else {
        throw new Error('Session expired. Please login again.');
      }
    }

    return response;
  }
}

const apiClient = ApiClient.getInstance();

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const text = await res.text();
    try {
      // Try to parse as JSON first
      const error = JSON.parse(text);
      throw new Error(error.message || 'Request failed');
    } catch (e) {
      // If not JSON, use the text directly
      throw new Error(text || 'Request failed');
    }
  }

  const result = await res.json();
  return result;
};

export const postLogin = async (data: {
  usernameOrEmail: string;
  password: string;
}) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }

  return handleResponse(res);
};

export const getOverviewCount = async () => {
  const res = await apiClient.fetchWithAuth(`${API_URL}/api/overview/counts`);
  return handleResponse(res);
};

export const getOverviewTrend = async () => {
  const res = await apiClient.fetchWithAuth(`${API_URL}/api/overview/trend`);
  return handleResponse(res);
};

export const getRecentLogs = async (page = 1, limit = 10) => {
  const res = await apiClient.fetchWithAuth(
    `${API_URL}/api/overview/recent-logs?page=${page}&limit=${limit}`
  );
  return handleResponse(res);
};

export const getBarProductivity = async () => {
  const res = await apiClient.fetchWithAuth(`${API_URL}/api/overview/bar-productivity`);
  return handleResponse(res);
};

export const createDailyInput = async (data: {
  date: string;
  binningCount: number;
  pickingCount: number;
  isPresent: boolean;
  notes?: string;
}) => {
  const res = await apiClient.fetchWithAuth(`${API_URL}/api/daily-input`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const postDailyLog = async (data: {
  logDate: string;
  binningCount: number;
  pickingCount: number;
  totalItems: number;
  workerPresents: number[];
  workNotes?: string;
}) => {
  const res = await apiClient.fetchWithAuth(`${API_URL}/api/daily-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const getDailyLogs = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  dateRange?: DateRange;
  sort?: { key: string; direction: 'asc' | 'desc' };
}) => {
  const url = new URL(`${API_URL}/api/daily-logs`);
  url.searchParams.append('page', params.page?.toString() || '1');
  url.searchParams.append('limit', params.limit?.toString() || '10');
  url.searchParams.append('search', params.search || '');
  url.searchParams.append('sort', params.sort?.key || 'date');
  url.searchParams.append('direction', params.sort?.direction || 'desc');

  if (params.dateRange) {
    url.searchParams.append('startDate', params.dateRange.from?.toISOString() || '');
    url.searchParams.append('endDate', params.dateRange.to?.toISOString() || params.dateRange.from?.toISOString() || '');
  }

  const res = await apiClient.fetchWithAuth(url.toString());
  return handleResponse(res);
};

interface GetUsersParams {
  role?: string;
  // Add other filter parameters here if needed in the future
}

export const getDailyLogById = async (id: number) => {
  const res = await apiClient.fetchWithAuth(`${API_URL}/api/daily-logs/${id}`);
  return handleResponse(res);
};

export const updateDailyLog = async (id: number, data: {
  binningCount: number;
  pickingCount: number;
  workerPresents: number[];
  workNotes?: string;
}) => {
  const res = await apiClient.fetchWithAuth(`${API_URL}/api/daily-logs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const deleteDailyLog = async (id: number) => {
  const res = await apiClient.fetchWithAuth(`${API_URL}/api/daily-logs/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
};

export const getUsers = async (params?: GetUsersParams) => {
  const url = new URL(`${API_URL}/api/users`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, value);
      }
    });
  }
  const res = await apiClient.fetchWithAuth(url.toString());
  return handleResponse(res);
};

export const getTopPerformers = async (search?: string) => {
  const res = await apiClient.fetchWithAuth(`${API_URL}/api/top-performers?search=${search}`);

  const result = await handleResponse(res);
  return result.data;
};

export const createUser = async (data: {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  subRole: string;
}) => {
  const res = await apiClient.fetchWithAuth(`${API_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const updateUser = async (id: number, data: {
  fullName: string;
  username: string;
  email: string;
  role: string;
  subRole: string;
}) => {
  const res = await apiClient.fetchWithAuth(`${API_URL}/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const deleteUser = async (id: number) => {
  const res = await apiClient.fetchWithAuth(`${API_URL}/api/users/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
};

export const getWorkerPresent = async () => {
  const res = await apiClient.fetchWithAuth(`${API_URL}/api/insights/worker-present`);
  return handleResponse(res);
};

export const getTrendItem = async (startDate: string, endDate: string) => {
  const res = await apiClient.fetchWithAuth(
    `${API_URL}/api/insights/trend-item?startDate=${startDate}&endDate=${endDate}`
  );
  return handleResponse(res);
};

export const getWorkerPerformance = async (type: string, year: number) => {
  const res = await apiClient.fetchWithAuth(
    `${API_URL}/api/insights/worker-performance?type=${type}&year=${year}`
  );
  return handleResponse(res);
};

export const getReportFilter = async (params: ReportFilterParams) => {
  const url = new URL(`${API_URL}/api/reports/filter`);
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, value);
    }
  });
  const res = await apiClient.fetchWithAuth(url.toString());
  return handleResponse(res);
};

export const getReportExport = async (params: ReportFilterParams) => {
  const url = new URL(`${API_URL}/api/reports/export`);
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, value);
    }
  });

  const res = await apiClient.fetchWithAuth(url.toString());
  
  if (!res.ok) {
    const text = await res.text();
    try {
      const error = JSON.parse(text);
      throw new Error(error.message || 'Export failed');
    } catch (e) {
      throw new Error(text || 'Export failed');
    }
  }

  return res;
};