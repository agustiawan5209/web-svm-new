import CollapsibleRow from '@/components/collapsible-table';
import DetailPemeriksaan from '@/components/detail-pemeriksaan';
import PaginationTable from '@/components/pagination-table';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import UserAuthLayout from '@/layouts/guest/user-auth-layout';
import { PemeriksaanTypes } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Activity, Calendar, FileText, MapPin, Plus, Settings, User } from 'lucide-react';
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
    console.log(pemeriksaan);

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
            get(route('guest.klasifikasi.index', routeParams), {
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

            get(route('guest.klasifikasi.index'), {
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
                route('guest.klasifikasi.index', {
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
            read_url = route('guest.klasifikasi.show', { pemeriksaan: item.id });
            let delete_url = null;
            if (can.delete) {
                delete_url = route('guest.klasifikasi.destroy', { pemeriksaan: item.id });
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
        <UserAuthLayout>
            <Head title="Pemeriksaan" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/20">
                <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                    {/* Header Section */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl dark:text-white">Data Pemeriksaan Gizi</h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Kelola dan pantau data pemeriksaan gizi ibu hamil</p>
                        </div>

                        {can.add && (
                            <Link href={route('guest.klasifikasi.create-id')}>
                                <Button
                                    type="button"
                                    size="lg"
                                    className="flex cursor-pointer items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-700 hover:to-purple-700"
                                >
                                    <Plus className="h-5 w-5" />
                                    Pemeriksaan Gizi Baru
                                </Button>
                            </Link>
                        )}
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
                                        <TableHead>
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
        </UserAuthLayout>
    );
}
