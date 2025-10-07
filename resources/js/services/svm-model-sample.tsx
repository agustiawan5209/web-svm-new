import axios from 'axios';

// Import SVM library
let SVM: any = null;
if (typeof window !== 'undefined') {
    import('ml-svm').then((module) => {
        SVM = module.default || module;
    });
}
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
    kernel?: 'linear' | 'rbf' | 'poly';
    C?: number;
    gamma?: number;
    degree?: number;
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

class SVMModel {
    private trainingData: TrainingData | null = null;
    private splitData: SplitData = {
        trainFeatures: [],
        trainLabelsY: [],
        testFeatures: [],
        testLabelsY: [],
    };
    private svmModel: any | null = null;
    private states: SVMStates = {
        dataLoading: { isLoading: false, error: null },
        modelLoading: { isLoading: false, error: null },
        training: { isLoading: false, error: null },
        evaluation: { isLoading: false, error: null },
        prediction: { isLoading: false, error: null },
        saving: { isLoading: false, error: null },
    };

    // ==================== PUBLIC GETTERS ====================
    public getTrainingData(): TrainingData | null {
        return this.trainingData;
    }

    public getSplitData(): SplitData {
        return this.splitData;
    }

    public getSVMModel(): any | null {
        return this.svmModel;
    }

    public getSVMModelJson() {
        return this.svmModel ? this.svmModel.toJSON() : null;
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
            const generateLabelId = (id: number) => {
                if (id === 1) return 0;
                if (id === 2) return 1;
                if (id === 3) return 2;
                return id;
            };
            for (const row of rawTraining) {
                const featureRow = row.slice(0, -1).map(Number);
                features.push(featureRow);

                const labelName = row[row.length - 1];
                const labelId = generateLabelId(labelOptions.find((label) => label.nama === labelName)?.id) || 0;
                console.log('Mapping label:', labelName, 'to ID:', labelId);
                labelsY.push(labelId);
            }

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
}

export default SVMModel;
