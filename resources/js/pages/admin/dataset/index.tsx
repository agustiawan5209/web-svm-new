import { DeleteConfirmationForm } from '@/components/delete-confirmation-form';
import PaginationTable from '@/components/pagination-table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, DatasetTypes, KriteriaTypes, LabelTypes } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowDownUp, ArrowUpDown, Circle, EyeIcon, Filter, PenBoxIcon, Plus, RefreshCw } from 'lucide-react';
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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/20">
                <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                    {/* Header Section */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl dark:text-white">Dataset Gizi Ibu Hamil</h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Data ini digunakan untuk sebagai data pelatihan untuk Model algoritma Support Vector Machine (SVM)
                            </p>
                        </div>

                        <Link href={route('admin.dataset.create')}>
                            <Button
                                type="button"
                                size="lg"
                                className="flex cursor-pointer items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-700 hover:to-purple-700"
                            >
                                <Plus className="h-5 w-5" />
                                Dataset Baru
                            </Button>
                        </Link>
                    </div>
                    {/* Search and Filter Section */}
                    <div className="rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {/* Sort Filter */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        <Filter className="h-4 w-4" />
                                        Urutkan
                                    </label>
                                    <Select value={orderBy} onValueChange={setOrderBy}>
                                        <SelectTrigger className="border-gray-300 bg-white/50 dark:border-gray-600 dark:bg-gray-700/50">
                                            <SelectValue placeholder="Pilih urutan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Urutan Waktu</SelectLabel>
                                                <SelectItem value="desc" className="flex items-center gap-2">
                                                    <ArrowDownUp className="h-4 w-4" />
                                                    Terbaru
                                                </SelectItem>
                                                <SelectItem value="asc">
                                                    <ArrowUpDown className="h-4 w-4" />
                                                    Terlama
                                                </SelectItem>
                                            </SelectGroup>
                                            <SelectGroup>
                                                <SelectLabel>Status Gizi</SelectLabel>
                                                {opsiLabel.map((item: any) => (
                                                    <SelectItem key={item} value={item.nama} className="capitalize">
                                                        <Circle className="h-2 w-2 fill-current" />
                                                        {item.nama}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Data Table Section */}
                    <div className="overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
                        {/* Table */}
                        <div className="overflow-x-auto">
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
                    </div>
                    {/* Pagination Section */}
                    <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 p-4 sm:flex-row dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            {/* Items per page */}
                            <div className="flex items-center gap-2">
                                <Select value={perPage} onValueChange={setPerPage}>
                                    <SelectTrigger className="w-24 bg-white dark:bg-gray-700">
                                        <SelectValue placeholder="10" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="20">20</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                            <SelectItem value="100">100</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={submitPerPage}
                                    className="flex items-center gap-2"
                                    disabled={processing}
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Tampilkan
                                </Button>
                            </div>

                            {/* Page info */}
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Menampilkan <span className="font-semibold text-gray-900 dark:text-white">{dataset?.from || 0}</span> -
                                <span className="font-semibold text-gray-900 dark:text-white">{dataset?.to || 0}</span> dari{' '}
                                <span className="font-semibold text-gray-900 dark:text-white">{dataset?.total || 0}</span> data
                            </div>
                        </div>

                        {/* Pagination */}
                        <PaginationTable links={dataset?.links ?? []} data={filter} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
