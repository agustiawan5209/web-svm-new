import { Button } from '@/components/ui/button';
import SVMModelSample from '@/services/svm-model-sample';
import { LabelTypes } from '@/types';
import React, { useCallback, useEffect, useState } from 'react';

let SVM: any = null;

if (typeof window !== 'undefined') {
    import('ml-svm').then((module) => {
        SVM = module.default || module;
    });
}

interface TrainingData {
    features: number[][];
    labelsY: number[];
    featureNames: string[];
    label: LabelTypes[];
}

interface Prediction {
    features: number[];
    predictedLabel: number;
    confidence?: number;
}

interface ModelInfo {
    margin: number;
    supportVectors: number;
    accuracy?: number;
}

const SVMComponent: React.FC = () => {
    const [svmModel] = useState(() => new SVMModelSample());
    const [svm, setSvm] = useState<any | null>(null);
    const [trainingData, setTrainingData] = useState<TrainingData | null>(null);
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [isTrained, setIsTrained] = useState<boolean>(false);
    const [trainingStatus, setTrainingStatus] = useState<string>('Model belum ditraining');
    const [isTraining, setIsTraining] = useState<boolean>(false);
    const [manualFeatures, setManualFeatures] = useState<string[]>(['', '']);
    const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
    const [svmConfig, setSvmConfig] = useState({
        kernel: 'linear' as 'linear' | 'rbf' | 'poly',
        gamma: 0.1,
        cost: 1,
    });
    const [dataDebug, setDataDebug] = useState<any>(null);

    useEffect(() => {
        const loadSVM = async () => {
            if (typeof window !== 'undefined' && !SVM) {
                try {
                    const module = await import('ml-svm');
                    SVM = module.default || module;
                    console.log('SVM loaded successfully');
                } catch (error) {
                    console.error('Failed to load SVM:', error);
                }
            }
        };

        loadSVM();
    }, []);

    // Fungsi untuk membuat data sample jika data asli bermasalah
    const createSampleData = () => {
        // Data sederhana yang mudah dipisah
        const features = [
            [1, 1],
            [1, 2],
            [2, 1],
            [2, 2], // Class 0
            [4, 4],
            [4, 5],
            [5, 4],
            [5, 5], // Class 1
        ];
        const labelsY = [0, 0, 0, 0, 1, 1, 1, 1];

        return {
            features,
            labelsY,
            featureNames: ['Feature 1', 'Feature 2'],
            label: labelsY.map((label) => ({ id: label, name: `Class ${label}` })),
        };
    };

    // Debug data structure
    const debugData = (data: TrainingData) => {
        const debugInfo = {
            totalSamples: data.features.length,
            featureLength: data.features[0]?.length || 0,
            labelsCount: {
                class0: data.labelsY.filter((label) => label === 0).length,
                class1: data.labelsY.filter((label) => label === 1).length,
                other: data.labelsY.filter((label) => label !== 0 && label !== 1).length,
            },
            sampleFeatures: data.features.slice(0, 3),
            sampleLabels: data.labelsY.slice(0, 3),
            allLabels: [...new Set(data.labelsY)],
            hasNaN: data.features.some((row) => row.some((val) => isNaN(val))),
        };

        console.log('Data Debug Info:', debugInfo);
        setDataDebug(debugInfo);
        return debugInfo;
    };

    const trainModel = async () => {
        if (!SVM) {
            setTrainingStatus('SVM library belum siap. Tunggu sebentar...');
            return;
        }

        try {
            setIsTraining(true);
            setTrainingStatus('Sedang memuat data...');

            // Load data
            await svmModel.fetchAndProcessData();
            let datatrain: TrainingData = svmModel.getTrainingData();

            // Jika data tidak ada atau bermasalah, gunakan sample data
            if (!datatrain || !datatrain.features || datatrain.features.length === 0) {
                setTrainingStatus('Data asli bermasalah, menggunakan sample data...');
                datatrain = createSampleData();
            }

            // Debug data
            const debugInfo = debugData(datatrain);
            setTrainingData(datatrain);

            // Validasi data
            if (debugInfo.totalSamples === 0) {
                setTrainingStatus('Error: Tidak ada data training');
                return;
            }

            if (debugInfo.labelsCount.other > 0) {
                setTrainingStatus('Warning: Label mengandung nilai selain 0 dan 1');
            }
            console.log('All labels in data:', datatrain.labelsY);
            // Pastikan labels hanya 0 dan 1 untuk binary classification
            const validLabels = datatrain.labelsY.map((label) => (label === 0 ? 0 : 1));

            console.log('Training with data:', {
                samples: datatrain.features.length,
                features: datatrain.features[0].length,
                labels: validLabels,
            });

            setTrainingStatus('Sedang training model...');

            // Buat instance SVM
            const svmInstance = new SVM({
                kernel: svmConfig.kernel,
                gamma: svmConfig.gamma,
                cost: svmConfig.cost,
            });

            // Train dengan error handling
            try {
                svmInstance.train(datatrain.features, validLabels);
                console.log('Model trained successfully');
                console.log('Support Vectors:', svmInstance.toJSON());
            } catch (trainError) {
                console.error('Training error:', trainError);
                setTrainingStatus('Error saat training model');
                return;
            }

            setSvm(svmInstance);
            setIsTrained(true);

            // Test prediction untuk menghitung akurasi
            let correctPredictions = 0;
            let testPredictions = [];

            try {
                testPredictions = svmInstance.predict(datatrain.features);
                console.log('Test predictions:', testPredictions);

                for (let i = 0; i < validLabels.length; i++) {
                    if (testPredictions[i] === validLabels[i]) {
                        correctPredictions++;
                    }
                }
            } catch (predError) {
                console.error('Prediction error:', predError);
                setTrainingStatus('Error saat testing model');
                return;
            }

            const accuracy = (correctPredictions / validLabels.length) * 100;

            // Coba dapatkan support vectors
            let supportVectors = 0;
            try {
                if (svmInstance.supportVectors) {
                    supportVectors = svmInstance.supportVectors.length;
                }
            } catch (error) {
                console.log('Support vectors not available');
            }

            // Hitung margin sederhana
            const margin = supportVectors > 0 ? 1 / Math.sqrt(supportVectors) : Infinity;

            setModelInfo({
                margin: margin !== Infinity ? Number(margin.toFixed(4)) : Infinity,
                supportVectors,
                accuracy: Number(accuracy.toFixed(2)),
            });

            setTrainingStatus(`Model berhasil ditraining! Akurasi: ${accuracy.toFixed(2)}%`);
        } catch (error) {
            console.error('Error training model:', error);
            setTrainingStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsTraining(false);
        }
    };

    // Prediksi data baru
    const predict = useCallback(
        (features: number[]) => {
            if (!svm || !isTrained) {
                throw new Error('Model belum ditraining');
            }

            try {
                const prediction = svm.predict([features]);
                console.log('Prediction result:', prediction);

                return {
                    predictedLabel: prediction[0],
                    confidence: 0.8, // Default confidence untuk testing
                };
            } catch (error) {
                console.error('Prediction error:', error);
                throw new Error('Gagal melakukan prediksi');
            }
        },
        [svm, isTrained],
    );

    const handlePredict = useCallback(
        (features: number[]) => {
            try {
                const result = predict(features);
                setPredictions((prev) => [
                    ...prev,
                    {
                        features,
                        predictedLabel: result.predictedLabel,
                        confidence: result.confidence,
                    },
                ]);
                console.log('Prediction added:', result);
            } catch (error) {
                console.error('Prediction error:', error);
                alert('Gagal melakukan prediksi: ' + error);
            }
        },
        [predict],
    );

    const handleManualPredict = () => {
        const features = manualFeatures.map((val) => parseFloat(val));

        if (features.some((val) => isNaN(val))) {
            alert('Harap masukkan angka yang valid untuk semua feature');
            return;
        }

        handlePredict(features);
        setManualFeatures(['', '']);
    };

    const updateManualFeature = (index: number, value: string) => {
        const newFeatures = [...manualFeatures];
        newFeatures[index] = value;
        setManualFeatures(newFeatures);
    };

    const clearPredictions = () => {
        setPredictions([]);
    };

    const updateSvmConfig = (key: string, value: any) => {
        setSvmConfig((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // Test dengan sample prediction
    const testSamplePredictions = () => {
        if (!isTrained) {
            alert('Model belum ditraining!');
            return;
        }

        // Test dengan titik yang jelas class-nya
        handlePredict([1, 1]); // Seharusnya class 0
        handlePredict([5, 5]); // Seharusnya class 1
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-4xl font-bold text-gray-800">SVM Classifier - Debug Version</h1>
                    <p className="text-lg text-gray-600">Dengan debugging untuk masalah training</p>
                </div>

                {/* Debug Info */}
                {dataDebug && (
                    <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                        <h3 className="mb-2 font-semibold text-yellow-800">Debug Information:</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                            <div>
                                <span className="font-medium">Samples:</span> {dataDebug.totalSamples}
                            </div>
                            <div>
                                <span className="font-medium">Features:</span> {dataDebug.featureLength}
                            </div>
                            <div>
                                <span className="font-medium">Class 0:</span> {dataDebug.labelsCount.class0}
                            </div>
                            <div>
                                <span className="font-medium">Class 1:</span> {dataDebug.labelsCount.class1}
                            </div>
                            <div>
                                <span className="font-medium">Unique Labels:</span> [{dataDebug.allLabels.join(', ')}]
                            </div>
                            <div>
                                <span className="font-medium">Has NaN:</span> {dataDebug.hasNaN ? 'Yes' : 'No'}
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Configuration Card */}
                        <div className="rounded-2xl bg-white p-6 shadow-lg">
                            <h2 className="mb-4 text-2xl font-semibold text-gray-800">⚙️ Konfigurasi SVM</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Kernel Type</label>
                                    <select
                                        value={svmConfig.kernel}
                                        onChange={(e) => updateSvmConfig('kernel', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="linear">Linear</option>
                                        <option value="rbf">RBF</option>
                                        <option value="poly">Polynomial</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">Gamma: {svmConfig.gamma}</label>
                                        <input
                                            type="number"
                                            min="0.01"
                                            max="10"
                                            step="0.01"
                                            value={svmConfig.gamma}
                                            onChange={(e) => updateSvmConfig('gamma', parseFloat(e.target.value))}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">Cost: {svmConfig.cost}</label>
                                        <input
                                            type="number"
                                            min="0.1"
                                            max="100"
                                            step="0.1"
                                            value={svmConfig.cost}
                                            onChange={(e) => updateSvmConfig('cost', parseFloat(e.target.value))}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Training Card */}
                        <div className="rounded-2xl bg-white p-6 shadow-lg">
                            <h2 className="mb-4 text-2xl font-semibold text-gray-800">🏋️ Training Model</h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        onClick={trainModel}
                                        disabled={isTraining}
                                        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {isTraining ? 'Training...' : 'Train Model'}
                                    </Button>

                                    <Button
                                        onClick={testSamplePredictions}
                                        disabled={!isTrained}
                                        className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-green-700 disabled:opacity-50"
                                    >
                                        Test Predict
                                    </Button>
                                </div>

                                {/* Model Info */}
                                {modelInfo && (
                                    <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-700">Margin:</span>
                                            <span className={`font-semibold ${modelInfo.margin === Infinity ? 'text-red-600' : 'text-green-600'}`}>
                                                {modelInfo.margin === Infinity ? '∞' : modelInfo.margin}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-700">Support Vectors:</span>
                                            <span className="font-semibold text-blue-600">{modelInfo.supportVectors}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-700">Akurasi:</span>
                                            <span className={`font-semibold ${modelInfo.accuracy === 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                {modelInfo.accuracy}%
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="rounded-lg bg-gray-50 p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-700">Status:</span>
                                        <span
                                            className={`font-semibold ${
                                                trainingStatus.includes('berhasil')
                                                    ? 'text-green-600'
                                                    : trainingStatus.includes('Error')
                                                      ? 'text-red-600'
                                                      : 'text-blue-600'
                                            }`}
                                        >
                                            {trainingStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Manual Prediction */}
                        <div className="rounded-2xl bg-white p-6 shadow-lg">
                            <h2 className="mb-4 text-2xl font-semibold text-gray-800">🎯 Prediksi</h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {manualFeatures.map((feature, index) => (
                                        <div key={index}>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Feature {index + 1}</label>
                                            <input
                                                type="number"
                                                value={feature}
                                                onChange={(e) => updateManualFeature(index, e.target.value)}
                                                placeholder={`Feature ${index + 1}`}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleManualPredict}
                                        disabled={!isTrained || manualFeatures.some((f) => !f)}
                                        className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        Prediksi
                                    </Button>

                                    <Button onClick={clearPredictions} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="rounded-2xl bg-white p-6 shadow-lg">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-2xl font-semibold text-gray-800">📊 Hasil Prediksi</h2>
                                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                                    {predictions.length} results
                                </span>
                            </div>

                            <div className="max-h-96 space-y-4 overflow-y-auto">
                                {predictions
                                    .map((pred, index) => (
                                        <div
                                            key={index}
                                            className="rounded-lg border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-4 hover:border-blue-300"
                                        >
                                            <div className="mb-2 flex items-start justify-between">
                                                <div>
                                                    <span className="font-medium text-gray-700">Features:</span>
                                                    <span className="ml-2 rounded bg-gray-100 px-2 py-1 font-mono text-gray-800">
                                                        [{pred.features.join(', ')}]
                                                    </span>
                                                </div>
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                        pred.predictedLabel === 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                    }`}
                                                >
                                                    Label: {pred.predictedLabel}
                                                </span>
                                            </div>

                                            {pred.confidence && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">Confidence:</span>
                                                    <span className="font-semibold text-gray-800">{(pred.confidence * 100).toFixed(2)}%</span>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                    .reverse()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SVMComponent;
