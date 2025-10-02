<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pemeriksaan extends Model
{
    /** @use HasFactory<\Database\Factories\PemeriksaanFactory> */
    use HasFactory;

    protected $fillable = [
        "user_id",
        "pasien_id",
        "rme",
        "nik",
        "data_pasien",
        "tgl_pemeriksaan",
        "data_pemeriksaan",
        "label",
        "rekomendasi",
        "statusGizi",
    ];

    protected $casts = [
        'data_pasien' => 'array',
        'statusGizi' => 'array',
        'data_pemeriksaan' => 'array',
        'rekomendasi' => 'array',

    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function pasien()
    {
        return $this->belongsTo(Pasien::class);
    }

    public function detailpemeriksaan()
    {
        return $this->hasMany(DetailPemeriksaan::class, 'pemeriksaan_id', 'id');
    }


    public function scopeSearchByPasien($query, $search)
    {
        $query->when($search ?? null, function ($query, $search) {
            $query->whereHas('pasien', function ($query) use ($search) {
                $query->where('nama', 'like', '%' . $search . '%')
                    ->orWhere('nik', 'like', '%' . $search . '%');
            });
        });
    }
    public function scopeSearchByJenkel($query, $jenkel)
    {
        $query->when($jenkel ?? null, function ($query, $jenkel) {
            $query->whereHas('user', function ($query) use ($jenkel) {
                $query->where('jenis_kelamin', $jenkel);
            });
        });
    }


    /**
     * Scope a query to search by examination date.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string|null  $tanggal
     * @return void
     */

    public function scopeSearchByTanggal($query, $tanggal)
    {
        $query->when($tanggal, function ($query, $tanggal) {
            $query->whereDate('tgl_pemeriksaan', $tanggal);
        });
    }
    /**
     * Scope a query to search by label.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string|null  $label
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearchByLabel($query, $label)
    {
        $query->when($label, function ($query, $label) {
            $query->where('label', 'LIKE', '%' . $label . '%');
        });
    }


    /**
     * Scope a query to search by name and gender.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string|null  $nama
     * @param  string|null  $jenkel
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearchByNamaJenkel($query, $nama, $jenkel)
    {
        $query->when($nama ?? null, function ($query, $nama) {
            $query->whereJsonContains('data_pasien->nama', $nama);
        });
        $query->when($jenkel ?? null, function ($query, $jenkel) {
            $query->whereJsonContains('data_pasien->jenis_kelamin', $jenkel);
        });
    }
}
