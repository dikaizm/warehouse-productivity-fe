"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

const MOCK_USERS = [
  { name: "Anna", email: "Anna", role: "Admin", access: "Full Access" },
  { name: "Bob", email: "Bob", role: "Operator", access: "View" },
  { name: "Chris", email: "Chris", role: "Operator", access: "View" },
  { name: "David", email: "David", role: "Operator", access: "View" },
  { name: "Eva", email: "David", role: "Operator", access: "View" },
];

export default function SettingsPage() {
  const [workSchedule] = useState("Senin - Sabtu");
  const [dailyTarget] = useState(55);

  return (
    <div className="p-8 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Settings</h1>
      <p className="text-gray-400 mb-6">View and export your data</p>
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-500 mb-1">Jadwal Kerja Standar</label>
            <Input value={workSchedule} disabled className="bg-gray-100" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-500 mb-1">Target Produktivitas Harian</label>
            <Input value={dailyTarget} disabled className="bg-gray-100" />
          </div>
        </div>
        <div className="flex items-center justify-between mb-2 mt-2">
          <div className="text-lg font-semibold">User Management & Access Control</div>
          <Button variant="outline" className="font-semibold text-base px-6 py-2 bg-gray-100">Tambah User</Button>
        </div>
        <div className="overflow-x-auto rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Nama</TableHead>
                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Email</TableHead>
                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Role/Position</TableHead>
                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Access Level</TableHead>
                <TableHead className="py-3 font-medium text-gray-500 whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_USERS.map((user, idx) => (
                <TableRow key={idx}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={user.role === "Admin" ? "text-blue-600 font-medium" : "text-blue-500 font-medium"}>{user.role}</span>
                  </TableCell>
                  <TableCell>
                    <span className={user.access === "Full Access" ? "text-blue-600 font-medium" : "text-blue-500 font-medium"}>{user.access}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-700 font-medium cursor-pointer hover:underline">Edit</span>
                    <span className="mx-2 text-gray-400">|</span>
                    <span className="text-gray-700 font-medium cursor-pointer hover:underline">Delete</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
