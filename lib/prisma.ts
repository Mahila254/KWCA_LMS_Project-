import { PrismaClient } from "@prisma/client";

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    // QuizResult.answers holds the correct answers of every question in
    // an attempt. Leave it out of every query by default so no route can
    // send final-quiz answers to a learner by accident (profile and
    // learner-status return whole QuizResult rows). The review route opts
    // back in with `omit: { answers: false }`.
    omit: {
      quizResult: {
        answers: true,
      },
    },
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
