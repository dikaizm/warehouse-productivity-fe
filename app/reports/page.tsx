"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ChevronDown, Search } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { format as formatDate, addDays } from "date-fns";
import { getReportExport, getReportFilter } from "@/lib/api";
import { ReportData, ReportType } from "@/lib/types";

const MOCK_DATA = [
  { date: "2022-07-22", operator: "John Doe", binning: 120, picking: 100, total: 220, productivity: 0.85 },
  { date: "2022-07-21", operator: "Jane Smith", binning: 130, picking: 110, total: 240, productivity: 0.90 },
  { date: "2022-07-20", operator: "Michael Johnson", binning: 140, picking: 120, total: 260, productivity: 0.95 },
  { date: "2022-07-19", operator: "Emily Davis", binning: 150, picking: 130, total: 280, productivity: 1.00 },
  { date: "2022-07-18", operator: "Robert Brown", binning: 160, picking: 140, total: 300, productivity: 1.05 },
];

const REPORT_TYPES = [
  { label: "Harian", value: "daily" },
  { label: "Mingguan", value: "weekly" },
  { label: "Bulanan", value: "monthly" },
];

export default function ReportPage() {
  const [search, setSearch] = useState("");

  const [reportType, setReportType] = useState(REPORT_TYPES[0].value);
  // const [email, setEmail] = useState("");
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf">("csv");
  const [reportData, setReportData] = useState<ReportData>();

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: thirtyDaysAgo,
    to: today,
  });

  const filtered = MOCK_DATA.filter(row =>
    row.operator.toLowerCase().includes(search.toLowerCase())
  );

  const handleFilter = async () => {
    if (!dateRange.from || !dateRange.to) return;

    const res = await getReportFilter({
      startDate: formatDate(dateRange.from, 'yyyy-MM-dd'),
      endDate: formatDate(dateRange.to, 'yyyy-MM-dd'),
      type: reportType as ReportType,
      search: search || '',
    });

    if (res?.data) {
      setReportData(res.data);
    }
  }

  const handleExport = async () => {
    if (!dateRange.from || !dateRange.to || !reportData) return;

    try {
      const res = await getReportExport({
        startDate: formatDate(dateRange.from, 'yyyy-MM-dd'),
        endDate: formatDate(dateRange.to, 'yyyy-MM-dd'),
        type: reportType as ReportType,
        fileFormat: exportFormat as 'csv' | 'pdf',
        search: search || '',
      });

      if (!res) {
        throw new Error('Export failed');
      }

      // Get filename from Content-Disposition header if available
      const contentDisposition = res.headers.get('Content-Disposition');
      let filename = `report.${exportFormat}`;
      if (contentDisposition) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export report:", error);
      // You might want to show an error toast/notification here
    }
  }

  const handleReset = () => {
    setReportData(undefined);
    setSearch("");
    setDateRange({
      from: thirtyDaysAgo,
      to: today,
    });
    setReportType(REPORT_TYPES[0].value);
  }

  return (
    <div className="px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Reports</h1>
      <p className="text-gray-400 mb-6">View and export your data</p>
      <Card className="p-6">
        {/* Filters */}
        <div className="flex flex-col mb-4">
          <div className="flex flex-row gap-4 mb-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-500 mb-1">Cari</label>
              <div className="relative">
                <Input
                  placeholder="Cari nama operator"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-500 mb-1">Tanggal</label>

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
                          {formatDate(dateRange.from, "dd/MM/yyyy")} -{" "}
                          {formatDate(dateRange.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        formatDate(dateRange.from, "dd/MM/yyyy")
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
            </div>
            <div className="w-full max-w-44">
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

          <div className="flex gap-2">
            <Button className="w-32" onClick={() => handleFilter()}>Filter</Button>
            <Button variant="outline" className="w-full md:w-auto" onClick={() => handleReset()}>Reset</Button>
          </div>
        </div>

        <div className="my-4 border-t border-gray-200"></div>

        {/* Table Preview */}
        <div className="flex justify-between gap-4 items-center mb-2">
          <div className="mb-2 font-medium text-gray-600">Preview</div>
          {reportData && reportData?.data.length > 0 && (
            <div className="text-sm text-gray-500 bg-blue-50 rounded-lg px-2 py-1">
              <span className="font-medium">{reportData.data.length}</span> data ditemukan
            </div>
          )}
        </div>
        <div className="overflow-x-auto rounded-lg border bg-white mb-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Waktu</TableHead>
                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Operator</TableHead>
                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Binning</TableHead>
                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Picking</TableHead>
                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Total</TableHead>
                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Produktivitas / Orang</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-400">No data</TableCell>
                </TableRow>
              ) : (
                reportData?.data.slice(0, 10).map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>{row.operatorName}</TableCell>
                    <TableCell>{row.binningCount}</TableCell>
                    <TableCell>{row.pickingCount}</TableCell>
                    <TableCell>{row.totalItems}</TableCell>
                    <TableCell>{row.productivity.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Email & Format */}
        {/* <div className="mb-4">
          <label className="block text-sm font-medium text-gray-500 mb-1">Email address</label>
          <Input type="email" placeholder="" value={email} onChange={e => setEmail(e.target.value)} className="bg-gray-100" />
        </div> */}


        <div className="mb-6">
          <div className="font-medium text-gray-600 mb-2">Format</div>
          <div className="flex gap-2">
            <Button variant={exportFormat === "csv" ? "default" : "outline"} onClick={() => setExportFormat("csv")}>CSV</Button>
            <Button variant={exportFormat === "pdf" ? "default" : "outline"} onClick={() => setExportFormat("pdf")}>PDF</Button>
          </div>
        </div>
        {/* Actions */}
        <div className="flex gap-2">
          <Button className="w-full" onClick={() => handleExport()}>Export</Button>
        </div>
      </Card>
    </div>
  );
}
