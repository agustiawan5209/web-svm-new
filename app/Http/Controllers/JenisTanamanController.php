<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\JenisTanaman;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreJenisTanamanRequest;
use App\Http\Requests\UpdateJenisTanamanRequest;

class JenisTanamanController extends Controller
{
    private const BASE_BREADCRUMB = [
        [
            'title' => 'dashboard',
            'href' => '/dashboard',
        ],
        [
            'title' => 'jenisTanaman',
            'href' => '/admin/jenisTanaman/',
        ],
    ];
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render("admin/jenisTanaman/index", [
            'jenisTanaman' => JenisTanaman::all(),
            'breadcrumb' => self::BASE_BREADCRUMB,
            'titlePage' => 'JenisTanaman',
            'can' => [
                'add' => Auth::user()->can('add jenis_tanaman'),
                'edit' => Auth::user()->can('edit jenis_tanaman'),
                'read' => Auth::user()->can('read jenis_tanaman'),
                'delete' => Auth::user()->can('delete jenis_tanaman'),
            ],
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

    public function getSayuran(){
        return response()->json(JenisTanaman::orderBy('id','desc')->get());
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/jenisTanaman/create', [
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
    public function store(StoreJenisTanamanRequest $request): \Illuminate\Http\RedirectResponse
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => JenisTanaman::create([
                'nama' => $request->nama,
                'deskripsi' => $request->deskripsi,
            ]),
            successMessage: 'Kategori Berhasil Ditambahkan!',
            redirectRoute: 'admin.jenisTanaman.index'
        );
    }


    /**
     * Display the specified resource.
     */
    public function show(JenisTanaman $jenisTanaman)
    {
        return Inertia::render('admin/jenisTanaman/show', [
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'detail kategori',
                    'href' => '/admin/kategori/detail',
                ]
            ]),
            'jenisTanaman' => $jenisTanaman,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(JenisTanaman $jenisTanaman)
    {
        return Inertia::render('admin/jenisTanaman/edit', [
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'edit kategori',
                    'href' => '/admin/kategori/edit',
                ]
            ]),
            'jenisTanaman' => $jenisTanaman
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateJenisTanamanRequest $request, JenisTanaman $jenisTanaman)
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => $jenisTanaman->update([
                'nama' => $request->nama,
                'deskripsi' => $request->deskripsi,
            ]),
            successMessage: 'Kategori Berhasil Di Update!',
            redirectRoute: 'admin.jenisTanaman.index'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JenisTanaman $jenisTanaman)
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => $jenisTanaman->delete(),
            successMessage: 'Kategori Berhasil Di Hapus!',
            redirectRoute: 'admin.jenisTanaman.index'
        );
    }
}
