<?php

namespace Database\Seeders;

use App\Models\Dataset;
use App\Models\DetailDataset;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatasetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $label = ['gizi buruk', 'beresiko', 'gizi normal'];

        for ($i = 0; $i < 200; $i++) {
            $labels = fake()->randomElement($label);
            $id = $i + 1;
            if ($labels == 'gizi buruk') {
                $berat_badan = fake()->numberBetween(38, 42);
                $tinggi_badan = fake()->numberBetween(150, 153);
                $IMT = round($berat_badan / (($tinggi_badan / 100) * ($tinggi_badan / 100)), 2);
                $detail = [
                    [
                        'kriteria_id' => 1,
                        'dataset_id' => $id,
                        'nilai' => fake()->numberBetween(1, 2)
                    ],
                    [
                        'kriteria_id' => 2,
                        'dataset_id' => $id,
                        'nilai' => $tinggi_badan
                    ],
                    [
                        'kriteria_id' => 3,
                        'dataset_id' => $id,
                        'nilai' => $berat_badan
                    ],
                    [
                        'kriteria_id' => 4,
                        'dataset_id' => $id,
                        'nilai' => $IMT
                    ],
                    [
                        'kriteria_id' => 5,
                        'dataset_id' => $id,
                        'nilai' => fake()->numberBetween(20, 21)
                    ],
                    [
                        'kriteria_id' => 6,
                        'dataset_id' => $id,
                        'nilai' => fake()->numberBetween(9.2, 9.9)
                    ],
                ];
            }
            if ($labels == 'beresiko') {
                $tinggi_badan = fake()->numberBetween(155, 160);
                $berat_badan = fake()->numberBetween(42, 49);
                $IMT = round($berat_badan / (($tinggi_badan / 100) * ($tinggi_badan / 100)), 2);
                $detail = [
                    [
                        'kriteria_id' => 1,
                        'dataset_id' => $id,
                        'nilai' => fake()->numberBetween(3, 3)
                    ],
                    [
                        'kriteria_id' => 2,
                        'dataset_id' => $id,
                        'nilai' => $tinggi_badan
                    ],
                    [
                        'kriteria_id' => 3,
                        'dataset_id' => $id,
                        'nilai' => $berat_badan
                    ],
                    [
                        'kriteria_id' => 4,
                        'dataset_id' => $id,
                        'nilai' => $IMT
                    ],
                    [
                        'kriteria_id' => 5,
                        'dataset_id' => $id,
                        'nilai' => fake()->numberBetween(22, 24)
                    ],
                    [
                        'kriteria_id' => 6,
                        'dataset_id' => $id,
                        'nilai' => fake()->numberBetween(10.1, 10.9)
                    ],
                ];
            }
            if ($labels == 'gizi normal') {
                $tinggi_badan = fake()->numberBetween(160, 168);
                $berat_badan = fake()->numberBetween(50, 58);
                $IMT = round($berat_badan / (($tinggi_badan / 100) * ($tinggi_badan / 100)), 2);
                $detail = [
                    [
                        'kriteria_id' => 1,
                        'dataset_id' => $id,
                        'nilai' => fake()->numberBetween(3, 4)
                    ],
                    [
                        'kriteria_id' => 2,
                        'dataset_id' => $id,
                        'nilai' => $tinggi_badan
                    ],
                    [
                        'kriteria_id' => 3,
                        'dataset_id' => $id,
                        'nilai' => $berat_badan
                    ],
                    [
                        'kriteria_id' => 4,
                        'dataset_id' => $id,
                        'nilai' => $IMT
                    ],
                    [
                        'kriteria_id' => 5,
                        'dataset_id' => $id,
                        'nilai' => fake()->numberBetween(25, 30)
                    ],
                    [
                        'kriteria_id' => 6,
                        'dataset_id' => $id,
                        'nilai' => fake()->numberBetween(11.5, 12.4)
                    ],
                ];
            }
            $dataset = Dataset::create([
                'id' => $id,
                'label' => $labels,
                'data' => json_encode($detail),
            ]);
            DetailDataset::insert($detail);
        }
    }
}
