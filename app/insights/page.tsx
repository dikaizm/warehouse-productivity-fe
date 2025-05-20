"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { format } from "date-fns";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const pieData = {
  labels: ['Hadir', 'Tidak Hadir'],
  datasets: [
    {
      data: [18, 12],
      backgroundColor: [
        '#FFD600', // yellow
        '#2196F3', // blue
      ],
      borderWidth: 0,
    },
  ],
};

const pieOptions = {
  plugins: {
    legend: { display: false },
  },
  cutout: '70%',
  responsive: true,
  maintainAspectRatio: false,
};

const lineData = {
  labels: Array.from({ length: 10 }, (_, i) => (i + 1).toString()),
  datasets: [
    {
      label: 'Masuk',
      data: [14, 16, 15, 12, 10, 11, 13, 17, 15, 14],
      borderColor: '#FFD600',
      backgroundColor: '#FFD600',
      tension: 0.4,
      fill: false,
      pointRadius: 0,
      borderWidth: 2,
    },
    {
      label: 'Keluar',
      data: [16, 14, 12, 13, 14, 12, 10, 8, 7, 6],
      borderColor: '#2196F3',
      backgroundColor: '#2196F3',
      tension: 0.4,
      fill: false,
      pointRadius: 0,
      borderWidth: 2,
    },
  ],
};

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
      min: 4,
      max: 20,
    },
  },
};

const barData = {
  labels: [
    'Operator', 'Operator', 'Operator', 'Operator', 'Operator', 'Operator', 'Operator', 'Operator'
  ],
  datasets: [
    {
      label: 'Performa',
      data: [74779, 74779, 56635, 43887, 43887, 19027, 8142, 4918],
      backgroundColor: '#2196F3',
      borderRadius: 8,
      barThickness: 16,
      borderSkipped: false,
    },
  ],
};

const barOptions = {
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: any) => ctx.raw.toLocaleString('id-ID'),
      },
    },
  },
  scales: {
    x: {
      grid: { color: '#E5E7EB' },
      ticks: {
        color: '#888',
        font: { size: 12 },
        callback: (value: any) => value.toLocaleString('id-ID'),
      },
      min: 0,
      max: 80000,
    },
    y: {
      grid: { display: false },
      ticks: { color: '#888', font: { size: 12 } },
    },
  },
};

const dateRange = [new Date(2025, 3, 17), new Date(2025, 3, 20)];

export default function InsightsPage() {
  const [filter, setFilter] = useState('Mingguan');

  return (
    <div className="p-8 bg-gray-50 max-w-7xl min-h-screen">
      <h1 className="text-3xl font-bold mb-1">Insights</h1>
      <p className="text-gray-400 mb-6">Lorem ipsum</p>
      <div className="flex flex-col gap-6">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Pie Chart */}
          <Card className="flex-1 max-w-xs min-w-[260px]">
            <CardHeader>
              <CardTitle className="text-lg">Kehadiran Operator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="w-40 h-40">
                  <Pie data={pieData} options={pieOptions} />
                </div>
                <div className="flex gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#FFD600] inline-block" />
                    <span className="text-xs text-gray-700">Hadir</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#2196F3] inline-block" />
                    <span className="text-xs text-gray-700">Tidak Hadir</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Line Chart */}
          <Card className="flex-[2] min-w-[320px]">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-lg">Tren Item Masuk vs Keluar</CardTitle>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1 text-sm">
                <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
                {format(dateRange[0], 'dd/MM/yyyy')} - {format(dateRange[1], 'dd/MM/yyyy')}
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-56 w-full">
                <Line data={lineData} options={lineOptions} />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Bar Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Perbandingan Performa Operator</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 text-sm font-normal px-3 py-1">
                  {filter} <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter('Mingguan')}>Mingguan</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('Bulanan')}>Bulanan</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <Bar data={barData} options={barOptions} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
