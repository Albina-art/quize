-- Migrate from device-scoped rows to user-scoped rows (guest data discarded).
TRUNCATE TABLE "MarkdownNote";
TRUNCATE TABLE "TrainerQuestionProgress";
TRUNCATE TABLE "McqQuestionProgress";

-- If a prior run created "User" but failed before _prisma_migrations recorded success,
-- redeploy retries this file from the top and would hit 42P07. When notes still use
-- deviceId, the safe fix is to drop the orphan User (no app FKs to it yet).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'MarkdownNote' AND column_name = 'deviceId'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'User'
  ) THEN
    EXECUTE 'DROP TABLE "User" CASCADE';
  END IF;
END $$;

-- CreateTable User
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- MarkdownNote: device -> user
DROP INDEX IF EXISTS "MarkdownNote_deviceId_updatedAt_idx";
ALTER TABLE "MarkdownNote" DROP COLUMN IF EXISTS "deviceId";
ALTER TABLE "MarkdownNote" ADD COLUMN IF NOT EXISTS "userId" TEXT;
ALTER TABLE "MarkdownNote" ALTER COLUMN "userId" SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'MarkdownNote_userId_fkey') THEN
    ALTER TABLE "MarkdownNote" ADD CONSTRAINT "MarkdownNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "MarkdownNote_userId_updatedAt_idx" ON "MarkdownNote"("userId", "updatedAt" DESC);

-- McqQuestionProgress
DROP INDEX IF EXISTS "McqQuestionProgress_deviceId_questionId_key";
ALTER TABLE "McqQuestionProgress" DROP COLUMN IF EXISTS "deviceId";
ALTER TABLE "McqQuestionProgress" ADD COLUMN IF NOT EXISTS "userId" TEXT;
ALTER TABLE "McqQuestionProgress" ALTER COLUMN "userId" SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'McqQuestionProgress_userId_fkey') THEN
    ALTER TABLE "McqQuestionProgress" ADD CONSTRAINT "McqQuestionProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "McqQuestionProgress_userId_questionId_key" ON "McqQuestionProgress"("userId", "questionId");

-- TrainerQuestionProgress
DROP INDEX IF EXISTS "TrainerQuestionProgress_deviceId_questionId_key";
ALTER TABLE "TrainerQuestionProgress" DROP COLUMN IF EXISTS "deviceId";
ALTER TABLE "TrainerQuestionProgress" ADD COLUMN IF NOT EXISTS "userId" TEXT;
ALTER TABLE "TrainerQuestionProgress" ALTER COLUMN "userId" SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TrainerQuestionProgress_userId_fkey') THEN
    ALTER TABLE "TrainerQuestionProgress" ADD CONSTRAINT "TrainerQuestionProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "TrainerQuestionProgress_userId_questionId_key" ON "TrainerQuestionProgress"("userId", "questionId");
