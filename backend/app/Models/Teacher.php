<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teacher extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'foto',
        'nama_lengkap',
        'nip',
        'nuptk',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'no_hp',
        'email',
        'alamat',
        'pendidikan_terakhir',
        'status_kepegawaian',
        'mata_pelajaran',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_lahir' => 'date',
            'mata_pelajaran' => 'array',
        ];
    }
}
