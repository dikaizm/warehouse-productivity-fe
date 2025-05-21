"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { createUser, getUsers, deleteUser, updateUser } from "@/lib/api";
import { User, UserFormRequest } from "@/lib/types";
import { ChevronDown, Plus, Eye, EyeOff } from "lucide-react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
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
import { useAuth } from "@/context/auth-context";
import { ROLES, ROLES_NAME, SUB_ROLES, SUB_ROLES_NAME } from "@/lib/constants";

export default function SettingsPage() {
    const { user } = useAuth();

    const [workSchedule] = useState("Senin - Sabtu");
    const [dailyTarget] = useState(55);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editForm, setEditForm] = useState<UserFormRequest>({
        fullName: "",
        username: "",
        email: "",
        password: "",
        role: "",
        subRole: "",
    });
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);
    const [showAddPassword, setShowAddPassword] = useState(false);
    const [showEditPassword, setShowEditPassword] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getUsers();

                if (response?.data && Array.isArray(response.data)) {
                    setUsers(response.data);
                } else {
                    console.error('Invalid users data format:', response);
                    setUsers([]);
                    setError('Format data pengguna tidak valid');
                }
            } catch (error: any) {
                console.error('Error fetching users:', error);
                setUsers([]);
                setError(error?.message || 'Gagal memuat data pengguna.');
            } finally {
                setLoading(false);
            }
        };

        if (user?.role === ROLES.KEPALA_GUDANG) {
            fetchUsers();
        }
    }, [user?.role]);

    const handleOpenDeleteDialog = (user: User) => {
        setUserToDelete(user);
        setDeleteError(null);
        setShowDeleteDialog(true);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        setLoading(true);
        setDeleteError(null);
        try {
            const res = await deleteUser(userToDelete.id);
            if (res?.success || res?.data) {
                setUsers(users.filter(u => u.id !== userToDelete.id));
                setShowDeleteDialog(false);
                setUserToDelete(null);
            } else {
                setDeleteError(res?.message || 'Gagal menghapus pengguna.');
            }
        } catch (err: any) {
            setDeleteError(err?.message || 'Gagal menghapus pengguna.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await createUser(editForm);
            if (res?.data) {
                setUsers([...users, res.data]);
                setShowAddDialog(false);
                setEditForm({
                    fullName: "",
                    username: "",
                    email: "",
                    password: "",
                    role: "",
                    subRole: "",
                });
            } else {
                setError(res?.message || 'Gagal menambahkan pengguna.');
            }
        } catch (err: any) {
            setError(err?.message || 'Gagal menambahkan pengguna.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEditDialog = (user: User) => {
        setEditForm({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            role: user.role.name,
            subRole: user.subRole.name,
            password: '',
        });
        setEditError(null);
        setShowEditDialog(true);
    };

    const handleEditRoleChange = (role: string) => {
        setEditForm(f => ({ ...f, role }));

        if (role !== ROLES.OPERASIONAL) {
            setEditForm(f => ({ ...f, subRole: '' }));
        }
    };

    const handleEditSubRoleChange = (subRole: string) => {
        setEditForm(f => ({ ...f, subRole }));
    };

    const handleEditUser = async () => {
        setLoading(true);
        setEditError(null);
        try {
            if (!editForm.id) {
                throw new Error('User ID is required');
            }

            const res = await updateUser(editForm.id, {
                fullName: editForm.fullName,
                username: editForm.username,
                email: editForm.email,
                role: editForm.role,
                subRole: editForm.subRole,
            });
            if (res?.data) {
                setUsers(users.map(u => u.id === editForm.id ? { ...u, ...res.data } : u));
                setShowEditDialog(false);
            } else {
                setEditError(res?.message || 'Gagal mengedit pengguna.');
            }
        } catch (err: any) {
            setEditError(err?.message || 'Gagal mengedit pengguna.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-8 max-w-7xl mx-auto min-h-screen">
            <h1 className="text-3xl font-bold mb-1">Pengaturan</h1>
            <p className="text-gray-600 mb-6">Kelola pengaturan sistem dan pengguna</p>

            {/* System Settings */}
            <Card className="p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Pengaturan Sistem</h2>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Jadwal Kerja Standar</label>
                        <Input value={workSchedule} disabled className="bg-gray-100" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Target Produktivitas Harian</label>
                        <Input value={dailyTarget} disabled className="bg-gray-100" />
                    </div>
                </div>
            </Card>

            {user?.role === ROLES.KEPALA_GUDANG && (
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Manajemen Pengguna</h2>
                        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                            <DialogTrigger asChild>
                                <Button
                                    onClick={() => setShowAddDialog(true)}
                                    className="font-semibold text-base px-6 py-2"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tambah Pengguna
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Tambah Pengguna</DialogTitle>
                                </DialogHeader>
                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                                        <p className="font-medium">Error</p>
                                        <p className="text-sm">{error}</p>
                                    </div>
                                )}
                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Nama Lengkap</label>
                                        <Input placeholder="Nama Lengkap" value={editForm.fullName} onChange={e => setEditForm(f => ({ ...f, fullName: e.target.value }))} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
                                        <Input placeholder="Username" value={editForm.username} onChange={e => setEditForm(f => ({ ...f, username: e.target.value }))} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                                        <Input type="email" placeholder="Email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Password</label>
                                        <div className="relative">
                                            <Input
                                                type={showAddPassword ? "text" : "password"}
                                                placeholder="Password"
                                                value={editForm.password}
                                                onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowAddPassword(!showAddPassword)}
                                            >
                                                {showAddPassword ? (
                                                    <Eye className="h-4 w-4 text-gray-500" />
                                                ) : (
                                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-1/2">
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-between">
                                                        {editForm.role ? ROLES_NAME[editForm.role as keyof typeof ROLES_NAME] : "Pilih Role"}
                                                        <ChevronDown className="w-4 h-4 ml-2" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-full">
                                                    <DropdownMenuItem onClick={() => handleEditRoleChange(ROLES.KEPALA_GUDANG)}>Kepala Gudang</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleEditRoleChange(ROLES.OPERASIONAL)}>Operasional</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleEditRoleChange(ROLES.ADMIN_LOGISTIK)}>Admin Logistik</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Sub Role</label>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-between" disabled={editForm.role !== ROLES.OPERASIONAL}>
                                                        {editForm.subRole ? SUB_ROLES_NAME[editForm.subRole as keyof typeof SUB_ROLES_NAME] : "Pilih Sub Role"}
                                                        <ChevronDown className="w-4 h-4 ml-2" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-full">
                                                    {editForm.role === ROLES.OPERASIONAL && (
                                                        <>
                                                            <DropdownMenuItem onClick={() => handleEditSubRoleChange(SUB_ROLES.LEADER_INCOMING)}>Leader Incoming</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleEditSubRoleChange(SUB_ROLES.GOOD_RECEIVE)}>Good Receive</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleEditSubRoleChange(SUB_ROLES.QUALITY_INSPECTION)}>Quality Inspection</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleEditSubRoleChange(SUB_ROLES.BINNING)}>Binning</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleEditSubRoleChange(SUB_ROLES.LEADER_OUTGOING)}>Leader Outgoing</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleEditSubRoleChange(SUB_ROLES.PICKING)}>Picking</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleEditSubRoleChange(SUB_ROLES.QUALITY_CONTROL)}>Quality Control</DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </form>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">Batal</Button>
                                    </DialogClose>
                                    <Button type="button" onClick={handleAddUser}
                                        disabled={!editForm.fullName || !editForm.username || !editForm.email || !editForm.password || !editForm.role || (editForm.role === ROLES.OPERASIONAL && !editForm.subRole)}
                                    >Simpan</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                            <p className="font-medium">Error</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <div className="overflow-x-auto rounded-lg border bg-white">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                <p className="mt-2 text-gray-500">Memuat data pengguna...</p>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                Tidak ada data pengguna
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="py-3 font-medium text-gray-500">Nama</TableHead>
                                        <TableHead className="py-3 font-medium text-gray-500">Email</TableHead>
                                        <TableHead className="py-3 font-medium text-gray-500">Role</TableHead>
                                        <TableHead className="py-3 font-medium text-gray-500">Username</TableHead>
                                        <TableHead className="py-3 font-medium text-gray-500 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.fullName}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <span className="px-2 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-600">
                                                    {ROLES_NAME[user.role.name as keyof typeof ROLES_NAME]}
                                                </span>
                                            </TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell className="text-right flex gap-2 justify-end">
                                                <Button size="sm" onClick={() => handleOpenEditDialog(user)}>Edit</Button>
                                                <AlertDialog open={showDeleteDialog && userToDelete?.id === user.id} onOpenChange={setShowDeleteDialog}>
                                                    <AlertDialogTrigger asChild>
                                                        <Button size="sm" variant="destructive" onClick={() => handleOpenDeleteDialog(user)}>Delete</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Hapus Pengguna?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Apakah Anda yakin ingin menghapus pengguna <b>{userToDelete?.fullName}</b>?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        {deleteError && (
                                                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                                                                <p className="font-medium">Error</p>
                                                                <p className="text-sm">{deleteError}</p>
                                                            </div>
                                                        )}
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                                            <AlertDialogAction onClick={handleDeleteUser} disabled={loading} className="bg-red-600 text-white hover:bg-red-700">
                                                                Hapus
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </Card>
            )
            }


            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Pengguna</DialogTitle>
                    </DialogHeader>
                    {editError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                            <p className="font-medium">Error</p>
                            <p className="text-sm">{editError}</p>
                        </div>
                    )}
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Nama Lengkap</label>
                            <Input value={editForm.fullName} onChange={e => setEditForm(f => ({ ...f, fullName: e.target.value }))} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
                            <Input value={editForm.username} onChange={e => setEditForm(f => ({ ...f, username: e.target.value }))} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                            <Input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Password</label>
                            <div className="relative">
                                <Input
                                    type={showEditPassword ? "text" : "password"}
                                    value={editForm.password}
                                    onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowEditPassword(!showEditPassword)}
                                >
                                    {showEditPassword ? (
                                        <Eye className="h-4 w-4 text-gray-500" />
                                    ) : (
                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between">
                                            {editForm.role ? ROLES_NAME[editForm.role as keyof typeof ROLES_NAME] : "Pilih Role"}
                                            <ChevronDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-full">
                                        <DropdownMenuItem onClick={() => handleEditRoleChange('kepala_gudang')}>Kepala Gudang</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleEditRoleChange('operasional')}>Operasional</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleEditRoleChange('admin_logistik')}>Admin Logistik</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-gray-500 mb-1">Sub Role</label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between" disabled={editForm.role !== ROLES.OPERASIONAL}>
                                            {editForm.subRole ? SUB_ROLES_NAME[editForm.subRole as keyof typeof SUB_ROLES_NAME] : "Pilih Sub Role"}
                                            <ChevronDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-full">
                                        {editForm.role === ROLES.OPERASIONAL && (
                                            <>
                                                <DropdownMenuItem onClick={() => handleEditSubRoleChange(SUB_ROLES.LEADER_INCOMING)}>Leader Incoming</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEditSubRoleChange(SUB_ROLES.GOOD_RECEIVE)}>Good Receive</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEditSubRoleChange(SUB_ROLES.QUALITY_INSPECTION)}>Quality Inspection</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEditSubRoleChange(SUB_ROLES.BINNING)}>Binning</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEditSubRoleChange(SUB_ROLES.LEADER_OUTGOING)}>Leader Outgoing</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEditSubRoleChange(SUB_ROLES.PICKING)}>Picking</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEditSubRoleChange(SUB_ROLES.QUALITY_CONTROL)}>Quality Control</DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </form>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Batal</Button>
                        </DialogClose>
                        <Button type="button" onClick={handleEditUser} disabled={!editForm.fullName || !editForm.username || !editForm.email || !editForm.role || (editForm.role === ROLES.OPERASIONAL && !editForm.subRole) || loading}>Simpan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
