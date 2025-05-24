"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Search } from "lucide-react";
import type { TopPerformer } from "@/lib/types";
import { getTopPerformers } from "@/lib/api";
import { SUB_ROLES_NAME, TEAM_CATEGORY_NAME } from "@/lib/constants";

export default function TopPerformersPage() {
    const [search, setSearch] = useState("");
    const [performers, setPerformers] = useState<TopPerformer[]>([]);

    useEffect(() => {
        getTopPerformers(search).then((res: TopPerformer[]) => {
            setPerformers(res);
        });
    }, [search]);

    return (
        <div className="px-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-1">Top Performers</h1>
            <p className="text-gray-400 mb-6">Lihat operator dengan performa terbaik berdasarkan data produktivitas.</p>
            <Card className="p-6">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Cari</label>
                    <div className="relative max-w-md">
                        <Input
                            placeholder="Cari nama operator"
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
                                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Operator</TableHead>
                                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Peran Operator</TableHead>
                                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Produktivitas Bulanan</TableHead>
                                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Hari Kerja Bulanan</TableHead>
                                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Pencapaian vs Target Bulanan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {performers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-gray-400">No data</TableCell>
                                </TableRow>
                            ) : (
                                performers.map((row, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{row.operatorName}</TableCell>
                                        <TableCell>{TEAM_CATEGORY_NAME[row.operatorSubRole.teamCategory as keyof typeof TEAM_CATEGORY_NAME]} ({SUB_ROLES_NAME[row.operatorSubRole.name as keyof typeof SUB_ROLES_NAME]})</TableCell>
                                        <TableCell className="text-blue-500 font-medium">{row.avgMonthlyProductivity}</TableCell>
                                        <TableCell className="text-blue-500 font-medium">{row.avgMonthlyWorkdays}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-sm font-medium  ${row.productivity.avgActual >= row.productivity.target ? 'text-blue-600 bg-blue-50' : 'text-red-500 bg-red-50'}`}>
                                                {row.productivity.avgActual} / {row.productivity.target}
                                            </span>
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
