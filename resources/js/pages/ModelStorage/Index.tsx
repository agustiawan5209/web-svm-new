import FormTraining from '@/components/form-training';
import { Card } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, JenisTanamanTypes, KriteriaTypes } from '@/types';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

interface DecisionTreeViewProps {
    dataTraining: {
        training: string[][];
        kriteria: string[];
    };
    breadcrumb?: BreadcrumbItem[];
    titlePage?: string;
    kriteria?: KriteriaTypes[];
    jenisTanaman?: JenisTanamanTypes[];
}

export default function DecisionTreeView({ dataTraining, breadcrumb, titlePage, kriteria, jenisTanaman }: DecisionTreeViewProps) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    // Bagi data menjadi training dan test set

    //  history tabel
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Paginate data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataTraining?.training.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(dataTraining?.training.length / itemsPerPage);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={titlePage ?? 'Data Training'} />

            {/* Data */}
            <Card>
                <div className="container mx-auto overflow-hidden px-4 py-4">
                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-bold md:text-xl">Algoritma Support Vector Machine</h2>
                    </div>
                    {kriteria && jenisTanaman && (
                        <div className="mt-6">
                            <div className="mb-10 text-center">
                                <h1 className="mb-2 text-4xl font-bold text-gray-800">Gizi Rekomendasi</h1>
                                <p className="mx-auto max-w-2xl text-gray-600">Rekomendasi Makanan Bergizi untuk Ibu Hamil</p>
                            </div>

                            <FormTraining kriteria={kriteria} canEvaluate={true} />
                        </div>
                    )}
                    {dataTraining && (
                        <div className="mt-4">
                            <h3 className="text-md mb-2 font-semibold">Data Training</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border bg-white">
                                    <thead>
                                        <tr>
                                            {dataTraining.kriteria.map((kriteria, index) => (
                                                <th key={index} className="border px-4 py-2">
                                                    {kriteria}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                {row.map((cell, cellIndex) => (
                                                    <td key={cellIndex} className="border px-4 py-2">
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="order-2 text-xs whitespace-nowrap text-gray-500 sm:order-1 md:text-sm">
                                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, dataTraining.training.length)} of{' '}
                                        {dataTraining.training.length} entries
                                    </div>
                                    <Pagination className="order-1 sm:order-2">
                                        <PaginationContent className="flex-wrap justify-center">
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                                    size={undefined}
                                                />
                                            </PaginationItem>
                                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                let page;
                                                if (totalPages <= 5) {
                                                    page = i + 1;
                                                } else if (currentPage <= 3) {
                                                    page = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    page = totalPages - 4 + i;
                                                } else {
                                                    page = currentPage - 2 + i;
                                                }
                                                return (
                                                    <PaginationItem key={page}>
                                                        <PaginationLink
                                                            isActive={page === currentPage}
                                                            onClick={() => setCurrentPage(page)}
                                                            size={undefined}
                                                        >
                                                            {page}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            })}
                                            <PaginationItem>
                                                <PaginationNext
                                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                                    size={undefined}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </AppLayout>
    );
}
