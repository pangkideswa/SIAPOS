-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "image" TEXT,
ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'email',
ADD COLUMN     "providerId" TEXT;
