"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getOverviewCount, getOverviewTrend, getRecentLogs, getBarProductivity } from "@/lib/api"
import type {
  OverviewCountsResponse,
  BarProductivityResponse,
  TrendResponse,
  RecentLogResponse
} from "@/lib/types"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        <p className="font-medium">Error</p>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [todayData, setTodayCount] = useState<OverviewCountsResponse | null>(null);
  const [trendsData, setTrendsData] = useState<TrendResponse | null>(null);
  const [recentLogsData, setRecentLogsData] = useState<RecentLogResponse[] | null>(null);
  const [barProductivityData, setBarProductivityData] = useState<BarProductivityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [today, trends, recentLogs, barProductivity] = await Promise.all([
          getOverviewCount(),
          getOverviewTrend(),
          getRecentLogs(),
          getBarProductivity(),
        ]);

        if (!today || !trends || !recentLogs || !barProductivity) {
          setError("Gagal memuat semua data dashboard.");
          return;
        }

        setTodayCount(today.data);
        setTrendsData(trends.data);
        setRecentLogsData(recentLogs.data);
        setBarProductivityData(barProductivity.data);
        setError("");
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat mengambil data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 max-w-7xl">
      <h1 className="text-2xl font-bold mb-2">Ringkasan</h1>
      <p className="text-gray-600 mb-6">
        Ini adalah tampilan tingkat tinggi dari produktivitas tim Anda. Termasuk ringkasan aktivitas hari ini, serta tren 7 hari terakhir.
      </p>

      {loading ? (
        <div className="space-y-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ringkasan Produktivitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="pt-6">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Tren Produktivitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="pt-6">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Detail Produktivitas</CardTitle>
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded mb-2"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          {/* Productivity Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ringkasan Produktivitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-gray-500 mb-1">Item yang Diproses</div>
                    <div className="text-3xl font-bold">{todayData?.totalItemsToday || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-gray-500 mb-1">Karyawan Hadir</div>
                    <div className="text-3xl font-bold">{todayData?.presentWorkers || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-gray-500 mb-1">
                      Pencapaian terhadap Target
                    </div>
                    <div className="text-3xl font-bold">{todayData?.productivityActual || 0}<span className="ml-2 text-base text-gray-500">/ {todayData?.productivityTarget || 0}</span></div>
                  </CardContent>
                </Card>
              </div>

              {/* Chart */}
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <div className="text-sm mb-4">Item yang Diproses 7 Hari Terakhir</div>
                  <div className="h-64">
                    <BarChart data={barProductivityData} />
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Productivity Trends */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Tren Produktivitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-gray-500 mb-1">Rata-rata per Hari</div>
                    <div className="text-3xl font-bold">
                      {trendsData?.daily_average}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-gray-500 mb-1">Rata-rata per Minggu</div>
                    <div className="text-3xl font-bold">
                      {trendsData?.weekly_average}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-gray-500 mb-1">Rata-rata per Bulan</div>
                    <div className="text-3xl font-bold">
                      {trendsData?.monthly_average}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Productivity Details */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Detail Produktivitas</CardTitle>
              <Button variant="ghost" className="text-blue-600" onClick={() => router.push('/daily-logs')}>
                Lihat Semua
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-4 font-normal text-gray-500">Tanggal</th>
                      <th className="pb-4 font-normal text-gray-500">Binning</th>
                      <th className="pb-4 font-normal text-gray-500">Picking</th>
                      <th className="pb-4 font-normal text-gray-500">Total Karyawan</th>
                      <th className="pb-4 font-normal text-gray-500">Karyawan Hadir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLogsData?.map((item: RecentLogResponse, index: number) => (
                      <tr key={index} className="border-t">
                        <td className="py-4">{new Date(item.logDate).toLocaleDateString()}</td>
                        <td className="py-4">{item.binningCount}</td>
                        <td className="py-4">{item.pickingCount}</td>
                        <td className="py-4">{item.totalWorkers}</td>
                        <td className="py-4">{item.attendance.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function BarChart({ data }: { data: BarProductivityResponse | null }) {
  if (!data) {
    return null;
  }

  const chartData = {
    labels: data.productivity.map(item => {
      const date = new Date(item.date);
      // console.log('Processing date:', item.date, 'Formatted as:', date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }));
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    }),
    datasets: [
      {
        label: 'Produktivitas',
        data: data.productivity.map(item => {
          // console.log('Processing count:', item.count, 'for date:', item.date);
          return item.count;
        }),
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // blue-500 with opacity
        borderColor: 'rgb(59, 130, 246)', // blue-500
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: 'rgba(37, 99, 235, 0.9)', // blue-600 with opacity
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          },
          generateLabels: (chart: any) => {
            return [
              {
                text: 'Produktivitas',
                fillStyle: 'rgba(59, 130, 246, 0.8)',
                strokeStyle: 'rgb(59, 130, 246)',
                lineWidth: 1,
                hidden: false,
                index: 0
              },
              {
                text: 'Target',
                fillStyle: 'transparent',
                strokeStyle: 'rgb(239, 68, 68)',
                lineDash: [5, 5],
                lineWidth: 2,
                hidden: false,
                index: 1
              }
            ];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `Produktivitas: ${context.raw}`;
          }
        }
      },
      annotation: {
        annotations: {
          targetLine: {
            type: 'line' as const,
            yMin: data.target,
            yMax: data.target,
            borderColor: 'rgb(239, 68, 68)', // red-500
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              content: `Target: ${data.target}`,
              enabled: true,
              position: 'end' as const,
              backgroundColor: 'rgb(239, 68, 68)',
              color: 'white',
              padding: 4,
              borderRadius: 4,
            }
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          precision: 0,
          callback: function (value: any) {
            return value.toLocaleString('id-ID');
          }
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  return (
    <div className="h-64 w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}
