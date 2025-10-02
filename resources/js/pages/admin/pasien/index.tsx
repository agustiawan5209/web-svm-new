import { DeleteConfirmationForm } from '@/components/delete-confirmation-form';
import PaginationTable from '@/components/pagination-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { EyeIcon, PenBoxIcon } from 'lucide-react';
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
            <Card>
                <CardContent>
                    <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                        <div className="flex w-full flex-1 flex-row items-end justify-end gap-7 px-1 py-1 md:items-center md:justify-between lg:px-4 lg:py-2">
                            <div className="flex w-full flex-1 flex-col gap-7 px-1 py-1 md:flex-row md:items-center lg:px-4 lg:py-2">
                                {can.add && (
                                    <Link href={route('pasien.create')} className="col-span-1 cursor-pointer">
                                        <Button variant="default" className="flex cursor-pointer items-center gap-2 bg-primary">
                                            Tambah Data
                                        </Button>
                                    </Link>
                                )}
                                <div className="col-span-2 flex items-center gap-2">
                                    <label htmlFor="search" className="sr-only">
                                        Cari
                                    </label>
                                    <Input
                                        type="text"
                                        id="search"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari berdasarkan nama/NIK"
                                    />
                                    <Button variant="secondary" type="button" onClick={submitSearch} className="flex items-center gap-2 text-xs">
                                        Cari
                                    </Button>
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={clearSearch}
                                        className="flex items-center gap-2 border-red-500 text-xs"
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </div>
                            <div className="col-span-1 px-1 py-1 lg:px-4 lg:py-2">
                                <Select defaultValue="" value={orderBy} onValueChange={(e) => setOrderBy(e)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tampilan Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Urutkan</SelectLabel>
                                            <SelectItem value="A-Z">A-Z</SelectItem>
                                            <SelectItem value="Z-A">Z-A</SelectItem>
                                            <SelectItem value="desc">Terbaru</SelectItem>
                                            <SelectItem value="asc">sTerlama</SelectItem>
                                        </SelectGroup>
                                        <SelectSeparator />
                                        <SelectGroup>
                                            <SelectLabel>Jenis Kelamin</SelectLabel>
                                            <SelectItem value="Laki-laki">Laki-Laki</SelectItem>
                                            <SelectItem value="Perempuan">Perempuan</SelectItem>
                                        </SelectGroup>
                                        <SelectSeparator />
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="overflow-hidden lg:w-full">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-10">No.</TableHead>
                                        <TableHead>NIK</TableHead>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Tempat/Tanggal Lahir</TableHead>
                                        <TableHead>Jenis Kelamin</TableHead>
                                        <TableHead>Aksi</TableHead>
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
                                                <TableCell> {item.jenis_kelamin} </TableCell>
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

                            <div className="flex flex-col items-center justify-between gap-7 border-x-2 border-b-2 p-2 md:flex-row">
                                <div className="flex items-center gap-7 px-1 py-1 lg:px-4 lg:py-2">
                                    <div className="flex flex-row gap-2">
                                        <Select defaultValue="10" value={perPage} onValueChange={(e) => setPerPage(e.toString())}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Jumlah Data" />
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
                                        <Button variant="outline" type="button" onClick={submitPerPage} className="flex items-center gap-2 text-xs">
                                            Tampilkan
                                        </Button>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {' '}
                                        halaman {pasien?.from} ke {pasien?.to} dari {pasien?.total} total
                                    </div>
                                </div>
                                <PaginationTable links={pasien?.links ?? []} data={filter} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
