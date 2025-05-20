"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

const MOCK_DATA = [
  { date: "2022-07-22", operator: "John Doe", binning: 120, picking: 100, total: 220, productivity: 0.85 },
  { date: "2022-07-21", operator: "Jane Smith", binning: 130, picking: 110, total: 240, productivity: 0.90 },
  { date: "2022-07-20", operator: "Michael Johnson", binning: 140, picking: 120, total: 260, productivity: 0.95 },
  { date: "2022-07-19", operator: "Emily Davis", binning: 150, picking: 130, total: 280, productivity: 1.00 },
  { date: "2022-07-18", operator: "Robert Brown", binning: 160, picking: 140, total: 300, productivity: 1.05 },
];

const REPORT_TYPES = [
  { label: "Harian", value: "harian" },
  { label: "Mingguan", value: "mingguan" },
  { label: "Bulanan", value: "bulanan" },
];

export default function ReportPage() {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date("2025-04-17"));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date("2025-04-20"));
  const [reportType, setReportType] = useState(REPORT_TYPES[1].value);
  const [email, setEmail] = useState("");
  const [format, setFormat] = useState("csv");

  const filtered = MOCK_DATA.filter(row =>
    row.operator.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Reports</h1>
      <p className="text-gray-400 mb-6">View and export your data</p>
      <Card className="p-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
          <div className="flex-1 max-w-xs">
            <label className="block text-sm font-medium text-gray-500 mb-1">Cari</label>
            <div className="relative">
              <Input
                placeholder="Search by operator name"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <div className="flex-1 max-w-44">
            <label className="block text-sm font-medium text-gray-500 mb-1">Start date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? new Intl.DateTimeFormat('en-GB').format(startDate) : <span className="text-gray-400">Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={startDate} onSelect={date => {
                  if (date instanceof Date || date === undefined) setStartDate(date);
                }} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex-1 max-w-44">
            <label className="block text-sm font-medium text-gray-500 mb-1">End date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? new Intl.DateTimeFormat('en-GB').format(endDate) : <span className="text-gray-400">Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={endDate} onSelect={date => {
                  if (date instanceof Date || date === undefined) setEndDate(date);
                }} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex-1 max-w-44">
            <label className="block text-sm font-medium text-gray-500 mb-1">Jenis Laporan</label>
            <Select value={reportType} onValueChange={value => setReportType(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPORT_TYPES.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Table Preview */}
        <div className="mb-2 font-medium text-gray-600">Preview</div>
        <div className="overflow-x-auto rounded-lg border bg-white mb-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Date</TableHead>
                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Operator Name</TableHead>
                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Binning Item Count</TableHead>
                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Picking Item Count</TableHead>
                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Total Items/Day</TableHead>
                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Productivity / Person</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-400">No data</TableCell>
                </TableRow>
              ) : (
                filtered.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</TableCell>
                    <TableCell>{row.operator}</TableCell>
                    <TableCell>{row.binning}</TableCell>
                    <TableCell>{row.picking}</TableCell>
                    <TableCell>{row.total}</TableCell>
                    <TableCell>{row.productivity.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {/* Email & Format */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-500 mb-1">Email address</label>
          <Input type="email" placeholder="" value={email} onChange={e => setEmail(e.target.value)} className="bg-gray-100" />
        </div>
        <div className="mb-6">
          <div className="font-medium text-gray-600 mb-2">Format</div>
          <div className="flex gap-2">
            <Button variant={format === "csv" ? "default" : "outline"} onClick={() => setFormat("csv")}>CSV</Button>
            <Button variant={format === "pdf" ? "default" : "outline"} onClick={() => setFormat("pdf")}>PDF</Button>
          </div>
        </div>
        {/* Actions */}
        <div className="flex flex-col md:flex-row md:justify-between gap-2">
          <Button variant="outline" className="w-full md:w-auto">Reset</Button>
          <Button className="w-full md:w-auto">Export</Button>
        </div>
      </Card>
    </div>
  );
}
