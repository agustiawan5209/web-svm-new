<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dataset extends Model
{
    /** @use HasFactory<\Database\Factories\DatasetFactory> */
    use HasFactory;

    protected $fillable = [
        'data',
        'label',
    ];

    protected $casts = [
        'data'=> 'json',
        'created_at'=> 'datetime',
    ];

    public function detail(){
        return $this->hasMany(DetailDataset::class, 'dataset_id', 'id');
    }
}
