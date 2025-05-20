"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Search } from "lucide-react";
import type { TopPerformer } from "@/lib/types";

// Mock data
const MOCK_PERFORMERS: TopPerformer[] = [
  { operatorName: "Alice", averageMonthlyProductivity: 120, monthlyWorkdays: 22, achievementVsTarget: 80 },
  { operatorName: "Bob", averageMonthlyProductivity: 90, monthlyWorkdays: 20, achievementVsTarget: 60 },
  { operatorName: "Charlie", averageMonthlyProductivity: 110, monthlyWorkdays: 25, achievementVsTarget: 70 },
  { operatorName: "David", averageMonthlyProductivity: 100, monthlyWorkdays: 21, achievementVsTarget: 65 },
  { operatorName: "Ella", averageMonthlyProductivity: 130, monthlyWorkdays: 24, achievementVsTarget: 85 },
  { operatorName: "Ella", averageMonthlyProductivity: 130, monthlyWorkdays: 24, achievementVsTarget: 85 },
  { operatorName: "Ella", averageMonthlyProductivity: 130, monthlyWorkdays: 24, achievementVsTarget: 85 },
  { operatorName: "Ella", averageMonthlyProductivity: 130, monthlyWorkdays: 24, achievementVsTarget: 85 },
];

export default function TopPerformersPage() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_PERFORMERS.filter(p =>
    p.operatorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Top Performers</h1>
      <p className="text-gray-400 mb-6">Lorem ipsum</p>
      <Card className="p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-500 mb-1">Cari</label>
          <div className="relative max-w-md">
            <Input
              placeholder="Search for a name"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Operator Name</TableHead>
                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Average Monthly Productivity</TableHead>
                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Monthly Workdays</TableHead>
                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Achievement vs Target</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-400">No data</TableCell>
                </TableRow>
              ) : (
                filtered.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.operatorName}</TableCell>
                    <TableCell className="text-blue-500 font-medium">{row.averageMonthlyProductivity}</TableCell>
                    <TableCell className="text-blue-500 font-medium">{row.monthlyWorkdays}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4 min-w-[120px]">
                        <div className="flex-1">
                          <Progress value={row.achievementVsTarget} className="h-2 bg-gray-200" />
                        </div>
                        <span className="ml-2 text-gray-700 font-medium">{row.achievementVsTarget}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
