import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KriteriaTypes } from '@/types';
import React from 'react';

type KriteriaItem = {
    nama: string;
    nilai?: string;
};

type FormData = {
    label: string;
    kriteria: {
        kriteria_id: number;
        nilai: string | null;
    }[];
};

interface FormLoopKriteriaProps {
    kriteria: KriteriaTypes[];
    data: FormData;
    setData: React.Dispatch<React.SetStateAction<FormData>>;
    handleChange: React.ChangeEventHandler<HTMLInputElement>;
    handleSelectChange: (name: string, value: string) => void;
    processing: boolean;
}

const defaultData: FormData = {
    label: '',
    kriteria: [],
};

export default function FormLoopKriteria({
    kriteria = [],
    data = defaultData,
    setData = () => {},
    handleChange = () => {},
    handleSelectChange = () => {},
    processing = false,
}: Partial<FormLoopKriteriaProps> = {}) {
    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {kriteria.map((item: KriteriaItem, index: number) => {
                    const lowerCaseName = item.nama.toLowerCase();
                    if (lowerCaseName === 'jenis kelamin') {
                        return (
                            <div key={index} className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">{item.nama}</Label>
                                <Select
                                    value={data.kriteria?.[index].nilai || ''}
                                    required
                                    onValueChange={(value) => handleSelectChange(index.toLocaleString(), value)}
                                >
                                    <SelectTrigger className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                                        <SelectValue placeholder="Select " />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg border border-gray-200 shadow-lg">
                                        {['Laki-laki', 'Perempuan'].map((jenkel, idx) => (
                                            <SelectItem key={idx} value={jenkel} className="px-4 py-2 hover:bg-gray-50">
                                                {jenkel}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        );
                    }
                    if (lowerCaseName === 'frekuensi makan') {
                        return (
                            <div key={index} className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">{item.nama}</Label>
                                <Select
                                    value={data.kriteria?.[index].nilai || ''}
                                    required
                                    onValueChange={(value) => handleSelectChange(index.toLocaleString(), value)}
                                >
                                    <SelectTrigger className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                                        <SelectValue placeholder="Select " />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg border border-gray-200 shadow-lg">
                                        {['1 kali/hari', '2 kali/hari', '3 kali/hari', '>3 kali/hari'].map((makan, idx) => (
                                            <SelectItem key={idx} value={idx.toString()} className="px-4 py-2 hover:bg-gray-50">
                                                {makan}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        );
                    }
                    if (lowerCaseName.includes('konsumsi lauk hewani')) {
                        return (
                            <div key={index} className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">{item.nama}</Label>
                                <Select
                                    value={data.kriteria?.[index].nilai || ''}
                                    required
                                    onValueChange={(value) => handleSelectChange(index.toLocaleString(), value)}
                                >
                                    <SelectTrigger className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                                        <SelectValue placeholder="Select " />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg border border-gray-200 shadow-lg">
                                        {['Tidak pernah (0 kali/minggu)', '1–2 kali/minggu', '3–4 kali/minggu', '≥5 kali/minggu'].map(
                                            (makan, idx) => (
                                                <SelectItem key={idx} value={idx.toString()} className="px-4 py-2 hover:bg-gray-50">
                                                    {makan}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        );
                    }
                    if (lowerCaseName.includes('porsi sayur')) {
                        return (
                            <div key={index} className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">{item.nama}</Label>
                                <Select
                                    value={data.kriteria?.[index].nilai || ''}
                                    required
                                    onValueChange={(value) => handleSelectChange(index.toLocaleString(), value)}
                                >
                                    <SelectTrigger className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                                        <SelectValue placeholder="Select " />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg border border-gray-200 shadow-lg">
                                        {['0 Porsi', '1 Porsi', '2 Porsi', '>3 Porsi'].map((makan, idx) => (
                                            <SelectItem key={idx} value={idx.toString()} className="px-4 py-2 hover:bg-gray-50">
                                                {makan}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        );
                    }
                    return (
                        <div key={index}>
                            <Label className="text-xs text-gray-600">{item.nama}</Label>
                            <Input
                                type="text"
                                name={`kriteria.${index}`}
                                value={data.kriteria?.[index].nilai || ''}
                                onChange={handleChange}
                                className="input-minimal"
                                placeholder={`masukkan ${item.nama}`}
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );
}
