<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModelStorage extends Model
{
    protected $table = "model_storages"; // Define the table name if different from the default
    protected $fillable = [
        'model_path', // Assuming this is where the model data is stored
        'weights', // Assuming this is where the model data is stored
        'metadata',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'model_path' => 'array', // Cast the JSON column to an array
        'weights' => 'array', // Cast the JSON column to an array
        'metadata' => 'array', // Cast the JSON column to an array
    ];
}
