declare module 'ml-svm' {
    interface SVMOptions {
        kernel?: 'linear' | 'gaussian' | 'polynomial';
        C?: number;
        gamma?: number;
        degree?: number;
        probability?: boolean;
    }

    interface PredictionResult {
        label: number;
        probabilities?: number[];
    }

    class SVM {
        constructor(options?: SVMOptions);
        train(X: number[][], y: number[]): void;
        predict(X: number[][]): number[];
        predictOne(X: number[]): number;
        predictProbability(X: number[][]): PredictionResult[];
        save(): any;
        load(model: any): void;
        toJSON(): any;
        fromJSON(json: any): any;
    }

    export = SVM;
}
