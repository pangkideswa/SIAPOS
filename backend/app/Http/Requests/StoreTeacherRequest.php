<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTeacherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $teacherId = $this->route('teacher');

        return [
            'foto' => 'nullable|string|max:255',
            'nama_lengkap' => 'required|string|max:255',
            'nip' => [
                'required',
                'string',
                'max:20',
                Rule::unique('teachers', 'nip')->ignore($teacherId),
            ],
            'nuptk' => 'nullable|string|max:20',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'no_hp' => 'nullable|string|max:20',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('teachers', 'email')->ignore($teacherId),
            ],
            'alamat' => 'nullable|string',
            'pendidikan_terakhir' => 'required|string|max:255',
            'status_kepegawaian' => 'required|in:PNS,PPPK,Honorer',
            'mata_pelajaran' => 'required|array|min:1',
            'mata_pelajaran.*' => 'string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'nama_lengkap.required' => 'Nama lengkap wajib diisi.',
            'nip.required' => 'NIP wajib diisi.',
            'nip.unique' => 'NIP sudah digunakan.',
            'jenis_kelamin.required' => 'Jenis kelamin wajib diisi.',
            'jenis_kelamin.in' => 'Jenis kelamin harus Laki-laki atau Perempuan.',
            'tempat_lahir.required' => 'Tempat lahir wajib diisi.',
            'tanggal_lahir.required' => 'Tanggal lahir wajib diisi.',
            'tanggal_lahir.date' => 'Format tanggal lahir tidak valid.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan.',
            'pendidikan_terakhir.required' => 'Pendidikan terakhir wajib diisi.',
            'status_kepegawaian.required' => 'Status kepegawaian wajib diisi.',
            'status_kepegawaian.in' => 'Status kepegawaian harus PNS, PPPK, atau Honorer.',
            'mata_pelajaran.required' => 'Mata pelajaran wajib diisi.',
            'mata_pelajaran.array' => 'Mata pelajaran harus berupa array.',
            'mata_pelajaran.min' => 'Pilih minimal satu mata pelajaran.',
        ];
    }
}
