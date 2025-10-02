<?php

namespace Database\Seeders;

use App\Models\LabelSayuran;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LabelSayuranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $label_sayurans = array(
            array('id' => '1', 'label_id' => '1', 'sayuran' => 'Bayam, Kangkung, Daun Kelor', 'porsi' => '50 - 70 gram', 'tekstur' => 'Ditumis dengan minyak/mentega, dicampur sumber protein (ayam,ikan)', 'frekuensi' => '3 kali', 'created_at' => '2025-09-19 20:17:15', 'updated_at' => '2025-09-19 20:17:15'),
            array('id' => '2', 'label_id' => '1', 'sayuran' => 'Labu Kuning, Wortel', 'porsi' => '50 - 70 gram', 'tekstur' => 'Dibuat puree kental atau sup krim', 'frekuensi' => '2 - 3 kali', 'created_at' => '2025-09-19 20:18:32', 'updated_at' => '2025-09-19 20:18:32'),
            array('id' => '3', 'label_id' => '2', 'sayuran' => 'Sawi Hijau, Buncis, Tomat', 'porsi' => '50 - 100 gram', 'tekstur' => 'Beragam metode masak untuk menjaga variasi', 'frekuensi' => '2 - 3 kali', 'created_at' => '2025-09-19 20:18:53', 'updated_at' => '2025-09-19 20:18:53'),
        );

        LabelSayuran::insert($label_sayurans);
    }
}
