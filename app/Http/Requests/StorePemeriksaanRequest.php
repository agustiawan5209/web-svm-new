<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePemeriksaanRequest extends FormRequest
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
            "user_id" => "nullable|integer|exists:users,id",
            "rme" => "nullable|string|max:50|unique:pemeriksaans,rme",
            "nik" => "required|string|max:50",
            "nama" => "required|string|max:100",
            "tempat_lahir" => "required|string|max:100",
            "tanggal_lahir" => "required|date",
            "jenis_kelamin" => "required|string|in:Laki-laki,Perempuan",
            "tanggal_pemeriksaan" => "required|date",
            "label" => "required|string|max:100",

            "rekomendasi" => "nullable|array",
            "statusGizi" => "nullable|array",
            'kriteria' => 'required|array',
            'kriteria.*.nilai' => 'required|string',
            'kriteria.*.kriteria_id' => 'required|exists:kriterias,id',

        ];
    }
    public function messages(): array
    {
        return [
            'user_id.required' => 'Orang tua wajib diisi.',
            'user_id.integer' => 'Orang tua harus berupa angka.',
            'user_id.exists' => 'Orang tua tidak ditemukan.',

            'rme.unique' => 'RME sudah digunakan.',

            'nik.required' => 'NIK wajib diisi.',
            'nik.string' => 'NIK harus berupa string.',
            'nik.max' => 'NIK maksimal 50 karakter.',

            'nama.required' => 'Nama wajib diisi.',
            'nama.string' => 'Nama harus berupa string.',
            'nama.max' => 'Nama maksimal 100 karakter.',

            'tempat_lahir.required' => 'Tempat lahir wajib diisi.',
            'tempat_lahir.string' => 'Tempat lahir harus berupa string.',
            'tempat_lahir.max' => 'Tempat lahir maksimal 100 karakter.',

            'tanggal_lahir.required' => 'Tanggal lahir wajib diisi.',
            'tanggal_lahir.date' => 'Tanggal lahir harus berupa tanggal yang valid.',

            'jenis_kelamin.required' => 'Jenis kelamin wajib diisi.',
            'jenis_kelamin.string' => 'Jenis kelamin harus berupa string.',
            'jenis_kelamin.in' => 'Jenis kelamin harus Laki-laki atau Perempuan.',

            'tanggal_pemeriksaan.required' => 'Tanggal pemeriksaan wajib diisi.',
            'tanggal_pemeriksaan.date' => 'Tanggal pemeriksaan harus berupa tanggal yang valid.',

            'label.required' => 'Label wajib diisi.',
            'label.string' => 'Label harus berupa string.',
            'label.max' => 'Label maksimal 100 karakter.',

            'rekomendasi.required' => 'Rekomendasi wajib diisi.',
            'rekomendasi.array' => 'Rekomendasi harus berupa array.',

            'statusGizi.required' => 'Status gizi wajib diisi.',
            'statusGizi.array' => 'Status gizi harus berupa array.',
        ];
    }
}
