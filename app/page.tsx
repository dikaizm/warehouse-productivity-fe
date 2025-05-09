"use client";

import { useEffect, useState } from "react";
import { Search, Bell, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/sidebar"
import { getOverviewToday, getOverviewTrends, getOverviewDetails, getSevenDayTrend } from "@/lib/api"

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
  const [todayData, setTodayData] = useState<any>(null);
  const [trendsData, setTrendsData] = useState<any>(null);
  const [detailsData, setDetailsData] = useState<any>(null);
  const [sevenDayTrend, setSevenDayTrend] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [today, trends, details, sevenDay] = await Promise.all([
          getOverviewToday(),
          getOverviewTrends(),
          getOverviewDetails(),
          getSevenDayTrend(),
        ]);
        setTodayData(today.data);
        setTrendsData(trends.data);
        setDetailsData(details.data);
        setSevenDayTrend(sevenDay.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-2xl font-bold mb-2">Overview</h1>
          <p className="text-gray-600 mb-6">
            This is the high-level view of your team's productivity. It includes a summary of today's activity, as well
            as a 7-day trend.
          </p>

          {loading ? (
            <div className="space-y-6">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Productivity Overview</CardTitle>
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
                  <CardTitle>Productivity Trends</CardTitle>
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
                  <CardTitle>Productivity Details</CardTitle>
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
                  <CardTitle>Productivity Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-sm text-gray-500 mb-1">Items processed</div>
                        <div className="text-3xl font-bold">{todayData?.itemsProcessed || 0}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-sm text-gray-500 mb-1">Worker present</div>
                        <div className="text-3xl font-bold">{todayData?.workersPresent || 0}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-sm text-gray-500 mb-1">
                          Target <span className="ml-2">{todayData?.target || 0}</span>
                        </div>
                        <div className="text-3xl font-bold">{todayData?.actual || 0}</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Chart */}
                  <Card className="mt-4">
                    <CardContent className="pt-6">
                      <div className="text-sm mb-4">Item yang diproses 7 hari terakhir</div>
                      <div className="h-64">
                        <BarChart data={sevenDayTrend} />
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>

              {/* Productivity Trends */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Productivity Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-sm text-gray-500 mb-1">Avg. per Day</div>
                        <div className="text-3xl font-bold">{trendsData?.daily || 0}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-sm text-gray-500 mb-1">Avg. per Week</div>
                        <div className="text-3xl font-bold">{trendsData?.weekly || 0}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-sm text-gray-500 mb-1">Avg. per Month</div>
                        <div className="text-3xl font-bold">{trendsData?.monthly || 0}</div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Productivity Details */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Productivity Details</CardTitle>
                  <Button variant="ghost" className="text-green-600">
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
                          <th className="pb-4 font-normal text-gray-500">Total Workers</th>
                          <th className="pb-4 font-normal text-gray-500">Worker Presents</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailsData?.data?.map((item: any, index: number) => (
                          <tr key={index} className="border-t">
                            <td className="py-4">{new Date(item.date).toLocaleDateString()}</td>
                            <td className="py-4">{item.binning}</td>
                            <td className="py-4">{item.picking}</td>
                            <td className="py-4">{item.totalWorkers}</td>
                            <td className="py-4">{item.workersPresent}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function BarChart({ data }: { data: any[] }) {
  const maxValue = Math.max(...(data?.map((item) => item.items) || [0]));
  const targetValue = 55; // This should come from your API

  return (
    <div className="relative h-full w-full">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
        <div>{maxValue}</div>
        <div>{Math.round(maxValue * 0.8)}</div>
        <div>{Math.round(maxValue * 0.6)}</div>
        <div>{Math.round(maxValue * 0.4)}</div>
        <div>{Math.round(maxValue * 0.2)}</div>
        <div>0</div>
      </div>

      {/* Chart area */}
      <div className="absolute left-10 right-0 top-0 bottom-0">
        {/* Target line */}
        <div
          className="absolute left-0 right-0 border-t border-red-400"
          style={{ top: `${((maxValue - targetValue) / maxValue) * 100}%` }}
        ></div>

        {/* Bars */}
        <div className="h-full flex items-end justify-between">
          {data?.map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className="w-12 bg-blue-500"
                style={{ height: `${(item.items / maxValue) * 100}%` }}
              ></div>
              <div className="mt-2 text-xs">
                {new Date(item.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
