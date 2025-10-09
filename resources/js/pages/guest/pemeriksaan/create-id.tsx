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
        user_id: auth.user.id.toString(),
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
            <Card className="border-none shadow-none">
                <CardContent className="p-6">
                    <div className="grid gap-8">
                        {/* Search Section */}

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
                </CardContent>
            </Card>
        </UserAuthLayout>
    );
}
