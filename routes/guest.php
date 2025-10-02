<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Guest\DashboardController;
use App\Http\Controllers\Guest\KlasifikasiController;
use App\Http\Controllers\RiwayatKlasifikasiController;

Route::middleware(['auth', 'verified', 'role:user'])->group(function () {
    Route::group(['prefix' => 'user', 'as' => 'guest.'], function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');


        Route::group(['prefix' => 'klasifikasi', 'as' => 'klasifikasi.'], function () {
            Route::controller(KlasifikasiController::class)->group(function () {
                // Show all pemeriksaans
                Route::get('/', 'index')->name('index');
                // Create a pemeriksaan
                Route::get('/create-id', 'createById')->name('create-id');

                // Edit a pemeriksaan
                Route::get('/edit/{pemeriksaan}', 'edit')->name('edit');
                // Show a pemeriksaan
                Route::get('/show/{pemeriksaan}', 'show')->name('show');

                // Store a pemeriksaan
                Route::post('/store', 'store')->name('store');
                // Update a pemeriksaan
                Route::put('/update/{pemeriksaan}', 'update')->name('update');
                // Delete a pemeriksaan
                Route::delete('/destroy/{pemeriksaan}', 'destroy')->name('destroy');
            });
        });
    });
});

// Route for decision tree model
