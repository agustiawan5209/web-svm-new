import { Head, useForm } from '@inertiajs/react';
import { Calendar, LoaderCircle, MapPin } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    nik: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    name: string;
    email: string;
    password: string;
    alamat: string;
    nohp: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        nik: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        name: '',
        email: '',
        alamat: '',
        nohp: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
            onError: (err) => console.log(err),
        });
    };
    const today = new Date();
    // Handle Input data anak
    const tahunLalu = new Date(today);
    tahunLalu.setFullYear(today.getFullYear() - 12);
    const maxDate = tahunLalu.toISOString().split('T')[0];
    tahunLalu.setFullYear(today.getFullYear() - 51);
    const minDate = tahunLalu.toISOString().split('T')[0];
    return (
        <AuthLayout title="Buat Akun" description="isi form sebelum masuk">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="nik">NIK (Nomor Induk Kependudukan)</Label>
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
                            placeholder="nik"
                        />
                        <InputError message={errors.nik} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Full name"
                        />
                        <InputError message={errors.name} className="mt-2" />
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
                    {/* Birth Information */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="tempat_lahir" className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-slate-500" />
                                Tempat Lahir
                            </Label>
                            <div className="relative">
                                <Input
                                    id="tempat_lahir"
                                    type="text"
                                    required
                                    tabIndex={2}
                                    autoComplete="tempat_lahir"
                                    value={data.tempat_lahir}
                                    onChange={(e) => setData({ ...data, tempat_lahir: e.target.value })}
                                    disabled={processing}
                                    placeholder="Kota tempat lahir"
                                    className="pl-10"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                </div>
                            </div>
                            <InputError message={errors.tempat_lahir} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tanggal_lahir" className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-slate-500" />
                                Tanggal Lahir
                            </Label>
                            <div className="relative">
                                <Input
                                    id="tanggal_lahir"
                                    type="date"
                                    required
                                    tabIndex={2}
                                    autoComplete="tanggal_lahir"
                                    value={data.tanggal_lahir}
                                    max={maxDate}
                                    min={minDate}
                                    onChange={(e) => setData({ ...data, tanggal_lahir: e.target.value })}
                                    disabled={processing}
                                    className="pl-10"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                </div>
                            </div>
                            <InputError message={errors.tanggal_lahir} />
                        </div>
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

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Buat Akun
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Sudah Punya Akun?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Masuk
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
