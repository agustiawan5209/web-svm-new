import { User, type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input, InputRadio } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UserAuthLayout from '@/layouts/guest/user-auth-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Biodata settings',
        href: '/settings/profile',
    },
];

type BiodataForm = {
    id: number;
    nik: string;
    nama: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: string;
};

export default function Biodata({ pasien }: { pasien?: User }) {
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<Required<BiodataForm>>({
        id: pasien?.id ?? 0,
        nik: pasien?.nik ?? '',
        nama: pasien?.nama ?? '',
        jenis_kelamin: pasien?.jenis_kelamin ?? '',
        tempat_lahir: pasien?.tempat_lahir ?? '',
        tanggal_lahir: pasien?.tanggal_lahir ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('guest.biodata.store'), {
            preserveScroll: true,
            onError: (err) => console.log(err),
        });
    };
    const today = new Date();
    const tahunLalu = new Date(today);
    tahunLalu.setFullYear(today.getFullYear() - 1);
    const minDate = tahunLalu.toISOString().split('T')[0];
    return (
        <UserAuthLayout>
            <Head title="Biodata setting" />

            <Card className="mx-auto w-full max-w-2xl">
                <CardContent>
                    <div className="space-y-6">
                        <HeadingSmall title="Biodata Pasien" description="Tambahkan biodata pasien" />

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

                                <InputError className="mt-2" message={errors.nik} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nama">Nama</Label>

                                <Input
                                    id="nama"
                                    className="mt-1 block w-full"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    required
                                    autoComplete="nama"
                                    placeholder="Full nama"
                                />

                                <InputError className="mt-2" message={errors.nama} />
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
                                        tabIndex={2}
                                        max={minDate}
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

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Simpan</Button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-neutral-600">Tersimpan</p>
                                </Transition>
                            </div>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </UserAuthLayout>
    );
}
