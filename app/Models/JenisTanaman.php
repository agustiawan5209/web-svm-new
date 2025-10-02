<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JenisTanaman extends Model
{
    /** @use HasFactory<\Database\Factories\JenisTanamanFactory> */
    use HasFactory;

    protected $fillable = [
        'nama',
        'deskripsi',
    ];

}
