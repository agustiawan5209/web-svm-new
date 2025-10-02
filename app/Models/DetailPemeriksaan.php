<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailPemeriksaan extends Model
{
    protected $table = "detail_pemeriksaans";

    protected $fillable = [
        'pemeriksaan_id',
        'kriteria_id',
        'nilai',
    ];

    public function pemeriksaan(){
        return $this->hasOne(Pemeriksaan::class,'id', 'pemeriksaan_id');
    }
    public function kriteria(){
        return $this->hasOne(Kriteria::class,'id', 'kriteria_id');
    }
}
