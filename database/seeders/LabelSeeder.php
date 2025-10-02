<?php

namespace Database\Seeders;

use App\Models\Label;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class LabelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $labels = array(
            array(
                "id" => 1,
                "nama" => "Buruk",
                "deskripsi" => "Buruk",
                "created_at" => "2025-07-17 10:21:01",
                "updated_at" => "2025-07-17 10:21:01",
            ),
            array(
                "id" => 2,
                "nama" => "Baik",
                "deskripsi" => "Baik",
                "created_at" => "2025-07-17 10:21:27",
                "updated_at" => "2025-07-17 10:21:27",
            ),
            array(
                "id" => 3,
                "nama" => "Obesitas",
                "deskripsi" => "Obesitas",
                "created_at" => "2025-07-17 10:21:27",
                "updated_at" => "2025-07-17 10:21:27",
            ),
        );

        Label::insert($labels);
    }
}
