<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'identifier' => 'required|string',
            'password' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'identifier.required' => 'Email / NIP / NISN wajib diisi.',
            'identifier.string' => 'Email / NIP / NISN harus berupa string.',
            'password.required' => 'Password wajib diisi.',
            'password.string' => 'Password harus berupa string.',
        ];
    }
}
