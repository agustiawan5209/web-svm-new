<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Label;
use App\Models\Dataset;
use App\Models\Kriteria;
use App\Models\JenisTanaman;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public function index()
    {
        // dd(Label::orderBy('id', 'desc')->get());
        $label = Label::select('nama')->orderBy('id', 'asc')->get()->pluck('nama')->toArray();

        $data = $this->getData();
        $training = collect($data['training']);
        $kriteria = $data['kriteria'];
        $distributionLabel = $this->setDistribusiLabel($training, $label);
        return Inertia::render("dashboard", [
            "distributionLabel" => $distributionLabel,
            "training" => count($training),
            "kriteria" => count($kriteria),
            "label" => Label::orderBy('id', 'desc')->get(),
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
