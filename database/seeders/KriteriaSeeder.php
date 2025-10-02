<?php

namespace Database\Seeders;

use App\Models\Kriteria;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KriteriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kriterias = array(
            array('id' => '1', 'nama' => 'Frekuensi Makan (x/hari)', 'deskripsi' => 'Frekuensi Makan (x/hari)', 'created_at' => '2025-07-31 23:20:34', 'updated_at' => '2025-07-31 23:20:34'),
            array('id' => '2', 'nama' => 'TB (cm)', 'deskripsi' => 'TB (cm)', 'created_at' => '2025-07-31 23:21:24', 'updated_at' => '2025-07-31 23:21:24'),
            array('id' => '3', 'nama' => 'BB (kg)', 'deskripsi' => 'BB (kg)', 'created_at' => '2025-07-31 23:21:10', 'updated_at' => '2025-07-31 23:21:10'),
            array('id' => '4', 'nama' => 'IMT', 'deskripsi' => 'IMT', 'created_at' => '2025-07-31 23:21:31', 'updated_at' => '2025-07-31 23:21:31'),
            array('id' => '5', 'nama' => 'LILA (cm)', 'deskripsi' => 'LILA (cm)', 'created_at' => '2025-07-31 23:21:31', 'updated_at' => '2025-07-31 23:21:31'),
            array('id' => '6', 'nama' => 'Hb (g/dL)', 'deskripsi' => 'Hb (g/dL)', 'created_at' => '2025-07-31 23:21:31', 'updated_at' => '2025-07-31 23:21:31'),
        );

        Kriteria::insert($kriterias);
    }
}
