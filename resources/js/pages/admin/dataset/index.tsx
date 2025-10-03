import { DeleteConfirmationForm } from '@/components/delete-confirmation-form';
import PaginationTable from '@/components/pagination-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, DatasetTypes, KriteriaTypes, LabelTypes } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { EyeIcon, PenBoxIcon } from 'lucide-react';
import { FormEventHandler, useEffect, useMemo, useState } from 'react';
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
    filter: {
        q: string;
        per_page: string;
        order_by: string;
    };
    can: {
        add: boolean;
        edit: boolean;
        read: boolean;
        delete: boolean;
    };
}
type GetForm = {
    q?: string;
    per_page?: string;
    order_by?: string;
};

export default function IndikatorIndex({ dataset, kriteria, breadcrumb, titlePage, opsiLabel, filter, can }: IndikatorIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    const { data, setData, get, processing, errors, reset } = useForm<GetForm>({
        // q: '',
        // per_page: '',
        // order_by: '',
    });

    /** START SEARCH */
    // store search query in state
    const [search, setSearch] = useState(filter?.q ?? '');

    const submitSearch: FormEventHandler = (e) => {
        e.preventDefault();
        // clean search query
        const cleanedSearch = search.trim();
        if (cleanedSearch.length > 0) {
            // if search query is not empty, make request to server
            get(route('admin.dataset.index', { q: cleanedSearch, per_page: filter?.per_page, order_by: filter?.order_by }), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {},
            });
        }
    };

    // clear search query when form is submitted
    const clearSearch: FormEventHandler = (e) => {
        e.preventDefault();
        setSearch('');
        reset();
        // make request to server when search query is cleared
        get(route('admin.dataset.index'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {},
        });
    };
    /** END SEARCH */

    /** Start Order BY (ASC, DESC) */
    const [orderBy, setOrderBy] = useState(filter?.order_by ?? '');

    useEffect(() => {
        // clean search query
        const cleanedOrderBy = orderBy.trim();
        if (cleanedOrderBy.length > 0) {
            // if search query is not empty, make request to server
            get(route('admin.dataset.index', { order_by: cleanedOrderBy, per_page: filter?.per_page, q: filter?.q }), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {},
            });
        }
    }, [orderBy]);
    /** END Order BY */
    const [isDeleteDialog, setisDeleteDialog] = useState(false);

    /** Start Request Per_page */
    const [perPage, setPerPage] = useState(filter?.per_page ?? 10); // Default value lebih baik angka

    const submitPerPage: FormEventHandler = (e) => {
        e.preventDefault();
        const cleanedPerPage = perPage.toString().trim();
        const numericPerPage = parseInt(cleanedPerPage);

        // Validasi nilai per_page
        if (!isNaN(numericPerPage) && numericPerPage > 0) {
            get(
                route('admin.dataset.index', {
                    per_page: numericPerPage,
                }),
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true, // Hindari penumpukan history
                },
            );
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={titlePage ?? 'Indikator'} />

            {/* Data */}
            <Card>
                <div className="px-2">
                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                            <Link href={route('admin.dataset.create')}>
                                <Button variant={'default'} type="button" className="cursor-pointer">
                                    Tambah Data
                                </Button>
                            </Link>
                        </div>
                        <div className="col-span-1 px-1 py-1 lg:px-4 lg:py-2">
                            <Select defaultValue="" value={orderBy} onValueChange={(e) => setOrderBy(e)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tampilan Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Urutkan</SelectLabel>
                                        <SelectItem value="desc">Terbaru</SelectItem>
                                        <SelectItem value="asc">Terlama</SelectItem>
                                    </SelectGroup>
                                    <SelectSeparator />
                                    <SelectGroup>
                                        <SelectLabel>Status Gizi</SelectLabel>
                                        {opsiLabel.map((item: any, index) => (
                                            <SelectItem key={index} value={item.nama}>
                                                {item.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                    <SelectSeparator />
                                </SelectContent>
                            </Select>
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
                                        <TableCell colSpan={10} className="py-4 text-center">
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
