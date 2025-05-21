"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { postDailyLog, getUsers } from '@/lib/api';
import { User } from "@/lib/types";

export default function DailyLogsPage() {
  const [date, setDate] = useState<Date>();
  const [binningCount, setBinningCount] = useState<number>(0);
  const [pickingCount, setPickingCount] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [selectedWorkers, setSelectedWorkers] = useState<number[]>([]);
  const [workNotes, setWorkNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [workers, setWorkers] = useState<User[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoadingWorkers(true);
        const response = await getUsers({ role: 'operasional' });
        if (response?.data && Array.isArray(response.data)) {
          setWorkers(response.data);
        } else {
          console.error('Invalid workers data format:', response);
          setWorkers([]);
          setErrorMsg('Format data karyawan tidak valid');
        }
      } catch (error: any) {
        console.error('Error fetching workers:', error);
        setWorkers([]);
        setErrorMsg(error?.message || 'Gagal memuat data karyawan.');
      } finally {
        setLoadingWorkers(false);
      }
    };

    fetchWorkers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setErrorMsg(null);
    try {
      await postDailyLog({
        logDate: date ? date.toISOString() : '',
        binningCount: Number(binningCount),
        pickingCount: Number(pickingCount),
        totalItems: Number(totalItems),
        workerPresents: selectedWorkers,
        workNotes: workNotes || undefined,
      });
      setSuccess('Log harian berhasil dikirim!');

      // Reset form
      setDate(undefined);
      setBinningCount(0);
      setPickingCount(0);
      setTotalItems(0);
      setSelectedWorkers([]);
      setWorkNotes('');
    } catch (error: any) {
      setErrorMsg(error?.message || 'Gagal mengirim log harian.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTotalItems(Number(binningCount) + Number(pickingCount));
  }, [binningCount, pickingCount]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[960px] mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-G900">Input Log Harian</h1>
          <p className="text-G600">Masukkan data produktivitas harian tim Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full p-4 bg-white rounded-xl flex flex-col justify-start items-start gap-6 overflow-hidden">
          {success && <div className="w-full p-3 mb-2 rounded bg-green-100 text-green-700">{success}</div>}
          {errorMsg && <div className="w-full p-3 mb-2 rounded bg-red-100 text-red-700">{errorMsg}</div>}

          {/* Date Input */}
          <div className="w-full md:w-80 flex flex-col justify-start items-start gap-1">
            <Label className="text-neutral-900 text-sm font-medium leading-tight">
              Tanggal
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 pl-4 pr-4 justify-start text-left font-normal border-G300 text-base",
                    !date && "text-G500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "dd/MM/yyyy", { locale: id })
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Count Inputs */}
          <div className="self-stretch flex flex-col md:flex-row justify-start items-start gap-6">
            <div className="w-full md:flex-1 flex flex-col justify-end items-start gap-1 md:gap-4">
              <div className="self-stretch min-w-40 flex flex-col justify-start items-start">
                <Label className="pb-1 text-neutral-900 text-sm font-medium leading-tight">
                  Item Binning
                </Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={binningCount}
                  onChange={(e) => {
                    // Only allow digits
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    // Remove leading zeros
                    const cleanValue = value.replace(/^0+/, '');
                    setBinningCount(cleanValue === '' ? 0 : Number(cleanValue));
                  }}
                  className="w-full h-14 px-5 text-base border-G300 placeholder:text-G500 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="w-full md:flex-1 flex flex-col justify-end items-start gap-1 md:gap-4">
              <div className="self-stretch min-w-40 flex flex-col justify-start items-start">
                <Label className="pb-1 text-neutral-900 text-sm font-medium leading-tight">
                  Item Picking
                </Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={pickingCount}
                  onChange={(e) => {
                    // Only allow digits
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    // Remove leading zeros
                    const cleanValue = value.replace(/^0+/, '');
                    setPickingCount(cleanValue === '' ? 0 : Number(cleanValue));
                  }}
                  className="w-full h-14 px-5 text-base border-G300 placeholder:text-G500 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="w-full md:flex-1 flex flex-col justify-end items-start gap-1 md:gap-4">
              <div className="self-stretch min-w-40 flex flex-col justify-start items-start">
                <Label className="pb-1 text-neutral-900 text-sm font-medium leading-tight">
                  Total Target Item
                </Label>
                <Input
                  type="number"
                  value={totalItems}
                  onChange={(e) => setTotalItems(Number(e.target.value))}
                  className="w-full h-14 px-5 text-base border-G300 placeholder:text-G500 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="0"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Worker Selection */}
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <Label className="text-neutral-900 text-base font-medium leading-normal">
              Karyawan Hadir
            </Label>
            {loadingWorkers ? (
              <div className="w-full flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : !Array.isArray(workers) || workers.length === 0 ? (
              <div className="w-full text-center py-4 text-gray-500">
                {!Array.isArray(workers) ? 'Data karyawan tidak valid' : 'Tidak ada data karyawan'}
              </div>
            ) : (
              <div className="w-full md:w-[496px] flex flex-wrap justify-start items-start gap-x-6">
                {workers.map((worker) => (
                  <div key={worker.id} className="w-full sm:w-56 py-3 flex justify-start items-center gap-3">
                    <Checkbox
                      id={`worker-${worker.id}`}
                      checked={selectedWorkers.includes(worker.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedWorkers([...selectedWorkers, worker.id]);
                        } else {
                          setSelectedWorkers(selectedWorkers.filter(id => id !== worker.id));
                        }
                      }}
                      className="w-5 h-5 rounded border-2 border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                    />
                    <Label
                      htmlFor={`worker-${worker.id}`}
                      className="text-neutral-900 text-sm font-normal leading-tight"
                    >
                      {worker.fullName} ({worker.role.name})
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Work Notes */}
          <div className="self-stretch flex flex-col justify-start items-start gap-1 w-full">
            <Label className="pb-1 text-neutral-900 text-sm font-medium leading-tight">
              Catatan (Opsional)
            </Label>
            <Textarea
              value={workNotes}
              onChange={(e) => setWorkNotes(e.target.value)}
              className="w-full min-h-36 p-3.5 bg-white rounded-xl border border-G300 resize-none placeholder:text-G500 text-base focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan catatan atau kendala..."
            />
          </div>

          {/* Action Buttons */}
          <div className="self-stretch flex justify-end items-start pt-2">
            <div className="flex justify-end items-start gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-12 px-6 py-3.5 rounded-lg border border-G300 text-G700 text-base font-semibold hover:bg-G100"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="h-12 px-6 py-3.5 bg-blue-600 rounded-lg text-white text-base font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Memuat..." : "Kirim"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 