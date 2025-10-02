<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailDataset extends Model
{
    //

    protected $table = "detail_datasets";

    protected $fillable = [
        'kriteria_id',
        'dataset_id',
        'nilai',
    ];


    public function dataset()
    {
        return $this->belongsTo(Dataset::class);
    }
    public function kriteria()
    {
        return $this->belongsTo(Kriteria::class);
    }
}
