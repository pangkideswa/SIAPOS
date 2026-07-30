<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeacherResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'foto' => $this->foto,
            'nama_lengkap' => $this->nama_lengkap,
            'nip' => $this->nip,
            'nuptk' => $this->nuptk,
            'jenis_kelamin' => $this->jenis_kelamin,
            'tempat_lahir' => $this->tempat_lahir,
            'tanggal_lahir' => $this->tanggal_lahir,
            'no_hp' => $this->no_hp,
            'email' => $this->email,
            'alamat' => $this->alamat,
            'pendidikan_terakhir' => $this->pendidikan_terakhir,
            'status_kepegawaian' => $this->status_kepegawaian,
            'mata_pelajaran' => $this->mata_pelajaran,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
