import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input, InputRadio } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem } from '@/types';
import { useMemo } from 'react';
export interface OrangtuaUpdaterops {
    breadcrumb?: { title: string; href: string }[];
    orangtua: User;
}
type UpdateForm = {
    id: number;
    nik: string;
    name: string;
    email: string;
    alamat: string;
    nohp: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tgl_lahir: string;
    password: string;
};

export default function OrangtuaUpdate({ breadcrumb, orangtua }: OrangtuaUpdaterops) {
    // Memoize breadcrumbs to prevent unnecessary recalculations
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    const { data, setData, put, processing, progress, errors, reset } = useForm<Required<UpdateForm>>({
        id: orangtua.id,
        nik: orangtua.nik ?? '',
        name: orangtua.name,
        email: orangtua.email,
        alamat: orangtua.alamat ?? '',
        nohp: orangtua.nohp ?? '',
        jenis_kelamin: orangtua.jenis_kelamin ?? '',
        tempat_lahir: orangtua.tempat_lahir ?? '',
        tgl_lahir: orangtua.tgl_lahir ?? '',
        password: orangtua.password ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('admin.orangtua.update', { user: orangtua.id }), {
            onFinish: () => reset('password'),
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Update" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-1 lg:p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="p-4 md:p-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="nik">nik</Label>

                                <Input
                                    id="nik"
                                    className="mt-1 block w-full"
                                    value={data.nik}
                                    onChange={(e) => setData('nik', e.target.value)}
                                    required
                                    autoComplete="nik"
                                    placeholder="nik"
                                />

                                <InputError className="mt-2" message={errors.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                />

                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="alamat">Alamat Lengkap</Label>
                                <Input
                                    id="alamat"
                                    type="text"
                                    required
                                    tabIndex={2}
                                    autoComplete="alamat"
                                    value={data.alamat}
                                    onChange={(e) => setData('alamat', e.target.value)}
                                    disabled={processing}
                                    placeholder="masukkan alamat"
                                />
                                <InputError message={errors.alamat} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nohp">No. WhatsApp</Label>
                                <Input
                                    id="nohp"
                                    type="text"
                                    required
                                    tabIndex={2}
                                    autoComplete="nohp"
                                    value={data.nohp}
                                    onChange={(e) => setData('nohp', e.target.value)}
                                    disabled={processing}
                                    placeholder="masukkan nohp"
                                />
                                <InputError message={errors.nohp} />
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
                                    <Label htmlFor="tgl_lahir">Tanggal Lahir</Label>
                                    <Input
                                        id="tgl_lahir"
                                        type="date"
                                        required
                                        tabIndex={2}
                                        autoComplete="tgl_lahir"
                                        value={data.tgl_lahir}
                                        onChange={(e) => setData('tgl_lahir', e.target.value)}
                                        disabled={processing}
                                        placeholder="tanggal lahir......."
                                    />
                                    <InputError message={errors.tgl_lahir} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                                <InputRadio
                                    id="jenis1"
                                    name="jenis_kelamin"
                                    label="Laki-laki"
                                    value="Laki-laki"
                                    onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                    checked={data.jenis_kelamin === 'Laki-laki'}
                                    className="border-red-500"
                                    labelClassName="text-gray-800 dark:text-white"
                                />
                                <InputRadio
                                    id="jenis2"
                                    name="jenis_kelamin"
                                    label="Perempuan"
                                    value="Perempuan"
                                    onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                    checked={data.jenis_kelamin === 'Perempuan'}
                                    className="border-red-500"
                                    labelClassName="text-gray-800 dark:text-white"
                                />
                                <InputError message={errors.jenis_kelamin} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>

                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>
                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Simpan</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
