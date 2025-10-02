/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toast } from '@/components/ui/toast';
import SVMModel from '@/services/algorithm-model';
import { KriteriaTypes, LabelTypes, SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, CheckCircle2, Clock, Loader2, Target, TrendingUp } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

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
interface TrainingMetrics {
    loss: number[];
    accuracy: number[];
    valLoss: number[];
    valAccuracy: number[];
}

interface TrainingProgress {
    epoch: number;
    loss: number;
    accuracy: number;
    valLoss?: number;
    valAccuracy?: number;
    status: 'training' | 'completed' | 'error';
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
    const [trainingReport, setTrainingReport] = useState<TrainingMetrics>({
        loss: [],
        accuracy: [],
        valLoss: [],
        valAccuracy: [],
    });

    // New states for training progress
    const [trainingProgress, setTrainingProgress] = useState<TrainingProgress[]>([]);
    const [isTraining, setIsTraining] = useState(false);
    const [showTrainingReport, setShowTrainingReport] = useState(false);
    const [trainingTime, setTrainingTime] = useState<number>(0);

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

    // Load data saat komponen mount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await model.fetchAndProcessData();
                setTrainingData(data as any);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Timer untuk training
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTraining) {
            interval = setInterval(() => {
                setTrainingTime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTraining]);

    const handleTrainAndEvaluate = async () => {
        setLoading(true);
        setIsTraining(true);
        setTrainingProgress([]);
        setTrainingTime(0);
        setShowTrainingReport(true);

        try {
            // Setup training callbacks untuk real-time updates
            const trainingCallbacks = {
                onEpochEnd: (epoch: number, logs: any) => {
                    console.log(
                        `Epoch ${epoch + 1}: loss = ${logs?.loss}, accuracy = ${logs?.acc}, val_loss = ${logs?.val_loss}, val_acc = ${logs?.val_acc}`,
                    );
                    const progress: TrainingProgress = {
                        epoch: epoch + 1,
                        loss: logs?.loss || 0,
                        accuracy: logs?.acc || 0,
                        valLoss: logs?.val_loss || 0,
                        valAccuracy: logs?.val_acc || 0,
                        status: 'training',
                    };

                    setTrainingProgress((prev) => [...prev, progress]);
                },
            };

            await model.trainModel(undefined, trainingCallbacks);

            const evalResult = await model.evaluateModel();
            await model.saveModel();

            // Final training progress
            setTrainingProgress((prev) => [
                ...prev,
                {
                    epoch: prev.length,
                    loss: prev[prev.length - 1]?.loss || 0,
                    accuracy: prev[prev.length - 1]?.accuracy || 0,
                    valLoss: prev[prev.length - 1]?.valLoss || 0,
                    valAccuracy: prev[prev.length - 1]?.valAccuracy || 0,
                    status: 'completed',
                },
            ]);

            setToast({
                title: 'Training Berhasil',
                show: true,
                message: `Model berhasil dilatih dalam ${trainingTime} detik dengan akurasi ${(evalResult.accuracy * 100).toFixed(2)}%`,
                type: 'success',
            });

            setEvaluationResult(evalResult);
        } catch (error) {
            console.error(error);
            setTrainingProgress((prev) => [
                ...prev,
                {
                    epoch: prev.length,
                    loss: prev[prev.length - 1]?.loss || 0,
                    accuracy: prev[prev.length - 1]?.accuracy || 0,
                    status: 'error',
                },
            ]);

            setToast({
                title: 'Training Gagal',
                show: true,
                message: error as string,
                type: 'error',
            });
        } finally {
            setLoading(false);
            setIsTraining(false);
        }
    };

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setPrediction(null);
        try {
            const feature = data.kriteria.map((item: any) => {
                const lowerItem = String(item).toLowerCase();

                if (lowerItem === 'laki-laki') {
                    return 0;
                } else if (lowerItem === 'perempuan') {
                    return 1;
                } else if (!isNaN(parseFloat(item)) && isFinite(item)) {
                    return parseFloat(item); // ubah ke angka
                } else {
                    return item; // biarkan tetap string
                }
            });

            const result = await model.predict([feature]); // Contoh fitur
            setPrediction(result);
            if (setFeature) {
                setFeature(data.kriteria);
            }
            if (result.label !== undefined && setResult) {
                setResult({
                    prediction: prediction?.prediction ?? 0,
                    label: prediction?.label ?? 'tidak dikenali',
                    rekomendasi: prediction?.rekomendasi ?? 'Label tidak dikenali',
                    error: prediction?.error ?? 'Label tidak dikenali',
                });
            }
        } catch (error) {
            console.error(error);
            setToast({
                title: 'Hasil Prediksi',
                show: true,
                message: error as string,
                type: 'success',
            });
        } finally {
            setLoading(false);
        }
    };

    // Prepare chart data
    const chartData = useMemo(() => {
        return trainingProgress.map((progress, index) => ({
            epoch: progress.epoch,
            loss: progress.loss,
            accuracy: progress.accuracy * 100,
            valLoss: progress.valLoss,
            valAccuracy: progress.valAccuracy ? progress.valAccuracy * 100 : null,
        }));
    }, [trainingProgress]);

    const confusionMatrixData = useMemo(() => {
        if (!evaluationResult?.confusionMatrix) return [];

        return evaluationResult.confusionMatrix.flatMap((row, i) =>
            row.map((value, j) => ({
                actual: `Kelas ${i + 1}`,
                predicted: `Kelas ${j + 1}`,
                value: value,
            })),
        );
    }, [evaluationResult]);

    const dataState = model.getDataLoadingState();
    const trainingState = model.getTrainingState();
    const evalState = model.getEvaluationState();
    const predState = model.getPredictionState();

    // Determine prediction color
    const predictionColor = useMemo(() => {
        if (!prediction) return '';
        switch (prediction.label) {
            case 'Buruk':
                return 'bg-red-100 border-red-300 text-red-800';
            case 'Cukup':
                return 'bg-yellow-100 border-yellow-300 text-yellow-800';
            case 'Baik':
                return 'bg-green-100 border-green-300 text-green-800';
            default:
                return 'bg-blue-100 border-blue-300 text-blue-800';
        }
    }, [prediction]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

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

            {/* Pelatihan Model */}
            <Card>
                <CardContent>
                    <div className="flex flex-wrap gap-3 pt-4">
                        {(auth.role === 'admin' || (auth.role === 'super_admin' && canEvaluate)) && (
                            <Button type="button" variant="outline" onClick={handleTrainAndEvaluate} disabled={loading}>
                                {isTraining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TrendingUp className="mr-2 h-4 w-4" />}
                                {isTraining ? 'Training...' : 'Train Model'}
                            </Button>
                        )}
                    </div>
                    {/* Training Report Section */}
                    <AnimatePresence>
                        {showTrainingReport && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-6 overflow-hidden"
                            >
                                <div className="rounded-lg border border-gray-200 bg-white p-6">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                                            <BarChart3 className="h-5 w-5" />
                                            Training Report
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {formatTime(trainingTime)}
                                            </div>
                                            {isTraining ? (
                                                <div className="flex items-center gap-1 text-blue-600">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Training...
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-green-600">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    Completed
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Training Metrics */}
                                    <div className="mb-6 grid grid-cols-2 gap-4">
                                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="rounded-lg bg-blue-50 p-4">
                                            <div className="text-sm text-blue-600">Current Loss</div>
                                            <div className="text-2xl font-bold text-blue-700">
                                                {trainingProgress[trainingProgress.length - 1]?.loss?.toFixed(4) || '0.0000'}
                                            </div>
                                        </motion.div>
                                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="rounded-lg bg-green-50 p-4">
                                            <div className="text-sm text-green-600">Current Accuracy</div>
                                            <div className="text-2xl font-bold text-green-700">
                                                {((trainingProgress[trainingProgress.length - 1]?.accuracy || 0) * 100).toFixed(2)}%
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Training Progress Chart */}
                                    {chartData.length > 0 && (
                                        <div className="mb-6 h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="epoch" />
                                                    <YAxis yAxisId="left" />
                                                    <YAxis yAxisId="right" orientation="right" />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Line
                                                        yAxisId="left"
                                                        type="monotone"
                                                        dataKey="loss"
                                                        stroke="#ef4444"
                                                        strokeWidth={2}
                                                        name="Training Loss"
                                                        dot={false}
                                                    />
                                                    <Line
                                                        yAxisId="right"
                                                        type="monotone"
                                                        dataKey="accuracy"
                                                        stroke="#10b981"
                                                        strokeWidth={2}
                                                        name="Training Accuracy (%)"
                                                        dot={false}
                                                    />
                                                    {chartData[0]?.valLoss && (
                                                        <Line
                                                            yAxisId="left"
                                                            type="monotone"
                                                            dataKey="valLoss"
                                                            stroke="#f97316"
                                                            strokeWidth={2}
                                                            strokeDasharray="3 3"
                                                            name="Validation Loss"
                                                            dot={false}
                                                        />
                                                    )}
                                                    {chartData[0]?.valAccuracy && (
                                                        <Line
                                                            yAxisId="right"
                                                            type="monotone"
                                                            dataKey="valAccuracy"
                                                            stroke="#8b5cf6"
                                                            strokeWidth={2}
                                                            strokeDasharray="3 3"
                                                            name="Validation Accuracy (%)"
                                                            dot={false}
                                                        />
                                                    )}
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}

                                    {/* Evaluation Results */}
                                    {evaluationResult && (
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Target className="h-5 w-5 text-green-600" />
                                                <h4 className="font-semibold">Evaluation Results</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
                                                    <div className="flex items-center">
                                                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-white" />
                                                        <div className="ml-4">
                                                            <h3 className="text-lg font-semibold text-white">Hasil Akurasi Model</h3>
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ type: 'spring', stiffness: 200 }}
                                                                className="mt-1 text-2xl font-bold text-white"
                                                            >
                                                                {(evaluationResult.accuracy * 100).toFixed(1)}%
                                                            </motion.div>
                                                            <p className="mt-1 text-sm text-white">Akurasi model pada data testing</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="rounded-lg bg-gray-100 p-4">
                                                    <div className="text-sm">Total Epochs</div>
                                                    <div className="text-2xl font-bold text-gray-700">{trainingProgress.length}</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm lg:grid-cols-3">
                {/* Input Form */}
                <div className="p-6 md:p-8 lg:col-span-2">
                    <form onSubmit={(e) => handlePredict(e)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {kriteria.map((item, index) => (
                                <div key={index} className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        {item.nama.charAt(0).toUpperCase() + item.nama.slice(1)}
                                    </Label>
                                    {item.nama.toLowerCase() === 'jenis kelamin' ? (
                                        <Select
                                            value={data.kriteria[index] || ''}
                                            required
                                            onValueChange={(value) => handleSelectChange(index.toString(), value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Jenis Kelamin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['Laki-laki', 'Perempuan'].map((gender, idx) => (
                                                    <SelectItem key={idx} value={gender}>
                                                        {gender}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input
                                            type="text"
                                            name={`kriteria.${index}`}
                                            value={data.kriteria[index] || ''}
                                            onChange={handleChange}
                                            placeholder={`Enter ${item.nama}`}
                                            disabled={processing}
                                            required
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-3 pt-4">
                            {(auth.role === 'admin' || (auth.role === 'super_admin' && canEvaluate)) && (
                                <Button type="button" variant="outline" onClick={handleTrainAndEvaluate} disabled={loading}>
                                    {isTraining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TrendingUp className="mr-2 h-4 w-4" />}
                                    {isTraining ? 'Training...' : 'Train Model'}
                                </Button>
                            )}
                            <Button
                                type="submit"
                                disabled={loading || !model}
                                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Mulai Rekomendasi
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Results Sidebar */}
                <div className="bg-gray-50 p-6 md:p-8">
                    {/* Prediction Result */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`border-2 ${predictionColor} mb-6 rounded-xl p-6 transition-all duration-300`}
                    >
                        <div className="flex items-center">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={`h-5 w-5 flex-shrink-0 rounded-full ${
                                    prediction?.label === 'Buruk'
                                        ? 'bg-red-500'
                                        : prediction?.label === 'Cukup'
                                          ? 'bg-yellow-500'
                                          : prediction?.label === 'Baik'
                                            ? 'bg-green-500'
                                            : 'bg-blue-500'
                                }`}
                            />
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold">Status Gizi Ibu Hamil</h3>
                                <motion.div
                                    key={prediction?.label}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="mt-1 text-2xl font-bold"
                                >
                                    {prediction?.label || '-'}
                                </motion.div>
                                {prediction?.rekomendasi && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="mt-2 text-sm text-gray-600"
                                    >
                                        {prediction.rekomendasi}
                                    </motion.p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default FormTraining;
