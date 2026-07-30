<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreClassRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'major' => 'required|string|max:255',
            'grade_level' => 'required|string|max:10',
            'homeroom_teacher_id' => 'nullable|integer|exists:users,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama kelas wajib diisi.',
            'major.required' => 'Jurusan wajib diisi.',
            'grade_level.required' => 'Tingkat kelas wajib diisi.',
            'grade_level.max' => 'Tingkat kelas maksimal 10 karakter.',
            'homeroom_teacher_id.exists' => 'Guru tidak ditemukan.',
        ];
    }
}
