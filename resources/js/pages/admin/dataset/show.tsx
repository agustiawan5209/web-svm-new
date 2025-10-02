import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, DatasetTypes } from '@/types';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

interface HarvestDetailProps {
    dataset: DatasetTypes;
    breadcrumb: BreadcrumbItem[];
    titlePage: string;
}
export default function HarvestDetailPage({ dataset, breadcrumb, titlePage }: HarvestDetailProps) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );
    const [data] = useState<DatasetTypes>(dataset);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={titlePage ?? 'Detail'} />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
            >
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: 0.5 }} className="mb-12 text-center">
                        <h1 className="mb-3 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-4xl font-bold text-gray-900">
                            Detail Dataset
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600">Detail informasi terkait data nutrisi Gizi</p>
                    </motion.div>

                    {/* Summary Cards */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2"
                    >
                        {/* Cultivation Data */}
                        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-xl transition-shadow duration-300 hover:shadow-2xl">
                            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-blue-500"></div>
                            <div className="mb-6 flex items-center">
                                <div className="bg-opacity-10 mr-4 rounded-lg bg-primary p-3">
                                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">Rekomendasi</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100">
                                    <div className="flex items-center">
                                        <svg className="mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span className="text-gray-700">Gizi Label</span>
                                    </div>
                                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">{data.label}</span>
                                </div>
                            </div>
                        </div>

                        {/* Data  */}
                        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-xl transition-shadow duration-300 hover:shadow-2xl">
                            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-chart-4 to-green-500"></div>
                            <div className="mb-6 flex items-center">
                                <div className="bg-opacity-10 mr-4 rounded-lg bg-chart-4 p-3">
                                    <svg className="h-6 w-6 text-chart-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">Data </h3>
                            </div>
                            <div className="space-y-4">
                                {data.detail.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between rounded-lg border-l-4 border-chart-4 bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100"
                                    >
                                        <div className="flex items-center">
                                            <span className="font-medium text-gray-700">{item.kriteria.nama}</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">{item.nilai}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Additional Visual Elements */}
                    {/* <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-center">
                        <button className="transform rounded-lg bg-gradient-to-r from-primary to-blue-600 px-6 py-3 font-medium text-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
                            Export Data
                        </button>
                    </motion.div> */}
                </div>
            </motion.div>
        </AppLayout>
    );
}
