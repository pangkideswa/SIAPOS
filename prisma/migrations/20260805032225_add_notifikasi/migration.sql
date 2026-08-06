-- CreateEnum
CREATE TYPE "NotifikasiTipe" AS ENUM ('MATERI', 'TUGAS', 'PENILAIAN', 'PENGUMUMAN', 'SISTEM');

-- CreateTable
CREATE TABLE "notifikasis" (
    "id" SERIAL NOT NULL,
    "tipe" "NotifikasiTipe" NOT NULL,
    "judul" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "href" TEXT,
    "targetRoles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifikasis_pkey" PRIMARY KEY ("id")
);
