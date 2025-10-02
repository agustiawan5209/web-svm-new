<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LabelSayuran extends Model
{
    /** @use HasFactory<\Database\Factories\LabelSayuranFactory> */
    use HasFactory;

    protected $fillable = [
        'label_id',
        'sayuran',
        'porsi',
        'tekstur',
        'frekuensi',
    ];

    public function label()
    {
        return $this->hasOne(Label::class, 'id', 'label_id');
    }
}
