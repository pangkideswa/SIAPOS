-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('HADIR', 'IZIN', 'SAKIT', 'ALPHA', 'TERLAMBAT');

-- CreateEnum
CREATE TYPE "AttendanceSessionStatus" AS ENUM ('SELESAI', 'BERLANGSUNG', 'BELUM');

-- CreateTable
CREATE TABLE "attendance_sessions" (
    "id" SERIAL NOT NULL,
    "teaching_class_id" INTEGER,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "jam_mulai" TEXT,
    "jam_selesai" TEXT,
    "mata_pelajaran" TEXT,
    "guru_nama" TEXT,
    "kelas" TEXT,
    "tahun_ajaran" TEXT,
    "semester" TEXT,
    "status" "AttendanceSessionStatus" NOT NULL DEFAULT 'BELUM',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_records" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'HADIR',
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "attendance_sessions_teaching_class_id_idx" ON "attendance_sessions"("teaching_class_id");

-- CreateIndex
CREATE INDEX "attendance_sessions_tanggal_idx" ON "attendance_sessions"("tanggal");

-- CreateIndex
CREATE INDEX "attendance_records_student_id_idx" ON "attendance_records"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_records_session_id_student_id_key" ON "attendance_records"("session_id", "student_id");

-- AddForeignKey
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_teaching_class_id_fkey" FOREIGN KEY ("teaching_class_id") REFERENCES "teaching_classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "attendance_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
