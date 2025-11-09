<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLabelSayuranRequest extends FormRequest
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
            'label_id' => 'required|exists:labels,id',
            'sayuran' => 'nullable|string',
            'porsi' => 'nullable|string',
            'tekstur' => 'required|string',
            'frekuensi' => 'nullable|string',
        ];
    }
}
