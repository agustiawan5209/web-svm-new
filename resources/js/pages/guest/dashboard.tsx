/* eslint-disable @typescript-eslint/no-explicit-any */
import HeroSection from '@/components/hero-section';
import UserAuthLayout from '@/layouts/guest/user-auth-layout';
import { LabelTypes } from '@/types';
import { Head } from '@inertiajs/react';

interface GuestDashboardProps {
    meanKriteriaValue: string[];
    distributionLabel: string[];
    label: LabelTypes[];
    training: number;
    kriteria: number;
}

export default function GuestDashboard({ distributionLabel, label, training, kriteria }: GuestDashboardProps) {
    return (
        <UserAuthLayout>
            <Head title="Dashboard" />
            <div className="mx-auto max-w-7xl">
                <header className="mb-8">
                    <p className="mt-1 text-muted-foreground">Dashboard Rekomendasi Jenis Sayuran </p>
                </header>

                {/* Hero Section */}
                <HeroSection />
            </div>
        </UserAuthLayout>
    );
}
