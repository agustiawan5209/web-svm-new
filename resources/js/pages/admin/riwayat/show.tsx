import AppLayout from '@/layouts/app-layout';
import { DetailPemeriksaanTypes, PemeriksaanTypes, SharedData, User, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { PersonIcon } from '@radix-ui/react-icons';
import {
    Activity,
    AlertCircle,
    Calendar,
    ChartBar,
    CheckCircle,
    Circle,
    ClipboardList,
    IdCard,
    MapPin,
    Ruler,
    UserCircle,
    Weight,
    WormIcon,
} from 'lucide-react';
import { useMemo } from 'react';

interface PolaMakan {
    id: string;
    rekomendasi: string;
    catatan_dokter: string;
}
interface Attribut {
    id: string;
    nama: string;
}
export interface RiwayatShowProps {
    pasien: User;
    pemeriksaan: PemeriksaanTypes;
    detail: DetailPemeriksaanTypes[];
    polamakan: PolaMakan;
    kriteria: Attribut[];
    dataPemeriksaanPasien: PemeriksaanTypes[];
    breadcrumb: { title: string; href: string }[];
}

export default function RiwayatShowView({ pemeriksaan, pasien, detail, kriteria, polamakan, dataPemeriksaanPasien, breadcrumb }: RiwayatShowProps) {
    // Memoize breadcrumbs to prevent unnecessary recalculations
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    const handleDownloadStart = () => {
        console.log('Download started');
    };

    const handleDownloadSuccess = () => {
        console.log('Download completed successfully');
    };

    const handleDownloadError = (error: unknown) => {
        console.error('Download failed:', error);
    };
    const searchById = (id: string, detail: { kriteria_id: string; nilai: string }[]): string => {
        if (!detail || !id) return '';
        try {
            const foundElement = detail.find((element) => String(element.kriteria_id).includes(id));
            return foundElement?.nilai ?? '';
        } catch (error) {
            console.error('Error in searchById:', error);
            return '';
        }
    };
    const page = usePage<SharedData>();
    const { defaultUrl } = page.props;
    const predictionColor = useMemo(() => {
        if (!pemeriksaan) return '';
        switch (pemeriksaan.label) {
            case 'beresiko':
                return 'bg-red-100 border-red-300 text-red-800';
            case 'gizi buruk':
                return 'bg-yellow-100 border-yellow-300 text-yellow-800';
            case 'gizi normal':
                return 'bg-green-100 border-green-300 text-green-800';
            default:
                return 'bg-blue-100 border-blue-300 text-blue-800';
        }
    }, [pemeriksaan]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Pemeriksaan" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 px-4 py-6 dark:from-gray-900 dark:to-blue-900/20">
                <div className="mx-auto max-w-7xl">
                    {/* Header Section */}
                    <div className="mb-8 rounded-2xl bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:bg-gray-800/80">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex-1">
                                <div className="mb-3 flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-600">
                                        <ClipboardList className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Detail Pemeriksaan</h1>
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                            Informasi lengkap hasil pemeriksaan gizi ibu hamil
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 lg:mt-0">
                                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 dark:bg-blue-900/30">
                                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                        {new Date(pemeriksaan.tgl_pemeriksaan).toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* Left Column - Patient Information */}
                        <div className="space-y-6 lg:col-span-5">
                            {/* Patient Data Card */}
                            <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-emerald-900/50 dark:from-emerald-900/20 dark:to-gray-800">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                                <div className="relative p-6">
                                    <div className="mb-6 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
                                            <PersonIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Pasien</h3>
                                            <p className="text-sm text-emerald-600 dark:text-emerald-400">Informasi identitas pasien</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            {
                                                label: 'NIK',
                                                value: pasien.nik,
                                                icon: <IdCard className="h-4 w-4" />,
                                            },
                                            {
                                                label: 'Nama Lengkap',
                                                value: pasien.nama,
                                                icon: <UserCircle className="h-4 w-4" />,
                                            },
                                            {
                                                label: 'Tempat Lahir',
                                                value: pasien.tempat_lahir,
                                                icon: <MapPin className="h-4 w-4" />,
                                            },
                                            {
                                                label: 'Tanggal Lahir',
                                                value: pasien.tanggal_lahir,
                                                icon: <Calendar className="h-4 w-4" />,
                                            },
                                            {
                                                label: 'Jenis Kelamin',
                                                value: pasien.jenis_kelamin,
                                                icon: <WormIcon className="h-4 w-4" />,
                                            },
                                        ].map((item: any, index) => (
                                            <div
                                                key={item.label}
                                                className="flex items-center gap-4 rounded-lg bg-white/50 p-3 transition-colors hover:bg-white/80 dark:bg-gray-700/50 dark:hover:bg-gray-700/80"
                                            >
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                                                    {item.icon}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
                                                    <p className="truncate text-sm text-gray-900 dark:text-white">{item.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Examination Data */}
                        <div className="space-y-6 lg:col-span-7">
                            {/* Results Summary Card */}
                            <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-6 shadow-sm dark:border-orange-900/50 dark:from-orange-900/20 dark:to-gray-800">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/50">
                                        <ChartBar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hasil Pemeriksaan Gizi Ibu Hamil</h3>
                                    <br />
                                </div>
                                <div className="flex flex-col items-center justify-center space-y-4 py-2">
                                    <div
                                        className={`rounded-full p-1 ${pemeriksaan.label === 'beresiko' ? 'bg-red-100' : pemeriksaan.label === 'gizi buruk' ? 'bg-yellow-100' : pemeriksaan.label === 'gizi normal' ? 'bg-green-100' : 'bg-blue-100'}`}
                                    >
                                        <div
                                            className={`flex h-24 w-24 items-center justify-center rounded-full ${pemeriksaan.label === 'beresiko' ? 'bg-red-500' : pemeriksaan.label === 'gizi buruk' ? 'bg-yellow-500' : pemeriksaan.label === 'gizi normal' ? 'bg-green-500' : 'bg-blue-500'}`}
                                        >
                                            {pemeriksaan.label === 'gizi normal' ? (
                                                <CheckCircle className="h-10 w-10 text-white" />
                                            ) : (
                                                <AlertCircle className="h-10 w-10 text-white" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-slate-600">Status IMT</p>
                                    <p className={`rounded-2xl p-2 text-xl font-bold ${predictionColor}`}>{pemeriksaan.label || '-'}</p>
                                </div>
                            </div>
                            {/* Examination Details Card */}
                            <div className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-purple-900/50 dark:from-purple-900/20 dark:to-gray-800">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                                <div className="relative p-6">
                                    <div className="mb-6 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/50">
                                            <ClipboardList className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Pemeriksaan</h3>
                                            <p className="text-sm text-purple-600 dark:text-purple-400">Parameter dan hasil pemeriksaan gizi</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {detail
                                            .filter((attr) => !['jenis kelamin'].includes(attr.kriteria.nama.toLowerCase()))
                                            .map((item, index) => {
                                                // Determine icon based on criteria type
                                                const getIcon = (kriteriaName: any) => {
                                                    const name = kriteriaName.toLowerCase();
                                                    if (name.includes('berat') || name.includes('bb')) return <Weight className="h-4 w-4" />;
                                                    if (name.includes('tinggi') || name.includes('tb')) return <Ruler className="h-4 w-4" />;
                                                    if (name.includes('usia') || name.includes('umur')) return <Calendar className="h-4 w-4" />;
                                                    if (name.includes('lingkar')) return <Circle className="h-4 w-4" />;
                                                    return <Activity className="h-4 w-4" />;
                                                };

                                                const getColor = (index: any) => {
                                                    const colors = [
                                                        'from-blue-500 to-cyan-500',
                                                        'from-purple-500 to-pink-500',
                                                        'from-green-500 to-emerald-500',
                                                        'from-orange-500 to-red-500',
                                                        'from-indigo-500 to-blue-500',
                                                        'from-teal-500 to-green-500',
                                                    ];
                                                    return colors[index % colors.length];
                                                };

                                                return (
                                                    <div
                                                        key={item.kriteria.nama}
                                                        className="group/card relative overflow-hidden rounded-xl bg-white/80 p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:bg-gray-700/50"
                                                    >
                                                        <div
                                                            className={`absolute inset-0 bg-gradient-to-br ${getColor(index)} opacity-5 transition-opacity duration-300 group-hover/card:opacity-10`}
                                                        ></div>

                                                        <div className="relative flex items-start gap-3">
                                                            <div
                                                                className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${getColor(index)} text-white shadow-sm`}
                                                            >
                                                                {getIcon(item.kriteria.nama)}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                                    {item.kriteria.nama}
                                                                </p>
                                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.nilai}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {/* <div className="mt-8 flex flex-wrap gap-4">
                        <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 font-medium text-white shadow-sm transition-all hover:from-green-600 hover:to-emerald-700 hover:shadow-md">
                            <Download className="h-4 w-4" />
                            Export PDF
                        </button>
                        <button className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                            <Printer className="h-4 w-4" />
                            Cetak Laporan
                        </button>
                        <button className="inline-flex items-center gap-2 rounded-xl border border-blue-300 bg-blue-50 px-6 py-3 font-medium text-blue-700 shadow-sm transition-all hover:bg-blue-100 dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50">
                            <Share className="h-4 w-4" />
                            Bagikan Hasil
                        </button>
                    </div> */}
                </div>
            </div>
        </AppLayout>
    );
}
