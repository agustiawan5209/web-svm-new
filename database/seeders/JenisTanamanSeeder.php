<?php

namespace Database\Seeders;

use App\Models\JenisTanaman;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JenisTanamanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jenis_tanamen = array(
            array(
                "id" => 1,
                "nama" => "Kangkung",
                "deskripsi" => "Kangkung adalah sayuran yang sangat populer dan mudah ditemukan. Manfaat utamanya meliputi:  Menjaga Kesehatan Mata: Tinggi akan kandungan vitamin A dan beta-karoten yang esensial untuk kesehatan mata, membantu mencegah rabun senja dan kerusakan mata akibat radikal bebas.  Mengatasi Anemia: Sebagai sumber zat besi yang baik, kangkung membantu dalam pembentukan sel darah merah sehingga efektif untuk mencegah dan mengatasi gejala anemia atau kekurangan darah.  Meningkatkan Imunitas Tubuh: Kandungan vitamin C pada kangkung berfungsi sebagai antioksidan yang memperkuat sistem kekebalan tubuh untuk melawan infeksi.  Melancarkan Pencernaan: Kaya akan serat, kangkung sangat baik untuk menjaga kesehatan sistem pencernaan, mencegah sembelit, dan membersihkan usus.",
                "created_at" => "2025-07-15 17:47:12",
                "updated_at" => "2025-07-15 17:47:12",
            ),
            array(
                "id" => 2,
                "nama" => "Selada",
                "deskripsi" => "Selada sering dijadikan lalapan atau bahan utama salad. Sayuran renyah ini memiliki manfaat seperti:  Mencegah Dehidrasi: Memiliki kandungan air yang sangat tinggi (sekitar 96%), menjadikannya pilihan yang baik untuk membantu memenuhi kebutuhan cairan tubuh.  Menjaga Kesehatan Tulang: Merupakan sumber vitamin K yang melimpah. Vitamin K berperan penting dalam membantu penyerapan kalsium untuk menjaga kepadatan dan kekuatan tulang.  Menangkal Radikal Bebas: Mengandung antioksidan seperti vitamin C dan beta-karoten yang melindungi sel-sel tubuh dari kerusakan akibat radikal bebas, sehingga mengurangi risiko penyakit kronis.  Menjaga Kesehatan Jantung: Kandungan folat dan kalium dalam selada membantu mengontrol tekanan darah dan menjaga kesehatan pembuluh darah.",
                "created_at" => "2025-07-15 17:47:31",
                "updated_at" => "2025-07-15 17:47:31",
            ),
            array(
                "id" => 3,
                "nama" => "Seledri",
                "deskripsi" => "Seledri dikenal dengan aroma khasnya dan sering digunakan sebagai pelengkap masakan. Manfaatnya antara lain:\n\nMenurunkan Tekanan Darah: Mengandung senyawa phthalides yang dapat membantu mengendurkan otot-otot di sekitar pembuluh darah, sehingga aliran darah lebih lancar dan tekanan darah menurun.\n\nAnti-inflamasi: Kaya akan antioksidan dan senyawa polisakarida yang bersifat anti-peradangan, membantu mengurangi risiko peradangan kronis seperti radang sendi.\n\nRendah Kalori dan Tinggi Serat: Sangat cocok untuk program penurunan berat badan karena rendah kalori namun tinggi serat, yang memberikan rasa kenyang lebih lama dan melancarkan pencernaan.\n\nMenjaga Kesehatan Ginjal: Memiliki sifat diuretik alami yang membantu mengeluarkan racun dan kelebihan cairan dari tubuh, sehingga mendukung fungsi ginjal yang sehat.",
                "created_at" => "2025-07-15 17:48:39",
                "updated_at" => "2025-07-15 17:48:39",
            ),
            array(
                "id" => 4,
                "nama" => "Bayam",
                "deskripsi" => "Bayam merupakan sayuran hijau yang sangat padat nutrisi. Beberapa manfaat utamanya adalah:\n\nSumber Energi dan Zat Besi: Seperti kangkung, bayam kaya akan zat besi yang penting untuk pembentukan energi dan pencegahan anemia.\n\nMenjaga Kesehatan Tulang: Selain vitamin K, bayam juga mengandung kalsium dan magnesium, kombinasi mineral yang sangat penting untuk membangun dan memelihara struktur tulang yang kuat.\n\nMengontrol Gula Darah: Kandungan serat dan magnesium pada bayam membantu mengatur kadar gula darah, sehingga baik dikonsumsi untuk pencegahan dan manajemen diabetes.\n\nKesehatan Kulit dan Rambut: Vitamin A dalam bayam membantu menjaga kelembapan kulit dan rambut, sementara vitamin C penting untuk produksi kolagen.",
                "created_at" => "2025-07-15 17:48:56",
                "updated_at" => "2025-07-15 17:48:56",
            ),
            array(
                "id" => 5,
                "nama" => "Pakcoy",
                "deskripsi" => "Pakcoy atau sawi sendok adalah jenis sawi yang populer dalam masakan Asia. Manfaatnya meliputi:\n\nMeningkatkan Kekebalan Tubuh: Merupakan sumber vitamin C yang sangat baik, yang krusial untuk memperkuat sistem imun dan melindungi tubuh dari berbagai penyakit.\n\nMenjaga Kesehatan Jantung: Mengandung folat, kalium, dan vitamin B6 yang bekerja sama untuk menjaga kesehatan jantung dengan cara mengontrol tekanan darah dan kadar homosistein dalam darah.\n\nPotensi Anti-kanker: Mengandung senyawa sulfur seperti glukosinolat yang dalam penelitian menunjukkan potensi untuk membantu melindungi sel dari kerusakan DNA dan menghambat pertumbuhan sel kanker.\n\nKesehatan Tulang: Kombinasi vitamin K, kalsium, fosfor, dan magnesium menjadikan pakcoy sayuran yang sangat baik untuk mendukung kepadatan dan kekuatan tulang.",
                "created_at" => "2025-07-15 17:49:10",
                "updated_at" => "2025-07-15 17:49:10",
            ),
        );

        JenisTanaman::insert($jenis_tanamen);
    }
}
