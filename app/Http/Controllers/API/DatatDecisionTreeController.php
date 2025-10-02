<?php

namespace App\Http\Controllers\API;

use App\Models\Label;
use App\Models\Dataset;
use App\Models\Kriteria;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DatatDecisionTreeController extends Controller
{
    public function getData()
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
                $row->label,
            ]);
        }
        return [
            'training' => array_values($data),
            'kriteria' => array_merge($kriteria, ['label']),
            "label" => Label::orderBy('id', 'desc')->get(),
        ];
    }
}
