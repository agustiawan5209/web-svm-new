<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Label;
use App\Models\Dataset;
use App\Models\Kriteria;
use App\Models\JenisTanaman;
use App\Models\ModelStorage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Validator;

class ModelStorageController extends Controller
{
    private const BASE_BREADCRUMB = [
        [
            'title' => 'dashboard',
            'href' => '/dashboard',
        ],
        [
            'title' => 'model-storage',
            'href' => '/admin/model-storage/',
        ],
    ];
    public function train(array $data): void
    {
        // Logic to train the Support Vector Machine model with the provided data
    }

    public function index(Request $request)
    {
        // Handle the request to display the Support Vector Machine model index page
        // dd($this->getData());
        return Inertia::render('ModelStorage/Index', [
            'dataTraining' => $this->getData(),
            "kriteria" => Kriteria::all(),
            "jenisTanaman" => JenisTanaman::all(),
            "opsiLabel" => Label::orderBy('id', 'desc')->get(),
            'breadcrumb' => self::BASE_BREADCRUMB,
            'titlePage' => 'ModelStorage',
            'can' => [
                'add' => true,
                'edit' => true,
                'show' => true,
                'delete' => true,
            ]
        ]);
    }
    public function sample(Request $request)
    {
        // Handle the request to display the Support Vector Machine model index page
        // dd($this->getData());
        return Inertia::render('ModelStorage/sample', [
            'dataTraining' => $this->getData(),
            "kriteria" => Kriteria::all(),
            "jenisTanaman" => JenisTanaman::all(),
            "opsiLabel" => Label::orderBy('id', 'desc')->get(),
            'breadcrumb' => self::BASE_BREADCRUMB,
            'titlePage' => 'ModelStorage',
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
        // Logic to retrieve data for the Support Vector Machine model

        $data = [];
        $dataset = Dataset::with(['detail', 'detail.kriteria'])->orderBy('id', 'desc')->get();
        $kriteria = Kriteria::select('nama')->orderBy('id', 'asc')->get()->pluck('nama')->toArray();

        foreach ($dataset as $row) {
            $attribut = [];
            foreach ($row->detail as $key => $detail) {
                if (strtolower($detail->kriteria->nama) == 'jenis kelamin') {
                    $attribut[$key] = strtolower($detail->nilai) == 'laki-laki' ? 0 : 1;
                } elseif (strtolower($detail->kriteria->nama) == 'pola makan') {
                    switch (strtolower($detail->nilai)) {
                        case 'kurang':
                            $attribut[$key] = 0;
                            break;
                        case 'sedang':
                            $attribut[$key] = 1;
                            break;
                        default:
                            $attribut[$key] = 2;
                            break;
                    }
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

    public function store(Request $request)
    {

        $valid = Validator::make($request->all(), [
            'model' => 'required'
        ]);

        if ($valid->fails()) {
            return response()->json([
                'error' => $valid->errors()->first(),
                'status' => 100,
            ]);
        }

        ModelStorage::updateOrCreate(
            ['model_path' => $request->model],
            [
                'model_path' => $request->model,
                'weights' => $request->weights
            ]

        );

        return response()->json([
            'status' => true,
            'message' => 'Model berhasil disimpan'
        ]);
    }

    public function getModel()
    {
        $model = ModelStorage::latest()->first();
        if ($model) {
            return response()->json([
                'model' => $model->model_path,
                'weights' => $model->weights,
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
