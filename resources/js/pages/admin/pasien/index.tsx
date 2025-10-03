import { DeleteConfirmationForm } from '@/components/delete-confirmation-form';
import PaginationTable from '@/components/pagination-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowDownUp, ArrowUpDown, EyeIcon, Filter, MapPin, PenBoxIcon, PersonStanding, Plus, Search, Settings, User, X } from 'lucide-react';
import { FormEventHandler, useEffect, useMemo, useState } from 'react';
export interface PasienProps {
    pasien?: {
        current_page: number;
        data: string[];
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
    breadcrumb?: { title: string; href: string }[];
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

export default function PasienIndex({ pasien, breadcrumb, filter, can }: PasienProps) {
    // Memoize breadcrumbs to prevent unnecessary recalculations
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
            get(route('pasien.index', { q: cleanedSearch, per_page: filter?.per_page, order_by: filter?.order_by }), {
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
        get(route('pasien.index'), {
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
            get(route('pasien.index', { order_by: cleanedOrderBy, per_page: filter?.per_page, q: filter?.q }), {
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
                route('pasien.index', {
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
    /** END Request Per_page */
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pasien" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/20">
                <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                    {/* Header Section */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl dark:text-white">Data Pasien</h1>
                            {/* <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Kelola Data pasien</p> */}
                        </div>

                        {can.add && (
                            <Link href={route('pasien.create')}>
                                <Button
                                    type="button"
                                    size="lg"
                                    className="flex cursor-pointer items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-700 hover:to-purple-700"
                                >
                                    <Plus className="h-5 w-5" />
                                    Data Pasien Baru
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Search and Filter Section */}
                    <div className="rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {/* Search Input */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="search-text"
                                        className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        <Search className="h-4 w-4" />
                                        Cari Pasien
                                    </label>
                                    <Input
                                        type="search"
                                        id="search-text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Nama atau NIK pasien..."
                                        className="w-full border-gray-300 bg-white/50 dark:border-gray-600 dark:bg-gray-700/50"
                                    />
                                </div>

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
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-end gap-2">
                                    <Button
                                        type="button"
                                        onClick={submitSearch}
                                        className="flex-1 bg-blue-600 text-white transition-colors hover:bg-blue-700"
                                        disabled={processing}
                                    >
                                        <Search className="mr-2 h-4 w-4" />
                                        Terapkan
                                    </Button>
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={clearSearch}
                                        className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                                        disabled={processing}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Table Section */}
                    <div className="overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
                        {/* Table */}
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30 dark:border-gray-700 dark:from-gray-800 dark:to-blue-900/20">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-12">No.</TableHead>
                                        <TableHead>
                                            <div className="flex items-center gap-2">
                                                <PersonStanding className="h-4 w-4" />
                                                Nik
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                Nama Pasien
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                Tempat/Tanggal Lahir
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className="flex items-center justify-center gap-2">
                                                <Settings className="h-4 w-4" />
                                                Aksi
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className={processing ? 'opacity-50' : ''}>
                                    {(pasien?.data ?? []).length > 0 &&
                                        pasien?.data.map((item: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1 + (pasien?.current_page - 1) * pasien?.per_page}</TableCell>

                                                <TableCell> {item.nik} </TableCell>
                                                <TableCell> {item.nama} </TableCell>
                                                <TableCell>
                                                    {' '}
                                                    {item.tempat_lahir}/ {item.tanggal_lahir}{' '}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-row items-center gap-2">
                                                        <DeleteConfirmationForm
                                                            title={`Hapus pasien ${item.id}`}
                                                            id={item.id}
                                                            url={route('pasien.destroy', { pasien: item.id })}
                                                            setOpenDialog={setisDeleteDialog}
                                                        />
                                                        <Link href={route('pasien.show', { pasien: item.id })}>
                                                            <Button variant={'default'} type="button" className="bg-chart-1">
                                                                <EyeIcon size={4} />
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('pasien.edit', { pasien: item.id })}>
                                                            <Button variant={'default'} type="button" className="bg-chart-4">
                                                                <PenBoxIcon size={4} />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination Section */}
                        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 p-4 sm:flex-row dark:border-gray-700">
                            {/* Pagination */}
                            <PaginationTable links={pasien?.links ?? []} data={filter} />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
