import { DateRange } from "react-day-picker";
import { ReportFilterParams } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const validateToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    window.location.href = '/login';
    return false;
  }
  return true;
};

const handleResponse = async (res: Response) => {
  if (res.status === 401) {
    // Token expired or invalid
    localStorage.removeItem("accessToken");
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

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

export const getOverviewCount = async () => {
  if (!validateToken()) return;
  const res = await fetch(`${API_URL}/api/overview/counts`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return handleResponse(res);
};

export const getOverviewTrend = async () => {
  if (!validateToken()) return;
  const res = await fetch(`${API_URL}/api/overview/trend`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return handleResponse(res);
};

export const getRecentLogs = async (page = 1, limit = 10) => {
  if (!validateToken()) return;
  const res = await fetch(
    `${API_URL}/api/overview/recent-logs?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  return handleResponse(res);
};

export const getBarProductivity = async () => {
  if (!validateToken()) return;
  const res = await fetch(`${API_URL}/api/overview/bar-productivity`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return handleResponse(res);
};

export const createDailyInput = async (data: {
  date: string;
  binningCount: number;
  pickingCount: number;
  isPresent: boolean;
  notes?: string;
}) => {
  if (!validateToken()) return;
  const res = await fetch(`${API_URL}/api/daily-input`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
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
  if (!validateToken()) return;
  const res = await fetch(`${API_URL}/api/daily-logs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
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
  if (!validateToken()) return;
  const url = new URL(`${API_URL}/api/daily-logs`);
  url.searchParams.append('page', params.page?.toString() || '1');
  url.searchParams.append('limit', params.limit?.toString() || '10');
  url.searchParams.append('search', params.search || '');
  url.searchParams.append('sort', params.sort?.key || 'date');
  url.searchParams.append('direction', params.sort?.direction || 'desc');

  if (params.dateRange) {
    url.searchParams.append('startDate', params.dateRange.from?.toISOString() || '');

    if (params.dateRange.to) {
      url.searchParams.append('endDate', params.dateRange.to?.toISOString() || '');
    } else {
      url.searchParams.append('endDate', params.dateRange.from?.toISOString() || '');
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return handleResponse(res);
};

interface GetUsersParams {
  role?: string;
  // Add other filter parameters here if needed in the future
}

export const getDailyLogById = async (id: number) => {
  if (!validateToken()) return;
  const res = await fetch(`${API_URL}/api/daily-logs/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return handleResponse(res);
};

export const updateDailyLog = async (id: number, data: {
  binningCount: number;
  pickingCount: number;
  workerPresents: number[];
  workNotes?: string;
}) => {
  if (!validateToken()) return;
  const res = await fetch(`${API_URL}/api/daily-logs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}


export const deleteDailyLog = async (id: number) => {
  if (!validateToken()) return;
  const res = await fetch(`${API_URL}/api/daily-logs/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return handleResponse(res);
};

export const getUsers = async (params?: GetUsersParams) => {
  if (!validateToken()) return;
  const url = new URL(`${API_URL}/api/users`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, value);
      }
    });
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return handleResponse(res);
};

export const getTopPerformers = async (search?: string) => {
  if (!validateToken()) return;
  const res = await fetch(`${API_URL}/api/top-performers?search=${search}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  const result = await handleResponse(res);
  return result.data;
};

export const createUser = async (data: {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  accessLevel: string;
}) => {
  if (!validateToken()) return;
  const res = await fetch(`${API_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const updateUser = async (id: number, data: {
  fullName: string;
  username: string;
  email: string;
  role: string;
  accessLevel: string;
}) => {
  if (!validateToken()) return;
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const deleteUser = async (id: number) => {
  if (!validateToken()) return;
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return handleResponse(res);
};

export const getWorkerPresent = async () => {
  if (!validateToken()) return;
  const res = await fetch(`${API_URL}/api/insights/worker-present`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return handleResponse(res);
};

export const getTrendItem = async (startDate: string, endDate: string) => {
  if (!validateToken()) return;
  const res = await fetch(`${API_URL}/api/insights/trend-item?startDate=${startDate}&endDate=${endDate}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return handleResponse(res);
};

export const getWorkerPerformance = async (type: string, year: number) => {
  if (!validateToken()) return;
  const res = await fetch(`${API_URL}/api/insights/worker-performance?type=${type}&year=${year}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return handleResponse(res);
};

export const getReportFilter = async (params: ReportFilterParams) => {
  if (!validateToken()) return;
  const res = await fetch(`${API_URL}/api/reports/filter?startDate=${params.startDate}&endDate=${params.endDate}&type=${params.type}&search=${params.search}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return handleResponse(res);
};

export const getReportExport = async (params: ReportFilterParams) => {
  if (!validateToken()) return;
  const url = new URL(`${API_URL}/api/reports/export`);
  
  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, value);
    }
  });

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  // For file downloads, we don't want to parse as JSON
  if (res.status === 401) {
    localStorage.removeItem("accessToken");
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  if (!res.ok) {
    const text = await res.text();
    try {
      const error = JSON.parse(text);
      throw new Error(error.message || 'Export failed');
    } catch (e) {
      throw new Error(text || 'Export failed');
    }
  }

  // Return the response directly for file downloads
  return res;
};