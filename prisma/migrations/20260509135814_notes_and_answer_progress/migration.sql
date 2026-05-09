-- CreateTable
CREATE TABLE "MarkdownNote" (
    "id" TEXT NOT NULL,
    "deviceId" VARCHAR(128) NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "body" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarkdownNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "McqQuestionProgress" (
    "id" SERIAL NOT NULL,
    "deviceId" VARCHAR(128) NOT NULL,
    "questionId" INTEGER NOT NULL,
    "lastCorrect" BOOLEAN NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "McqQuestionProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainerQuestionProgress" (
    "id" SERIAL NOT NULL,
    "deviceId" VARCHAR(128) NOT NULL,
    "questionId" INTEGER NOT NULL,
    "knewAnswer" BOOLEAN NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainerQuestionProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MarkdownNote_deviceId_updatedAt_idx" ON "MarkdownNote"("deviceId", "updatedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "McqQuestionProgress_deviceId_questionId_key" ON "McqQuestionProgress"("deviceId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainerQuestionProgress_deviceId_questionId_key" ON "TrainerQuestionProgress"("deviceId", "questionId");

-- AddForeignKey
ALTER TABLE "McqQuestionProgress" ADD CONSTRAINT "McqQuestionProgress_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "McqQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerQuestionProgress" ADD CONSTRAINT "TrainerQuestionProgress_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
