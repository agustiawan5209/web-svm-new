import ClassifyPemeriksaan from '@/components/classify-pemeriksaan';
import { Card, CardContent } from '@/components/ui/card';
import { Toast } from '@/components/ui/toast';
import UserAuthLayout from '@/layouts/guest/user-auth-layout';
import { KriteriaTypes, PredictionResult, SharedData, User, type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useMemo, useState } from 'react';

export interface PemeriksaanGuestCreateProps {
    breadcrumb?: { title: string; href: string }[];
    pasien: User[];
    kriteria: KriteriaTypes[];
}

type CreateForm = {
    user_id: string;
    rme: string;
    nik: string;
    nama: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    alamat: string;
    tanggal_pemeriksaan: string;
    kriteria:
        | {
              nilai: string | null;
              kriteria_id: string;
              name: string;
          }[]
        | undefined;
    label: string;
    alasan: string;
    rekomendasi: string[];
    usia_pasien: string;
    detail: string[];
    statusGizi: string[];
};

export default function PemeriksaanGuestCreate({ breadcrumb, pasien, kriteria }: PemeriksaanGuestCreateProps) {
    const { auth } = usePage<SharedData>().props;
    // Memoize breadcrumbs to prevent unnecessary recalculations
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [toast, setToast] = useState<{
        title: string;
        show: boolean;
        message: string;
        type: 'success' | 'default' | 'error';
    }>({
        title: '',
        show: false,
        message: '',
        type: 'success',
    });
    const today = new Date();
    const day = today.toISOString().split('T')[0];
    const { data, setData, post, processing, errors } = useForm<CreateForm>({
        rme: '',
        nik: '',
        user_id: auth.pasienid.toString(),
        nama: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        alamat: '',
        tanggal_pemeriksaan: day,
        kriteria: kriteria.map((attr) => ({ nilai: null, kriteria_id: attr.id.toString(), name: attr.nama })),
        label: '',
        alasan: '',
        rekomendasi: [],
        usia_pasien: '',
        detail: [],
        statusGizi: [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (data.label == '') {
            setData('label', prediction?.label?.toString() ?? '');
        } else {
            post(route('pemeriksaan.store'), {
                onError: (errors) => {
                    console.log(errors);
                    setToast({
                        title: 'Error',
                        show: true,
                        message: JSON.stringify(errors),
                        type: 'error',
                    });
                },
                preserveState: true,
            });
        }
    };

    useEffect(() => {
        if (prediction && prediction.label) {
            setData('label', prediction.label.toString());
        }
    }, [prediction]);

    return (
        <UserAuthLayout>
            <Head title="Create" />
            <Toast
                open={toast.show}
                onOpenChange={() => setToast((prev) => ({ ...prev, show: false }))}
                title={toast.title}
                description={toast.message}
                duration={5000}
                variant={toast.type}
            />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:from-gray-800 dark:to-gray-900">
                <div className="relative flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <Card className="border-none shadow-none">
                        <CardContent className="p-6">
                            <div className="grid gap-8">
                                {/* Search Section */}

                                {/* Selected Parent Info */}
                                {auth.user && (
                                    <div className="space-y-4 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-gray-700 dark:bg-gray-700/50">
                                        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">Informasi Orang Tua</h3>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Nama Orang Tua/Mewakili</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{auth.pasien.nama}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{auth.pasienemail}</p>
                                            </div>
                                            <div className="space-y-1 md:col-span-1">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Alamat</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{auth.pasienalamat}</p>
                                            </div>
                                            <div className="space-y-1 md:col-span-1">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">No. HP/Whatsapp</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{auth.pasiennohp}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Classification Section */}
                                {kriteria && (
                                    <div className="mt-4">
                                        <div className="mb-4">
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Rekomendasi Pemeriksaan</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Isi form berikut untuk melakukan klasifikasi</p>
                                        </div>
                                        <ClassifyPemeriksaan
                                            submit={submit}
                                            kriteria={kriteria}
                                            setResult={setPrediction}
                                            data={data}
                                            setData={setData as any}
                                            processing={processing}
                                            errors={errors as any}
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </UserAuthLayout>
    );
}
