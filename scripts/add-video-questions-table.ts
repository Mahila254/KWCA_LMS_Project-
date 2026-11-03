import "dotenv/config";
import { PrismaClient } from "@prisma/client";

// One-off migration: adds LessonVideoQuestion (see prisma/schema.prisma).
// Written as a script because `prisma db push` needs the schema engine,
// which can't be downloaded on this machine. Safe to run more than once.
// Locks the new table the same way scripts/secure-database.ts does.
//
//   npx.cmd tsx scripts/add-video-questions-table.ts
async function main() {
  const prisma = new PrismaClient();

  try {
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "VideoQuestionType" AS ENUM ('TRUE_FALSE', 'MULTIPLE_CHOICE');
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "LessonVideoQuestion" (
        "id" TEXT NOT NULL,
        "lessonId" TEXT NOT NULL,
        "timeSeconds" INTEGER NOT NULL,
        "type" "VideoQuestionType" NOT NULL DEFAULT 'TRUE_FALSE',
        "question" TEXT NOT NULL,
        "options" TEXT[],
        "correctIndex" INTEGER NOT NULL,
        "explanation" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "LessonVideoQuestion_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "LessonVideoQuestion_lessonId_fkey" FOREIGN KEY ("lessonId")
          REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "LessonVideoQuestion_lessonId_idx"
        ON "LessonVideoQuestion"("lessonId")
    `);

    await prisma.$executeRawUnsafe(
      'ALTER TABLE "LessonVideoQuestion" ENABLE ROW LEVEL SECURITY'
    );
    await prisma.$executeRawUnsafe(
      'REVOKE ALL ON "LessonVideoQuestion" FROM anon, authenticated'
    );

    const count = await prisma.lessonVideoQuestion.count();
    console.log(
      `LessonVideoQuestion table is in place (${count} questions saved).`
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
