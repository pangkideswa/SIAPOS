<?php

namespace Database\Seeders;

use App\Models\ClassModel;
use App\Models\Subject;
use App\Models\TeacherSubject;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            SuperAdminSeeder::class,
            JurusanSeeder::class,
            TeacherSeeder::class,
            StudentSeeder::class,
        ]);

        // Guru
        $guru1 = User::updateOrCreate(
            ['email' => 'budi@pklearning.com'],
            [
                'name' => 'Budi Santoso',
                'username' => 'budisantoso',
                'password' => Hash::make('password'),
                'role' => 'guru',
                'nip' => '198501152010011001',
            ]
        );
        $guru1->syncRoles('guru');

        $guru2 = User::updateOrCreate(
            ['email' => 'siti@pklearning.com'],
            [
                'name' => 'Siti Rahayu',
                'username' => 'sitirahayu',
                'password' => Hash::make('password'),
                'role' => 'guru',
                'nip' => '198703202012012002',
            ]
        );
        $guru2->syncRoles('guru');

        $guru3 = User::updateOrCreate(
            ['email' => 'andi@pklearning.com'],
            [
                'name' => 'Andi Wijaya',
                'username' => 'andiwijaya',
                'password' => Hash::make('password'),
                'role' => 'guru',
                'nip' => '199001012015011003',
            ]
        );
        $guru3->syncRoles('guru');

        // Siswa
        $siswa1 = User::updateOrCreate(
            ['email' => 'rizki@student.pklearning.com'],
            [
                'name' => 'Rizki Pratama',
                'username' => 'rizkipratama',
                'password' => Hash::make('password'),
                'role' => 'siswa',
                'nisn' => '0081234001',
            ]
        );
        $siswa1->syncRoles('siswa');

        $siswa2 = User::updateOrCreate(
            ['email' => 'dewi@student.pklearning.com'],
            [
                'name' => 'Dewi Lestari',
                'username' => 'dewilestari',
                'password' => Hash::make('password'),
                'role' => 'siswa',
                'nisn' => '0081234002',
            ]
        );
        $siswa2->syncRoles('siswa');

        $siswa3 = User::updateOrCreate(
            ['email' => 'fajar@student.pklearning.com'],
            [
                'name' => 'Fajar Nugroho',
                'username' => 'fajarnugroho',
                'password' => Hash::make('password'),
                'role' => 'siswa',
                'nisn' => '0081234003',
            ]
        );
        $siswa3->syncRoles('siswa');

        // Wali
        $wali1 = User::updateOrCreate(
            ['email' => 'wali@pklearning.com'],
            [
                'name' => 'Budi Santoso',
                'username' => 'walikelas',
                'password' => Hash::make('password'),
                'role' => 'wali',
            ]
        );
        $wali1->syncRoles('wali');

        // Kelas
        $kelas1 = ClassModel::firstOrCreate(
            ['name' => 'XI TKJ'],
            [
                'major' => 'Teknik Komputer Jaringan',
                'grade_level' => 'XI',
                'homeroom_teacher_id' => $guru1->id,
            ]
        );

        $kelas2 = ClassModel::firstOrCreate(
            ['name' => 'XI TBSM'],
            [
                'major' => 'Teknik Bengkel Sepeda Motor',
                'grade_level' => 'XI',
                'homeroom_teacher_id' => $guru2->id,
            ]
        );

        $kelas3 = ClassModel::firstOrCreate(
            ['name' => 'X RPL 1'],
            [
                'major' => 'Rekayasa Perangkat Lunak',
                'grade_level' => 'X',
                'homeroom_teacher_id' => $guru3->id,
            ]
        );

        // Mata Pelajaran
        $mataPelajaran1 = Subject::firstOrCreate(
            ['name' => 'Pemrograman Web'],
            [
                'description' => 'Mata pelajaran tentang pengembangan aplikasi web menggunakan HTML, CSS, JavaScript, dan PHP.',
                'is_active' => true,
            ]
        );

        $mataPelajaran2 = Subject::firstOrCreate(
            ['name' => 'Basis Data'],
            [
                'description' => 'Mata pelajaran tentang konsep dan implementasi basis data relasional.',
                'is_active' => true,
            ]
        );

        $mataPelajaran3 = Subject::firstOrCreate(
            ['name' => 'Pemrograman Mobile'],
            [
                'description' => 'Mata pelajaran tentang pengembangan aplikasi mobile menggunakan Android.',
                'is_active' => true,
            ]
        );

        // Penugasan Guru
        TeacherSubject::firstOrCreate(
            [
                'teacher_id' => $guru1->id,
                'subject_id' => $mataPelajaran1->id,
                'class_id' => $kelas1->id,
            ]
        );

        TeacherSubject::firstOrCreate(
            [
                'teacher_id' => $guru1->id,
                'subject_id' => $mataPelajaran2->id,
                'class_id' => $kelas1->id,
            ]
        );

        TeacherSubject::firstOrCreate(
            [
                'teacher_id' => $guru2->id,
                'subject_id' => $mataPelajaran1->id,
                'class_id' => $kelas2->id,
            ]
        );

        TeacherSubject::firstOrCreate(
            [
                'teacher_id' => $guru3->id,
                'subject_id' => $mataPelajaran3->id,
                'class_id' => $kelas3->id,
            ]
        );

        TeacherSubject::firstOrCreate(
            [
                'teacher_id' => $guru3->id,
                'subject_id' => $mataPelajaran1->id,
                'class_id' => $kelas3->id,
            ]
        );
    }
}
