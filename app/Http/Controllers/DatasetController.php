<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Dataset;
use App\Models\Kriteria;
use Illuminate\Support\Facades\App;
use App\Http\Requests\StoreDatasetRequest;
use App\Http\Requests\UpdateDatasetRequest;
use App\Models\DetailDataset;
use App\Models\JenisTanaman;
use App\Models\Label;
use Illuminate\Http\Request;

class DatasetController extends Controller
{
    private const BASE_BREADCRUMB = [
        [
            'title' => 'dashboard',
            'href' => '/dashboard',
        ],
        [
            'title' => 'dataset',
            'href' => '/admin/dataset/',
        ],
    ];
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $datasets = Dataset::query();

        if ($request->filled('orderBy')) {
            $datasets->where('label', $request->orderBy);
        }
        $datasets->with(['detail', 'detail.kriteria']);

        $datasets = $datasets->paginate(10);
        return Inertia::render("admin/dataset/index", [
            "dataset" => $datasets,
            "kriteria" => Kriteria::orderBy('id', 'asc')->get(),
            "breadcrumb" => self::BASE_BREADCRUMB,
            "opsiLabel" => Label::orderBy('id', 'desc')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("admin/dataset/create", [
            'kriteria' => Kriteria::all(),
            'jenisTanaman' => JenisTanaman::all(),
            "opsiLabel" => Label::orderBy('id', 'desc')->get(),
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                ['title' => 'tambah', 'href' => '/admin/dataset/create'],
            ])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDatasetRequest $request)
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => $this->addDataset($request->validated()),
            successMessage: 'Dataset Berhasil Ditambahkan!',
            redirectRoute: 'admin.dataset.index'
        );
    }

    private function addDataset($request)
    {
        $dataset = new Dataset();
        $dataset->label = $request['label'];
        $dataset->data = json_encode($request['attribut']);
        $dataset->save();

        for ($i = 0; $i < count($request['attribut']); $i++) {
            $attribut =  $request['attribut'][$i];

            DetailDataset::create([
                'kriteria_id' =>  $attribut['kriteria_id'],
                'dataset_id' =>  $dataset->id,
                'nilai' =>  $attribut['nilai'],
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Dataset $dataset)
    {
        $dataset->load(['detail', 'detail.kriteria']);
        return Inertia::render('admin/dataset/show', [
            'dataset' => $dataset,
            'breadrumb' => array_merge(self::BASE_BREADCRUMB, [[
                "title" => 'detail',
                'href' => 'admin/dataset/show',
            ]])
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Dataset $dataset)
    {
        $dataset->load(['detail', 'detail.kriteria']);
        return Inertia::render('admin/dataset/edit', [
            'dataset' => $dataset,
            'kriteria' => Kriteria::all(),
            "opsiLabel" => Label::orderBy('id', 'desc')->get(),
            'jenisTanaman' => JenisTanaman::all(),
            'breadrumb' => array_merge(self::BASE_BREADCRUMB, [[
                "title" => 'edit',
                'href' => 'admin/dataset/edit',
            ]])
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDatasetRequest $request, Dataset $dataset)
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => $this->editDataset($request->validated(), $dataset),
            successMessage: 'Dataset Berhasil Di Ubah!',
            redirectRoute: 'admin.dataset.index'
        );
    }

    private function editDataset($request, $dataset)
    {
        $dataset->label = $request['label'];
        $dataset->data = json_encode($request['attribut']);
        $dataset->save();

        DetailDataset::where('dataset_id', $dataset->id)->delete();

        for ($i = 0; $i < count($request['attribut']); $i++) {
            $attribut =  $request['attribut'][$i];

            DetailDataset::create([
                'kriteria_id' =>  $attribut['kriteria_id'],
                'dataset_id' =>  $dataset->id,
                'nilai' =>  $attribut['nilai'],
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dataset $dataset)
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => $dataset->delete(),
            successMessage: 'Kategori Berhasil Di Hapus!',
            redirectRoute: 'admin.dataset.index'
        );
    }
}
