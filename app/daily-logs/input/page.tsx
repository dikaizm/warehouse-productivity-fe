"use client";

import { useState } from "react";
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

// Mock data for workers - replace with actual data from API
const mockWorkers = [
  { id: 1, name: "John Doe", role: "Picker" },
  { id: 2, name: "Jane Smith", role: "Binner" },
  { id: 3, name: "Mike Johnson", role: "Picker" },
  { id: 4, name: "Sarah Williams", role: "Binner" },
  { id: 5, name: "David Brown", role: "Picker" },
  { id: 6, name: "Lisa Davis", role: "Binner" },
  { id: 7, name: "Tom Wilson", role: "Picker" },
  { id: 8, name: "Emma Taylor", role: "Binner" },
];

export default function DailyLogsPage() {
  const [date, setDate] = useState<Date>();
  const [binningCount, setBinningCount] = useState("");
  const [pickingCount, setPickingCount] = useState("");
  const [totalItems, setTotalItems] = useState("");
  const [selectedWorkers, setSelectedWorkers] = useState<number[]>([]);
  const [workNotes, setWorkNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Add your API call here
      console.log({
        date,
        binningCount,
        pickingCount,
        totalItems,
        selectedWorkers,
        workNotes,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[960px] mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-G900">Input Log Harian</h1>
          <p className="text-G600">Masukkan data produktivitas harian tim Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full p-4 bg-white rounded-xl flex flex-col justify-start items-start gap-6 overflow-hidden">
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
                  type="number"
                  value={binningCount}
                  onChange={(e) => setBinningCount(e.target.value)}
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
                  type="number"
                  value={pickingCount}
                  onChange={(e) => setPickingCount(e.target.value)}
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
                  onChange={(e) => setTotalItems(e.target.value)}
                  className="w-full h-14 px-5 text-base border-G300 placeholder:text-G500 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Worker Selection */}
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <Label className="text-neutral-900 text-base font-medium leading-normal">
              Karyawan Hadir
            </Label>
            <div className="w-full md:w-[496px] flex flex-wrap justify-start items-start gap-x-6">
              {mockWorkers.map((worker) => (
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
                    {worker.name} ({worker.role})
                  </Label>
                </div>
              ))}
            </div>
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