<?php

namespace Database\Seeders;

use App\Models\Jurusan;
use Illuminate\Database\Seeder;

class JurusanSeeder extends Seeder
{
    private const JURUSANS = [
        [
            'name' => 'Teknik Komputer dan Jaringan',
            'code' => 'TKJ',
            'is_active' => true,
            'description' => 'Jurusan yang mempelajari instalasi, konfigurasi, dan pemeliharaan jaringan komputer serta server.',
        ],
        [
            'name' => 'Teknik Bisnis Sepeda Motor',
            'code' => 'TBSM',
            'is_active' => true,
            'description' => 'Jurusan yang mempelajari perawatan, perbaikan, dan bisnis sepeda motor.',
        ],
        [
            'name' => 'Bisnis Daring dan Pemasaran',
            'code' => 'BDP',
            'is_active' => false,
            'description' => 'Jurusan yang mempelajari pemasaran digital, perdagangan daring, dan manajemen bisnis.',
        ],
    ];

    public function run(): void
    {
        foreach (self::JURUSANS as $data) {
            Jurusan::updateOrCreate(
                ['code' => $data['code']],
                $data
            );
        }
    }
}
