<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Label;
use App\Models\Pasien;
use App\Models\Dataset;
use App\Models\Kriteria;
use App\Models\Pemeriksaan;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public function index()
    {
        $label = Label::select('nama')->orderBy('id', 'asc')->get()->pluck('nama')->toArray();

        $data = $this->getData();
        $training = collect($data['training']);
        $kriteria = $data['kriteria'];
        $distributionLabel = $this->setDistribusiLabel($training, $label);

        $pasien = Pasien::with(['pemeriksaan' => function ($query) {
            $query->latest()->limit(5);
        }])->latest()->get()->map(function ($item) {
            $pemeriksaan = $item->pemeriksaan->first();

            // Initialize default values
            $umur_kehamilan = null;
            $berat_badan = null;
            $tinggi_badan = null;
            $label = null;
            $tgl_pemeriksaan = null;

            // Only process if pemeriksaan exists
            if ($pemeriksaan) {
                $kriteria = Kriteria::all();
                $umur = now()->diff($item->tanggal_lahir)->y;
                $item->umur = $umur;

                foreach ($kriteria as $kri) {
                    $detail = $pemeriksaan->detailpemeriksaan->where('kriteria_id', $kri->id)->first();

                    if (in_array(strtolower($kri->nama), ['usia kehamilan', 'umur kehamilan'])) {
                        $umur_kehamilan = $detail ? $detail->nilai : null;
                        continue;
                    }
                    if (in_array(strtolower($kri->nama), ['bb (kg)', 'berat badan'])) {
                        $berat_badan = $detail ? $detail->nilai : null;
                        continue;
                    }
                    if (in_array(strtolower($kri->nama), ['tb (cm)', 'tinggi badan'])) {
                        $tinggi_badan = $detail ? $detail->nilai : null;
                        continue;
                    }
                }

                $label = str_replace('gizi ', '', strtolower($pemeriksaan->label ?? ''));
                $tgl_pemeriksaan = $pemeriksaan->tgl_pemeriksaan;
            }

            return [
                'id' => $item->id,
                'name' => $item->nama,
                'age' => $item->umur ?? now()->diff($item->tanggal_lahir)->y,
                'weight' => $berat_badan,
                'height' => $tinggi_badan,
                'pregnancyAge' => $umur_kehamilan,
                'lastCheckup' => $tgl_pemeriksaan,
                'nutritionStatus' => [
                    'status' => $label,
                    'color' => $label == 'gizi baik' ? 'bg-green-500' : ($label ? 'bg-red-500' : 'bg-gray-500'),
                ],
            ];
        })->toArray();

        return Inertia::render("dashboard", [
            "distributionLabel" => $distributionLabel,
            "training" => count($training),
            "kriteria" => count($kriteria),
            "label" => Label::orderBy('id', 'desc')->get(),
            'totalPasien' => Pasien::count(),
            "pemeriksaan" => Pemeriksaan::count(),
            "patients" => $pasien,
        ]);
    }
    private function getData()
    {
        // Logic to retrieve data for the Support Vector Machine model

        $data = [];
        $dataset = Dataset::with(['detail', 'detail.kriteria'])->orderBy('id', 'desc')->get();
        $kriteria = Kriteria::select('nama')->orderBy('id', 'asc')->get()->pluck('nama')->toArray();

        foreach ($dataset as $row) {
            $attribut = [];
            foreach ($row->detail as $key => $detail) {
                if (strtolower($detail->kriteria->nama) == 'jenis kelamin') {
                    $attribut[$key] = strtolower($detail->nilai) == 'laki-laki' ? 0 : 1;
                } else {
                    $attribut[$key] = floatval($detail->nilai);
                }
            }
            $data[] = array_merge($attribut, [
                'label' => $row->label,
            ]);
        }
        // dd($data);
        return [
            'training' => $data,
            'kriteria' => array_merge($kriteria, ['label']),
        ];
    }
    private function setDistribusiLabel($training, $label)
    {

        try {

            $distributionLabel = [];
            foreach ($label as $item) {
                $distributionLabel[$item] = [];
            }

            foreach ($training as $row) {
                $distributionLabel[$row['label']][] = $row;
            }

            return $distributionLabel;
        } catch (\Exception $e) {
            return [];
        }
    }
}
