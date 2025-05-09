const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getOverviewToday = async () => {
  const res = await fetch(`${API_URL}/api/overview/today`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch today's overview");
  return res.json();
};

export const getOverviewTrends = async () => {
  const res = await fetch(`${API_URL}/api/overview/trends`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch trends");
  return res.json();
};

export const getOverviewDetails = async (page = 1, limit = 10) => {
  const res = await fetch(
    `${API_URL}/api/overview/details?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch details");
  return res.json();
};

export const getSevenDayTrend = async () => {
  const res = await fetch(`${API_URL}/api/overview/seven-day-trend`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch seven day trend");
  return res.json();
}; 