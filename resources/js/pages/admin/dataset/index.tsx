import { DeleteConfirmationForm } from '@/components/delete-confirmation-form';
import PaginationTable from '@/components/pagination-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, DatasetTypes, KriteriaTypes, LabelTypes } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { EyeIcon, PenBoxIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
interface IndikatorIndexProps {
    dataset: {
        current_page: number;
        data: DatasetTypes[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        next_page_url?: string;
        path: string;
        per_page: number;
        prev_page_url: string;
        to: number;
        total: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    kriteria: KriteriaTypes[];
    breadcrumb?: BreadcrumbItem[];
    titlePage?: string;
    opsiLabel: LabelTypes[];
}

export default function IndikatorIndex({ dataset, kriteria, breadcrumb, titlePage, opsiLabel }: IndikatorIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );
    const { get } = useForm();

    const [isDeleteDialog, setisDeleteDialog] = useState(false);

    const [orderBy, setorderBy] = useState('');

    const handleOrderBy = (value: string) => {
        setorderBy(value);
        get(route('admin.dataset.index', { orderBy: value }), {
            preserveScroll: true,
            preserveState: true,
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={titlePage ?? 'Indikator'} />

            {/* Data */}
            <Card>
                <div className="px-2">
                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-bold md:text-xl">Data Gizi Ibu Hamil</h2>
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                            <Link href={route('admin.dataset.create')}>
                                <Button variant={'default'} type="button" className="cursor-pointer">
                                    Tambah Data
                                </Button>
                            </Link>

                            <div className="max-w-sm">
                                <Select value={orderBy} required onValueChange={(value: string) => handleOrderBy(value)}>
                                    <SelectTrigger className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                                        <SelectValue placeholder="Pilih Label " />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg border border-gray-200 shadow-lg">
                                        {opsiLabel.map((label, idx) => (
                                            <SelectItem key={idx} value={label.nama} className="px-4 py-2 hover:bg-gray-50">
                                                {label.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto rounded-md border">
                        <Table className="min-w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="cursor-pointer">no</TableHead>
                                    <TableHead className="cursor-pointer">Label (Gizi)</TableHead>
                                    {kriteria.map((item, index) => (
                                        <TableHead key={index} className="cursor-pointer">
                                            {item.nama}
                                        </TableHead>
                                    ))}
                                    <TableHead className="cursor-pointer">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dataset.data && dataset.data.length ? (
                                    dataset.data.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{index + 1 + (dataset?.current_page - 1) * dataset?.per_page}</TableCell>
                                            <TableCell>{item.label}</TableCell>
                                            {item.detail.map((detail, idx) => (
                                                <TableCell key={idx}>{detail.kriteria ? detail.nilai : ''}</TableCell>
                                            ))}
                                            <TableCell>
                                                <div className="flex flex-row items-center gap-2">
                                                    <DeleteConfirmationForm
                                                        title={`Hapus dataset ${item.id}`}
                                                        id={item.id}
                                                        url={route('admin.dataset.destroy', { dataset: item.id })}
                                                        setOpenDialog={setisDeleteDialog}
                                                    />
                                                    <Link href={route('admin.dataset.show', { dataset: item.id })}>
                                                        <Button variant={'default'} type="button" className="bg-chart-1">
                                                            <EyeIcon size={4} />
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('admin.dataset.edit', { dataset: item.id })}>
                                                        <Button variant={'default'} type="button" className="bg-chart-4">
                                                            <PenBoxIcon size={4} />
                                                        </Button>
                                                    </Link>
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
                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-gray-700">
                            jumlah data {dataset.total}, halaman {dataset.current_page} dari {dataset.last_page}
                        </p>
                        <PaginationTable links={dataset.links} data={{ orderBy: orderBy ?? '' }} />
                    </div>
                </div>
            </Card>
        </AppLayout>
    );
}
