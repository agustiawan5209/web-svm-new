import FormKlasifikasi from '@/components/formulir-klasifikasi';
import { Card, CardContent } from '@/components/ui/card';
import { Toast } from '@/components/ui/toast';
import AppLayout from '@/layouts/app-layout';
import { KriteriaTypes, PredictionResult, SharedData, type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useMemo, useState } from 'react';

export interface PemeriksaanCreateProps {
    breadcrumb?: { title: string; href: string }[];
    kriteria: KriteriaTypes[];
}

type CreateForm = {
    rme: string;
    user_id: string;
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
    detail: string[];
    statusGizi: string[];
};

export default function PemeriksaanCreate({ breadcrumb, kriteria }: PemeriksaanCreateProps) {
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
    const { auth } = usePage<SharedData>().props;
    const today = new Date();
    const day = today.toISOString().split('T')[0];
    const { data, setData, get, post, processing, errors } = useForm<CreateForm>({
        rme: '',
        user_id: '',
        nik: '',
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
        detail: [],
        statusGizi: [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (data.label == '') {
            setData('label', prediction?.label?.toString() ?? '');
        } else {
            post(route('pemeriksaan.store', { label: prediction?.label?.toString() }), {
                onError: (errors) => {
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create" />
            <Toast
                open={toast.show}
                onOpenChange={() => setToast((prev) => ({ ...prev, show: false }))}
                title={toast.title}
                description={toast.message}
                duration={5000}
                variant={toast.type}
            />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-1 lg:p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <Card>
                        <CardContent>
                            {kriteria && (
                                <div className="mt-6">
                                    <FormKlasifikasi
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
