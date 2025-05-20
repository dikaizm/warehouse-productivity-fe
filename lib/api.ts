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
  return res.json();
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