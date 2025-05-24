"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
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
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { id as localeId } from "date-fns/locale";
import { DailyLog, DailyLogDetail } from "@/lib/types";
import { deleteDailyLog, getDailyLogById, getDailyLogs, getUsers, updateDailyLog } from "@/lib/api";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ROLES, SUB_ROLES_NAME } from "@/lib/constants";
import { useAuth } from "@/context/auth-context";

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

export default function DailyLogsPage() {
    const { user } = useAuth();

    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
    const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'logDate', direction: 'desc' });
    const [logs, setLogs] = useState<DailyLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalLogs, setTotalLogs] = useState(0);
    const [editLog, setEditLog] = useState<DailyLogDetail | null>(null);
    const [editBinning, setEditBinning] = useState(0);
    const [editPicking, setEditPicking] = useState(0);
    const [editWorkers, setEditWorkers] = useState<number[]>([]);
    const [editTotalItems, setEditTotalItems] = useState(0);
    const [editWorkNotes, setEditWorkNotes] = useState("");
    const [workers, setWorkers] = useState<any[]>([]);
    const [loadingWorkers, setLoadingWorkers] = useState(false);
    const [detailLog, setDetailLog] = useState<DailyLogDetail | null>(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [logDeleted, setLogDeleted] = useState<number>(0);
    const [logUpdated, setLogUpdated] = useState<number>(0);

    useEffect(() => {
        const fetchDailyLogs = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getDailyLogs({
                    page,
                    limit: pageSize,
                    search,
                    dateRange,
                    sort,
                });

                if (response?.data) {
                    setLogs(response.data.logs);

                    // Assuming the API returns total count in metadata
                    if (response.data?.total) {
                        setTotalLogs(response.data.total);
                    }
                } else {
                    console.error('Invalid logs data format:', response);
                    setLogs([]);
                    setError('Format data log tidak valid');
                }
            } catch (error: any) {
                console.error('Error fetching logs:', error);
                setLogs([]);
                setError(error?.message || 'Gagal memuat data log.');
            } finally {
                setLoading(false);
            }
        };

        fetchDailyLogs();
    }, [page, pageSize, search, dateRange, sort, logDeleted, logUpdated]);

    // Fetch workers on mount
    useEffect(() => {
        const fetchWorkers = async () => {
            setLoadingWorkers(true);
            try {
                const response = await getUsers({ role: 'operasional' });

                if (response?.data && Array.isArray(response.data)) {
                    setWorkers(response.data);
                } else {
                    setWorkers([]);
                }
            } catch (e) {
                setWorkers([]);
            } finally {
                setLoadingWorkers(false);
            }
        };

        if (user?.role === ROLES.KEPALA_GUDANG) {
            fetchWorkers();
        }
    }, [user?.role]);

    // Calculate total pages based on total items from API
    const totalPages = Math.ceil(totalLogs / pageSize);

    // Table headers with sort icons
    const headers = [
        { label: "Tanggal", key: "logDate" },
        { label: "Operator", key: "attendanceCount" },
        { label: "Binning", key: "binningCount" },
        { label: "Picking", key: "pickingCount" },
        { label: "Total Item", key: "totalItems" },
        { label: "Produktivitas", key: "productivity" },
        { label: "Actions", key: "actions" },
    ];

    if (user?.role !== ROLES.KEPALA_GUDANG) {
        headers.splice(headers.length - 1, 1);
    }

    const handleDelete = async (id: string) => {
        await deleteDailyLog(Number(id));
        setLogDeleted(Number(id));
    };

    // When opening edit dialog, set form state
    const openEditDialog = async (log: DailyLog) => {
        const logId = log.id;
        const response = await getDailyLogById(Number(logId));

        if (response?.data) {
            setEditLog(response.data);
            setEditBinning(response.data.binningCount);
            setEditPicking(response.data.pickingCount);
            setEditTotalItems(response.data.totalItems);
            setEditWorkers(response.data.attendance.map((a: any) => Number(a.operatorId)));
        } else {
            setError(`Gagal memuat data log ${log.logDate}`);
        }
    };

    const openDetailDialog = async (log: DailyLog) => {
        const logId = log.id;

        const response = await getDailyLogById(Number(logId));

        if (response?.data) {
            setDetailLog(response.data);
            setShowDetailDialog(true);
        } else {
            setError(`Gagal memuat data log ${log.logDate}`);
        }
    };

    const handleUpdateLog = async (id: number) => {
        await updateDailyLog(id, {
            binningCount: editBinning,
            pickingCount: editPicking,
            workerPresents: editWorkers.map(Number),
        });
        setEditLog(null);
        setEditBinning(0);
        setEditPicking(0);
        setEditWorkers([]);
        setEditTotalItems(0);
        setEditWorkNotes("");
        setError(null);

        setLogUpdated(id);
        setShowEditDialog(false);
    };

    return (
        <div className="px-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-1">Log Harian</h1>
            <p className="text-gray-600 mb-6">Riwayat log produktivitas harian tim</p>
            <Card className="p-6">
                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4 justify-between">
                    <div className="flex-1 max-w-xs">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Cari</label>
                        <div className="relative">
                            <Input
                                placeholder="Cari berdasarkan nama operator..."
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

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                        <p className="font-medium">Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border bg-white">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <p className="mt-2 text-gray-500">Memuat data log...</p>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            Tidak ada data log
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    {headers.map((h) => (
                                        <TableHead
                                            key={h.key}
                                            className={`py-3 font-medium text-gray-500 whitespace-nowrap ${h.key !== 'actions' ? 'cursor-pointer select-none' : 'text-right'}`}
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
                                {logs.length > 0 && logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-medium">
                                            {format(new Date(log.logDate), "dd MMMM yyyy", { locale: localeId })}
                                        </TableCell>
                                        <TableCell>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        {log.attendance.length > 0
                                                            ? `${log.attendance.length} hadir`
                                                            : "Tidak ada"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent side="right" align="start" className="min-w-[180px]">
                                                    <div className="font-semibold mb-2">Operator Hadir</div>
                                                    {log.attendance.length > 0 ? (
                                                        <ul className="space-y-1">
                                                            {log.attendance.map((a, idx) => (
                                                                <li key={idx} className="text-gray-700">{a.operatorName}  ({SUB_ROLES_NAME[a.operatorSubRole as keyof typeof SUB_ROLES_NAME]})</li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <div className="text-gray-400">Tidak ada operator hadir</div>
                                                    )}
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                        <TableCell>{log.binningCount}</TableCell>
                                        <TableCell>{log.pickingCount}</TableCell>
                                        <TableCell>{log.totalItems}</TableCell>
                                        <TableCell>
                                            <span className="px-2 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-600">
                                                {Math.round(log.productivity)}%
                                            </span>
                                        </TableCell>
                                        {user?.role === ROLES.KEPALA_GUDANG && (
                                            <TableCell className="text-right flex gap-2 justify-end">
                                                <Dialog open={showDetailDialog && detailLog?.id === log.id} onOpenChange={open => { setShowDetailDialog(open); if (!open) setDetailLog(null); }}>
                                                    <DialogTrigger asChild>
                                                        <Button size="sm" variant="outline" onClick={() => { openDetailDialog(log) }}>Detail</Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Detail Log Harian</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="space-y-3">
                                                            <div>
                                                                <span className="block text-xs text-gray-500">Tanggal</span>
                                                                <span className="font-medium">{format(new Date(log.logDate), "dd MMMM yyyy", { locale: localeId })}</span>
                                                            </div>
                                                            <div className="flex flex-row gap-4">
                                                                <div className="w-full">
                                                                    <span className="block text-xs text-gray-500">Binning</span>
                                                                    <span className="font-medium">{log.binningCount}</span>
                                                                </div>
                                                                <div className="w-full">
                                                                    <span className="block text-xs text-gray-500">Picking</span>
                                                                    <span className="font-medium">{log.pickingCount}</span>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <span className="block text-xs text-gray-500">Total Item</span>
                                                                <span className="font-medium">{log.totalItems}</span>
                                                            </div>
                                                            <div>
                                                                <span className="block text-xs text-gray-500">Produktivitas</span>
                                                                <span className="font-medium px-2 py-1 rounded bg-blue-50 text-blue-600">
                                                                    {Math.round(log.productivity)}%
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="block text-xs text-gray-500 mb-1">Karyawan Hadir</span>
                                                                {detailLog && detailLog.attendance.length > 0 ? (
                                                                    <ul className={`list-disc ml-5 text-sm ${detailLog?.attendance.length > 4 ? 'grid grid-cols-2 gap-x-2' : ''}`}>
                                                                        {detailLog?.attendance.map((a, idx) => (
                                                                            <li key={idx}>{a.operatorName} ({
                                                                                [SUB_ROLES_NAME[a.operatorSubRole as keyof typeof SUB_ROLES_NAME]]
                                                                            })</li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (
                                                                    <span className="text-gray-400">Tidak ada operator hadir</span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <span className="block text-xs text-gray-500 mb-1">Catatan</span>
                                                                <span className="font-medium">{detailLog?.workNotes ? detailLog?.workNotes : 'Tidak ada catatan'}</span>
                                                            </div>
                                                            <div>
                                                                <span className="block text-xs text-gray-500">Terakhir Diperbarui</span>
                                                                <span className="font-medium text-sm">{detailLog ? format(new Date(detailLog?.createdAt), "dd MMMM yyyy", { locale: localeId }) : ''}</span>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                                <Dialog open={showEditDialog && editLog?.id === log.id} onOpenChange={open => { setShowEditDialog(open); if (!open) setEditLog(null); }}>
                                                    <DialogTrigger asChild>
                                                        <Button size="sm" onClick={() => openEditDialog(log)}>Edit</Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Edit Log Harian</DialogTitle>
                                                            <DialogDescription>
                                                                Ubah data log harian di bawah ini, lalu simpan perubahan.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <form className="space-y-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-neutral-700 mb-1">Tanggal</label>
                                                                <Input value={editLog ? format(new Date(editLog.logDate), "dd MMMM yyyy", { locale: localeId }) : ''} disabled />
                                                            </div>
                                                            <div className="flex flex-row gap-4">
                                                                <div className="w-full">
                                                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Binning</label>
                                                                    <Input type="number" value={editBinning} onChange={e => setEditBinning(Number(e.target.value))} />
                                                                </div>
                                                                <div className="w-full">
                                                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Picking</label>
                                                                    <Input type="number" value={editPicking} onChange={e => setEditPicking(Number(e.target.value))} />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-neutral-700 mb-1">Total Item</label>
                                                                <Input type="number" value={editTotalItems} onChange={e => setEditTotalItems(Number(e.target.value))} disabled />
                                                            </div>
                                                            <div className="self-stretch flex flex-col justify-start items-start gap-2">
                                                                <Label className="text-neutral-700 text-sm font-medium leading-normal">
                                                                    Karyawan Hadir
                                                                </Label>
                                                                {loadingWorkers ? (
                                                                    <div className="w-full flex justify-center py-4">
                                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                                                    </div>
                                                                ) : workers.length === 0 ? (
                                                                    <div className="w-full text-center py-4 text-gray-500">
                                                                        Tidak ada data karyawan
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-full grid grid-cols-2 gap-x-6">
                                                                        {workers.map((worker) => (
                                                                            <div key={worker.id} className="py-2 flex justify-start items-center gap-3">
                                                                                <Checkbox
                                                                                    id={`worker-${worker.id}`}
                                                                                    checked={editWorkers.includes(worker.id)}
                                                                                    onCheckedChange={(checked) => {
                                                                                        if (checked) {
                                                                                            setEditWorkers([...editWorkers, worker.id]);
                                                                                        } else {
                                                                                            setEditWorkers(editWorkers.filter(id => id !== worker.id));
                                                                                        }
                                                                                    }}
                                                                                    className="w-5 h-5 rounded border-2 border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                                                                                />
                                                                                <Label
                                                                                    htmlFor={`worker-${worker.id}`}
                                                                                    className="text-neutral-900 text-sm font-normal leading-tight"
                                                                                >
                                                                                    {worker.fullName} ({SUB_ROLES_NAME[worker.subRole.name as keyof typeof SUB_ROLES_NAME]})
                                                                                </Label>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-neutral-700 mb-1">Catatan</label>
                                                                <Textarea value={editWorkNotes} onChange={e => setEditWorkNotes(e.target.value)} />
                                                            </div>
                                                        </form>
                                                        <DialogFooter>
                                                            <DialogClose asChild>
                                                                <Button type="button" variant="secondary">Batal</Button>
                                                            </DialogClose>
                                                            <Button type="button" onClick={() => handleUpdateLog(log.id)}>Simpan</Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button size="sm" variant="destructive">Hapus</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Hapus Log?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Apakah Anda yakin ingin menghapus log harian ini? Tindakan ini tidak dapat dibatalkan.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-600 hover:bg-red-700"
                                                                onClick={() => handleDelete(String(log.id))}
                                                            >
                                                                Hapus
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>

                {/* Pagination & Show N */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm justify-center md:justify-start">
                        <span>Menampilkan</span>
                        <Select
                            value={String(pageSize)}
                            onValueChange={v => {
                                setPageSize(Number(v));
                                setPage(1); // Reset to first page when changing page size
                            }}
                        >
                            <SelectTrigger className="w-16">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PAGE_SIZE_OPTIONS.map(opt => (
                                    <SelectItem key={opt} value={String(opt)}>{opt}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span className="whitespace-nowrap">/ {totalLogs} data</span>
                    </div>
                    <Pagination className="justify-center md:justify-end">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious className="cursor-pointer"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                />
                            </PaginationItem>
                            {page > 2 && (
                                <PaginationItem>
                                    <PaginationLink className="cursor-pointer" onClick={() => setPage(1)}>1</PaginationLink>
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
                                        <PaginationLink className={`cursor-pointer ${p === page ? 'bg-blue-500 text-white' : ''}`} onClick={() => setPage(p)}>{p}</PaginationLink>
                                    </PaginationItem>
                                ))}
                            {page < totalPages - 2 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
                            {page < totalPages - 1 && (
                                <PaginationItem>
                                    <PaginationLink className="cursor-pointer" onClick={() => setPage(totalPages)}>{totalPages}</PaginationLink>
                                </PaginationItem>
                            )}
                            <PaginationItem>
                                <PaginationNext className="cursor-pointer"
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </Card>
        </div>
    );
}
