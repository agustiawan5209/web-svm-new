import FormPanen from '@/components/form-panen';
import { Button } from '@/components/ui/button';
import * as tf from '@tensorflow/tfjs';
import React, { useEffect, useState } from 'react';
import PredictionChart from './prediction-chart';
interface Transaction {
    panjangGarisPantai: number;
    jumlahPetani: number;
    luasPotensi: number;
    luasTanam: number;
    jumlahTali: number;
    jumlahBibit: number;
    suhuAir: number;
    salinitas: number;
    kejernihanAir: string;
    cahayaMatahari: string;
    arusAir: string;
    kedalamanAir: number;
    pHAir: number;
    ketersediaanGizi: string;
    eucheuma_conttoni: number;
    gracilaria_sp: number;
}
interface MultipleLinearRegressionProps {
    transaction: Transaction[];
}

const opsiKejernihan = [
    { value: 5, label: 'Sangat Jernih' },
    { value: 4, label: 'Jernih' },
    { value: 3, label: 'Agak Keruh' },
    { value: 2, label: 'Keruh' },
    { value: 1, label: 'Sangat Keruh' },
];
const opsiCahaya = [
    { value: 5, label: 'Sangat Cerah' },
    { value: 4, label: 'Cerah' },
    { value: 3, label: 'Berawan' },
    { value: 2, label: 'Mendung' },
    { value: 1, label: 'Gelap' },
];
const opsiArus = [
    { value: 5, label: 'Sangat Kuat' },
    { value: 4, label: 'Kuat' },
    { value: 3, label: 'Sedang' },
    { value: 2, label: 'Lemah' },
    { value: 1, label: 'Sangat Lemah' },
];
const opsiGizi = [
    { value: 4, label: 'Melimpah' },
    { value: 3, label: 'Cukup' },
    { value: 2, label: 'Terbatas' },
    { value: 1, label: 'Sangat Sedikit' },
];
export default function FormPrediction({ transaction }: MultipleLinearRegressionProps) {
    const [modelEucheuma, setModelEucheuma] = useState<tf.Sequential | null>(null);
    const [modelGraacilaria, setModelGraacilaria] = useState<tf.Sequential | null>(null);
    const [training, setTraining] = useState(false);
    const [prediction, setPrediction] = useState<number | null>(null);
    const [predictionEucheuma, setPredictionEucheuma] = useState<number | null>(null);
    const [predictionGracilaria, setPredictionGracilaria] = useState<number | null>(null);

    const HeaderTabel = [
        'panjangGarisPantai',
        'jumlahPetani',
        'luasPotensi',
        'luasTanam',
        'jumlahTali',
        'jumlahBibit',
        'suhuAir',
        'salinitas',
        'kejernihanAir',
        'cahayaMatahari',
        'arusAir',
        'kedalamanAir',
        'pHAir',
        'ketersediaanGizi',
        'eucheuma_conttoni',
        'gracilaria_sp',
    ];
    useEffect(() => {
        // Inisialisasi modelEucheuma saat komponen mount
        const initModel = () => {
            const modelEucheuma = tf.sequential();
            modelEucheuma.add(
                tf.layers.dense({
                    units: 1,
                    inputShape: [14], // 15 variabel input
                }),
            );
            return modelEucheuma;
        };
        const initModelGraacilaria = () => {
            const modelGraacilaria = tf.sequential();
            modelGraacilaria.add(
                tf.layers.dense({
                    units: 1,
                    inputShape: [14], // 15 variabel input
                }),
            );
            return modelGraacilaria;
        };

        setModelEucheuma(initModel());
        setModelGraacilaria(initModelGraacilaria());
        return () => {
            // Cleanup
            if (modelEucheuma) {
                modelEucheuma.dispose();
            }
            if (modelGraacilaria) {
                modelGraacilaria.dispose();
            }
        };
    }, []);

    const [data, setData] = useState<Transaction[]>(transaction || []);

    const [normalizationParams, setNormalizationParams] = useState<{
        featureRanges: { min: number; max: number }[];
        outputMin: number;
        outputMax: number;
    } | null>(null);

    // Hitung min-max untuk setiap fitur
    const featureRanges = HeaderTabel.slice(0, 14).map((_, i) => {
        const values = data.map((point: any) => {
            // Konversi nilai kategorikal ke numerik
            if (i === 8) return opsiKejernihan.find((item) => item.label === point.kejernihanAir)?.value || 0;
            if (i === 9) return opsiCahaya.find((item) => item.label === point.cahayaMatahari)?.value || 0;
            if (i === 10) return opsiArus.find((item) => item.label === point.arusAir)?.value || 0;
            if (i === 13) return opsiGizi.find((item) => item.label === point.ketersediaanGizi)?.value || 0;

            // Ambil nilai numerik langsung
            return point[HeaderTabel[i]];
        });
        return {
            min: Math.min(...values),
            max: Math.max(...values),
        };
    });
    // Normalisasi data
    // Fungsi normalisasi input
    const normalize = (value: number, min: number, max: number) => {
        /**
         * Normalisasi nilai input agar berada dalam rentang 0-1.
         * Jika nilai input kurang dari min, maka nilainya akan diubah menjadi 0.
         * Jika nilai input lebih dari max, maka nilainya akan diubah menjadi 1.
         * @param value nilai input yang akan dinormalisasi
         * @param min nilai minimum
         * @param max nilai maximum
         * @returns nilai yang telah dinormalisasi
         */
        if (min === max) return 0;
        let normalizedValue = (value - min) / (max - min);
        if (normalizedValue < 0) normalizedValue = 0; // Pastikan tidak negatif
        if (normalizedValue > 1) normalizedValue = 1; // Pastikan tidak lebih dari 1
        return normalizedValue;
    };
    const InputXs = data.map((point, key) => {
        let kejernihan = opsiKejernihan.find((item) => item.label === point.kejernihanAir)?.value || 0;
        let cahaya = opsiCahaya.find((item) => item.label === point.cahayaMatahari)?.value || 0;
        let arus = opsiArus.find((item) => item.label === point.arusAir)?.value || 0;
        let nutrisi = opsiGizi.find((item) => item.label === point.ketersediaanGizi)?.value || 0;

        return [
            normalize(point.panjangGarisPantai, featureRanges[0].min, featureRanges[0].max),
            normalize(point.jumlahPetani, featureRanges[1].min, featureRanges[1].max),
            normalize(point.luasPotensi, featureRanges[2].min, featureRanges[2].max),
            normalize(point.luasTanam, featureRanges[3].min, featureRanges[3].max),
            normalize(point.jumlahTali, featureRanges[4].min, featureRanges[4].max),
            normalize(point.jumlahBibit, featureRanges[5].min, featureRanges[5].max),
            normalize(point.suhuAir, featureRanges[6].min, featureRanges[6].max),
            normalize(point.salinitas, featureRanges[7].min, featureRanges[7].max),
            normalize(kejernihan, featureRanges[8].min, featureRanges[8].max),
            normalize(cahaya, featureRanges[9].min, featureRanges[9].max),
            normalize(arus, featureRanges[10].min, featureRanges[10].max),
            normalize(point.kedalamanAir, featureRanges[11].min, featureRanges[11].max),
            normalize(point.pHAir, featureRanges[12].min, featureRanges[12].max),
            normalize(nutrisi, featureRanges[13].min, featureRanges[13].max),
        ];
    });

    // Normalisasi output juga
    const outputValues = data.map((point) => point.eucheuma_conttoni);
    const outputMin = Math.min(...outputValues);
    const outputMax = Math.max(...outputValues);
    const Ydataeucheuma_conttoni = data.map((point) => point.eucheuma_conttoni);

    const Ydatagracilaria_sp = data.map((point) => point.gracilaria_sp);
    const ysEuchuma = tf.tensor2d(data.map((point) => [normalize(point.eucheuma_conttoni, outputMin, outputMax)]));
    const ysGlacilaria = tf.tensor2d(data.map((point) => [normalize(point.gracilaria_sp, outputMin, outputMax)]));

    const trainModel = async () => {
        if (!modelEucheuma || !modelGraacilaria) return;

        setTraining(true);

        // Persiapan data dengan normalisasi
        const xs = tf.tensor2d(InputXs);
        // Kompilasi modelEucheuma dengan learning rate yang lebih kecil
        modelEucheuma.compile({
            optimizer: tf.train.adam(0.001), // Menggunakan Adam optimizer dengan learning rate lebih kecil
            loss: 'meanSquaredError',
        });
        modelGraacilaria.compile({
            optimizer: tf.train.adam(0.001), // Menggunakan Adam optimizer dengan learning rate lebih kecil
            loss: 'meanSquaredError',
        });

        // Pelatihan dengan lebih banyak epoch
        await modelEucheuma.fit(xs, ysEuchuma, {
            epochs: 200,
            batchSize: 32,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    console.log(`Epoch Eucheuma ${epoch}: loss = ${logs?.loss}`);
                },
            },
        });
        await modelGraacilaria.fit(xs, ysGlacilaria, {
            epochs: 200,
            batchSize: 32,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    console.log(`Epoch Gracilaria ${epoch}: loss = ${logs?.loss}`);
                },
            },
        });

        // Simpan parameter normalisasi untuk prediksi
        setNormalizationParams({
            featureRanges,
            outputMin,
            outputMax,
        });

        // Simpan model ke session storage
        // Tidak perlu karena model akan dihapus ketika browser di-close
        localStorage.setItem('modelEucheuma', JSON.stringify(modelEucheuma));
        localStorage.setItem('modelGraacilaria', JSON.stringify(modelGraacilaria));

        // Dispose tensors
        xs.dispose();
        ysEuchuma.dispose();
        ysGlacilaria.dispose();

        setTraining(false);
    };

    const [parameter, setParameter] = useState<Transaction>({
        panjangGarisPantai: 6,
        jumlahPetani: 261,
        luasPotensi: 7,
        luasTanam: 5,
        jumlahTali: 1.74,
        jumlahBibit: 1.671,
        suhuAir: 31,
        salinitas: 43,
        kejernihanAir: 'Keruh',
        cahayaMatahari: 'Cerah',
        arusAir: 'Kuat',
        kedalamanAir: 2,
        pHAir: 8,
        ketersediaanGizi: 'Terbatas',
        eucheuma_conttoni: 687,
        gracilaria_sp: 1.303,
    });

    const [mse, setMSE] = useState<number | null>(null);
    const [rSquared, setRSquared] = useState<number | null>(null);

    const predictData = (model: tf.Sequential, input: number[], min: number, max: number) => {
        const inputTensor = tf.tensor2d([input]);
        const prediction = model.predict(inputTensor) as tf.Tensor;
        let value = prediction.dataSync()[0];

        inputTensor.dispose();
        prediction.dispose();

        /**
         * Denormalisasi nilai output agar berada dalam rentang asli.
         * @param value nilai output yang akan dide-normalisasi
         * @param min nilai minimum
         * @param max nilai maximum
         * @returns nilai yang telah dide-normalisasi
         */
        return value * (max - min) + min;
    };
    /**
     * Fungsi untuk prediksi eucheuma conttoni
     */
    const predict = () => {
        if (!modelEucheuma || !modelGraacilaria || !parameter || !normalizationParams) {
            console.error('Model, parameter, or normalization params not ready');
            return;
        }

        try {
            // Konversi field kategorikal ke nilai numerik
            let kejernihan = opsiKejernihan.find((item) => item.label === parameter.kejernihanAir)?.value || 0;
            let cahaya = opsiCahaya.find((item) => item.label === parameter.cahayaMatahari)?.value || 0;
            let arus = opsiArus.find((item) => item.label === parameter.arusAir)?.value || 0;
            let nutrisi = opsiGizi.find((item) => item.label === parameter.ketersediaanGizi)?.value || 0;

            // Normalisasi input
            const inputArr = [
                normalize(parameter.panjangGarisPantai, normalizationParams.featureRanges[0].min, normalizationParams.featureRanges[0].max),
                normalize(parameter.jumlahPetani, normalizationParams.featureRanges[1].min, normalizationParams.featureRanges[1].max),
                normalize(parameter.luasPotensi, normalizationParams.featureRanges[2].min, normalizationParams.featureRanges[2].max),
                normalize(parameter.luasTanam, normalizationParams.featureRanges[3].min, normalizationParams.featureRanges[3].max),
                normalize(parameter.jumlahTali, normalizationParams.featureRanges[4].min, normalizationParams.featureRanges[4].max),
                normalize(parameter.jumlahBibit, normalizationParams.featureRanges[5].min, normalizationParams.featureRanges[5].max),
                normalize(parameter.suhuAir, normalizationParams.featureRanges[6].min, normalizationParams.featureRanges[6].max),
                normalize(parameter.salinitas, normalizationParams.featureRanges[7].min, normalizationParams.featureRanges[7].max),
                normalize(kejernihan, normalizationParams.featureRanges[8].min, normalizationParams.featureRanges[8].max),
                normalize(cahaya, normalizationParams.featureRanges[9].min, normalizationParams.featureRanges[9].max),
                normalize(arus, normalizationParams.featureRanges[10].min, normalizationParams.featureRanges[10].max),
                normalize(parameter.kedalamanAir, normalizationParams.featureRanges[11].min, normalizationParams.featureRanges[11].max),
                normalize(parameter.pHAir, normalizationParams.featureRanges[12].min, normalizationParams.featureRanges[12].max),
                normalize(nutrisi, normalizationParams.featureRanges[13].min, normalizationParams.featureRanges[13].max),
            ];

            const inputTensor = tf.tensor2d([inputArr]);
            // const outputTensor = modelEucheuma.predict(inputTensor) as tf.Tensor;
            // const output = outputTensor.dataSync()[0];

            setPredictionEucheuma(predictData(modelEucheuma, inputArr, normalizationParams.outputMin, normalizationParams.outputMax));
            setPredictionGracilaria(predictData(modelGraacilaria, inputArr, normalizationParams.outputMin, normalizationParams.outputMax));

            const Hasil_MSE = tf.losses.meanSquaredError(ysEuchuma, modelEucheuma.predict(tf.tensor2d(InputXs)) as tf.Tensor);
            const Hasil_RSquared = tf.metrics.r2Score(ysEuchuma, modelEucheuma.predict(tf.tensor2d(InputXs)) as tf.Tensor);

            setMSE(Hasil_MSE.dataSync()[0]);
            setRSquared(Hasil_RSquared.dataSync()[0]);
            // Fungsi denormalisasi output
        } catch (error) {
            console.error('Prediction error:', error);
            setPrediction(null);
        }
    };

    const [showTable, setShowTable] = useState<boolean>(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setParameter({
            ...parameter,
            [name]: parseFloat(value),
        });
    };
    const handleSelectChange = (name: string, value: string) => {
        if (name && value !== undefined && parameter) {
            setParameter((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else {
            console.error('Invalid data: name, value, or parameter may be undefined');
        }
    };

    return (
        <>
            <section className="mb-10 rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-gray-50 to-gray-100 p-8 shadow-xl">
                <h2 className="mb-8 text-2xl font-bold tracking-tight text-gray-900">Input Parameter</h2>
                <form
                    className="grid grid-cols-1 gap-8 md:grid-cols-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        predict();
                    }}
                >
                    <FormPanen parameter={parameter} handleChange={handleChange} handleSelectChange={handleSelectChange} />
                    <div className="mt-8 flex gap-4 md:col-span-2">
                        <Button
                            type="button"
                            variant="default"
                            onClick={trainModel}
                            disabled={training}
                            className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white shadow transition hover:bg-blue-700"
                        >
                            {training ? (
                                <span className="flex items-center gap-2">
                                    <span className="border-opacity-50 h-4 w-4 animate-spin rounded-full border-t-2 border-white"></span>
                                    Training...
                                </span>
                            ) : (
                                'Train Model'
                            )}
                        </Button>
                        <Button
                            type="submit"
                            variant="secondary"
                            className="rounded-lg bg-gray-700 px-6 py-2 font-semibold text-white shadow transition hover:bg-gray-800"
                        >
                            Prediksi
                        </Button>
                    </div>
                </form>
                {predictionEucheuma !== null && (
                    <>
                        <ul className="mt-10 space-y-2 rounded-xl bg-green-100/60 p-6 font-medium text-green-900 shadow-inner">
                            <li>
                                <span className="font-semibold">Hasil Prediksi Eucheuma Conttoni:</span>
                                <span className="ml-2 text-lg">{predictionEucheuma.toFixed(2)} kg</span>
                            </li>
                            <li>
                                <span className="font-semibold">Hasil Prediksi Gracilia:</span>
                                <span className="ml-2 text-lg">{predictionGracilaria?.toFixed(2)} kg</span>
                            </li>
                        </ul>
                        <ul className="mx-auto mt-6 flex flex-col gap-2 rounded-xl bg-blue-50 p-6 shadow-inner">
                            <li className="font-medium text-blue-900">
                                Mean Squared Error (MSE): <span className="font-mono">{mse !== null ? mse.toFixed(4) : 'Belum dihitung'}</span>
                            </li>
                            <li className="font-medium text-blue-900">
                                R-Squared: <span className="font-mono">{rSquared !== null ? rSquared.toFixed(4) : 'Belum dihitung'}</span>
                            </li>
                        </ul>
                    </>
                )}
                <div className="mt-8 rounded-2xl border border-gray-100 bg-white/80 p-6 shadow">
                    <PredictionChart
                        dataRumputlautX1={Ydataeucheuma_conttoni}
                        dataRumputlautX2={Ydatagracilaria_sp}
                        predictionX1={predictionEucheuma}
                        predictionX2={predictionGracilaria}
                        mse={mse}
                        rSquared={rSquared}
                    />
                </div>
            </section>
        </>
    );
}
