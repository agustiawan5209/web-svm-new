import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
    role: string;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    flash: {
        success?: string;
        error?: string;
    }
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    nik: string;
    name: string;
    email: string;
    avatar?: string;
    alamat?: string;
    nohp?: string;
    jenis_kelamin?: string;
    tempat_lahir?: string;
    tgl_lahir?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}


export interface KriteriaTypes {
    id: number;
    nama: string;
    deskripsi: string;
}
export interface LabelTypes {
    id: number;
    nama: string;
    deskripsi: string;
}
export interface LabelSayuranTypes {
    id: number;
    label_id: number;
    sayuran: string;
    porsi: string;
    tekstur: string;
    frekuensi: string;
    label: LabelTypes;
}



export interface JenisTanamanTypes {
    id: number;
    nama: string;
    deskripsi: string;
}


export interface DatasetTypes {
    id: number;
    label: string;
    data: string[];
    created_at?: string;
    detail: DetailDatasetTypes[];
}

export interface DetailDatasetTypes {
    id: number;
    kriteria_id: number;
    dataset_id: number;
    nilai: string;
    kriteria: KriteriaTypes;
}
export interface DetailPemeriksaanTypes {
    id: number;
    kriteria_id: number;
    pemeriksaan_id: number;
    nilai: string;
    kriteria: KriteriaTypes;
}
export interface PasienTypes {
    id: number;
    nik: string;
    nama: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    user_id: string;
    user: User;
}


interface PredictionResult {
    prediction: number | number[] | null;
    label: string | string[] | null;
    rekomendasi: string | null;
    error: string | null;
}



export interface PemeriksaanTypes {
    id: number;
    pasien_id: number;
    rme: string;
    nik: string;
    data_pasien: string[];
    pasien: PasienTypes;
    tgl_pemeriksaan: string;
    data_pemeriksaan: string;
    label: string;
    rekomendasi: string[];
    detailpemeriksaan: DetailPemeriksaanTypes[];
    statusGizi: LabelSayuranTypes[];
}
