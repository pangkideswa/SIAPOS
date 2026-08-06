-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('BELUM_AKTIF', 'AKTIF', 'DIBLOKIR');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "last_login" TIMESTAMP(3),
ADD COLUMN     "login_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "AccountStatus" NOT NULL DEFAULT 'BELUM_AKTIF',
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;

-- Backfill: semua akun yang sudah ada dianggap aktif
UPDATE "users" SET "status" = 'AKTIF';

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_jurusan_id_fkey" FOREIGN KEY ("jurusan_id") REFERENCES "jurusans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
