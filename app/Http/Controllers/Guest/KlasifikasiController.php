<?php

namespace App\Http\Controllers\Guest;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Label;
use App\Models\Pasien;
use App\Models\Kriteria;
use App\Models\Pemeriksaan;
use Illuminate\Http\Request;
use App\Models\DetailPemeriksaan;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StorePemeriksaanRequest;
use App\Http\Requests\UpdatePemeriksaanRequest;

class KlasifikasiController extends Controller
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
            'pasien',
            'detailpemeriksaan',
            'detailpemeriksaan.kriteria',
        ]);
        $pemeriksaanQuery->where('user_id', '=', Auth::user()->id);

        // Apply filters
        $this->applyFilters($pemeriksaanQuery, $request);

        $pemeriksaan = $pemeriksaanQuery->orderBy('id', 'desc')->paginate(10);

        return Inertia::render('guest/pemeriksaan/index', [
            'pemeriksaan' => $pemeriksaan,
            'breadcrumb' => self::BASE_BREADCRUMB,
            'filter' => $request->only('search', 'order_by', 'date', 'q'),
            'statusLabel' => $statusLabel,
            'kriteria' => Kriteria::orderBy('id', 'asc')->get(),
            'can' => [
                'add' => auth()->user()->can('add pemeriksaan'),
                'edit' => auth()->user()->can('edit pemeriksaan'),
                'delete' => auth()->user()->can('delete pemeriksaan'),
                'read' => auth()->user()->can('read pemeriksaan'),
            ]
        ]);
    }

    /**
     * Apply filters to the query
     */
    private function applyFilters($query, Request $request): void
    {
        $statusLabel = Label::pluck('nama')->toArray();
        if ($request->filled('q')) {
            $query->searchByUser($request->input('q'));
        }

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
     * Show the form for creating a new resource.
     */

    public function createById(Request $request)
    {
        $statusLabel = Label::pluck('nama')->toArray();
        return Inertia::render('guest/pemeriksaan/create-id', [
            'kriteria' => Kriteria::orderBy('id')
                ->whereNotIn('nama', ['status'])
                ->get(),
            'pasien' => Pasien::orderBy('id')->with(['user'])->get(),
            'label' => array_map(fn($label) => ['nama' => $label], $statusLabel),
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'tambah pemeriksaan',
                    'href' => '/pemeriksaan/create',
                ],
            ]),
        ]);
    }


    public function store(StorePemeriksaanRequest $request)
    {
        // Validate the request

        try {
            $pasienData = $request->except('kriteria', 'tanggal_pemeriksaan');

            $existingUserWithNama = Pasien::where('nama', '=', $request->nama)->where('user_id', '=', $request->user_id)->first();
            if ($existingUserWithNama) {
                $pasien = $existingUserWithNama;
            } else {

                $pasien = Pasien::create($pasienData);
            }

            $pemeriksaanData = [
                'user_id' => Auth::user()->id,
                'pasien_id' => $pasien->id,
                'data_pasien' => $pasien,
                'data_pemeriksaan' => $request->input('kriteria'),
                'tgl_pemeriksaan' => $request->input('tanggal_pemeriksaan'),
                'label' => $request->input('label'),
                'rekomendasi' => $request->input('rekomendasi'),
            ];
            $pemeriksaan = Pemeriksaan::create($pemeriksaanData);

            $this->createDetailPemeriksaan($pemeriksaan, $request->input('kriteria'), $pasien->jenis_kelamin, $request->input('label'));

            return redirect()->route('guest.klasifiksi.index')->with('success', 'Data pemeriksaan berhasil ditambahkan!');
        } catch (\Exception $exception) {
            $pemeriksaan = Pemeriksaan::latest()->first();
            if ($pemeriksaan) {
                $pemeriksaan->delete();
            }
            return redirect()
                ->route('pemeriksaan.create-id')
                ->with('error', $exception->getMessage());
        }
    }

    /**
     * Create detail pemeriksaan records
     */
    private function createDetailPemeriksaan(Pemeriksaan $pemeriksaan, array $kriteria, string $jenisKelamin, $label): void
    {
        $detailRecords = array_map(function ($item) use ($pemeriksaan) {
            return [
                'pemeriksaan_id' => $pemeriksaan->id,
                'kriteria_id' => $item['kriteria_id'],
                'nilai' => $item['nilai'],
            ];
        }, $kriteria);

        // Add jenis kelamin kriteriae if exists
        if ($jenkelKriteria = Kriteria::where('nama', 'like', '%jenis kelamin%')->first()) {
            $detailRecords[] = [
                'pemeriksaan_id' => $pemeriksaan->id,
                'kriteria_id' => $jenkelKriteria->id,
                'nilai' => $jenisKelamin,
            ];
        }
        if ($statusKriteria = Kriteria::where('nama', 'like', '%status%')->first()) {
            $detailRecords[] = [
                'pemeriksaan_id' => $pemeriksaan->id,
                'kriteria_id' => $statusKriteria->id,
                'nilai' => $label,
            ];
        }

        DetailPemeriksaan::insert($detailRecords);
    }


    /**
     * Display the specified resource.
     */
    public function show(Pemeriksaan $pemeriksaan)
    {
        $pemeriksaan->load([
            'pasien',
            'pasien.pemeriksaan',
            'pasien.pemeriksaan.detailpemeriksaan',
            'detailpemeriksaan',
            'detailpemeriksaan.kriteria',
        ]);

        return Inertia::render('guest/pemeriksaan/show', [
            'pemeriksaan' => $pemeriksaan,
            'pasien' => $pemeriksaan->pasien,
            'detail' => $pemeriksaan->detailpemeriksaan,
            'dataPemeriksaanPasien' => $pemeriksaan->pasien->pemeriksaan,
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'detail pemeriksaan',
                    'href' => '/pemeriksaan/show',
                ],
            ]),
            'kriteria' => Kriteria::orderBy('id', 'asc')->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pemeriksaan $pemeriksaan)
    {
        $statusLabel = Label::pluck('nama')->toArray();
        return Inertia::render('guest/pemeriksaan/edit', [
            'kriteria' => Kriteria::orderBy('id')->get(),
            'label' => array_map(fn($label) => ['nama' => $label], $statusLabel),
            'pemeriksaan' => $pemeriksaan,
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'edit pemeriksaan',
                    'href' => '/pemeriksaan/edit',
                ],
            ]),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePemeriksaanRequest $request, Pemeriksaan $pemeriksaan)
    {
        DB::transaction(function () use ($request, $pemeriksaan) {
            $pemeriksaan->update([
                'data_pemeriksaan' => $request->input('kriteria'),
                'tgl_pemeriksaan' => $request->input('tgl_pemeriksaan'),
                'label' => $request->input('label'),
            ]);

            DetailPemeriksaan::where('pemeriksaan_id', $pemeriksaan->id)->delete();

            $detailRecords = array_map(function ($kriteriaId, $nilai) use ($pemeriksaan) {
                return [
                    'pemeriksaan_id' => $pemeriksaan->id,
                    'kriteria_id' => $kriteriaId,
                    'nilai' => $nilai,
                ];
            }, array_keys($request->kriteria), $request->kriteria);

            DetailPemeriksaan::insert($detailRecords);
        });

        return redirect()
            ->route('guest.klasifikasi.index')
            ->with('success', 'Data pemeriksaan berhasil diupdate!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pemeriksaan $pemeriksaan)
    {
        $pemeriksaan->delete();


        return redirect()
            ->route('guest.klasifikasi.index')
            ->with('success', 'Data pemeriksaan berhasil dihapus!');
    }
}
