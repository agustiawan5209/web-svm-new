import { DeleteConfirmationForm } from '@/components/delete-confirmation-form';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, KriteriaTypes } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, PenBox, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
interface KriteriaIndexProps {
    kriteria: KriteriaTypes[];
    breadcrumb?: BreadcrumbItem[];
    titlePage?: string;
}
type kriteriaFormData = {
    id: number | null;
    nama: string;
    deskripsi: string;
};

export default function KriteriaIndex({ kriteria, breadcrumb, titlePage }: KriteriaIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    const { data, setData, get, post, put, processing, errors, reset } = useForm<kriteriaFormData>({
        id: null,
        nama: '',
        deskripsi: '',
    });

    const [editId, setEditId] = useState<number | null>(null);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (editId == null) {
            post(route('admin.kriteria.store'), {
                preserveState: true,
                onSuccess: () => {
                    setData({
                        id: null,
                        nama: '',
                        deskripsi: '',
                    });
                    setIsOpenDialog(false);
                },
                onError: (errors) => {
                    console.error(errors);
                },
            });
        } else {
            put(route('admin.kriteria.update', { kriteria: editId }), {
                preserveState: true,
                onSuccess: () => {
                    setData({
                        id: null,
                        nama: '',
                        deskripsi: '',
                    });
                    setEditId(null);
                    setIsOpenDialog(false);
                },
                onError: (errors) => {
                    console.error(errors);
                },
            });
        }
    };

    const [isOpenDialog, setIsOpenDialog] = useState(false);

    const handleEdit = (id: number) => {
        if (id) {
            const kriteriaTemp: KriteriaTypes[] = kriteria.filter((item) => item.id === id, []);
            setEditId(kriteriaTemp[0].id);
            if (kriteriaTemp) {
                setData({
                    id: kriteriaTemp[0].id,
                    nama: kriteriaTemp[0].nama,
                    deskripsi: kriteriaTemp[0].deskripsi,
                });
            }
            setIsOpenDialog(true);
        }
    };

    const [isDeleteDialog, setisDeleteDialog] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={titlePage ?? 'Kriteria'} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/20">
                <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                    {/* Header Section */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl dark:text-white">Data Kriteria Gizi Ibu Hamil</h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Kelola kriteria/parameter yang digunakan untuk deteksi gizi ibu hamil
                            </p>
                        </div>
                        <Button
                            onClick={() => setIsOpenDialog(true)}
                            type="button"
                            size="lg"
                            className="flex cursor-pointer items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-700 hover:to-purple-700"
                        >
                            <Plus className="h-5 w-5" />
                            Data Kriteria Baru
                        </Button>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
                        <div className="overflow-x-auto rounded-sm border">
                            <Table className="min-w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="cursor-pointer">no</TableHead>
                                        <TableHead className="cursor-pointer">Nama</TableHead>
                                        <TableHead className="cursor-pointer">deskripsi</TableHead>
                                        <TableHead className="cursor-pointer">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {kriteria.length > 0 ? (
                                        kriteria.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{item.nama}</TableCell>
                                                <TableCell>{item.deskripsi}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-row items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            variant={'default'}
                                                            tooltip="edit"
                                                            onClick={() => handleEdit(item.id)}
                                                            className="border border-chart-4 bg-chart-4"
                                                        >
                                                            {' '}
                                                            <PenBox />{' '}
                                                        </Button>

                                                        <DeleteConfirmationForm
                                                            title={`Hapus kriteria ${item.id}`}
                                                            id={item.id}
                                                            url={route('admin.kriteria.destroy', { kriteria: item.id })}
                                                            setOpenDialog={setisDeleteDialog}
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="py-4 text-center">
                                                No data found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editId ? `Edit` : `Tambah`} Kriteria</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={submit}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="nama" className="text-sm font-medium">
                                    Nama Kriteria
                                </Label>
                                <Input
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    id="nama"
                                    name="nama"
                                    className="input"
                                    disabled={processing}
                                    placeholder="Masukkan nama kriteria"
                                />
                                <InputError message={errors.nama} className="mt-2" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="deskripsi" className="text-sm font-medium">
                                    Keterangan
                                </Label>
                                <Input
                                    type="text"
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                    id="deskripsi"
                                    name="deskripsi"
                                    className="input"
                                    disabled={processing}
                                    placeholder="Masukkan deskripsi kriteria"
                                />
                                <InputError message={errors.deskripsi} className="mt-2" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    reset();
                                    setEditId(null);
                                    setIsOpenDialog(false);
                                }}
                            >
                                Batal
                            </Button>
                            <Button type="submit">{processing && <LoaderCircle className="h-4 w-4 animate-spin" />}Simpan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
