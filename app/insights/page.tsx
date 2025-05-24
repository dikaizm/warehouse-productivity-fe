"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { format } from "date-fns";
import { getWorkerPresent, getTrendItem, getWorkerPerformance } from "@/lib/api";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { InsightTrendItem, InsightWorkerPresent } from "@/lib/types";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const pieOptions = {
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          const label = context.label || '';
          const value = context.raw || 0;
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = Math.round((value / total) * 100);
          return `${label}: ${value} (${percentage}%)`;
        }
      }
    }
  },
  cutout: '60%',
  responsive: true,
  maintainAspectRatio: false,
};

type WorkerPerformancePoint = {
  operatorId: number;
  operatorName: string;
  value: number;
};
type TimePointPerformance = {
  timePoint: string;
  data: WorkerPerformancePoint[];
};
type WorkerComparisonDataset = {
  year: number;
  type: 'weekly' | 'monthly';
  metrics: TimePointPerformance[];
};

// Helper to generate all time points for the year
function getAllTimePoints(type: 'weekly' | 'monthly', year: number): string[] {
  if (type === 'monthly') {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  } else {
    // Generate all weeks for each month
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const getWeeksInMonth = (year: number, month: number) => {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      return Math.ceil(daysInMonth / 7);
    };
    let points: string[] = [];
    for (let m = 0; m < 12; m++) {
      const numWeeks = getWeeksInMonth(year, m);
      for (let w = 1; w <= numWeeks; w++) {
        points.push(`${monthLabels[m]} W${w}`);
      }
    }
    return points;
  }
}

// Generate N distinct colors using HSL
function generateColors(count: number): string[] {
  return Array.from({ length: count }, (_, i) =>
    `hsl(${Math.round((360 * i) / count)}, 70%, 50%)`
  );
}

export default function InsightsPage() {
  const [filterPerformance, setFilterPerformance] = useState<{
    type: 'weekly' | 'monthly';
    value: string;
  }>({
    type: 'weekly',
    value: 'Mingguan'
  });
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const thirtyDaysBefore = new Date();
  thirtyDaysBefore.setDate(today.getDate() - 30);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: thirtyDaysBefore,
    to: today
  });

  const [workerPresent, setWorkerPresent] = useState<InsightWorkerPresent>({
    present: 0,
    absent: 0,
    total: 0,
    presentPercentage: 0,
    absentPercentage: 0,
  });

  const [trendItem, setTrendItem] = useState<InsightTrendItem>({
    data: [],
    period: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  // Add state for worker performance data
  const [workerPerformance, setWorkerPerformance] = useState<WorkerComparisonDataset | null>(null);

  // Fetch worker present data
  useEffect(() => {
    const fetchWorkerPresent = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getWorkerPresent();
        if (res?.data) {
          setWorkerPresent(res.data);
        }
      } catch (err: any) {
        setError(err?.message || 'Gagal memuat data kehadiran operator.');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkerPresent();
  }, []);

  // Fetch trend item data
  useEffect(() => {
    const fetchTrendItem = async () => {
      if (!dateRange.from || !dateRange.to) return;
      try {
        setLoading(true);
        setError(null);
        const res = await getTrendItem(format(dateRange.from, 'yyyy-MM-dd'), format(dateRange.to, 'yyyy-MM-dd'));
        if (res?.data) {
          setTrendItem(res.data);
        }
      } catch (err: any) {
        setError(err?.message || 'Gagal memuat data tren item.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrendItem();
  }, [dateRange]);

  // Fetch worker performance data
  useEffect(() => {
    const fetchWorkerPerformance = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getWorkerPerformance(filterPerformance.type, selectedYear);
        if (res?.data) {
          setWorkerPerformance(res.data);
        }
      } catch (err: any) {
        setError(err?.message || 'Gagal memuat data performa operator.');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkerPerformance();
  }, [filterPerformance.type, selectedYear]);

  // Update pie chart data with real worker present data
  const pieData = {
    labels: ['Hadir', 'Tidak Hadir'],
    datasets: [
      {
        data: [workerPresent.present, workerPresent.absent],
        backgroundColor: [
          '#FFD600', // yellow
          '#2196F3', // blue
        ],
        borderWidth: 0,
      },
    ],
  };

  // Update line chart data with real trend item data
  const lineData = {
    labels: trendItem.data.map(item => format(new Date(item.date), 'dd/MM')),
    datasets: [
      {
        label: 'Binning',
        data: trendItem.data.map(item => item.binningCount),
        borderColor: '#FFD600',
        backgroundColor: '#FFD600',
        tension: 0.1,
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'Picking',
        data: trendItem.data.map(item => item.pickingCount),
        borderColor: '#2196F3',
        backgroundColor: '#2196F3',
        tension: 0.1,
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  // Dynamically calculate lineYMax based on API data
  const allLineValues = lineData.datasets.flatMap(ds => ds.data);
  const lineYMax = allLineValues.length > 0 ? Math.max(...allLineValues) + 4 : 20;

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          font: { size: 14 },
          color: '#222',
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#888', font: { size: 12 } },
      },
      y: {
        grid: { color: '#E5E7EB' },
        ticks: { color: '#888', font: { size: 12 }, stepSize: 4 },
        min: 0,
        max: lineYMax,
      },
    },
  };

  // Get all unique operator IDs and names from the API (or fallback to empty)
  const operatorMap = new Map<number, string>();
  if (workerPerformance && workerPerformance.metrics.length > 0) {
    workerPerformance.metrics[0].data.forEach((op: WorkerPerformancePoint) => {
      operatorMap.set(op.operatorId, op.operatorName);
    });
  }

  const operatorCount = operatorMap.size;
  const operatorColors = generateColors(operatorCount);

  // Build datasets for each operator, filling missing time points with 0
  const barDatasets = Array.from(operatorMap.entries()).map(([operatorId, operatorName], idx) => ({
    label: operatorName,
    data: getAllTimePoints(filterPerformance.type, selectedYear).map(tp => {
      const metric = workerPerformance?.metrics.find((m: TimePointPerformance) => m.timePoint === tp);
      const found = metric?.data.find((d: WorkerPerformancePoint) => d.operatorId === operatorId);
      return found ? found.value : 0;
    }),
    backgroundColor: operatorColors[idx],
    borderRadius: 6,
    barThickness: 8,
  }));

  const barData = {
    labels: getAllTimePoints(filterPerformance.type, selectedYear),
    datasets: barDatasets,
  };

  // Find the max value in the current bar data
  const allBarValues = barData.datasets.flatMap(ds => ds.data);
  const maxBarValue = allBarValues.length > 0 ? Math.max(...allBarValues) : 10; // fallback to 10 if empty
  const yMax = Math.ceil(maxBarValue / 10) * 10 + 10; // round up to nearest 10 and add 10 for headroom

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (ctx: any) {
            return `${ctx.dataset.label}: ${ctx.raw.toLocaleString('id-ID')}`;
          },
        },
      },
    },
    scales: {
      x: { stacked: false, grid: { color: '#E5E7EB' }, ticks: { color: '#888', font: { size: 12 } } },
      y: {
        stacked: false,
        grid: { color: '#E5E7EB' },
        ticks: { color: '#888', font: { size: 12 } },
        min: 0,
        max: yMax,
      },
    },
  };

  return (
    <div className="px-8 bg-gray-50 max-w-7xl min-h-screen">
      <h1 className="text-3xl font-bold mb-1">Insights</h1>
      <p className="text-gray-400 mb-6">Lihat statistik kehadiran operator dan tren aktivitas barang di gudang.</p>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      <div className="flex flex-col gap-6">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Pie Chart */}
          <Card className="flex-1 max-w-xs min-w-[260px]">
            <CardHeader>
              <CardTitle className="text-lg">Kehadiran Operator</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-40 h-40">
                    <Pie data={pieData} options={pieOptions} />
                  </div>
                  <div className="flex gap-4 mt-4">
                    {pieData.labels.map((label, index) => {
                      const value = pieData.datasets[0].data[index];
                      const total = pieData.datasets[0].data.reduce((a, b) => a + b, 0);
                      const percentage = Math.round((value / total) * 100);
                      return (
                        <div key={label} className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full inline-block"
                            style={{ backgroundColor: pieData.datasets[0].backgroundColor[index] }}
                          />
                          <div className="text-xs text-gray-700">
                            <div>{label}</div>
                            <div className="font-medium">{value} ({percentage}%)</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Line Chart */}
          <Card className="flex-[2] min-w-[320px]">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-lg">Tren Item Binning vs Picking</CardTitle>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1 text-sm",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                          {format(dateRange.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy")
                      )
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                    <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={(range: DateRange | undefined) => {
                      if (range) {
                        setDateRange(range);
                      }
                    }}
                    numberOfMonths={2}
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-56">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="h-56 w-full">
                  <Line data={lineData} options={lineOptions} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Bar Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Perbandingan Performa Operator</CardTitle>
            <div className="flex gap-2">

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 text-sm font-normal px-3 py-1">
                    {selectedYear} <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {
                    Array.from({ length: 6 }, (_, i) => 2025 - i).map((year) => (
                      <DropdownMenuItem key={year} onClick={() => setSelectedYear(year)}>{year}</DropdownMenuItem>
                    ))
                  }
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 text-sm font-normal px-3 py-1">
                    {filterPerformance.value} <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterPerformance({ type: 'weekly', value: 'Mingguan' })}>Mingguan</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterPerformance({ type: 'monthly', value: 'Bulanan' })}>Bulanan</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <div style={{ minWidth: filterPerformance.type === 'weekly' ? 6000 : 1200, minHeight: 400 }}>
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-6 justify-center">
              {barDatasets.map((ds, idx) => (
                <div key={ds.label} className="flex items-center gap-2">
                  <span
                    className="inline-block w-4 h-4 rounded"
                    style={{ backgroundColor: ds.backgroundColor }}
                  />
                  <span className="text-sm text-gray-700">{ds.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
