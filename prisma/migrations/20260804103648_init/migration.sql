-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'GURU', 'SISWA', 'WALI');

-- CreateEnum
CREATE TYPE "MaterialStatus" AS ENUM ('DRAFT', 'PUBLISH');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('NOT_SUBMITTED', 'SUBMITTED', 'LATE');

-- CreateEnum
CREATE TYPE "AnnouncementStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ScheduleDay" AS ENUM ('SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'MINGGU');

-- CreateEnum
CREATE TYPE "NilaiStatus" AS ENUM ('LENGKAP', 'BELUM_LENGKAP');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'SISWA',
    "username" TEXT,
    "nip" TEXT,
    "nisn" TEXT,
    "avatar" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "foto" TEXT,
    "nama_lengkap" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "nuptk" TEXT,
    "jenis_kelamin" TEXT NOT NULL DEFAULT 'Laki-laki',
    "tempat_lahir" TEXT,
    "tanggal_lahir" TIMESTAMP(3),
    "no_hp" TEXT,
    "email" TEXT NOT NULL,
    "alamat" TEXT,
    "pendidikan_terakhir" TEXT,
    "status_kepegawaian" TEXT NOT NULL DEFAULT 'Honorer',
    "mata_pelajaran" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "foto" TEXT,
    "nis" TEXT NOT NULL,
    "nisn" TEXT NOT NULL,
    "nama_lengkap" TEXT NOT NULL,
    "jenis_kelamin" TEXT NOT NULL DEFAULT 'Laki-laki',
    "tempat_lahir" TEXT,
    "tanggal_lahir" TIMESTAMP(3),
    "agama" TEXT,
    "alamat" TEXT,
    "jurusan_id" INTEGER,
    "kelas" TEXT,
    "tahun_masuk" TEXT,
    "tahun_ajaran" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "nama_ayah" TEXT,
    "nama_ibu" TEXT,
    "no_hp_ortu" TEXT,
    "alamat_ortu" TEXT,
    "classroom_id" INTEGER,
    "tahun_akademik_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classrooms" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "major" TEXT,
    "grade_level" TEXT,
    "homeroom_teacher_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classrooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teaching_classes" (
    "id" SERIAL NOT NULL,
    "classroom_id" INTEGER,
    "subject_id" INTEGER,
    "teacher_id" INTEGER,
    "guru_nama" TEXT,
    "mata_pelajaran" TEXT,
    "kelas" TEXT,
    "tahun_ajaran" TEXT,
    "semester" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "tahun_akademik_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teaching_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materials" (
    "id" SERIAL NOT NULL,
    "teaching_class_id" INTEGER,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "guru_nama" TEXT,
    "mata_pelajaran" TEXT,
    "kelas" TEXT,
    "pertemuan" INTEGER,
    "jenis_materi" TEXT,
    "thumbnail_url" TEXT,
    "lampiran" JSONB,
    "video_url" TEXT,
    "link_drive" TEXT,
    "link_eksternal" TEXT,
    "isi_materi" TEXT,
    "status" "MaterialStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignments" (
    "id" SERIAL NOT NULL,
    "teaching_class_id" INTEGER,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "guru_nama" TEXT,
    "mata_pelajaran" TEXT,
    "kelas" TEXT,
    "lampiran" JSONB,
    "tanggal_dibuka" TIMESTAMP(3),
    "tenggat_waktu" TIMESTAMP(3),
    "tenggat_jam" TEXT,
    "nilai_maksimal" INTEGER NOT NULL DEFAULT 100,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" SERIAL NOT NULL,
    "assignment_id" INTEGER,
    "student_id" INTEGER,
    "file_jawaban" JSONB,
    "catatan" TEXT,
    "waktu_pengumpulan" TIMESTAMP(3),
    "status" "SubmissionStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
    "nilai" INTEGER,
    "feedback" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "ringkasan" TEXT,
    "isi" TEXT,
    "kategori" TEXT,
    "target" TEXT,
    "kelas" TEXT,
    "status" "AnnouncementStatus" NOT NULL DEFAULT 'DRAFT',
    "penulis" TEXT,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "lampiran" JSONB,
    "tanggal_publish" TIMESTAMP(3),
    "author_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" SERIAL NOT NULL,
    "teaching_class_id" INTEGER,
    "hari" "ScheduleDay" NOT NULL,
    "jam_mulai" TEXT,
    "jam_selesai" TEXT,
    "mata_pelajaran" TEXT,
    "guru_nama" TEXT,
    "kelas" TEXT,
    "tahun_ajaran" TEXT,
    "semester" TEXT,
    "ruang" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "tahun_akademik_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tahun_akademik" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "tanggal_mulai" TIMESTAMP(3),
    "tanggal_selesai" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tahun_akademik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nilai" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER,
    "teaching_class_id" INTEGER,
    "tahun_akademik_id" INTEGER,
    "tugas" INTEGER,
    "praktik" INTEGER,
    "uts" INTEGER,
    "uas" INTEGER,
    "nilai_akhir" INTEGER,
    "status" "NilaiStatus" NOT NULL DEFAULT 'BELUM_LENGKAP',
    "tahun_ajaran" TEXT,
    "semester" TEXT,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nilai_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_nip_key" ON "users"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "users_nisn_key" ON "users"("nisn");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_user_id_key" ON "teachers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_nip_key" ON "teachers"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_email_key" ON "teachers"("email");

-- CreateIndex
CREATE INDEX "teachers_user_id_idx" ON "teachers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_user_id_key" ON "students"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_nis_key" ON "students"("nis");

-- CreateIndex
CREATE UNIQUE INDEX "students_nisn_key" ON "students"("nisn");

-- CreateIndex
CREATE INDEX "students_classroom_id_idx" ON "students"("classroom_id");

-- CreateIndex
CREATE INDEX "students_tahun_akademik_id_idx" ON "students"("tahun_akademik_id");

-- CreateIndex
CREATE INDEX "classrooms_homeroom_teacher_id_idx" ON "classrooms"("homeroom_teacher_id");

-- CreateIndex
CREATE INDEX "teaching_classes_classroom_id_idx" ON "teaching_classes"("classroom_id");

-- CreateIndex
CREATE INDEX "teaching_classes_subject_id_idx" ON "teaching_classes"("subject_id");

-- CreateIndex
CREATE INDEX "teaching_classes_teacher_id_idx" ON "teaching_classes"("teacher_id");

-- CreateIndex
CREATE INDEX "teaching_classes_tahun_akademik_id_idx" ON "teaching_classes"("tahun_akademik_id");

-- CreateIndex
CREATE INDEX "materials_teaching_class_id_idx" ON "materials"("teaching_class_id");

-- CreateIndex
CREATE INDEX "assignments_teaching_class_id_idx" ON "assignments"("teaching_class_id");

-- CreateIndex
CREATE INDEX "submissions_assignment_id_idx" ON "submissions"("assignment_id");

-- CreateIndex
CREATE INDEX "submissions_student_id_idx" ON "submissions"("student_id");

-- CreateIndex
CREATE INDEX "announcements_author_id_idx" ON "announcements"("author_id");

-- CreateIndex
CREATE INDEX "announcements_status_idx" ON "announcements"("status");

-- CreateIndex
CREATE INDEX "schedules_teaching_class_id_idx" ON "schedules"("teaching_class_id");

-- CreateIndex
CREATE INDEX "schedules_hari_idx" ON "schedules"("hari");

-- CreateIndex
CREATE INDEX "schedules_tahun_akademik_id_idx" ON "schedules"("tahun_akademik_id");

-- CreateIndex
CREATE UNIQUE INDEX "tahun_akademik_nama_key" ON "tahun_akademik"("nama");

-- CreateIndex
CREATE INDEX "tahun_akademik_is_active_idx" ON "tahun_akademik"("is_active");

-- CreateIndex
CREATE INDEX "nilai_teaching_class_id_idx" ON "nilai"("teaching_class_id");

-- CreateIndex
CREATE INDEX "nilai_tahun_akademik_id_idx" ON "nilai"("tahun_akademik_id");

-- CreateIndex
CREATE UNIQUE INDEX "nilai_student_id_teaching_class_id_semester_key" ON "nilai"("student_id", "teaching_class_id", "semester");

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_classroom_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "classrooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_tahun_akademik_id_fkey" FOREIGN KEY ("tahun_akademik_id") REFERENCES "tahun_akademik"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_homeroom_teacher_id_fkey" FOREIGN KEY ("homeroom_teacher_id") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_classes" ADD CONSTRAINT "teaching_classes_classroom_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "classrooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_classes" ADD CONSTRAINT "teaching_classes_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_classes" ADD CONSTRAINT "teaching_classes_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_classes" ADD CONSTRAINT "teaching_classes_tahun_akademik_id_fkey" FOREIGN KEY ("tahun_akademik_id") REFERENCES "tahun_akademik"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_teaching_class_id_fkey" FOREIGN KEY ("teaching_class_id") REFERENCES "teaching_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_teaching_class_id_fkey" FOREIGN KEY ("teaching_class_id") REFERENCES "teaching_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_teaching_class_id_fkey" FOREIGN KEY ("teaching_class_id") REFERENCES "teaching_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_tahun_akademik_id_fkey" FOREIGN KEY ("tahun_akademik_id") REFERENCES "tahun_akademik"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai" ADD CONSTRAINT "nilai_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai" ADD CONSTRAINT "nilai_teaching_class_id_fkey" FOREIGN KEY ("teaching_class_id") REFERENCES "teaching_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai" ADD CONSTRAINT "nilai_tahun_akademik_id_fkey" FOREIGN KEY ("tahun_akademik_id") REFERENCES "tahun_akademik"("id") ON DELETE SET NULL ON UPDATE CASCADE;
