<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModelStorage extends Model
{
    protected $table = "model_storages"; // Define the table name if different from the default
    protected $fillable = [
        'model_path', // Assuming this is where the model data is stored
        'created_at',
        'updated_at',
    ];
}
