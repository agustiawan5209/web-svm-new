<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePasienRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama' => 'required|string|max:255',
            'nik' => 'required|string|max:16|unique:pasiens,nik',
            'tanggal_lahir' => 'required|date',
            // 'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            // 'alamat' => 'required|string|max:500',
            // 'no_telepon' => 'required|string|max:15',
        ];
    }
}
