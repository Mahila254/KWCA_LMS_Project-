import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Enrols a learner in a course once, and only once. If they are already
 * enrolled the existing record comes back untouched, so their progress,
 * completion, quiz results and certificate are never reset. The database
 * also refuses a second Enrollment for the same learner and course
 * (@@unique([userId, courseId])); if two requests race, the loser reads
 * the winner's row instead of failing.
 */
export async function ensureEnrollment(userId: string, courseId: string) {
  const where = { userId_courseId: { userId, courseId } };

  const existing = await prisma.enrollment.findUnique({ where });
  if (existing) {
    return { enrollment: existing, created: false };
  }

  try {
    const enrollment = await prisma.enrollment.create({
      data: { userId, courseId, progress: 0, completed: false },
    });
    return { enrollment, created: true };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const enrollment = await prisma.enrollment.findUniqueOrThrow({ where });
      return { enrollment, created: false };
    }
    throw error;
  }
}
