<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreJurusanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $jurusanId = $this->route('jurusan');

        return [
            'name' => 'required|string|max:255',
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('jurusans', 'code')->ignore($jurusanId),
            ],
            'is_active' => 'required|boolean',
            'description' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama jurusan wajib diisi.',
            'name.max' => 'Nama jurusan maksimal 255 karakter.',
            'code.required' => 'Kode jurusan wajib diisi.',
            'code.max' => 'Kode jurusan maksimal 50 karakter.',
            'code.unique' => 'Kode jurusan sudah digunakan.',
            'is_active.required' => 'Status wajib diisi.',
            'is_active.boolean' => 'Status harus aktif atau tidak aktif.',
        ];
    }
}
