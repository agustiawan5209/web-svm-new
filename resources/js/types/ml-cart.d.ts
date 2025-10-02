declare module 'ml-svm' {
    export interface SVMOptions {
        kernel?: 'linear' | 'rbf' | 'poly';
        C?: number;
        gamma?: number;
        degree?: number;
        quiet?: boolean;
    }

    export class SVM {
        constructor(options?: SVMOptions);

        train(features: number[][], labels: number[]): void;
        predict(features: number[][]): number[];
        predictOne(feature: number[]): number;
        toJSON(): any;
        fromJSON(model: any): void;
        supportVectors(): number[][];
    }

    export default SVM;
}
