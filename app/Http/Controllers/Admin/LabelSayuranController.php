<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Label;
use App\Models\LabelSayuran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreLabelSayuranRequest;
use App\Http\Requests\UpdateLabelSayuranRequest;

class LabelSayuranController extends Controller
{
    private const BASE_BREADCRUMB = [
        [
            'title' => 'dashboard',
            'href' => '/dashboard',
        ],
        [
            'title' => 'labelSayuran',
            'href' => '/admin/labelSayuran/',
        ],
    ];

    public function getDataByLabel($label)
    {
        $labelSayuran = LabelSayuran::whereHas('label', function ($query) use ($label) {
            $query->where('nama', 'like', '%' . $label . '%');
        })->with(['label'])->get();
        if ($labelSayuran->count() > 0) {
            return $labelSayuran;
        } else {
            return [];
        }
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render("admin/label-sayuran/index", [
            'listLabelSayuran' => LabelSayuran::with(['label'])->orderBy('id', 'desc')->get(),
            'labelSayuran' => LabelSayuran::orderBy('id', 'desc')->get(),
            'label' => Label::orderBy('id', 'desc')->get(),
            'breadcrumb' => self::BASE_BREADCRUMB,
            'titlePage' => 'LabelSayuran',
            'can' => [
                'add' => Auth::user()->can('add label'),
                'edit' => Auth::user()->can('edit label'),
                'read' => Auth::user()->can('read label'),
                'delete' => Auth::user()->can('delete label'),
            ],
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/labelSayuran/create', [
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'tambah labelSayuran',
                    'href' => '/admin/labelSayuran/create',
                ]
            ]),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLabelSayuranRequest $request): \Illuminate\Http\RedirectResponse
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => LabelSayuran::create($request->validated()),
            successMessage: 'labelSayuran Berhasil Ditambahkan!',
            redirectRoute: 'admin.labelSayuran.index'
        );
    }


    /**
     * Display the specified resource.
     */
    public function show(LabelSayuran $labelSayuran)
    {
        return Inertia::render('admin/labelSayuran/show', [
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'detail labelSayuran',
                    'href' => '/admin/labelSayuran/detail',
                ]
            ]),
            'labelSayuran' => $labelSayuran,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LabelSayuran $labelSayuran)
    {
        return Inertia::render('admin/labelSayuran/edit', [
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'edit labelSayuran',
                    'href' => '/admin/labelSayuran/edit',
                ]
            ]),
            'labelSayuran' => $labelSayuran
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLabelSayuranRequest $request, LabelSayuran $labelSayuran)
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => $labelSayuran->update($request->validated()),
            successMessage: 'labelSayuran Berhasil Di Update!',
            redirectRoute: 'admin.labelSayuran.index'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LabelSayuran $labelSayuran)
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => $labelSayuran->delete(),
            successMessage: 'labelSayuran Berhasil Di Hapus!',
            redirectRoute: 'admin.labelSayuran.index'
        );
    }
}
