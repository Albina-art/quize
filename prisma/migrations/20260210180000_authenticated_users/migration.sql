-- Migrate from device-scoped rows to user-scoped rows (guest data discarded).
TRUNCATE TABLE "MarkdownNote";
TRUNCATE TABLE "TrainerQuestionProgress";
TRUNCATE TABLE "McqQuestionProgress";

-- CreateTable User
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- MarkdownNote: device -> user
DROP INDEX IF EXISTS "MarkdownNote_deviceId_updatedAt_idx";
ALTER TABLE "MarkdownNote" DROP COLUMN IF EXISTS "deviceId";
ALTER TABLE "MarkdownNote" ADD COLUMN "userId" TEXT NOT NULL;

ALTER TABLE "MarkdownNote" ADD CONSTRAINT "MarkdownNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "MarkdownNote_userId_updatedAt_idx" ON "MarkdownNote"("userId", "updatedAt" DESC);

-- McqQuestionProgress
DROP INDEX IF EXISTS "McqQuestionProgress_deviceId_questionId_key";
ALTER TABLE "McqQuestionProgress" DROP COLUMN IF EXISTS "deviceId";
ALTER TABLE "McqQuestionProgress" ADD COLUMN "userId" TEXT NOT NULL;

ALTER TABLE "McqQuestionProgress" ADD CONSTRAINT "McqQuestionProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "McqQuestionProgress_userId_questionId_key" ON "McqQuestionProgress"("userId", "questionId");

-- TrainerQuestionProgress
DROP INDEX IF EXISTS "TrainerQuestionProgress_deviceId_questionId_key";
ALTER TABLE "TrainerQuestionProgress" DROP COLUMN IF EXISTS "deviceId";
ALTER TABLE "TrainerQuestionProgress" ADD COLUMN "userId" TEXT NOT NULL;

ALTER TABLE "TrainerQuestionProgress" ADD CONSTRAINT "TrainerQuestionProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "TrainerQuestionProgress_userId_questionId_key" ON "TrainerQuestionProgress"("userId", "questionId");
