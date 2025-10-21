<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PasienController;
use App\Http\Controllers\DatasetController;
use App\Http\Controllers\Admin\LabelController;
use App\Http\Controllers\PemeriksaanController;
use App\Http\Controllers\DecisionTreeController;
use App\Http\Controllers\JenisTanamanController;
use App\Http\Controllers\ModelStorageController;
use App\Http\Controllers\Admin\KriteriaController;
use App\Http\Controllers\Admin\OrangTuaController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\LabelSayuranController;
use App\Http\Controllers\RiwayatKlasifikasiController;
use App\Http\Controllers\API\DatatDecisionTreeController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified', 'role:admin|super_admin'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Routes for managing pasiens
    Route::prefix('pasien')->as('pasien.')->group(function () {
        Route::controller(PasienController::class)->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/create', 'create')->name('create');
            Route::get('/edit/{pasien}', 'edit')->name('edit');
            Route::get('/show/{pasien}', 'show')->name('show');

            Route::post('/store', 'store')->name('store');
            Route::put('/update/{pasien}', 'update')->name('update');
            Route::delete('/destroy/{pasien}', 'destroy')->name('destroy');
        });
    });
    // Routes for managing pemeriksaans
    Route::prefix('pemeriksaan')->as('pemeriksaan.')->group(function () {
        // Dataset controller
        Route::controller(PemeriksaanController::class)->group(function () {
            // Show all pemeriksaans
            Route::get('/', 'index')->name('index');
            // Create a pemeriksaan
            Route::get('/create-id', 'createById')->name('create-id');

            // Edit a pemeriksaan
            Route::get('/edit/{pemeriksaan}', 'edit')->name('edit');
            // Show a pemeriksaan
            Route::get('/show/{pemeriksaan}', 'show')->name('show');

            // Update a pemeriksaan
            Route::put('/update/{pemeriksaan}', 'update')->name('update');
            // Delete a pemeriksaan
            Route::delete('/destroy/{pemeriksaan}', 'destroy')->name('destroy');
        });
    });
    Route::group(['prefix' => 'admin', 'as' => 'admin.'], function () {

        // Routes for managing orangtuas
        Route::prefix('orangtua')->as('orangtua.')->group(function () {
            // Dataset controller
            Route::controller(OrangTuaController::class)->group(function () {
                // Show all orangtuas
                Route::get('/', 'index')->name('index');
                // Create a orangtua
                Route::get('/create', 'create')->name('create');
                // Edit a orangtua
                Route::get('/edit/{user}', 'edit')->name('edit');
                // Show a orangtua
                Route::get('/show/{user}', 'show')->name('show');

                // Store a orangtua
                Route::post('/store', 'store')->name('store');
                // Update a orangtua
                Route::put('/update/{user}', 'update')->name('update');
                // Delete a orangtua
                Route::delete('/destroy/{user}', 'destroy')->name('destroy');
            });
        });
        // Routes for label
        Route::group(['prefix' => 'label', 'as' => 'label.'], function () {
            Route::controller(LabelController::class)->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/create', 'create')->name('create');
                Route::post('/', 'store')->name('store');
                Route::get('/{label}/edit', 'edit')->name('edit');
                Route::put('/{label}', 'update')->name('update');
                Route::delete('/{label}', 'destroy')->name('destroy');
            });
        });
        Route::group(['prefix' => 'label-sayuran', 'as' => 'labelSayuran.'], function () {
            Route::controller(LabelSayuranController::class)->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/create', 'create')->name('create');
                Route::post('/', 'store')->name('store');
                Route::get('/{labelSayuran}/edit', 'edit')->name('edit');
                Route::put('/{labelSayuran}', 'update')->name('update');
                Route::delete('/{labelSayuran}', 'destroy')->name('destroy');
            });
        });

        // Routes for Kriteria
        Route::group(['prefix' => 'kriterias', 'as' => 'kriteria.'], function () {
            Route::controller(KriteriaController::class)->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/create', 'create')->name('create');
                Route::post('/', 'store')->name('store');
                Route::get('/{kriteria}/edit', 'edit')->name('edit');
                Route::put('/{kriteria}', 'update')->name('update');
                Route::delete('/{kriteria}', 'destroy')->name('destroy');
            });
        });

        // Route for Jenis Makanan
        Route::group(['prefix' => 'jenis-tanaman', 'as' => 'jenisTanaman.'], function () {
            Route::controller(JenisTanamanController::class)->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/create', 'create')->name('create');
                Route::post('/', 'store')->name('store');
                Route::get('/{jenisTanaman}/edit', 'edit')->name('edit');
                Route::put('/{jenisTanaman}', 'update')->name('update');
                Route::delete('/{jenisTanaman}', 'destroy')->name('destroy');
            });
        });
        // Route for training dataset
        Route::group(['prefix' => 'dataset', 'as' => 'dataset.'], function () {
            Route::controller(DatasetController::class)->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/create', 'create')->name('create');
                Route::post('/', 'store')->name('store');
                Route::get('/{dataset}/edit', 'edit')->name('edit');
                Route::get('/{dataset}/show', 'show')->name('show');
                Route::put('/{dataset}', 'update')->name('update');
                Route::delete('/{dataset}', 'destroy')->name('destroy');
            });
        });


        Route::group(['prefix' => 'riwayat', 'as' => 'riwayat.'], function () {
            Route::controller(RiwayatKlasifikasiController::class)->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/{pemeriksaan}/show', 'show')->name('show');
                Route::delete('/{pemeriksaan}/show', 'destroy')->name('destroy');
            });
        });
    });
    // Route for decision tree model
    Route::group(['prefix' => 'model-storage', 'as' => 'ModelStorage.'], function () {
        Route::controller(ModelStorageController::class)->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/sample', 'sample')->name('sample');
        });
    });
});

// Store a pemeriksaan
Route::post('/pemeriksaan/store', [PemeriksaanController::class, 'store'])->name('pemeriksaan.store')->middleware(['auth', 'verified', 'role:user|admin|super_admin']);




require __DIR__ . '/guest.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';


Route::post('/model-storage/store', [ModelStorageController::class, 'store'])->name('ModelStorage.store');
Route::get('/model-storage/get-model', [ModelStorageController::class, 'getModel'])->name('ModelStorage.getModel');
Route::get('/api/model-storage/get-data', [ModelStorageController::class, 'getData'])->name('api.ModelStorage.getData');


// Get Jenis Makanan Berdasarkan nama gizi
Route::get('/api/get-sayuran', [JenisTanamanController::class, 'getSayuran'])->name('api.get.sayuran');

// get pasien by nik
Route::get('/api/get-pasien-by-nik/{nik}', [PasienController::class, 'getByNik'])->name('api.get.pasien-by-nik');


// get klasifikasi usia berdasarkan dari parameter $usia

Route::get('/api/label-sayuran/{label}', [LabelSayuranController::class, 'getDataByLabel'])->name('api.get.label-sayuran-by-label');
