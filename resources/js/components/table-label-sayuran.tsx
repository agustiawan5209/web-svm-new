import { LabelSayuranTypes } from '@/types';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PersonStandingIcon } from 'lucide-react';

export default function TableLabelSayuran({ data }: { data: LabelSayuranTypes[] }) {
    return (
        <Table className="w-full">
            <TableHeader>
                <TableRow>
                    <TableHead colSpan={7}>
                        <h3 className="mb-3 flex items-center justify-center gap-2 text-center text-sm font-semibold text-white">
                            <PersonStandingIcon className="h-4 w-4" />
                            Klasifikasi Berdasarkan Status Gizi
                        </h3>
                    </TableHead>
                </TableRow>
                <TableRow>
                    <TableHead className="w-10">No.</TableHead>
                    <TableHead className="cursor-pointer">Nama Label</TableHead>
                    {/* <TableHead className="cursor-pointer">Makanan</TableHead>
                    <TableHead className="cursor-pointer">Porsi</TableHead> */}
                    <TableHead className="cursor-pointer">Penanganan</TableHead>
                    {/* <TableHead className="cursor-pointer">Frekuensi</TableHead> */}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.length > 0 ? (
                    data.map((item: LabelSayuranTypes, index: number) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.label.nama}</TableCell>
                            {/* <TableCell>{item.sayuran}</TableCell>
                            <TableCell>{item.porsi}</TableCell> */}
                            <TableCell>{item.tekstur}</TableCell>
                            {/* <TableCell>{item.frekuensi}</TableCell> */}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center text-sm text-gray-500">
                            Tidak ada data
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
