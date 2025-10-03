import FormLoopKriteria from '@/components/form-loop-kriteria';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, DatasetTypes, JenisTanamanTypes, KriteriaTypes, LabelTypes } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useCallback } from 'react';

interface PropsDatasetView {
    breadcrumb: BreadcrumbItem[];
    kriteria: KriteriaTypes[];
    jenisTanaman: JenisTanamanTypes[];
    opsiLabel: LabelTypes[];
    titlePage?: string;
    dataset?: DatasetTypes; // Added for edit functionality
}
type Form = {
    id: number;
    label: string;
    kriteria: {
        kriteria_id: number;
        nilai: string | null;
    }[];
};

export default function EditDatasetView({ breadcrumb, kriteria, titlePage, dataset, opsiLabel }: PropsDatasetView) {
    const breadcrumbs: BreadcrumbItem[] = breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : [];

    // Initialize form with existing dataset data if available
    const { data, setData, put, processing, errors } = useForm<Form>({
        id: dataset?.id ?? 0,
        label: dataset?.label || '',
        kriteria: kriteria.map((kriteriaItem) => {
            // Find the existing kriteriae value if editing
            const existingAttribut = dataset?.detail.find((attr) => Number(attr.kriteria_id) === Number(kriteriaItem.id));
            return {
                kriteria_id: Number(kriteriaItem.id),
                nilai: existingAttribut?.nilai || null,
            };
        }),
    });
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            const [field, indexStr] = name.split('.');
            const index = Number(indexStr);
            if (field === 'kriteria') {
                if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
                    setData((prev) => {
                        // Update nilai yang diubah
                        const updatedKriteria = prev.kriteria?.map((item, i) => (i === index ? { ...item, nilai: value } : item));

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
                                    kriteria: updatedKriteria?.map((item, i) =>
                                        i === IMTindex ? { ...item, nilai: hitungIMT(nilaiBB, nilaiTB) } : item,
                                    ),
                                };
                            }
                        }

                        return {
                            ...prev,
                            kriteria: updatedKriteria,
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
        if (name && value !== undefined && data && data.kriteria) {
            if (name === 'label') {
                setData((prevData) => ({
                    ...prevData,
                    [name]: value,
                }));
            } else {
                setData((prevData) => ({
                    ...prevData,
                    kriteria: prevData.kriteria.map((item, index) => {
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
            console.error('Invalid data: name, value, or kriteria may be undefined');
        }
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Use put instead of post for update
        put(route('admin.dataset.update', data.id), {
            onError: (err) => {
                console.log(err);
            },
            onSuccess: () => {
                // Optional: Add success message or redirect
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={titlePage ?? 'Edit Data Dataset Gizi'} />
            <div className="mx-auto max-w-7xl rounded-xl border border-gray-100 bg-white p-6 shadow">
                <h1 className="mb-6 text-center text-xl font-semibold text-primary">Edit Data Dataset Gizi</h1>
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
                    <FormLoopKriteria
                        kriteria={kriteria}
                        data={data}
                        setData={setData}
                        handleChange={handleChange}
                        handleSelectChange={handleSelectChange}
                        processing={processing}
                    />
                    <div className="flex justify-end">
                        <Button type="submit" variant={'default'}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Update Data
                        </Button>
                    </div>
                </form>
            </div>
            <style>{`
                .input-minimal {
                    background: #f9fafb;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 8px 12px;
                    font-size: 14px;
                    outline: none;
                    transition: border 0.2s;
                }
                .input-minimal:focus {
                    border-color: var(--color-primary, #2563eb);
                    background: #fff;
                }
                .bg-primary { background-color: var(--color-primary, #2563eb); }
                .bg-primary-dark { background-color: var(--color-primary-dark, #1d4ed8); }
                .text-primary { color: var(--color-primary, #2563eb); }
            `}</style>
        </AppLayout>
    );
}
