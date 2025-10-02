<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Label;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreLabelRequest;
use App\Http\Requests\UpdateLabelRequest;

class LabelController extends Controller
{
    private const BASE_BREADCRUMB = [
        [
            'title' => 'dashboard',
            'href' => '/dashboard',
        ],
        [
            'title' => 'label',
            'href' => '/admin/label/',
        ],
    ];
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render("admin/label/index", [
            'label' => Label::orderBy('id', 'desc')->get(),
            'breadcrumb' => self::BASE_BREADCRUMB,
            'titlePage' => 'Label',
            'can' => [
                'add' => Auth::user()->can('add label'),
                'edit' => Auth::user()->can('edit label'),
                'read' => Auth::user()->can('read label'),
                'delete' => Auth::user()->can('delete label'),
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
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/label/create', [
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'tambah label',
                    'href' => '/admin/label/create',
                ]
            ]),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLabelRequest $request): \Illuminate\Http\RedirectResponse
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => Label::create([
                'nama' => $request->nama,
                'deskripsi' => $request->deskripsi,
            ]),
            successMessage: 'Kategori Berhasil Ditambahkan!',
            redirectRoute: 'admin.label.index'
        );
    }


    /**
     * Display the specified resource.
     */
    public function show(Label $label)
    {
        return Inertia::render('admin/label/show', [
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'detail label',
                    'href' => '/admin/label/detail',
                ]
            ]),
            'label' => $label,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Label $label)
    {
        return Inertia::render('admin/label/edit', [
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'edit label',
                    'href' => '/admin/label/edit',
                ]
            ]),
            'label' => $label
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLabelRequest $request, Label $label)
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => $label->update([
                'nama' => $request->nama,
                'deskripsi' => $request->deskripsi,
            ]),
            successMessage: 'Kategori Berhasil Di Update!',
            redirectRoute: 'admin.label.index'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Label $label)
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => $label->delete(),
            successMessage: 'Kategori Berhasil Di Hapus!',
            redirectRoute: 'admin.label.index'
        );
    }
}
