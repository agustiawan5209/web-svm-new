/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toast } from '@/components/ui/toast';
import SVMModel from '@/services/algorithm-model';
import { KriteriaTypes, LabelTypes, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { LeafyGreen, Loader2, LoaderCircle } from 'lucide-react';
import React, { FormEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import InputError from './input-error';
import TableLabelSayuran from './table-label-sayuran';
import { Button } from './ui/button';

type Dataset = {
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
    detail: string[];
    statusGizi: string[];
};

interface PredictionResult {
    prediction: number | number[] | null;
    label: string | string[] | null;
    rekomendasi: string | null;
    error: string | null;
}
interface TrainingData {
    features: number[][];
    labelsY: number[];
    featureNames: string[];
    label: LabelTypes[];
}
interface EvaluationResult {
    accuracy: number;
    confusionMatrix: number[][];
}

const ClassifyPemeriksaan = ({
    data,
    setData,
    processing,
    errors,
    kriteria,
    setResult,
    setFeature,
    submit,
}: {
    data: Dataset;
    setData: React.Dispatch<React.SetStateAction<Dataset>>;
    processing: boolean;
    errors: Dataset;
    kriteria: KriteriaTypes[];
    setResult: (predict: PredictionResult) => void;
    setFeature?: (feature: any) => void;
    submit: () => FormEventHandler;
}) => {
    const { auth } = usePage<SharedData>().props;
    // State management
    const [loading, setLoading] = useState(false);
    const [trainingData, setTrainingData] = useState<TrainingData | null>(null);
    const [model] = useState(new SVMModel());
    const [openDialog, setOpenDialog] = useState(false);
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [isError, setIsError] = useState(false);
    const today = new Date();

    const [nikPasien, setNikPasien] = useState('');
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
    const handleTanggalLahirChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            const umurIndex = kriteria.findIndex((k) => k.nama.toLowerCase().includes('umur'));
            const usiaBulan = hitungUsiaBulan(value);
            setData((prev) => {
                return {
                    ...prev,
                    tanggal_lahir: value, // Mengupdate tanggal_lahir, bukan tempat_lahir
                    kriteria: prev.kriteria?.map((item, i) => (i === umurIndex ? { ...item, nilai: usiaBulan.toString() } : item)),
                };
            });
        },
        [data, setData],
    );

    // Input handlers
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

    const fetchByLabelSayuran = async (label: string) => {
        try {
            const response = await axios.get(route('api.get.label-sayuran-by-label', { label: label }));
            if (response.status !== 200) throw new Error('Failed to fetch label sayuran');
            const data: any = await response.data;
            console.log(data);
            setData((prev) => ({ ...prev, statusGizi: data }));
        } catch (error) {
            console.error(error);
            setToast({
                title: 'Error',
                show: true,
                message: (error as Error).message,
                type: 'error',
            });
            return null;
        }
    };

    // Load data saat komponen mount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await model.fetchAndProcessData();
                await model.loadModel();
                setTrainingData(data as any);
            } catch (error) {
                setToast({
                    title: 'Error',
                    show: true,
                    message: `${(error as Error).message}, Lakukan training pada halaman decision Tree sebelum masuk Pemeriksaan Gizi Ibu Hamil`,
                    type: 'error',
                });
                setIsError(true);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const feature = data.kriteria?.map((item: any) => {
                const nilai = item.nilai;

                // Cek jika nilai null atau undefined
                if (nilai === null || nilai === undefined || nilai === '') {
                    setToast({
                        title: 'Error',
                        show: true,
                        message: `Nilai jenis kelamin, usia,  BB, TB, IMT Tidak Boleh Kosong `,
                        type: 'error',
                    });
                }

                const lowerItem = String(nilai).toLowerCase();

                if (lowerItem === 'laki-laki') {
                    return 0;
                } else if (lowerItem === 'perempuan') {
                    return 1;
                } else if (!isNaN(parseFloat(nilai)) && isFinite(nilai)) {
                    return parseFloat(nilai); // ubah ke angka
                } else {
                    return nilai; // biarkan tetap string
                }
            });

            if (data.nik === '' || data.nama === '' || data.tempat_lahir === '') {
                console.log(data.nik, data.nama);
                setToast({
                    title: 'Error',
                    show: true,
                    message: `NIK, Nama, Orang Tua, Tempat Lahir Tidak Boleh Kosong `,
                    type: 'error',
                });
            } else {
                const result = await model.predict([feature ?? []]);

                if (result.error) {
                    setToast({
                        title: 'Hasil Prediksi',
                        show: true,
                        message: result.error as string,
                        type: 'success',
                    });
                } else {
                    setPrediction(result);
                    if (setFeature) {
                        setFeature(data.kriteria);
                    }
                    if (result.label !== undefined && result.label !== null) {
                        const newLabel = result.label.toString();
                        console.log('Setting label to:', newLabel);
                        setData((prevData) => ({ ...prevData, label: newLabel }));
                        console.log('Data after set (may not be updated yet):', data);
                        setResult(result);
                        fetchByLabelSayuran(result.label?.toString() ?? '');
                        handleOpenDialog();
                    }
                }
            }
        } catch (error) {
            console.error(error);
            setToast({
                title: 'Hasil Prediksi',
                show: true,
                message: error as string,
                type: 'success',
            });
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (prediction && prediction.label) {
            console.log('Prediction label changed:', prediction.label);
            setData('label', prediction.label.toString());
        }
    }, [prediction]);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    // Handle Input data anak
    const tahunLalu = new Date(today);
    tahunLalu.setFullYear(today.getFullYear() - 1);
    const minDate = tahunLalu.toISOString().split('T')[0];

    function hitungUsia(tanggalLahir: string) {
        const birthDate = new Date(tanggalLahir);
        const today = new Date();

        let tahun = today.getFullYear() - birthDate.getFullYear();
        let bulan = today.getMonth() - birthDate.getMonth();
        let hari = today.getDate() - birthDate.getDate();

        if (hari < 0) {
            bulan--;
            hari += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); // total hari bulan sebelumnya
        }

        if (bulan < 0) {
            tahun--;
            bulan += 12;
        }

        return `${tahun} tahun, ${bulan} bulan, ${hari} hari`;
    }
    function hitungUsiaBulan(tanggalLahir: string) {
        const birthDate = new Date(tanggalLahir);
        const today = new Date();
        let tahun = today.getFullYear() - birthDate.getFullYear();
        let bulan = today.getMonth() - birthDate.getMonth();
        let hari = today.getDate() - birthDate.getDate();

        // total bulan = selisih tahun * 12 + selisih bulan
        let totalBulan = tahun * 12 + bulan;

        // kalau tanggal hari ini < tanggal lahir, berarti belum genap 1 bulan
        if (hari < 0) {
            totalBulan -= 1;
        }

        return totalBulan.toString();
    }
    const predictionColor = useMemo(() => {
        if (!prediction) return '';
        switch (prediction.label) {
            case 'Buruk':
                return 'bg-red-100 border-red-300 text-red-800';
            case 'Cukup':
                return 'bg-yellow-100 border-yellow-300 text-yellow-800';
            case 'Baik':
                return 'bg-green-100 border-green-300 text-green-800';
            default:
                return 'bg-blue-100 border-blue-300 text-blue-800';
        }
    }, [prediction]);

    const hitungIMT = (berat: number, tinggi: number) => {
        // tinggi dalam meter
        const tb = tinggi / 100;
        const imt = berat / (tb * tb);
        return imt.toFixed(3);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <Toast
                open={toast.show}
                onOpenChange={() => setToast((prev) => ({ ...prev, show: false }))}
                title={toast.title}
                description={toast.message}
                duration={10000}
                variant={toast.type}
            />

            <div className="grid grid-cols-1 rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="p-6 ring-1 md:p-8">
                    <form onSubmit={(e) => handlePredict(e)} className="space-y-6">
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="nik">NIK</Label>
                                <div className="flex">
                                    <Input
                                        id="nik"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="nik"
                                        value={nikPasien}
                                        onChange={(e) => {
                                            setData((prev) => ({ ...prev, nik: e.target.value }));
                                            setNikPasien(e.target.value);
                                        }}
                                        disabled={processing}
                                        placeholder="Masukkan Nik Pasien"
                                    />
                                </div>
                                <InputError message={errors.nik} className="mt-2" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nama">Nama Pasien</Label>
                                <Input
                                    id="nama"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="nama"
                                    value={data.nama}
                                    onChange={(e) => setData({ ...data, nama: e.target.value })}
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
                                        onChange={(e) => setData({ ...data, tempat_lahir: e.target.value })}
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
                                        // max={minDate}
                                        tabIndex={2}
                                        autoComplete="tanggal_lahir"
                                        value={data.tanggal_lahir}
                                        onChange={(e) => handleTanggalLahirChange(e)}
                                        disabled={processing}
                                        placeholder="tanggal lahir......."
                                    />
                                    <InputError message={errors.tanggal_lahir} />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {kriteria.map((item, index) => {
                                const value = data.kriteria?.[index]?.nilai ?? '';

                                return (
                                    <div key={index} className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">
                                            {item.nama.charAt(0).toUpperCase() + item.nama.slice(1)}
                                        </Label>
                                        {item.nama.toLowerCase() === 'jenis kelamin' ? (
                                            <Select
                                                value={data.kriteria?.[index]?.nilai || ''}
                                                required={true}
                                                onValueChange={(val) => {
                                                    setData((prev) => ({
                                                        ...prev,
                                                        jenis_kelamin: val,
                                                        kriteria: prev.kriteria?.map((item, i) => (i === index ? { ...item, nilai: val } : item)),
                                                    }));
                                                }}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Jenis Kelamin" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {['Laki-laki', 'Perempuan'].map((gender, idx) => (
                                                        <SelectItem key={idx} value={gender}>
                                                            {gender}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Input
                                                type="text"
                                                name={`kriteria.${index}`}
                                                value={value}
                                                onChange={handleChange}
                                                placeholder={`Enter ${item.nama}`}
                                                disabled={processing}
                                                readOnly={item.nama.toLowerCase().includes('imt') || item.nama.toLowerCase().includes('umur')}
                                                required
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex w-full flex-wrap gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={loading || !model || isError}
                                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Proses
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger />
                <DialogContent className="h-auto max-w-7xl overflow-y-auto">
                    <DialogTitle>
                        <div className="flex items-center gap-3 text-foreground">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                                <LeafyGreen className={`h-4 w-4 ${prediction?.label == 'Baik' ? 'text-green-500' : 'text-red-500'}`} />
                            </div>
                            <span className="text-lg font-medium">Hasil rekomendasi sayuran</span>
                        </div>
                    </DialogTitle>

                    <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Nama Gizi</p>
                                <p className="text-sm font-medium">{data.nama}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Tanggal Lahir</p>
                                <p className="text-sm font-medium">{data.tanggal_lahir}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Usia</p>
                                <p className="text-sm font-medium">{hitungUsia(data.tanggal_lahir)}</p>
                            </div>

                            <div className="space-y-1">
                                <p className={'text-sm font-medium text-muted-foreground ' + predictionColor}>status IMT</p>
                                <p
                                    className={`h-auto w-max flex-shrink-0 rounded-full px-2 ${
                                        prediction?.label === 'Buruk'
                                            ? 'bg-red-500'
                                            : prediction?.label === 'Cukup'
                                              ? 'bg-yellow-500'
                                              : prediction?.label === 'Baik'
                                                ? 'bg-green-500'
                                                : 'bg-blue-500'
                                    }`}
                                >
                                    {prediction?.label}
                                </p>
                            </div>
                            <div className="col-span-full">
                                <TableLabelSayuran data={data.statusGizi} />
                            </div>
                        </div>
                        <Button type="button" variant="default" size="sm" className="w-full" disabled={processing} onClick={submit}>
                            {processing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Simpan
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ClassifyPemeriksaan;
