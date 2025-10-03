<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Pasien;
use Illuminate\Http\Request;
use App\Http\Requests\StorePasienRequest;
use App\Http\Requests\UpdatePasienRequest;
use App\Models\Kriteria;

class PasienController extends Controller
{
    private const BASE_BREADCRUMB = [
        [
            'title' => 'dashboard',
            'href' => '/dashboard',
        ],
        [
            'title' => 'data pasien',
            'href' => '/pasien/',
        ],
    ];

    public function getByNik($nik)
    {
        $pasien = Pasien::where('nik', '=', $nik)->with('user')->first();

        if ($pasien) {
            return response()->json($pasien, 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Pasien not found'
            ], 404);
        }
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Pasien::query();

        if ($request->filled('q')) {
            $query->searchByNama($request->input('q', ''));
        }

        if ($request->filled('order_by')) {
            $orderBy = $request->input('order_by');
            if (in_array($orderBy, ['asc', 'desc'])) {
                $query->orderBy('created_at', $orderBy);
            } else if (in_array($orderBy, ['A-Z', 'Z-A'])) {
                if ($orderBy == 'A-Z') {
                    $query->orderBy('name', 'asc');
                } else {
                    $query->orderBy('name', 'desc');
                }
            } else if (in_array($orderBy, ['Laki-laki', 'Perempuan'])) {
                $query->searchByJenkel($orderBy);
            } else {
                // Handle invalid order_by value
                return redirect()->back()->withErrors(['order_by' => 'Invalid order_by value']);
            }
        }

        try {
            $pasien = $query->with(['user'])->paginate($request->input('per_page', 10));
        } catch (\Exception $e) {
            // Handle pagination error
            return redirect()->back()->withErrors(['pagination' => 'Pagination failed: ' . $e->getMessage()]);
        }

        return Inertia::render('admin/pasien/index', [
            'pasien' => $pasien,
            'breadcrumb' => self::BASE_BREADCRUMB,
            'filter' => $request->only('q'),
            'can' => [
                'add' => auth()->user()->can('add pasien'),
                'edit' => auth()->user()->can('edit pasien'),
                'delete' => auth()->user()->can('delete pasien'),
                'read' => auth()->user()->can('read pasien'),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/pasien/form', [
            'user' => User::withoutRole(['admin', 'super_admin'])->get(),
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'tambah data',
                    'href' => '/pasien/create',
                ],
            ])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePasienRequest $request)
    {
        $pasien = Pasien::create($request->all());
        return redirect()->route('pasien.index')->with('success', 'Pasien berhasil ditambahkan!!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Pasien $pasien)
    {
        $pasien->load(['user', 'pemeriksaan', 'pemeriksaan.detailpemeriksaan']);
        return Inertia::render('admin/pasien/show', [
            'pasien' => $pasien,
            'pemeriksaan' => $pasien->pemeriksaan,
            'kriteria' => Kriteria::orderBy('id', 'asc')->get(),
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'detail data',
                    'href' => '/pasien/show',
                ],
            ])
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pasien $pasien)
    {
        $pasien->load(['user']);
        return Inertia::render('admin/pasien/form', [
            'pasien' => $pasien,
            'user' => User::withoutRole('admin')->get(),
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'edit data',
                    'href' => '/pasien/edit',
                ],
            ])
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePasienRequest $request, Pasien $pasien)
    {
        $pasien->update($request->all());
        return redirect()->route('pasien.index')->with('success', 'Pasien berhasil diupdate!!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pasien $pasien)
    {
        $pasien->delete();
        return redirect()->route('pasien.index')->with('success', 'Pasien berhasil dihapus!!');
    }
}
