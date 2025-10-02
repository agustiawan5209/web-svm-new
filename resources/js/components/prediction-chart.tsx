import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';

interface PredictionChartProps {
    predictionX1: number | null; // Assuming prediction is an array of numbers
    predictionX2: number | null; // Assuming prediction is an array of numbers
    dataRumputlautX1?: number[] | null; // Optional prop for additional data
    dataRumputlautX2?: number[]; // Optional prop for additional data
    mse: number | null;
    rSquared: number | null;
}
const PredictionChart = ({ predictionX1, predictionX2, dataRumputlautX1, dataRumputlautX2, mse, rSquared }: PredictionChartProps) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const metricChartRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (predictionX1 !== null && predictionX2 !== null && chartRef.current && metricChartRef.current) {
            // Chart untuk hasil prediksi
            const ctx = chartRef.current.getContext('2d');

            // Chart untuk metrik evaluasi
            const metricCtx = metricChartRef.current.getContext('2d');
            if (metricCtx && ctx) {
                const metricChart = new Chart(metricCtx, {
                    type: 'bar',
                    data: {
                        labels: ['MSE', 'R-squared'],
                        datasets: [
                            {
                                label: 'Metrik Evaluasi Model',
                                data: [mse, rSquared],
                                backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(75, 192, 192, 0.5)'],
                                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'],
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Nilai Metrik',
                                },
                            },
                        },
                    },
                });
                // Chart untuk hasil prediksi
                const predictionChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: dataRumputlautX1 ? [...dataRumputlautX1.map((_, index) => ` ${index + 1}`), 'Prediksi'] : ['Prediksi'],
                        datasets: [
                            {
                                label: 'Produktivitas Rumput Laut Eucheuma',
                                data: [...(dataRumputlautX1 || []), null],
                                fill: false,
                                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 2,
                                tension: 0.3,
                                pointRadius: 3,
                            },
                            {
                                label: 'Prediksi Rumput Laut Eucheuma',
                                data: [...(dataRumputlautX1 || []), predictionX1],
                                fill: false,
                                backgroundColor: 'rgba(77, 255, 190,0.5)',
                                borderColor: 'rgba(77, 255, 190,1)',
                                borderWidth: 2,
                                tension: 0.3,
                                pointRadius: 3,
                            },
                            {
                                label: 'Produktivitas Rumput Laut Glacilaria',
                                data: [...(dataRumputlautX2 || []), null],
                                fill: false,
                                backgroundColor: 'rgb(254, 119, 67, 0.5)',
                                borderColor: 'rgba(254, 119, 67, 1)',
                                borderWidth: 2,
                                tension: 0.3,
                                pointRadius: 3,
                            },
                            {
                                label: 'Prediksi Rumput Laut Glacilaria',
                                data: [...(dataRumputlautX2 || []), predictionX2],
                                fill: false,
                                backgroundColor: 'rgba(237, 53, 0,0.5)',
                                borderColor: 'rgba(237, 53, 0,1)',
                                borderWidth: 2,
                                tension: 0.3,
                                pointRadius: 3,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true,
                            },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Periode',
                                },
                            },
                            y: {
                                beginAtZero: false,
                                title: {
                                    display: true,
                                    text: 'Nilai Produktivitas',
                                },
                            },
                        },
                    },
                });
                return () => {
                    predictionChart.destroy();
                    metricChart.destroy();
                };
            } else {
                console.error('Metric chart context is null');
            }
        }
    }, [predictionX1, predictionX2, mse, rSquared]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
                <h3>Hasil Prediksi Produktivitas</h3>
                <canvas ref={chartRef} width="400" height="200"></canvas>
            </div>
            <div>
                <h3>Metrik Evaluasi Model</h3>
                <canvas ref={metricChartRef} width="400" height="200"></canvas>
            </div>
        </div>
    );
};

export default PredictionChart;
