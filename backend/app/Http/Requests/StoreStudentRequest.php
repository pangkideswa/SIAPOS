<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $studentId = $this->route('student');

        return [
            'foto' => 'nullable|string|max:255',
            'nis' => [
                'required',
                'string',
                'max:20',
                Rule::unique('students', 'nis')->ignore($studentId),
            ],
            'nisn' => [
                'required',
                'string',
                'max:20',
                Rule::unique('students', 'nisn')->ignore($studentId),
            ],
            'nama_lengkap' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'agama' => 'required|string|max:50',
            'alamat' => 'nullable|string',
            'jurusan_id' => 'required|exists:jurusans,id',
            'kelas' => 'required|string|max:50',
            'tahun_masuk' => 'required|string|max:10',
            'tahun_ajaran' => 'required|string|max:10',
            'status' => 'required|in:Aktif,Alumni,Pindah,Keluar',
            'nama_ayah' => 'required|string|max:255',
            'nama_ibu' => 'required|string|max:255',
            'no_hp_ortu' => 'nullable|string|max:20',
            'alamat_ortu' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'nis.required' => 'NIS wajib diisi.',
            'nis.unique' => 'NIS sudah digunakan.',
            'nisn.required' => 'NISN wajib diisi.',
            'nisn.unique' => 'NISN sudah digunakan.',
            'nama_lengkap.required' => 'Nama lengkap wajib diisi.',
            'jenis_kelamin.required' => 'Jenis kelamin wajib diisi.',
            'jenis_kelamin.in' => 'Jenis kelamin harus Laki-laki atau Perempuan.',
            'tempat_lahir.required' => 'Tempat lahir wajib diisi.',
            'tanggal_lahir.required' => 'Tanggal lahir wajib diisi.',
            'tanggal_lahir.date' => 'Format tanggal lahir tidak valid.',
            'agama.required' => 'Agama wajib diisi.',
            'jurusan_id.required' => 'Jurusan wajib dipilih.',
            'jurusan_id.exists' => 'Jurusan tidak valid.',
            'kelas.required' => 'Kelas wajib diisi.',
            'tahun_masuk.required' => 'Tahun masuk wajib diisi.',
            'tahun_ajaran.required' => 'Tahun ajaran wajib diisi.',
            'status.required' => 'Status wajib diisi.',
            'status.in' => 'Status harus Aktif, Alumni, Pindah, atau Keluar.',
            'nama_ayah.required' => 'Nama ayah wajib diisi.',
            'nama_ibu.required' => 'Nama ibu wajib diisi.',
        ];
    }
}
