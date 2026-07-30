<?php

namespace Database\Seeders;

use App\Models\Teacher;
use Illuminate\Database\Seeder;

class TeacherSeeder extends Seeder
{
    private const TEACHERS = [
        [
            'foto' => null,
            'nama_lengkap' => 'Budi Santoso',
            'nip' => '198501152010011001',
            'nuptk' => '123456789012345670',
            'jenis_kelamin' => 'Laki-laki',
            'tempat_lahir' => 'Jakarta',
            'tanggal_lahir' => '1985-01-15',
            'no_hp' => '081234567890',
            'email' => 'budi.santoso@sekolah.sch.id',
            'alamat' => 'Jl. Merdeka No. 10, Jakarta Selatan',
            'pendidikan_terakhir' => 'S2',
            'status_kepegawaian' => 'PNS',
            'mata_pelajaran' => ['Jaringan Komputer', 'Sistem Operasi'],
        ],
        [
            'foto' => null,
            'nama_lengkap' => 'Siti Rahayu',
            'nip' => '198703202012012002',
            'nuptk' => null,
            'jenis_kelamin' => 'Perempuan',
            'tempat_lahir' => 'Bandung',
            'tanggal_lahir' => '1987-03-20',
            'no_hp' => '081234567891',
            'email' => 'siti.rahayu@sekolah.sch.id',
            'alamat' => 'Jl. Asia Afrika No. 25, Bandung',
            'pendidikan_terakhir' => 'S1',
            'status_kepegawaian' => 'PPPK',
            'mata_pelajaran' => ['Basis Data', 'Pemrograman Web'],
        ],
        [
            'foto' => null,
            'nama_lengkap' => 'Andi Wijaya',
            'nip' => '199001012015011003',
            'nuptk' => '987654321098765430',
            'jenis_kelamin' => 'Laki-laki',
            'tempat_lahir' => 'Surabaya',
            'tanggal_lahir' => '1990-01-01',
            'no_hp' => null,
            'email' => 'andi.wijaya@sekolah.sch.id',
            'alamat' => null,
            'pendidikan_terakhir' => 'S1',
            'status_kepegawaian' => 'Honorer',
            'mata_pelajaran' => ['Komputer dan Jaringan Dasar', 'Pekerjaan Dasar Permesinan'],
        ],
    ];

    public function run(): void
    {
        foreach (self::TEACHERS as $data) {
            Teacher::updateOrCreate(
                ['nip' => $data['nip']],
                $data
            );
        }
    }
}
