/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from '@inertiajs/react';
import React from 'react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
    data: any;
}

const PaginationTable: React.FC<PaginationProps> = ({ links, data }) => {
    const currentIndex = links.findIndex((link) => link.active);

    // Tentukan batas tampilan 5 link: 2 sebelum & 2 sesudah halaman aktif
    let start = Math.max(currentIndex - 2, 1); // Mulai dari index 1 (skip 'prev')
    const end = Math.min(start + 5, links.length - 1); // Hindari 'next'

    // Penyesuaian jika mendekati akhir
    if (end - start < 7 && start > 1) {
        start = Math.max(end - 5, 1);
    }

    const visibleLinks = links.slice(start, end);

    return (
        <section>
            {links.length > 3 ? (
                <div className="flex items-center justify-center space-x-1">
                    {/* Tombol Prev */}
                    {links[0].url && (
                        <Link
                            href={links[0].url ?? ''}
                            data={data ?? {}}
                            preserveState={true}
                            dangerouslySetInnerHTML={{ __html: links[0].label }}
                            className="rounded border px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                        />
                    )}

                    {/* Link halaman */}
                    {visibleLinks.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url ?? ''}
                            data={data ?? {}}
                            preserveState={true}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`rounded border px-3 py-1 text-sm ${
                                link.active
                                    ? 'bg-primary text-white'
                                    : link.url
                                      ? 'text-gray-700 hover:bg-gray-200'
                                      : 'cursor-not-allowed text-gray-200'
                            }`}
                        />
                    ))}

                    {/* Tombol Next */}
                    {links[links.length - 1].url && (
                        <Link
                            href={links[links.length - 1].url ?? ''}
                            data={data ?? {}}
                            preserveState={true}
                            dangerouslySetInnerHTML={{ __html: links[links.length - 1].label }}
                            className="rounded border px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                        />
                    )}
                </div>
            ) : (
                <div className="flex items-center justify-center space-x-1">
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url ?? ''}
                            data={data ?? {}}
                            preserveState={true}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`rounded border px-3 py-1 text-sm ${
                                link.active
                                    ? 'bg-primary text-white'
                                    : link.url
                                      ? 'text-gray-700 hover:bg-gray-200'
                                      : 'cursor-not-allowed text-gray-200'
                            }`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default PaginationTable;
