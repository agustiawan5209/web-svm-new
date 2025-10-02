<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Dataset;
use App\Models\Kriteria;
use Illuminate\Http\Request;
use App\Models\DetailDataset;
use Illuminate\Support\Facades\App;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreKriteriaRequest;
use App\Http\Requests\UpdateKriteriaRequest;

class KriteriaController extends Controller
{
    private const BASE_BREADCRUMB = [
        [
            'title' => 'dashboard',
            'href' => '/dashboard',
        ],
        [
            'title' => 'kriteria',
            'href' => '/admin/kriteria/',
        ],
    ];
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render("admin/kriteria/index", [
            'kriteria' => Kriteria::all(),
            'breadcrumb' => self::BASE_BREADCRUMB,
            'titlePage' => 'Kriteria',
        ]);
    }
    private function applyFilters($query, Request $request): void
    {
        if ($request->filled('q')) {
            $query->searchByName($request->input('q'));
        }
        if ($request->filled('category')) {
            $query->searchByCategory($request->input('category'));
        }

        if (in_array($request->input('order_by'), ['asc', 'desc'])) {
            $query->orderBy('created_at', $request->input('order_by'));
        } elseif (in_array($request->input('order_by'), ['A-Z', 'Z-A'])) {
            $direction = $request->input('order_by') === 'A-Z' ? 'asc' : 'desc';
            $query->orderBy('name', $direction);
        }

        $sortField = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/kriteria/create', [
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'tambah kategori',
                    'href' => '/admin/kategori/create',
                ]
            ]),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreKriteriaRequest $request): \Illuminate\Http\RedirectResponse
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => $this->addStore($request),
            successMessage: 'Kategori Berhasil Ditambahkan!',
            redirectRoute: 'admin.kriteria.index'
        );
    }

    public function addStore($request)
    {
        $kriteria = Kriteria::create([
            'nama' => $request->nama,
            'deskripsi' => $request->deskripsi,
        ]);

        $dataset = Dataset::all();

        foreach ($dataset as $val) {
            DetailDataset::create([
                'kriteria_id' => $kriteria->id,
                'dataset_id' => $val->id,
                'nilai' => 0,
            ]);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Kriteria $kriteria)
    {
        return Inertia::render('admin/kriteria/show', [
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'detail kategori',
                    'href' => '/admin/kategori/detail',
                ]
            ]),
            'kriteria' => $kriteria,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kriteria $kriteria)
    {
        return Inertia::render('admin/kriteria/edit', [
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'edit kategori',
                    'href' => '/admin/kategori/edit',
                ]
            ]),
            'kriteria' => $kriteria
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKriteriaRequest $request, Kriteria $kriteria)
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => $kriteria->update([
                'nama' => $request->nama,
                'deskripsi' => $request->deskripsi,
            ]),
            successMessage: 'Kategori Berhasil Di Update!',
            redirectRoute: 'admin.kriteria.index'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kriteria $kriteria)
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => $kriteria->delete(),
            successMessage: 'Kategori Berhasil Di Hapus!',
            redirectRoute: 'admin.kriteria.index'
        );
    }
}
