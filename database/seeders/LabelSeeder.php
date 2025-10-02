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
                "nama" => "gizi buruk",
                "deskripsi" => "gizi buruk",
                "created_at" => "2025-07-17 10:21:01",
                "updated_at" => "2025-07-17 10:21:01",
            ),
            array(
                "id" => 2,
                "nama" => "gizi normal",
                "deskripsi" => "gizi normal",
                "created_at" => "2025-07-17 10:21:27",
                "updated_at" => "2025-07-17 10:21:27",
            ),
        );

        Label::insert($labels);
    }
}
