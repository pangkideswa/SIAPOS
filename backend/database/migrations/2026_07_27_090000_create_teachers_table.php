<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->string('foto')->nullable();
            $table->string('nama_lengkap');
            $table->string('nip')->unique();
            $table->string('nuptk')->nullable();
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan']);
            $table->string('tempat_lahir');
            $table->date('tanggal_lahir');
            $table->string('no_hp')->nullable();
            $table->string('email')->unique();
            $table->text('alamat')->nullable();
            $table->string('pendidikan_terakhir');
            $table->enum('status_kepegawaian', ['PNS', 'PPPK', 'Honorer']);
            $table->json('mata_pelajaran');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
