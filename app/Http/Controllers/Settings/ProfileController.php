<?php

namespace App\Http\Controllers\Settings;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Pasien;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Http\Requests\Settings\ProfileUpdateRequest;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $user = Auth::user();
        if ($user->hasRole(['admin', 'super_admin'])) {
            return Inertia::render('settings/profile', [
                'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
                'status' => $request->session()->get('status'),
            ]);
        }
        return Inertia::render('guest/settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'pasien' => Pasien::where('user_id', '=', Auth::user()->id)->with(['user'])->first(),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        $pasien = Pasien::where('user_id', $request->user()->id)->first();
        $pasien->update([
            'nik' => $request->nik,
            'tempat_lahir' => $request->tempat_lahir,
            'tanggal_lahir' => $request->tanggal_lahir,
            'jenis_kelamin' => "Perempuan",
            'nama' => $request->name,
            'alamat' => $request->alamat,
            'nohp' => $request->nohp,
        ]);

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
