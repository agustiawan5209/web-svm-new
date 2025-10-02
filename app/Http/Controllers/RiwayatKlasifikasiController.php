<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Kriteria;
use App\Models\Pemeriksaan;
use Illuminate\Http\Request;
use App\Models\DetailPemeriksaan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StorePemeriksaanRequest;
use App\Http\Requests\UpdatePemeriksaanRequest;
use App\Models\Label;

class RiwayatKlasifikasiController extends Controller
{

    private const BASE_BREADCRUMB = [
        [
            'title' => 'dashboard',
            'href' => '/dashboard',
        ],
        [
            'title' => 'data pemeriksaan',
            'href' => '/pemeriksaan/',
        ],
    ];


    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $statusLabel = Label::pluck('nama')->toArray();
        $pemeriksaanQuery = Pemeriksaan::with([
            'user',
            'detailpemeriksaan',
            'detailpemeriksaan.kriteria',
        ]);
        $pemeriksaanQuery->where('user_id', '!=', Auth::user()->id);

        // Apply filters
        $this->applyFilters($pemeriksaanQuery, $request);

        $pemeriksaan = $pemeriksaanQuery->paginate($request->input('per_page', 10));

        return Inertia::render('admin/riwayat/index', [
            'pemeriksaan' => $pemeriksaan,
            'breadcrumb' => self::BASE_BREADCRUMB,
            'filter' => $request->only('search', 'order_by', 'date', 'q'),
            'statusLabel' => $statusLabel,
            'kriteria' => Kriteria::orderBy('id', 'asc')->get(),
            'can' => [
                'add' => auth()->user()->can('add dataset'),
                'edit' => auth()->user()->can('edit dataset'),
                'delete' => auth()->user()->can('delete dataset'),
                'read' => auth()->user()->can('read dataset'),
            ]
        ]);
    }

    /**
     * Apply filters to the query
     */
    private function applyFilters($query, Request $request): void
    {
        $statusLabel = Label::pluck('nama')->toArray();


        if ($request->filled('date')) {
            $query->searchByTanggal(Carbon::parse($request->date));
        }

        if (in_array($request->input('order_by'), ['asc', 'desc'])) {
            $query->orderBy('created_at', $request->input('order_by'));
        } elseif (in_array($request->input('order_by'), ['A-Z', 'Z-A'])) {
            $direction = $request->input('order_by') === 'A-Z' ? 'asc' : 'desc';
            $query->orderBy('label', $direction);
        } elseif (in_array($request->input('order_by'), $statusLabel)) {
            $query->where('label', $request->input('order_by'));
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Pemeriksaan $pemeriksaan)
    {
        $pemeriksaan->load([
            'user',
            'pasienpemeriksaan',
            'pasienpemeriksaan.detailpemeriksaan',
            'detailpemeriksaan',
            'detailpemeriksaan.kriteria',
        ]);

        return Inertia::render('admin/riwayat/show', [
            'pemeriksaan' => $pemeriksaan,
            'user' => $pemeriksaan->user,
            'detail' => $pemeriksaan->detailpemeriksaan,
            'dataPemeriksaanPasien' => $pemeriksaan->user->pemeriksaan,
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'detail pemeriksaan',
                    'href' => '/pemeriksaan/show',
                ],
            ]),
            'kriteria' => Kriteria::orderBy('id', 'asc')->get(),
        ]);
    }
}
