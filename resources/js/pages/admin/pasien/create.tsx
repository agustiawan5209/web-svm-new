import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input, InputRadio } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useMemo } from 'react';
export interface PasienCreaterops {
    breadcrumb?: { title: string; href: string }[];
}
type CreateForm = {
    user_id: string;
    nik: string;
    nama: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
};

export default function PasienCreate({ breadcrumb }: PasienCreaterops) {
    // Memoize breadcrumbs to prevent unnecessary recalculations
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    const { data, setData, get, post, processing, progress, errors, reset } = useForm<Required<CreateForm>>({
        user_id: '',
        nik: '',
        nama: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
    });

    /**
     * Handles the form submission. Prevents the default form submission,
     * then makes a POST request to the server to store the new Pasien.
     * If there's an error, logs the error to the console.
     */
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('pasien.store'), {
            onError: (err) => console.log(err),
        });
    };

    // Hitung tanggal minimum: 1 tahun lalu dari hari ini
    const today = new Date();
    const tahunLalu = new Date(today);
    tahunLalu.setFullYear(today.getFullYear() - 1);
    const minDate = tahunLalu.toISOString().split('T')[0];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-1 lg:p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="p-4 md:p-6">
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="nama">NIK (Nomor Induk Kependudukan)</Label>
                                    <Input
                                        id="nik"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="nik"
                                        value={data.nik}
                                        onChange={(e) => setData('nik', e.target.value)}
                                        disabled={processing}
                                        placeholder="Nomor Induk Kependudukan"
                                    />
                                    <InputError message={errors.nik} className="mt-2" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="nama">Nama</Label>
                                    <Input
                                        id="nama"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="nama"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        disabled={processing}
                                        placeholder="Nama Pasien"
                                    />
                                    <InputError message={errors.nama} className="mt-2" />
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="col-span-1 grid gap-2">
                                        <Label htmlFor="tempat_lahir">Tempat</Label>
                                        <Input
                                            id="tempat_lahir"
                                            type="text"
                                            required
                                            tabIndex={2}
                                            autoComplete="tempat_lahir"
                                            value={data.tempat_lahir}
                                            onChange={(e) => setData('tempat_lahir', e.target.value)}
                                            disabled={processing}
                                            placeholder="tempat_lahir......."
                                        />
                                        <InputError message={errors.tempat_lahir} />
                                    </div>
                                    <div className="col-span-2 grid gap-2">
                                        <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                        <Input
                                            id="tanggal_lahir"
                                            type="date"
                                            required
                                            max={minDate}
                                            tabIndex={2}
                                            autoComplete="tanggal_lahir"
                                            value={data.tanggal_lahir}
                                            onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                            disabled={processing}
                                            placeholder="tanggal lahir......."
                                        />
                                        <InputError message={errors.tanggal_lahir} />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                                    <InputRadio
                                        id="jenis1"
                                        name="jenis_kelaim"
                                        label="Laki-laki"
                                        value="Laki-laki"
                                        onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                        className="border-red-500"
                                        labelClassName="text-gray-800 dark:text-white"
                                    />
                                    <InputRadio
                                        id="jenis2"
                                        name="jenis_kelaim"
                                        label="Perempuan"
                                        value="Perempuan"
                                        onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                        className="border-red-500"
                                        labelClassName="text-gray-800 dark:text-white"
                                    />
                                    <InputError message={errors.jenis_kelamin} />
                                </div>

                                <Button type="submit" variant={'default'} className="mt-2 w-full" tabIndex={5} disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Simpan
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
