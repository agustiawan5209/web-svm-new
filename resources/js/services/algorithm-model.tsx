import { JenisTanamanTypes } from '@/types';
import * as tf from '@tensorflow/tfjs';
import axios from 'axios';

interface LabelTypes {
    id: number;
    nama: string;
}

interface TrainingData {
    features: number[][];
    labelsY: number[];
    featureNames: string[];
    label: LabelTypes[];
}

interface SplitData {
    trainFeatures: number[][];
    trainLabelsY: number[];
    testFeatures: number[][];
    testLabelsY: number[];
}

interface PredictionResult {
    prediction: number | number[] | null;
    label: string | string[] | null;
    rekomendasi: string | null;
    error: string | null;
}

interface ModelOptions {
    kernel: 'linear' | 'rbf';
    C: number;
    gamma: number;
}

interface OperationState<T = any> {
    isLoading: boolean;
    error: string | null;
    data?: T;
}

interface SVMStates {
    dataLoading: OperationState<TrainingData>;
    modelLoading: OperationState<any>;
    training: OperationState<void>;
    evaluation: OperationState<{ accuracy: number; confusionMatrix?: number[][] }>;
    prediction: OperationState<PredictionResult>;
    saving: OperationState<void>;
}
interface TrainingProgress {
    epoch: number;
    loss: number;
    accuracy: number;
    valLoss?: number;
    valAccuracy?: number;
    status: 'training' | 'completed' | 'error';
}

interface TrainingCallbacks {
    onEpochEnd?: (epoch: number, logs: any) => void;
    onTrainBegin?: (logs: any) => void;
    onTrainEnd?: (logs: any) => void;
}
class SVMModel {
    private trainingData: TrainingData | null = null;
    private splitData: SplitData = {
        trainFeatures: [],
        trainLabelsY: [],
        testFeatures: [],
        testLabelsY: [],
    };
    private svmModel: tf.LayersModel | null = null;
    private classNames: string[] = [];
    private labelMap: Map<number, string> = new Map();
    private states: SVMStates = {
        dataLoading: { isLoading: false, error: null },
        modelLoading: { isLoading: false, error: null },
        training: { isLoading: false, error: null },
        evaluation: { isLoading: false, error: null },
        prediction: { isLoading: false, error: null },
        saving: { isLoading: false, error: null },
    };
    private trainingReport: string[] = [];
    private trainingLoss: string[] = [];
    private trainingAccuracy: string[] = [];
    private trainingValLoss: string[] = [];
    private trainingValAccuracy: string[] = [];
    private trainingProgress: TrainingProgress[] = [];

    // ==================== PUBLIC GETTERS ====================
    public getTrainingData(): TrainingData | null {
        return this.trainingData;
    }

    public getSplitData(): SplitData {
        return this.splitData;
    }

    public getSVMModel(): tf.LayersModel | null {
        return this.svmModel;
    }

    public getSVMModelJson() {
        if (!this.svmModel) return null;
        return {
            model: this.svmModel,
            featureNames: this.trainingData?.featureNames,
            labels: this.trainingData?.label,
            classNames: this.classNames,
            labelMap: Array.from(this.labelMap.entries()),
        };
    }

    public getDataLoadingState() {
        return this.states.dataLoading;
    }
    public getModelLoadingState() {
        return this.states.modelLoading;
    }
    public getTrainingState() {
        return this.states.training;
    }
    public getEvaluationState() {
        return this.states.evaluation;
    }
    public getPredictionState() {
        return this.states.prediction;
    }
    public getSavingState() {
        return this.states.saving;
    }

    public getTrainingReport() {
        return this.trainingReport;
    }
    public getTrainingMetrics() {
        return {
            loss: this.trainingLoss,
            accuracy: this.trainingAccuracy,
            valLoss: this.trainingValLoss,
            valAccuracy: this.trainingValAccuracy,
        };
    }
    public getTrainingProgress() {
        return this.trainingProgress;
    }

    // ==================== STATE MANAGEMENT ====================
    private setState<K extends keyof SVMStates>(key: K, update: Partial<OperationState<SVMStates[K]['data']>>) {
        this.states[key] = { ...this.states[key], ...update };
    }

    private resetState<K extends keyof SVMStates>(key: K) {
        this.states[key] = { isLoading: false, error: null, data: undefined };
    }

    // ==================== CORE METHODS ====================
    public async fetchAndProcessData(): Promise<TrainingData> {
        this.setState('dataLoading', { isLoading: true, error: null });

        try {
            const response = await axios.get(route('api.ModelStorage.getData'));

            if (response.status !== 200) {
                throw new Error(`API returned status ${response.status}`);
            }

            const data = response.data;
            const rawTraining: string[][] = data?.training ?? [];
            const rawKriteria: string[] = data?.kriteria ?? [];
            const labelOptions: LabelTypes[] = data?.label ?? [];

            if (rawTraining.length === 0 || rawKriteria.length === 0) {
                throw new Error('Data training atau kriteria dari API kosong');
            }

            // Process features and labels
            const features: number[][] = [];
            const labelsY: number[] = [];

            for (const row of rawTraining) {
                const featureRow = row.slice(0, -1).map(Number);
                features.push(featureRow);

                const labelName = row[row.length - 1];
                const labelId = labelOptions.find((label) => label.nama === labelName)?.id || 0;
                labelsY.push(labelId);
            }

            // Create label mapping and class names
            this.labelMap.clear();
            labelOptions.forEach((label) => {
                this.labelMap.set(label.id, label.nama);
            });
            this.classNames = Array.from(this.labelMap.values());

            // Set training data
            const trainingData: TrainingData = {
                features,
                labelsY,
                featureNames: rawKriteria.slice(0, -1),
                label: labelOptions,
            };

            this.trainingData = trainingData;
            this.splitData = this.splitDataTraining(features, labelsY, 0.8);

            this.setState('dataLoading', {
                isLoading: false,
                data: trainingData,
            });
            return trainingData;
        } catch (err) {
            const errorMsg = 'Gagal memuat dataset: ' + (err as Error).message;
            this.setState('dataLoading', {
                isLoading: false,
                error: errorMsg,
            });
            throw new Error(errorMsg);
        }
    }

    private splitDataTraining(features: number[][], labelsY: number[], splitRatio = 0.7): SplitData {
        const shuffledIndices = features.map((_, i) => i).sort(() => Math.random() - 0.5);
        const splitIndex = Math.floor(features.length * splitRatio);

        return {
            trainFeatures: shuffledIndices.slice(0, splitIndex).map((i) => features[i]),
            trainLabelsY: shuffledIndices.slice(0, splitIndex).map((i) => labelsY[i]),
            testFeatures: shuffledIndices.slice(splitIndex).map((i) => features[i]),
            testLabelsY: shuffledIndices.slice(splitIndex).map((i) => labelsY[i]),
        };
    }

    private createSVMModel(inputDim: number, numClasses: number, options: ModelOptions): tf.LayersModel {
        const model = tf.sequential();

        // Input layer dengan normalisasi
        model.add(
            tf.layers.dense({
                inputShape: [inputDim],
                units: 128,
                activation: 'relu',
                kernelRegularizer: tf.regularizers.l2({ l2: 1 / options.C }),
            }),
        );

        // Dropout untuk regularisasi
        model.add(tf.layers.dropout({ rate: 0.3 }));

        // Hidden layer
        model.add(
            tf.layers.dense({
                units: 64,
                activation: 'relu',
            }),
        );

        // Output layer untuk multi-class classification
        model.add(
            tf.layers.dense({
                units: numClasses,
                activation: 'softmax',
            }),
        );

        // Compile model dengan optimizer yang sesuai
        model.compile({
            optimizer: tf.train.adam(0.001),
            loss: 'sparseCategoricalCrossentropy',
            metrics: ['accuracy'],
        });

        return model;
    }

    public async loadModel(): Promise<tf.LayersModel> {
        this.setState('modelLoading', { isLoading: true, error: null });

        try {
            const response = await axios.get(route('ModelStorage.getModel'));

            if (response.status !== 200) {
                throw new Error(`API returned status ${response.status}`);
            }

            const modelData = response.data;

            // Handle different response formats
            let modelJSON: any;
            let weightsData: any[] = [];

            if (typeof modelData === 'string') {
                const parsed = JSON.parse(modelData);
                modelJSON = parsed.model;
                weightsData = parsed.weights || [];
            } else if (typeof modelData === 'object') {
                modelJSON = modelData.model;
                weightsData = modelData.weights || [];
            } else {
                throw new Error('Format model tidak dikenali');
            }

            // Load model architecture
            this.svmModel = await tf.models.modelFromJSON(modelJSON);

            // Reconstruct weights if available
            if (weightsData.length > 0 && this.svmModel) {
                const weightTensors = weightsData.map((w, i) => tf.tensor(w, this.svmModel!.weights[i].shape, 'float32'));
                this.svmModel.setWeights(weightTensors);

                // Cleanup temporary tensors
                weightTensors.forEach((t) => t.dispose());
            }

            // Load metadata
            if (modelData.featureNames) {
                this.trainingData = {
                    ...(this.trainingData || {}),
                    featureNames: modelData.featureNames,
                    label: modelData.labels || [],
                };
            }

            if (modelData.classNames) {
                this.classNames = modelData.classNames;
            }

            if (modelData.labelMap) {
                this.labelMap = new Map(modelData.labelMap);
            }

            this.setState('modelLoading', {
                isLoading: false,
                data: this.svmModel,
            });

            return this.svmModel;
        } catch (err) {
            const errorMsg = 'Gagal memuat model: ' + (err as Error).message;
            this.setState('modelLoading', {
                isLoading: false,
                error: errorMsg,
            });
            throw new Error(errorMsg);
        }
    }

    // Dalam class SVMModel, update method trainModel
    public async trainModel(options?: Partial<ModelOptions>, callbacks?: TrainingCallbacks): Promise<void> {
        this.setState('training', { isLoading: true, error: null });

        try {
            if (!this.trainingData || this.trainingData.features.length === 0) {
                throw new Error('Training data tidak tersedia atau kosong');
            }

            const defaultOptions: ModelOptions = {
                kernel: 'rbf',
                C: 1.0,
                gamma: 0.1,
                ...options,
            };

            // Prepare data dengan tipe yang benar
            const numClasses = this.classNames.length;
            const inputDim = this.trainingData.features[0].length;

            // Convert features to float32
            const trainFeaturesTensor = tf.tensor2d(this.splitData.trainFeatures, undefined, 'float32');

            // Convert labels to float32
            const trainLabelsTensor = tf.tensor1d(this.splitData.trainLabelsY, 'float32');

            // Normalisasi features
            const { mean, variance } = tf.moments(trainFeaturesTensor, 0);
            const adjustedVariance = variance.add(1e-7);
            const normalizedFeatures = trainFeaturesTensor.sub(mean).div(adjustedVariance.sqrt());

            // Create and train model
            this.svmModel = this.createSVMModel(inputDim, numClasses, defaultOptions);

            console.log('Memulai training model...');
            console.log(`Data: ${this.splitData.trainFeatures.length} samples, ${numClasses} classes`);

            // Panggil callback awal training
            if (callbacks?.onTrainBegin) {
                callbacks.onTrainBegin({
                    samples: this.splitData.trainFeatures.length,
                    classes: numClasses,
                    inputDim: inputDim,
                });
            }

            // Manual splitting untuk validation data
            const splitIndex = Math.floor(this.splitData.trainFeatures.length * 0.8);

            const trainFeatures = normalizedFeatures.slice(0, splitIndex);
            const trainLabels = trainLabelsTensor.slice(0, splitIndex);
            const valFeatures = normalizedFeatures.slice(splitIndex);
            const valLabels = trainLabelsTensor.slice(splitIndex);

            // Training dengan callbacks
            const history = await this.svmModel.fit(trainFeatures, trainLabels, {
                epochs: 50,
                batchSize: 32,
                validationData: [valFeatures, valLabels],
                callbacks: {
                    onEpochEnd: async (epoch, logs) => {
                        // Panggil custom callback
                        if (callbacks?.onEpochEnd) {
                            callbacks.onEpochEnd(epoch, {
                                loss: logs?.loss || 0,
                                acc: logs?.acc || 0,
                                val_loss: logs?.val_loss || 0,
                                val_acc: logs?.val_acc || 0,
                            });
                        }
                    },
                    onTrainEnd: () => {
                        console.log('Training completed');
                        if (callbacks?.onTrainEnd) {
                            callbacks.onTrainEnd({
                                finalLoss: history.history.loss[history.history.loss.length - 1],
                                finalAccuracy: history.history.acc[history.history.acc.length - 1],
                            });
                        }
                    },
                },
            });

            console.log('Training selesai');

            // Cleanup tensors
            trainFeaturesTensor.dispose();
            trainLabelsTensor.dispose();
            normalizedFeatures.dispose();
            mean.dispose();
            variance.dispose();
            adjustedVariance.dispose();
            trainFeatures.dispose();
            trainLabels.dispose();
            valFeatures.dispose();
            valLabels.dispose();

            this.setState('training', { isLoading: false });
        } catch (err) {
            const errorMsg = 'Gagal melatih model: ' + (err as Error).message;
            console.error('Error training:', err);
            this.setState('training', {
                isLoading: false,
                error: errorMsg,
            });
            throw new Error(errorMsg);
        }
    }
    public async evaluateModel(): Promise<{ accuracy: number; confusionMatrix: number[][] }> {
        this.setState('evaluation', { isLoading: true, error: null });

        try {
            if (!this.svmModel || !this.splitData) {
                throw new Error('Model atau data split tidak tersedia');
            }

            // Convert test features to float32
            const testFeaturesTensor = tf.tensor2d(this.splitData.testFeatures, undefined, 'float32');

            // Normalisasi test features
            const { mean, variance } = tf.moments(testFeaturesTensor, 0);
            const normalizedTestFeatures = testFeaturesTensor.sub(mean).div(variance.sqrt().add(1e-7));

            const predictions = this.svmModel.predict(normalizedTestFeatures) as tf.Tensor;
            const predictedClasses = predictions.argMax(1).dataSync();

            const uniqueLabels = [...new Set(this.splitData.testLabelsY)].sort((a, b) => a - b);

            // Hitung akurasi
            let correct = 0;
            const predictedArray = Array.from(predictedClasses);
            for (let i = 0; i < predictedArray.length; i++) {
                if (predictedArray[i] === this.splitData.testLabelsY[i]) {
                    correct++;
                }
            }
            const accuracy = correct / predictedArray.length;

            // Buat confusion matrix
            const confusionMatrix = uniqueLabels.map(() => uniqueLabels.map(() => 0));

            for (let i = 0; i < predictedArray.length; i++) {
                const actualIdx = uniqueLabels.indexOf(this.splitData.testLabelsY[i]);
                const predictedIdx = uniqueLabels.indexOf(predictedArray[i]);
                if (actualIdx >= 0 && predictedIdx >= 0) {
                    confusionMatrix[actualIdx][predictedIdx]++;
                }
            }

            // Cleanup tensors
            testFeaturesTensor.dispose();
            normalizedTestFeatures.dispose();
            predictions.dispose();
            mean.dispose();
            variance.dispose();

            const result = { accuracy, confusionMatrix };

            this.setState('evaluation', {
                isLoading: false,
                data: result,
            });

            return result;
        } catch (err) {
            const errorMsg = 'Gagal mengevaluasi model: ' + (err as Error).message;
            this.setState('evaluation', {
                isLoading: false,
                error: errorMsg,
            });
            throw new Error(errorMsg);
        }
    }

    private async getsayuran(label: string): Promise<{ rekomendasi: string }> {
        let rekomendasi = null;
        try {
            const response = await axios.get(route('api.get.sayuran'));
            const sayuran: JenisTanamanTypes[] = response.data as JenisTanamanTypes[];
            if (response.status == 200) {
                rekomendasi =
                    sayuran.filter((item) => {
                        return item.nama.toLowerCase() == label.toLowerCase();
                    })[0]?.deskripsi || '';
            }
        } catch (err) {
            console.log('Terjadi kesalahan ketika memuat data sayuran :', err);
        }

        return {
            rekomendasi: rekomendasi ?? '',
        };
    }

    public async predict(features: number[] | number[][]): Promise<PredictionResult> {
        this.setState('prediction', { isLoading: true, error: null });

        try {
            if (!this.svmModel) throw new Error('Model belum dimuat');
            if (!this.trainingData) throw new Error('Data training tidak tersedia');

            // Validasi input features
            const featuresArray = Array.isArray(features[0]) ? (features as number[][]) : ([features] as number[][]);

            if (featuresArray[0].length !== this.trainingData.features[0]?.length) {
                throw new Error(`Jumlah fitur tidak sesuai. Diharapkan: ${this.trainingData.features[0]?.length}`);
            }

            // Convert features to tensor dengan tipe float32
            const featuresTensor = tf.tensor2d(featuresArray, undefined, 'float32');

            // Normalisasi features
            const { mean, variance } = tf.moments(featuresTensor, 0);
            const normalizedFeatures = featuresTensor.sub(mean).div(variance.sqrt().add(1e-7));

            const predictions = this.svmModel.predict(normalizedFeatures) as tf.Tensor;
            const predictedClasses = predictions.argMax(1).dataSync();

            // Convert to regular array
            const predictionsArray = Array.from(predictedClasses);

            // Get label names
            const labelNames = predictionsArray.map((classId: number) => {
                const labelName = this.labelMap.get(classId) || this.classNames[classId] || 'Unknown';
                return labelName;
            });

            const label = labelNames.length === 1 ? labelNames[0] : labelNames;
            const rekomendasi = await this.getsayuran(label as string);

            // Cleanup tensors
            featuresTensor.dispose();
            normalizedFeatures.dispose();
            predictions.dispose();
            mean.dispose();
            variance.dispose();

            const result: PredictionResult = {
                prediction: predictionsArray.length === 1 ? predictionsArray[0] : predictionsArray,
                label: label,
                rekomendasi: rekomendasi.rekomendasi,
                error: null,
            };

            this.setState('prediction', {
                isLoading: false,
                data: result,
            });

            return result;
        } catch (err) {
            const errorMsg = 'Prediksi gagal: ' + (err as Error).message;
            this.setState('prediction', {
                isLoading: false,
                error: errorMsg,
            });
            throw new Error(errorMsg);
        }
    }

    public async saveModel(): Promise<void> {
        this.setState('saving', { isLoading: true, error: null });

        try {
            if (!this.svmModel) {
                throw new Error('Tidak ada model yang tersedia untuk disimpan');
            }

            // Convert model to JSON
            const modelJSON = this.svmModel.toJSON();

            // Get weights as arrays
            const weights = this.svmModel.getWeights();
            const weightArrays = weights.map((w) => Array.from(w.dataSync()));

            const modelData = {
                model: modelJSON,
                weights: weightArrays,
                weightSpecs: weights.map((w) => ({
                    shape: w.shape,
                    dtype: w.dtype,
                })),
                featureNames: this.trainingData?.featureNames,
                labels: this.trainingData?.label,
                classNames: this.classNames,
                labelMap: Array.from(this.labelMap.entries()),
                metadata: {
                    savedAt: new Date().toISOString(),
                    inputDim: this.trainingData?.features[0]?.length,
                    numClasses: this.classNames.length,
                },
            };

            const response = await axios.post(route('ModelStorage.store'), {
                model: JSON.stringify(modelData),
            });

            if (response.status !== 200) {
                throw new Error(`Gagal menyimpan model: ${response.statusText}`);
            }

            this.setState('saving', { isLoading: false });
        } catch (err) {
            const errorMsg = 'Gagal menyimpan model: ' + (err as Error).message;
            this.setState('saving', {
                isLoading: false,
                error: errorMsg,
            });
            throw new Error(errorMsg);
        }
    }

    // Cleanup method to dispose tensors and models
    public dispose(): void {
        if (this.svmModel) {
            this.svmModel.dispose();
            this.svmModel = null;
        }
    }
}

export default SVMModel;
