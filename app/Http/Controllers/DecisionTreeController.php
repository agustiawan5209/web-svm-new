<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Label;
use App\Models\Dataset;
use App\Models\Kriteria;
use App\Models\JenisTanaman;
use App\Models\DecisionTree;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Validator;

class DecisionTreeController extends Controller
{
    private const BASE_BREADCRUMB = [
        [
            'title' => 'dashboard',
            'href' => '/dashboard',
        ],
        [
            'title' => 'decision-tree',
            'href' => '/admin/decision-tree/',
        ],
    ];
    public function train(array $data): void
    {
        // Logic to train the Decision Tree model with the provided data
    }

    public function index(Request $request)
    {
        // Handle the request to display the Decision Tree model index page
        // dd($this->getData());
        return Inertia::render('DecisionTree/Index', [
            'dataTraining' => $this->getData(),
            "kriteria" => Kriteria::all(),
            "jenisTanaman" => JenisTanaman::all(),
            "opsiLabel" => Label::orderBy('id', 'desc')->get(),
            'breadcrumb' => self::BASE_BREADCRUMB,
            'titlePage' => 'DecisionTree',
            'can' => [
                'add' => true,
                'edit' => true,
                'show' => true,
                'delete' => true,
            ]
        ]);
    }

    public function getData()
    {
        // Logic to retrieve data for the Decision Tree model

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
        // dd($data);
        return [
            'training' => array_values($data),
            'kriteria' => array_merge($kriteria, ['label']),
        ];
    }

    public function store(Request $request)
    {

        $valid = Validator::make($request->all(), [
            'model' => 'required'
        ]);

        if ($valid->fails()) {
            return response()->json([
                'error' => $valid->errors()->first(),
                'status' => false
            ]);
        }

        DecisionTree::updateOrCreate(
            ['model_path' => json_encode($request->model)],
            ['model_path' => json_encode($request->model)]
        );

        return response()->json([
            'status' => true,
            'message' => 'Model berhasil disimpan'
        ]);
    }

    public function getModel()
    {
        $model = DecisionTree::latest()->first();
        if ($model) {
            return response()->json([
                'model' => json_decode($model->model_path),
                'status' => true
            ], 200);
        } else {
            return response()->json([
                'model' => null,
                'status' => false
            ], 500);
        }
    }
}
