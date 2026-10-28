import "dotenv/config";
import { PrismaClient } from "@prisma/client";

// One-off migration: adds QuizResult.answers (see prisma/schema.prisma).
// Written as a script because `prisma db push` needs the schema engine,
// which can't be downloaded on this machine. Safe to run more than once.
//
//   npx.cmd tsx scripts/add-quiz-answers-column.ts
async function main() {
  const prisma = new PrismaClient();

  try {
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "QuizResult" ADD COLUMN IF NOT EXISTS "answers" JSONB'
    );

    const columns = await prisma.$queryRawUnsafe<{ column_name: string }[]>(
      `SELECT column_name FROM information_schema.columns
       WHERE table_name = 'QuizResult' AND column_name = 'answers'`
    );

    console.log(
      columns.length === 1
        ? 'QuizResult."answers" column is in place.'
        : 'Column not found after ALTER TABLE — check the database.'
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
