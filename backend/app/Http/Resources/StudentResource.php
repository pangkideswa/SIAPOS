<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'foto' => $this->foto,
            'nis' => $this->nis,
            'nisn' => $this->nisn,
            'nama_lengkap' => $this->nama_lengkap,
            'jenis_kelamin' => $this->jenis_kelamin,
            'tempat_lahir' => $this->tempat_lahir,
            'tanggal_lahir' => $this->tanggal_lahir,
            'agama' => $this->agama,
            'alamat' => $this->alamat,
            'jurusan_id' => $this->jurusan_id,
            'jurusan' => $this->whenLoaded('jurusan'),
            'kelas' => $this->kelas,
            'tahun_masuk' => $this->tahun_masuk,
            'tahun_ajaran' => $this->tahun_ajaran,
            'status' => $this->status,
            'nama_ayah' => $this->nama_ayah,
            'nama_ibu' => $this->nama_ibu,
            'no_hp_ortu' => $this->no_hp_ortu,
            'alamat_ortu' => $this->alamat_ortu,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
