import AppLayout from '@/layouts/app-layout';
import { PasienTypes, PemeriksaanTypes, SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Baby, Calendar, ClipboardList, PersonStanding, Ruler, Scale } from 'lucide-react';
import { useMemo } from 'react';

interface DetailPemeriksaan {
    kriteria: {
        nama: string;
    };
    nilai: number | string;
}
interface Attribut {
    id: string;
    nama: string;
}

export interface PemeriksaanProps {
    pasien: PasienTypes;
    pemeriksaan: PemeriksaanTypes[];
    detail: DetailPemeriksaan[];
    kriteria: Attribut[];
    breadcrumb: { title: string; href: string }[];
}

// Animasi variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
};

const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.3,
        },
    }),
};

export default function PemeriksaanShow({ pemeriksaan, pasien, kriteria, breadcrumb }: PemeriksaanProps) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    const searchById = (id: string, detail: { kriteria_id: number; nilai: string }[]): string => {
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

    // Format tanggal untuk display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    // Hitung usia berdasarkan tanggal lahir
    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Pemeriksaan" />
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="flex h-full flex-1 flex-col space-y-6 p-4 lg:p-6">
                {/* Header Section dengan Gradient */}
                <motion.div variants={itemVariants} className="text-center">
                    <motion.h1
                        className="bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-3xl font-bold text-transparent"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Sistem Klasifikasi Gizi Ibu Hamil
                    </motion.h1>
                    <motion.p
                        className="mt-2 text-gray-600 dark:text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        Detail Monitoring Gizi dan Perkembangan Kehamilan
                    </motion.p>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Left Column - Data Pasien */}
                    <motion.div variants={containerVariants} className="space-y-6">
                        {/* Data Pasien Card */}
                        <motion.div
                            variants={cardVariants}
                            className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-cyan-50 p-6 shadow-lg dark:border-emerald-800 dark:from-emerald-900/20 dark:to-cyan-900/20"
                        >
                            <div className="absolute top-4 right-4">
                                <motion.div
                                    animate={{
                                        rotate: [0, 5, 0, -5, 0],
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        repeatDelay: 3,
                                    }}
                                >
                                    <Baby className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
                                </motion.div>
                            </div>

                            <motion.h3
                                variants={itemVariants}
                                className="mb-4 flex items-center gap-3 text-xl font-semibold text-emerald-800 dark:text-emerald-200"
                            >
                                <PersonStanding className="h-6 w-6" />
                                Profil Ibu Hamil
                            </motion.h3>

                            <motion.div variants={containerVariants} className="space-y-4">
                                <DataRow icon={<Scale className="h-4 w-4" />} label="NIK" value={pasien.nik} />
                                <DataRow icon={<Ruler className="h-4 w-4" />} label="Nama Lengkap" value={pasien.nama} />
                                <DataRow
                                    icon={<Calendar className="h-4 w-4" />}
                                    label="Tempat, Tanggal Lahir"
                                    value={`${pasien.tempat_lahir}, ${formatDate(pasien.tanggal_lahir)}`}
                                />
                                <DataRow
                                    icon="♀♂"
                                    label="Usia & Jenis Kelamin"
                                    value={`${calculateAge(pasien.tanggal_lahir)} tahun, ${pasien.jenis_kelamin}`}
                                />
                            </motion.div>

                            {/* Decorative elements */}
                            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-400 to-cyan-400"></div>
                        </motion.div>

                        {/* Statistik Ringkas */}
                        <motion.div
                            variants={cardVariants}
                            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                        >
                            <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-200">Ringkasan Pemeriksaan</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                    className="rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-900/20"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{pemeriksaan?.length || 0}</div>
                                    <div className="text-sm text-blue-600/80 dark:text-blue-400/80">Total Pemeriksaan</div>
                                </motion.div>
                                <motion.div
                                    className="rounded-lg bg-green-50 p-3 text-center dark:bg-green-900/20"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{kriteria.length}</div>
                                    <div className="text-sm text-green-600/80 dark:text-green-400/80">Parameter Gizi</div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Column - Data Pemeriksaan */}
                    <motion.div variants={containerVariants} className="space-y-6">
                        {/* Examination Data Card */}
                        <motion.div
                            variants={cardVariants}
                            className="overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-xl dark:border-purple-800 dark:from-purple-900/20 dark:to-indigo-900/20"
                        >
                            <motion.h3
                                variants={itemVariants}
                                className="flex items-center gap-3 border-b border-purple-200 bg-gradient-to-r from-purple-500 to-indigo-500 p-4 text-lg font-semibold text-white dark:border-purple-800"
                            >
                                <ClipboardList className="h-5 w-5" />
                                Riwayat Pemeriksaan Gizi
                            </motion.h3>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-purple-400/10 to-indigo-400/10">
                                        <tr>
                                            <motion.th
                                                variants={itemVariants}
                                                className="w-12 px-4 py-4 text-left text-xs font-semibold tracking-wider text-purple-800 uppercase dark:text-purple-200"
                                            >
                                                No.
                                            </motion.th>
                                            <motion.th
                                                variants={itemVariants}
                                                className="px-4 py-4 text-left text-xs font-semibold tracking-wider text-purple-800 uppercase dark:text-purple-200"
                                            >
                                                Tanggal
                                            </motion.th>
                                            {kriteria.map((item, index) => (
                                                <motion.th
                                                    key={item.id}
                                                    variants={itemVariants}
                                                    custom={index}
                                                    className="px-4 py-4 text-left text-xs font-semibold tracking-wider text-purple-800 uppercase dark:text-purple-200"
                                                >
                                                    {item.nama}
                                                </motion.th>
                                            ))}
                                            <motion.th
                                                variants={itemVariants}
                                                className="px-4 py-4 text-left text-xs font-semibold tracking-wider text-purple-800 uppercase dark:text-purple-200"
                                            >
                                                Status Gizi
                                            </motion.th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-purple-100 dark:divide-purple-900/30">
                                        {pemeriksaan?.length > 0 ? (
                                            pemeriksaan.map((item, index) => (
                                                <motion.tr
                                                    key={index}
                                                    custom={index}
                                                    variants={tableRowVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    className="transition-colors duration-200 hover:bg-purple-50/50 dark:hover:bg-purple-900/10"
                                                    whileHover={{
                                                        scale: 1.01,
                                                        backgroundColor: 'rgba(192, 132, 252, 0.05)',
                                                    }}
                                                >
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{index + 1}</td>
                                                    <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">
                                                        {formatDate(item.tgl_pemeriksaan)}
                                                    </td>
                                                    {kriteria.map((kriterias) => (
                                                        <td
                                                            key={kriterias.id}
                                                            className="px-4 py-4 text-sm whitespace-nowrap text-gray-700 dark:text-gray-300"
                                                        >
                                                            {searchById(kriterias.id, item.detailpemeriksaan) || '-'}
                                                        </td>
                                                    ))}
                                                    <td className="px-4 py-4">
                                                        <StatusBadge status={item.label} />
                                                    </td>
                                                </motion.tr>
                                            ))
                                        ) : (
                                            <motion.tr variants={itemVariants} initial="hidden" animate="visible">
                                                <td colSpan={kriteria.length + 2} className="px-4 py-8 text-center">
                                                    <motion.div
                                                        animate={{
                                                            scale: [1, 1.02, 1],
                                                            opacity: [0.7, 1, 0.7],
                                                        }}
                                                        transition={{
                                                            duration: 2,
                                                            repeat: Infinity,
                                                        }}
                                                        className="text-gray-500 dark:text-gray-400"
                                                    >
                                                        <ClipboardList className="mx-auto mb-3 h-12 w-12 opacity-50" />
                                                        <div>Belum ada data pemeriksaan</div>
                                                        <div className="mt-1 text-sm">Data pemeriksaan akan muncul di sini</div>
                                                    </motion.div>
                                                </td>
                                            </motion.tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </AppLayout>
    );
}

// Komponen DataRow yang ditingkatkan
function DataRow({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
    return (
        <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 border-b border-emerald-100 py-3 last:border-b-0 dark:border-emerald-800/50"
            whileHover={{ x: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                {icon}
            </div>
            <div className="flex-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{value || '-'}</div>
            </div>
        </motion.div>
    );
}

// Komponen Status Badge dengan animasi
function StatusBadge({ status }: { status: string }) {
    const getStatusColor = (status: string) => {
        const statusLower = status.toLowerCase();
        if (statusLower.includes('baik') || statusLower.includes('normal')) {
            return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
        } else if (statusLower.includes('buruk') || statusLower.includes('gizi buruk')) {
            return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
        } else if (statusLower.includes('lebih') || statusLower.includes('tinggi')) {
            return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
        } else if (statusLower.includes('beresiko') || statusLower.includes('beresiko')) {
            return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
        }
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800';
    };

    return (
        <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(status)}`}
        >
            {status}
        </motion.span>
    );
}
