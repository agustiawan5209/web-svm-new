<?php

namespace App\Providers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;

class DatabaseServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton('databaseHelper', function () {
            return function (
                callable $operation,
                string $successMessage = "Data berhasil ditambahkan",
                string $errorMessage = "Data gagal ditambahkan",
                ?string $redirectRoute = null,
                bool $withInput = true,
            ) {
                try {
                    $operation();

                    return $redirectRoute
                        ? redirect()->route($redirectRoute)->with('success', $successMessage)
                        : back()->with('success', $successMessage);
                } catch (\Exception $e) {
                    Log::error('Database Error: ' . $e->getMessage());

                    $redirect = $redirectRoute
                        ? redirect()->route($redirectRoute)
                        : back();

                    return $withInput
                        ? $redirect->with('error', $errorMessage)->withInput()
                        : $redirect->with('error', $errorMessage);
                }
            };
        });
    }


    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
