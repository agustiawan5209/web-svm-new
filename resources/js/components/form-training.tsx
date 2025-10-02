/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Toast } from '@/components/ui/toast';
import SVMModel from '@/services/algorithm-model';
import { KriteriaTypes, LabelTypes, SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import React, { useCallback, useState } from 'react';

type Dataset = {
    label: string;
    kriteria: string[];
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

const FormTraining = ({
    kriteria,
    setResult,
    setFeature,
    canEvaluate = false,
}: {
    kriteria: KriteriaTypes[];
    setResult?: (predict: PredictionResult) => void;
    setFeature?: (feature: any) => void;
    canEvaluate?: boolean;
}) => {
    const { auth } = usePage<SharedData>().props;
    // State management
    const [loading, setLoading] = useState(false);
    const [trainingData, setTrainingData] = useState<TrainingData | null>(null);
    const [model] = useState(new SVMModel());
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);

    // Form handling
    const { data, setData, processing } = useForm<Dataset>({
        label: '',
        kriteria: kriteria.map(() => ''),
    });

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
                        const updatedAttribut = prev.kriteria?.map((item, i) => (i === index ? value : item));

                        // Cari index untuk perhitungan IMT
                        const BBindex = kriteria.findIndex((k) => k.nama.toLowerCase().includes('bb'));
                        const TBindex = kriteria.findIndex((k) => k.nama.toLowerCase().includes('tb'));
                        const IMTindex = kriteria.findIndex((k) => k.nama.toLowerCase().includes('imt'));

                        // Jika yang diubah adalah BB atau TB, hitung IMT
                        if ((index === BBindex || index === TBindex) && IMTindex !== -1) {
                            const nilaiBB = index === BBindex ? Number(value) : Number(updatedAttribut?.[BBindex] ?? 0);

                            const nilaiTB = index === TBindex ? Number(value) : Number(updatedAttribut?.[TBindex] ?? 0);

                            // Hitung IMT hanya jika kedua nilai valid
                            if (nilaiBB > 0 && nilaiTB > 0) {
                                return {
                                    ...prev,
                                    kriteria: updatedAttribut?.map((item, i) => (i === IMTindex ? hitungIMT(nilaiBB, nilaiTB) : item)),
                                };
                            }
                        }

                        return {
                            ...prev,
                            kriteria: updatedAttribut,
                        };
                    });
                }
            } else {
                setData((prev) => ({ ...prev, [name]: value }));
            }
        },
        [kriteria, setData],
    );
    const hitungIMT = (berat: number, tinggi: number) => {
        // tinggi dalam meter
        const tb = tinggi / 100;
        const imt = berat / (tb * tb);
        return imt.toFixed(3);
    };
    const handleSelectChange = useCallback(
        (name: string, value: string) => {
            if (name === 'label') {
                setData((prev) => ({ ...prev, [name]: value }));
            } else {
                setData((prev) => ({
                    ...prev,
                    kriteria: prev.kriteria.map((item, index) => (index === Number(name) ? value : item)),
                }));
            }
        },
        [setData],
    );

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <Toast
                open={toast.show}
                onOpenChange={() => setToast((prev) => ({ ...prev, show: false }))}
                title={toast.title}
                description={toast.message}
                duration={5000}
                variant={toast.type}
            />
        </div>
    );
};

export default FormTraining;
