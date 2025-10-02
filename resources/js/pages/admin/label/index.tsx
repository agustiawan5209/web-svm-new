import { DeleteConfirmationForm } from '@/components/delete-confirmation-form';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, KriteriaTypes } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, PenBox } from 'lucide-react';
import { useMemo, useState } from 'react';
interface LabelIndexProps {
    label: KriteriaTypes[];
    breadcrumb?: BreadcrumbItem[];
    titlePage?: string;
    can?: {
        add: boolean;
        edit: boolean;
        read: boolean;
        delete: boolean;
    };
}
type labelFormData = {
    id: number | null;
    nama: string;
    deskripsi: string;
};

export default function LabelIndex({ label, breadcrumb, titlePage, can }: LabelIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    const { data, setData, get, post, put, processing, errors, reset } = useForm<labelFormData>({
        id: null,
        nama: '',
        deskripsi: '',
    });

    const [editId, setEditId] = useState<number | null>(null);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (editId == null) {
            post(route('admin.label.store'), {
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
            put(route('admin.label.update', { label: editId }), {
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
            const labelTemp: KriteriaTypes[] = label.filter((item) => item.id === id, []);
            setEditId(labelTemp[0].id);
            if (labelTemp) {
                setData({
                    id: labelTemp[0].id,
                    nama: labelTemp[0].nama,
                    deskripsi: labelTemp[0].deskripsi,
                });
            }
            setIsOpenDialog(true);
        }
    };

    const closeDialog = () => {
        setIsOpenDialog(false);
        reset();
        setEditId(null);
    };
    const [isDeleteDialog, setisDeleteDialog] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={titlePage ?? 'Label'} />

            {/* Data */}
            <Card>
                <div className="px-2">
                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-bold md:text-xl">Label Gizi Ibu Hamil</h2>
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                            {can?.add && (
                                <Button variant={'default'} type="button" className="cursor-pointer" onClick={() => setIsOpenDialog(true)}>
                                    Tambah Data
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="overflow-x-auto rounded-sm border">
                        <Table className="min-w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="cursor-pointer">no</TableHead>
                                    <TableHead className="cursor-pointer">Nama</TableHead>
                                    <TableHead className="cursor-pointer">deskripsi</TableHead>
                                    {(can?.delete || can?.edit) && <TableHead className="cursor-pointer">Aksi</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {label.length > 0 ? (
                                    label.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.nama}</TableCell>
                                            <TableCell>{item.deskripsi}</TableCell>
                                            {(can?.edit || can?.delete) && (
                                                <TableCell>
                                                    <div className="flex flex-row items-center gap-2">
                                                        {can?.edit && (
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
                                                        )}

                                                        {can?.delete && (
                                                            <DeleteConfirmationForm
                                                                title={`Hapus label ${item.id}`}
                                                                id={item.id}
                                                                url={route('admin.label.destroy', { label: item.id })}
                                                                setOpenDialog={setisDeleteDialog}
                                                            />
                                                        )}
                                                    </div>
                                                </TableCell>
                                            )}
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
            </Card>

            <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editId ? `Edit` : `Tambah`} Label</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={submit}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="nama" className="text-sm font-medium">
                                    Nama Label
                                </Label>
                                <Input
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    id="nama"
                                    name="nama"
                                    className="input"
                                    disabled={processing}
                                    placeholder="Masukkan nama label"
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
                                    placeholder="Masukkan deskripsi label"
                                />
                                <InputError message={errors.deskripsi} className="mt-2" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="secondary" onClick={() => closeDialog()}>
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
