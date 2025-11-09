import { DeleteConfirmationForm } from '@/components/delete-confirmation-form';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, KriteriaTypes, LabelSayuranTypes } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, PenBox } from 'lucide-react';
import { useMemo, useState } from 'react';
interface LabelIndexProps {
    label: KriteriaTypes[];
    listLabelSayuran: LabelSayuranTypes[];
    labelSayuran?: LabelSayuranTypes;
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
    label_id: string;
    sayuran: string;
    porsi: string;
    tekstur: string;
    frekuensi: string;
};

export default function LabelIndex({ label, labelSayuran, listLabelSayuran, breadcrumb, titlePage, can }: LabelIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    const { data, setData, get, post, put, processing, errors, reset } = useForm<labelFormData>({
        id: null,
        label_id: '',
        sayuran: '',
        porsi: '',
        tekstur: '',
        frekuensi: '',
    });

    const [editId, setEditId] = useState<number | null>(null);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (editId == null) {
            post(route('admin.labelSayuran.store'), {
                preserveState: true,
                onSuccess: () => {
                    setData({
                        id: null,
                        label_id: '',
                        sayuran: '',
                        porsi: '',
                        tekstur: '',
                        frekuensi: '',
                    });
                    setIsOpenDialog(false);
                },
                onError: (errors) => {
                    console.error(errors);
                },
            });
        } else {
            put(route('admin.labelSayuran.update', { labelSayuran: editId }), {
                preserveState: true,
                onSuccess: () => {
                    setData({
                        id: null,
                        label_id: '',
                        sayuran: '',
                        porsi: '',
                        tekstur: '',
                        frekuensi: '',
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
            const labelTemp: LabelSayuranTypes[] = listLabelSayuran.filter((item) => item.id === id, []);
            setEditId(labelTemp[0].id);
            if (labelTemp) {
                setData({
                    id: labelTemp[0].id,
                    label_id: labelTemp[0].label_id.toLocaleString(),
                    sayuran: labelTemp[0].sayuran,
                    porsi: labelTemp[0].porsi,
                    tekstur: labelTemp[0].tekstur,
                    frekuensi: labelTemp[0].frekuensi,
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
                                    <TableHead className="cursor-pointer">Nama Label</TableHead>
                                    {/* <TableHead className="cursor-pointer">Makanan</TableHead>
                                    <TableHead className="cursor-pointer">Porsi</TableHead> */}
                                    <TableHead className="cursor-pointer">Penanganan</TableHead>
                                    {/* <TableHead className="cursor-pointer">Frekuensi</TableHead> */}
                                    {(can?.delete || can?.edit) && <TableHead className="cursor-pointer">Aksi</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listLabelSayuran.length > 0 ? (
                                    listLabelSayuran.map((item: LabelSayuranTypes, index: number) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.label.nama}</TableCell>
                                            {/* <TableCell>{item.sayuran}</TableCell>
                                            <TableCell>{item.porsi}</TableCell> */}
                                            <TableCell>{item.tekstur}</TableCell>
                                            {/* <TableCell>{item.frekuensi}</TableCell> */}
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
                                                                url={route('admin.labelSayuran.destroy', { labelSayuran: item.id })}
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
                                        <TableCell colSpan={7} className="py-4 text-center">
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
                        <DialogTitle>{editId ? `Edit` : `Tambah`} Rekomendasi Makanan</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={submit}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="sayuran" className="text-sm font-medium">
                                    Pilih Label
                                </Label>
                                <Select value={data.label_id} required={true} onValueChange={(val) => setData('label_id', val)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Label" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {label.map((gender, idx) => (
                                            <SelectItem key={idx} value={gender.id.toString()}>
                                                {gender.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.label_id} className="mt-2" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sayuran" className="text-sm font-medium">
                                    Nama Makanan
                                </Label>
                                <Input
                                    type="text"
                                    value={data.sayuran}
                                    onChange={(e) => setData('sayuran', e.target.value)}
                                    id="sayuran"
                                    name="sayuran"
                                    className="input"
                                    disabled={processing}
                                    placeholder="Masukkan nama-nama sayuran"
                                />
                                <InputError message={errors.sayuran} className="mt-2" />
                            </div>
                            {/* <div className="grid gap-2">
                                <Label htmlFor="porsi" className="text-sm font-medium">
                                    Jumlah Porsi Makanan
                                </Label>
                                <Input
                                    type="text"
                                    value={data.porsi}
                                    onChange={(e) => setData('porsi', e.target.value)}
                                    id="porsi"
                                    name="porsi"
                                    className="input"
                                    disabled={processing}
                                    placeholder="Masukkan porsi"
                                />
                                <InputError message={errors.porsi} className="mt-2" />
                            </div> */}
                            <div className="grid gap-2">
                                <Label htmlFor="tekstur" className="text-sm font-medium">
                                    Penanganan Makanan
                                </Label>
                                <Input
                                    type="text"
                                    value={data.tekstur}
                                    onChange={(e) => setData('tekstur', e.target.value)}
                                    id="tekstur"
                                    name="tekstur"
                                    className="input"
                                    disabled={processing}
                                    placeholder="Masukkan tekstur"
                                />
                                <InputError message={errors.tekstur} className="mt-2" />
                            </div>
                            {/* <div className="grid gap-2">
                                <Label htmlFor="frekuensi" className="text-sm font-medium">
                                    Frekuensi Per Hari
                                </Label>
                                <Input
                                    type="text"
                                    value={data.frekuensi}
                                    onChange={(e) => setData('frekuensi', e.target.value)}
                                    id="frekuensi"
                                    name="frekuensi"
                                    className="input"
                                    disabled={processing}
                                    placeholder="Masukkan frekuensi"
                                />
                                <InputError message={errors.frekuensi} className="mt-2" />
                            </div> */}
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
