/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toast } from '@/components/ui/toast';
import SVMModel from '@/services/algorithm-model';
import { KriteriaTypes, LabelTypes, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    Activity,
    AlertCircle,
    Calendar,
    CheckCircle,
    Heart,
    LeafyGreen,
    Loader2,
    LoaderCircle,
    MapPin,
    PersonStandingIcon,
    Scale,
    User,
} from 'lucide-react';
import React, { FormEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import FormLoopKriteria from './form-loop-kriteria';
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

const FormKlasifikasi = ({
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

    const [nikPasien, setNikPasien] = useState(data.nik || '');
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
                    kriteria: prevData.kriteria?.map((item, index) => {
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

    const fetchByLabelSayuran = async (label: string) => {
        try {
            const response = await axios.get(route('api.get.label-sayuran-by-label', { label: label }));
            if (response.status !== 200) throw new Error('Failed to fetch rekomendasi makanan');
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
                console.log(data);
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

    const findNik = (nik: number) => {
        // mencari data pasien berdasarkan nik
        const pasien = axios.get(route('api.get.pasien-by-nik', { nik: nik }));
        if (pasien) {
            pasien
                .then((res) => {
                    const data = res.data;
                    setData((prev) => ({
                        ...prev,
                        nama: data.nama,
                        tempat_lahir: data.tempat_lahir,
                        tanggal_lahir: data.tanggal_lahir,
                        jenis_kelamin: data.jenis_kelamin,
                        alamat: data.alamat,
                    }));
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };
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
                } else if (lowerItem === 'kurang') {
                    return 0;
                } else if (lowerItem === 'sedang') {
                    return 1;
                } else if (lowerItem === 'baik') {
                    return 2;
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
                const dataToSend = {
                    trainingData: trainingData?.features,
                    className: trainingData?.labelsY,
                    inputFeature: feature,
                };
                const response = await axios.post('https://delapain.my.id/api/svm/', dataToSend);
                const label = trainingData?.label.find((item, index) => item.id === response.data.result);

                const result = label?.nama;

                if (response.data.status !== 'success') {
                    setToast({
                        title: 'Hasil Prediksi',
                        show: true,
                        message: response.data.status as string,
                        type: 'error',
                    });
                } else {
                    setPrediction({
                        prediction: response.data.result,
                        label: result ?? null,
                        rekomendasi: label?.deskripsi ?? null,
                        error: null,
                    });
                    if (setFeature) {
                        setFeature(data.kriteria);
                    }
                    if (result !== undefined && result !== null) {
                        const newLabel = result.toString();
                        setData((prevData) => ({ ...prevData, label: newLabel }));

                        setResult({ prediction: response.data.result, label: result ?? null, rekomendasi: label?.deskripsi ?? null, error: null });
                        fetchByLabelSayuran(result?.toString() ?? '');
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

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    // Handle Input data anak
    const tahunLalu = new Date(today);
    tahunLalu.setFullYear(today.getFullYear() - 12);
    const maxDate = tahunLalu.toISOString().split('T')[0];
    tahunLalu.setFullYear(today.getFullYear() - 51);
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
            case 'beresiko':
                return 'bg-red-100 border-red-300 text-red-800';
            case 'gizi buruk':
                return 'bg-yellow-100 border-yellow-300 text-yellow-800';
            case 'gizi normal':
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-8">
            <div className="mx-auto max-w-4xl">
                {/* Toast Notification */}
                <Toast
                    open={toast.show}
                    onOpenChange={() => setToast((prev) => ({ ...prev, show: false }))}
                    title={toast.title}
                    description={toast.message}
                    duration={10000}
                    variant={toast.type}
                />

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-sm">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                            <LeafyGreen className="h-5 w-5 text-green-600" />
                        </div>
                        <h1 className="text-xl font-bold text-slate-800">Deteksi Status Gizi Ibu Hamil</h1>
                    </div>
                    <p className="mt-3 text-slate-600">Sistem prediksi status gizi menggunakan metode SVM</p>
                </div>

                {/* Main Form Card */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
                        <h2 className="text-lg font-semibold">Data Pasien</h2>
                        <p className="text-sm opacity-90">Lengkapi informasi di bawah untuk analisis gizi</p>
                    </div>

                    <div className="p-6 md:p-8">
                        <form onSubmit={(e) => handlePredict(e)} className="space-y-6">
                            {/* Patient Identity Section */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* NIK Input */}
                                    <div className="space-y-2">
                                        <Label htmlFor="nik" className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-slate-500" />
                                            NIK Pasien
                                        </Label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Input
                                                    id="nik"
                                                    type="text"
                                                    required
                                                    tabIndex={1}
                                                    autoComplete="nik"
                                                    value={nikPasien}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Hanya izinkan angka
                                                        if (/^\d*$/.test(value)) {
                                                            if (value.length <= 16) {
                                                                setData((prev) => ({ ...prev, nik: value }));
                                                                setNikPasien(value);
                                                            }
                                                        }
                                                    }}
                                                    disabled={processing}
                                                    placeholder="Masukkan NIK Pasien"
                                                    className="pl-10"
                                                />
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <User className="h-4 w-4 text-slate-400" />
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant={'outline'}
                                                onClick={() => {
                                                    if (nikPasien.length <= 16) {
                                                        findNik(Number(nikPasien));
                                                    } else {
                                                        setToast({
                                                            title: 'Error',
                                                            show: true,
                                                            message: 'NIK harus 16 digit',
                                                            type: 'error',
                                                        });
                                                    }
                                                }}
                                            >
                                                Cari
                                            </Button>
                                        </div>
                                        <InputError message={errors.nik} className="mt-2" />
                                    </div>

                                    {/* Nama Input */}
                                    <div className="space-y-2">
                                        <Label htmlFor="nama" className="flex items-center gap-2">
                                            <PersonStandingIcon className="h-4 w-4 text-slate-500" />
                                            Nama Pasien
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="nama"
                                                type="text"
                                                required
                                                tabIndex={1}
                                                autoComplete="nama"
                                                value={data.nama}
                                                onChange={(e) => setData({ ...data, nama: e.target.value })}
                                                disabled={processing}
                                                placeholder="Nama Lengkap Pasien"
                                                className="pl-10"
                                            />
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                <PersonStandingIcon className="h-4 w-4 text-slate-400" />
                                            </div>
                                        </div>
                                        <InputError message={errors.nama} className="mt-2" />
                                    </div>
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
                                                max={maxDate}
                                                min={minDate}
                                                autoComplete="tanggal_lahir"
                                                value={data.tanggal_lahir}
                                                onChange={(e) => handleTanggalLahirChange(e)}
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
                            </div>

                            {/* Criteria Form */}
                            <FormLoopKriteria
                                kriteria={kriteria}
                                data={data}
                                setData={setData}
                                handleChange={handleChange}
                                handleSelectChange={handleSelectChange}
                                processing={processing}
                            />

                            {/* Submit Button */}
                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={loading || !model || isError}
                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 py-3 font-medium text-white shadow-md transition-all hover:from-green-700 hover:to-emerald-700 hover:shadow-lg disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Activity className="mr-2 h-4 w-4" />}
                                    {loading ? 'Memproses...' : 'Analisis Status Gizi'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Results Dialog */}
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger />
                    <DialogContent className="max-w-4xl overflow-hidden rounded-2xl p-0">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                            <DialogTitle className="flex items-center gap-3 text-white">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                                    <LeafyGreen className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Hasil Analisis Status Gizi</h2>
                                    <p className="text-sm opacity-90">Rekomendasi berdasarkan kondisi kesehatan</p>
                                </div>
                            </DialogTitle>
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto p-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Patient Information */}
                                <div className="space-y-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
                                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                                        <User className="h-5 w-5 text-slate-600" />
                                        Informasi Pasien
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex justify-between border-b border-slate-200 pb-2">
                                            <span className="text-slate-600">Nama</span>
                                            <span className="font-medium">{data.nama || '-'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-200 pb-2">
                                            <span className="text-slate-600">Tanggal Lahir</span>
                                            <span className="font-medium">{data.tanggal_lahir || '-'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-200 pb-2">
                                            <span className="text-slate-600">Usia</span>
                                            <span className="font-medium">{hitungUsia(data.tanggal_lahir)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Tempat Lahir</span>
                                            <span className="font-medium">{data.tempat_lahir || '-'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Nutrition Status */}
                                <div className="space-y-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
                                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                                        <Scale className="h-5 w-5 text-slate-600" />
                                        Status Gizi
                                    </h3>

                                    <div className="flex flex-col items-center justify-center space-y-4 py-2">
                                        <div
                                            className={`rounded-full p-1 ${prediction?.label === 'beresiko' ? 'bg-red-100' : prediction?.label === 'gizi buruk' ? 'bg-yellow-100' : prediction?.label === 'gizi normal' ? 'bg-green-100' : 'bg-blue-100'}`}
                                        >
                                            <div
                                                className={`flex h-24 w-24 items-center justify-center rounded-full ${prediction?.label === 'beresiko' ? 'bg-red-500' : prediction?.label === 'gizi buruk' ? 'bg-yellow-500' : prediction?.label === 'gizi normal' ? 'bg-green-500' : 'bg-blue-500'}`}
                                            >
                                                {prediction?.label === 'gizi normal' ? (
                                                    <CheckCircle className="h-10 w-10 text-white" />
                                                ) : (
                                                    <AlertCircle className="h-10 w-10 text-white" />
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <p className="text-sm font-medium text-slate-600">Status IMT</p>
                                            <p className={`rounded-2xl p-2 text-xl font-bold ${predictionColor}`}>{prediction?.label || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Nutrition Table */}
                            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
                                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
                                    <Heart className="h-5 w-5 text-slate-600" />
                                    Rekomendasi Gizi
                                </h3>
                                <TableLabelSayuran data={data.statusGizi} />
                            </div>

                            {/* Action Button */}
                            <div className="mt-6">
                                <Button
                                    type="button"
                                    variant="default"
                                    size="sm"
                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 py-3 font-medium text-white shadow-md transition-all hover:from-green-700 hover:to-emerald-700 hover:shadow-lg"
                                    disabled={processing}
                                    onClick={submit}
                                >
                                    {processing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                    {processing ? 'Menyimpan...' : 'Simpan Hasil Analisis'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default FormKlasifikasi;
