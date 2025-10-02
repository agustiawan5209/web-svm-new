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
        Schema::create('pemeriksaans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable();
            $table->string('rme')->unique()->nullable();
            $table->string('nik', 50)->index();
            $table->foreignId('pasien_id')->constrained('users')->onDelete('cascade');
            $table->json('data_pasien')->nullable();
            $table->date('tgl_pemeriksaan');
            $table->json('data_pemeriksaan');
            $table->text('rekomendasi')->nullable();
            $table->string('label', 50)->nullable();
            $table->text('keterangan')->nullable();
            $table->json('statusGizi')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pemeriksaans');
    }
};
