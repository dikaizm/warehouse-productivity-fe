"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search } from "lucide-react";
import { format, isValid } from "date-fns";
import { DateRange } from "react-day-picker";
import { id as localeId } from "date-fns/locale";

// Mock data
const MOCK_DATA = [
    {
        date: "2022-07-22",
        operator: "John Doe",
        binning: 120,
        picking: 100,
        total: 220,
        productivity: 0.85,
    },
    {
        date: "2022-07-21",
        operator: "Jane Smith",
        binning: 130,
        picking: 110,
        total: 240,
        productivity: 0.9,
    },
    {
        date: "2022-07-20",
        operator: "Michael Johnson",
        binning: 140,
        picking: 120,
        total: 260,
        productivity: 0.95,
    },
    {
        date: "2022-07-19",
        operator: "Emily Davis",
        binning: 150,
        picking: 130,
        total: 280,
        productivity: 1.0,
    },
    // 6x Robert Brown for demo
    ...Array(6).fill({
        date: "2022-07-18",
        operator: "Robert Brown",
        binning: 160,
        picking: 140,
        total: 300,
        productivity: 1.05,
    }),
];

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

export default function DailyLogsPage() {
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
    const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });

    // Filtering logic
    const filteredData = MOCK_DATA.filter((row) => {
        const matchesSearch = row.operator.toLowerCase().includes(search.toLowerCase());
        let matchesDate = true;
        if (dateRange?.from && dateRange?.to) {
            const rowDate = new Date(row.date);
            matchesDate = rowDate >= dateRange.from && rowDate <= dateRange.to;
        }
        return matchesSearch && matchesDate;
    });

    // Sorting logic
    const sortedData = [...filteredData].sort((a, b) => {
        const { key, direction } = sort;
        let aValue = a[key];
        let bValue = b[key];
        // For date, compare as Date
        if (key === 'date') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        }
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    // Pagination logic
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const paginatedData = sortedData.slice((page - 1) * pageSize, page * pageSize);

    // Table headers with sort icons (static for now)
    const headers = [
        { label: "Tanggal", key: "date" },
        { label: "Nama Operator", key: "operator" },
        { label: "Binning Item", key: "binning" },
        { label: "Picking Item", key: "picking" },
        { label: "Total Items/Day", key: "total" },
        { label: "Produktivitas", key: "productivity" },
        { label: "", key: "actions" },
    ];

    return (
        <div className="p-8 md:p-10 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-1">Daily Log</h1>
            <p className="text-gray-400 mb-6">Lorem ipsum</p>
            <Card className="p-6">
                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4 justify-between">
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
                    <div className="flex-1 max-w-60">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Tanggal</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateRange?.from && dateRange?.to
                                        ? `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`
                                        : <span className="text-gray-400">Pilih rentang tanggal</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="range"
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    numberOfMonths={2}
                                    locale={localeId}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                {/* Table */}
                <div className="overflow-x-auto rounded-lg border bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-100">
                                {headers.map((h, i) => (
                                    <TableHead
                                        key={h.key}
                                        className={`py-3 font-medium text-gray-500 whitespace-nowrap ${h.key !== 'actions' ? 'cursor-pointer select-none' : ''}`}
                                        onClick={() => {
                                            if (h.key === 'actions') return;
                                            setSort(prev =>
                                                prev.key === h.key
                                                    ? { key: h.key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
                                                    : { key: h.key, direction: 'asc' }
                                            );
                                        }}
                                    >
                                        <span className="flex flex-row items-center gap-1">
                                            {h.label}
                                            {h.key !== 'actions' && (
                                                <span className="flex flex-col items-center text-xs leading-none ml-1">
                                                    <span className={sort.key === h.key && sort.direction === 'asc' ? 'text-black' : 'text-gray-300'}>▲</span>
                                                    <span className={sort.key === h.key && sort.direction === 'desc' ? 'text-black' : 'text-gray-300'}>▼</span>
                                                </span>
                                            )}
                                        </span>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={headers.length} className="text-center py-8 text-gray-400">Tidak ada data</TableCell>
                                </TableRow>
                            ) : (
                                paginatedData.map((row, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{format(new Date(row.date), "MMM dd, yyyy")}</TableCell>
                                        <TableCell>{row.operator}</TableCell>
                                        <TableCell>{row.binning}</TableCell>
                                        <TableCell>{row.picking}</TableCell>
                                        <TableCell>{row.total}</TableCell>
                                        <TableCell>{row.productivity.toFixed(2)}</TableCell>
                                        <TableCell className="text-blue-600 font-medium flex gap-2">
                                            <Button size="sm">Edit</Button>
                                            <Button size="sm" variant="destructive">Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                {/* Pagination & Show N */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm justify-center md:justify-start">
                        <span>Menampilkan</span>
                        <Select value={String(pageSize)} onValueChange={v => { setPageSize(Number(v)); setPage(1); }}>
                            <SelectTrigger className="w-16">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PAGE_SIZE_OPTIONS.map(opt => (
                                    <SelectItem key={opt} value={String(opt)}>{opt}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Pagination className="justify-center md:justify-end">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious>
                                    <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} />
                                </PaginationPrevious>
                            </PaginationItem>
                            {page > 2 && (
                                <PaginationItem>
                                    <PaginationLink>
                                        <button onClick={() => setPage(1)}>1</button>
                                    </PaginationLink>
                                </PaginationItem>
                            )}
                            {page > 3 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(p => Math.abs(p - page) <= 1)
                                .map(p => (
                                    <PaginationItem key={p}>
                                        <PaginationLink isActive={p === page}>
                                            <button onClick={() => setPage(p)}>{p}</button>
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                            {page < totalPages - 2 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
                            {page < totalPages - 1 && (
                                <PaginationItem>
                                    <PaginationLink>
                                        <button onClick={() => setPage(totalPages)}>{totalPages}</button>
                                    </PaginationLink>
                                </PaginationItem>
                            )}
                            <PaginationItem>
                                <PaginationNext>
                                    <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => Math.min(totalPages, p + 1))} />
                                </PaginationNext>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </Card>
        </div>
    );
}
