import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, JenisTanamanTypes, KriteriaTypes, LabelTypes } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useCallback } from 'react';

type Dataset = {
    label: string;
    attribut: {
        kriteria_id: number;
        nilai: string | null;
    }[];
};

interface PropsDatasetView {
    breadcrumb: BreadcrumbItem[];
    kriteria: KriteriaTypes[];
    opsiLabel: LabelTypes[];
    jenisTanaman: JenisTanamanTypes[];
    titlePage?: string;
}

export default function FormDatasetView({ breadcrumb, kriteria, titlePage, opsiLabel }: PropsDatasetView) {
    const breadcrumbs: BreadcrumbItem[] = breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : [];
    const { data, setData, post, processing, errors } = useForm<Dataset>({
        label: '',
        attribut: kriteria.map((_, index) => ({
            kriteria_id: kriteria[index].id,
            nilai: null,
        })),
    });

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            const [field, indexStr] = name.split('.');
            const index = Number(indexStr);
            if (field === 'attribut') {
                if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
                    setData((prev) => {
                        // Update nilai yang diubah
                        const updatedKriteria = prev.attribut?.map((item, i) => (i === index ? { ...item, nilai: value } : item));

                        // Cari index untuk perhitungan IMT
                        const BBindex = kriteria.findIndex((k) => k.nama.includes('BB'));
                        const TBindex = kriteria.findIndex((k) => k.nama.includes('TB'));
                        const IMTindex = kriteria.findIndex((k) => k.nama.toLowerCase().includes('imt'));

                        // Jika yang diubah adalah BB atau TB, hitung IMT
                        if ((index === BBindex || index === TBindex) && IMTindex !== -1) {
                            const nilaiBB = index === BBindex ? Number(value) : Number(updatedKriteria?.[BBindex]?.nilai ?? 0);

                            const nilaiTB = index === TBindex ? Number(value) : Number(updatedKriteria?.[TBindex]?.nilai ?? 0);

                            // Hitung IMT hanya jika kedua nilai valid
                            if (nilaiBB > 0 && nilaiTB > 0) {
                                return {
                                    ...prev,
                                    attribut: updatedKriteria?.map((item, i) =>
                                        i === IMTindex ? { ...item, nilai: hitungIMT(nilaiBB, nilaiTB) } : item,
                                    ),
                                };
                            }
                        }

                        return {
                            ...prev,
                            attribut: updatedKriteria,
                        };
                    });
                }
            } else {
                setData((prev) => ({ ...prev, [name]: value }));
            }
        },
        [kriteria, setData],
    );

    const hitungIMT = (berat: number, tinggi: number) => {
        // tinggi dalam meter
        const tb = tinggi / 100;
        const imt = berat / (tb * tb);
        return imt.toFixed(3);
    };

    const handleSelectChange = (name: string, value: string) => {
        if (name && value !== undefined && data && data.attribut) {
            if (name === 'label') {
                setData((prevData) => ({
                    ...prevData,
                    [name]: value,
                }));
            } else {
                setData((prevData) => ({
                    ...prevData,
                    attribut: prevData.attribut.map((item, index) => {
                        if (index === Number(name)) {
                            return {
                                ...item,
                                nilai: value,
                            };
                        } else {
                            return item;
                        }
                    }),
                }));
            }
        } else {
            console.error('Invalid data: name, value, or attribut may be undefined');
        }
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Tambahkan logika submit di sini
        post(route('admin.dataset.store'), {
            onError: (err) => {
                console.log(err);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={titlePage ?? 'Input Data Gizi Ibu Hamil'} />
            <div className="mx-auto max-w-7xl rounded-xl border border-gray-100 bg-white p-6 shadow">
                <h1 className="mb-6 text-center text-xl font-semibold text-primary">Input Data Gizi Ibu Hamil</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informasi Dasar */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <Label className="text-xs text-gray-600">Label</Label>
                            <Select value={data.label} required onValueChange={(value) => handleSelectChange('label', value)}>
                                <SelectTrigger className="input-minimal">
                                    <SelectValue placeholder="Pilih" />
                                </SelectTrigger>
                                <SelectContent>
                                    {opsiLabel.map((item: any, index) => (
                                        <SelectItem key={index} value={item.nama}>
                                            {item.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.label && <InputError message={errors.label} className="mt-2" />}
                        </div>
                    </div>

                    {/* Parameter Lingkungan */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {kriteria.map((item: { nama: string; id: number; deskripsi: string }, index: number) => {
                            if (item.nama.toLowerCase() === 'jenis kelamin') {
                                return (
                                    <div key={index} className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">{item.nama}</Label>
                                        <Select
                                            value={data.attribut[index].nilai || ''}
                                            required
                                            onValueChange={(value) => handleSelectChange(index.toLocaleString(), value)}
                                        >
                                            <SelectTrigger className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                                                <SelectValue placeholder="Select " />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-lg border border-gray-200 shadow-lg">
                                                {['Laki-laki', 'Perempuan'].map((jenkel, idx) => (
                                                    <SelectItem key={idx} value={jenkel} className="px-4 py-2 hover:bg-gray-50">
                                                        {jenkel}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                );
                            }
                            if (item.nama.toLowerCase() === 'pola makan') {
                                return (
                                    <div key={index} className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">{item.nama}</Label>
                                        <Select
                                            value={data.attribut[index].nilai || ''}
                                            required
                                            onValueChange={(value) => handleSelectChange(index.toLocaleString(), value)}
                                        >
                                            <SelectTrigger className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                                                <SelectValue placeholder="Select " />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-lg border border-gray-200 shadow-lg">
                                                {['kurang', 'sedang', 'baik'].map((jenkel, idx) => (
                                                    <SelectItem key={idx} value={jenkel} className="px-4 py-2 hover:bg-gray-50">
                                                        {jenkel}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                );
                            }
                            return (
                                <div key={index}>
                                    <Label className="text-xs text-gray-600">{item.nama}</Label>
                                    <Input
                                        type="text"
                                        name={`attribut.${index}`}
                                        value={data.attribut[index].nilai || ''}
                                        onChange={handleChange}
                                        className="input-minimal"
                                        placeholder={`masukkan ${item.nama}`}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" variant={'default'}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Simpan Data
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
