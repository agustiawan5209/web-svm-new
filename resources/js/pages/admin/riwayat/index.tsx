import CollapsibleRow from '@/components/collapsible-table';
import DetailPemeriksaan from '@/components/detail-pemeriksaan';
import PaginationTable from '@/components/pagination-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { PemeriksaanTypes, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Activity, ArrowDownUp, ArrowUpDown, Calendar, Circle, FileText, Filter, MapPin, RefreshCw, Search, Settings, User, X } from 'lucide-react';
import { FormEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
interface PemeriksaanProps {
    pemeriksaan?: {
        current_page: number;
        data: PemeriksaanTypes[];
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
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    breadcrumb?: Array<{ title: string; href: string }>;
    filter: {
        q: string;
        per_page: string;
        order_by: string;
        date: string;
    };
    statusLabel: string[];
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
    date?: string;
};

export default function PemeriksaanIndex({ pemeriksaan, breadcrumb, filter, statusLabel, can }: PemeriksaanProps) {
    // Memoize breadcrumbs to prevent unnecessary recalculations
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    const { get, processing } = useForm<GetForm>();

    // State management
    const [search, setSearch] = useState(filter?.q ?? '');
    const [TglPemeriksaan, setTglPemeriksaan] = useState(filter?.date ?? '');
    const [orderBy, setOrderBy] = useState(filter?.order_by ?? '');
    const [perPage, setPerPage] = useState(filter?.per_page ?? '10');
    const [dialogOpen, setDialogOpen] = useState(false);

    // Memoized route parameters to avoid recalculations
    const routeParams = useMemo(
        () => ({
            q: search.trim(),
            per_page: perPage,
            order_by: orderBy,
            date: TglPemeriksaan,
        }),
        [search, perPage, orderBy, TglPemeriksaan],
    );

    // Optimized filter submission using useCallback
    const submitFilter = useCallback(() => {
        const cleanedSearch = search.trim();
        const cleanedDate = TglPemeriksaan.trim();
        const numericPerPage = parseInt(perPage.toString());

        // Only make request if there are valid changes
        if (cleanedSearch || cleanedDate || !isNaN(numericPerPage)) {
            get(route('admin.riwayat.index', routeParams), {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }
    }, [get, routeParams]);

    // Handle search submission
    const submitSearch: FormEventHandler = useCallback(
        (e) => {
            e.preventDefault();
            submitFilter();
        },
        [submitFilter],
    );

    // Handle per page submission
    const submitPerPage: FormEventHandler = useCallback(
        (e) => {
            e.preventDefault();
            submitFilter();
        },
        [submitFilter],
    );

    // Handle date submission
    const submitTglPemeriksaan = useCallback(() => {
        submitFilter();
    }, [submitFilter]);

    // Clear all filters
    const clearSearch: FormEventHandler = useCallback(
        (e) => {
            e.preventDefault();
            setSearch('');
            setTglPemeriksaan('');
            setPerPage('10');
            setOrderBy('');

            get(route('admin.riwayat.index'), {
                preserveState: true,
                preserveScroll: true,
            });
        },
        [get],
    );

    // Effect for orderBy changes
    useEffect(() => {
        const cleanedOrderBy = orderBy.trim();
        if (cleanedOrderBy) {
            get(
                route('admin.riwayat.index', {
                    order_by: cleanedOrderBy,
                    per_page: perPage,
                    q: search,
                }),
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        }
    }, [orderBy, get, perPage, search]);

    // Memoize table rows to prevent unnecessary re-renders
    const tableRows = useMemo(() => {
        if (!pemeriksaan?.data?.length) return null;

        return pemeriksaan.data.map((item, index) => {
            let read_url = null;
            read_url = route('admin.riwayat.show', { pemeriksaan: item.id });
            let delete_url = null;
            if (can.delete) {
                delete_url = route('admin.riwayat.destroy', { pemeriksaan: item.id });
            }
            return (
                <CollapsibleRow
                    key={item.id} // Using item.id as key is better than index
                    num={index + 1 + (pemeriksaan.current_page - 1) * pemeriksaan.per_page}
                    title={item.tgl_pemeriksaan}
                    columnData={[item.pasien.nama, `${item.pasien.tempat_lahir}/${item.pasien.tanggal_lahir}`, item.label]}
                    delete={delete_url ?? ''}
                    url={delete_url ?? ''}
                    id={item.id.toString()}
                    show={read_url ?? ''}
                >
                    <DetailPemeriksaan pemeriksaan={item} detail={item.detailpemeriksaan} />
                </CollapsibleRow>
            );
        });
    }, [pemeriksaan]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pemeriksaan" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/20">
                <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                    {/* Header Section */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl dark:text-white">
                                Riwayat Data Pemeriksaan Gizi Oleh Pengguna
                            </h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Kelola dan pantau data pemeriksaan gizi ibu hamil</p>
                        </div>
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

                                {/* Date Filter */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="search-date"
                                        className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        <Calendar className="h-4 w-4" />
                                        Tanggal Pemeriksaan
                                    </label>
                                    <Input
                                        type="date"
                                        id="search-date"
                                        value={TglPemeriksaan}
                                        onChange={(e) => setTglPemeriksaan(e.target.value)}
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
                                            <SelectGroup>
                                                <SelectLabel>Status Gizi</SelectLabel>
                                                {statusLabel.map((item) => (
                                                    <SelectItem key={item} value={item} className="capitalize">
                                                        <Circle className="h-2 w-2 fill-current" />
                                                        {item}
                                                    </SelectItem>
                                                ))}
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
                                                <Calendar className="h-4 w-4" />
                                                Tanggal Pemeriksaan
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
                                            <div className="flex items-center gap-2">
                                                <Activity className="h-4 w-4" />
                                                Hasil Pemeriksaan
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-center font-semibold text-foreground">
                                            <div className="flex items-center justify-center gap-2">
                                                <Settings className="h-4 w-4" />
                                                Aksi
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className={processing ? 'opacity-50' : 'divide-y divide-gray-200 dark:divide-gray-700'}>
                                    {tableRows}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Empty State */}
                        {!tableRows ||
                            (tableRows.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-700">
                                        <FileText className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Tidak ada data pemeriksaan</h3>
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        {search || TglPemeriksaan ? 'Coba ubah filter pencarian Anda' : 'Mulai dengan membuat pemeriksaan gizi baru'}
                                    </p>
                                </div>
                            ))}

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
                                    Menampilkan <span className="font-semibold text-gray-900 dark:text-white">{pemeriksaan?.from || 0}</span> -
                                    <span className="font-semibold text-gray-900 dark:text-white">{pemeriksaan?.to || 0}</span> dari{' '}
                                    <span className="font-semibold text-gray-900 dark:text-white">{pemeriksaan?.total || 0}</span> data
                                </div>
                            </div>

                            {/* Pagination */}
                            <PaginationTable links={pemeriksaan?.links ?? []} data={filter} />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
