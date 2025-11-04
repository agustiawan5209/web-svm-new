import { PasienTypes, type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UserAuthLayout from '@/layouts/guest/user-auth-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    nik: string;
    name: string;
    email: string;
    alamat: string;
    nohp: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: string;
};

export default function Profile({ mustVerifyEmail, status, pasien }: { mustVerifyEmail: boolean; status?: string; pasien: PasienTypes }) {
    const { auth } = usePage<SharedData>().props;
    console.log(auth.user);
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        nik: pasien ? pasien.nik : '',
        name: auth.user.name,
        email: auth.user.email,
        alamat: auth.user.alamat ?? '',
        nohp: auth.user.nohp ?? '',
        jenis_kelamin: auth.user.jenis_kelamin ?? '',
        tempat_lahir: pasien ? pasien.tempat_lahir : '',
        tanggal_lahir: pasien ? pasien.tanggal_lahir : '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <UserAuthLayout>
            <Head title="Profile settings" />

            <Card className="mx-auto w-full max-w-2xl">
                <CardContent>
                    <div className="space-y-6">
                        <HeadingSmall title="Biodata Pengguna" description="Update Biodata anda untuk disistem" />

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
                                    <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                    <Input
                                        id="tanggal_lahir"
                                        type="date"
                                        required
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
                            {/* <div className="grid gap-2">
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
                            </div> */}

                            {mustVerifyEmail && auth.user.email_verified_at === null && (
                                <div>
                                    <p className="-mt-4 text-sm text-muted-foreground">
                                        Your email address is unverified.{' '}
                                        <Link
                                            href={route('verification.send')}
                                            method="post"
                                            as="button"
                                            className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                        >
                                            Click here to resend the verification email.
                                        </Link>
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <div className="mt-2 text-sm font-medium text-green-600">
                                            A new verification link has been sent to your email address.
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Save</Button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-neutral-600">Saved</p>
                                </Transition>
                            </div>
                        </form>
                        <DeleteUser />
                    </div>
                </CardContent>
            </Card>
        </UserAuthLayout>
    );
}
