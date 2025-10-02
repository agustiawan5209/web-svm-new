<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('detail_datasets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kriteria_id')->constrained('kriterias')->cascadeOnDelete();
            $table->foreignId('dataset_id')->constrained('datasets')->cascadeOnDelete();
            $table->string('nilai', 30)->comment('berupa nilai string dan number');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_datasets');
    }
};
