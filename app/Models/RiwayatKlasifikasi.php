<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiwayatKlasifikasi extends Model
{
    /** @use HasFactory<\Database\Factories\RiwayatKlasifikasiFactory> */
    use HasFactory;

    protected $fillable = [
        "user",
        "label",
        "attribut",
        "kriteria",
    ];

    protected $casts = [
        'attribut' => 'json',
        'kriteria' => 'json',
        'user' => 'json',
    ];
}
