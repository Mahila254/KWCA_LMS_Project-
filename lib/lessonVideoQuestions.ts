import { prisma } from "@/lib/prisma";
import type { VideoQuestion, VideoQuestionInput } from "@/lib/videoQuestions";

/** A lesson's pop-up video questions, in the order they come up. */
export async function getLessonVideoQuestions(
  lessonId: string
): Promise<VideoQuestion[]> {
  return prisma.lessonVideoQuestion.findMany({
    where: { lessonId },
    orderBy: { timeSeconds: "asc" },
    select: {
      id: true,
      timeSeconds: true,
      type: true,
      question: true,
      options: true,
      correctIndex: true,
      explanation: true,
    },
  });
}

/** Saves the admin editor's list as the lesson's complete set. */
export async function replaceLessonVideoQuestions(
  lessonId: string,
  questions: VideoQuestionInput[]
) {
  await prisma.$transaction([
    prisma.lessonVideoQuestion.deleteMany({ where: { lessonId } }),
    prisma.lessonVideoQuestion.createMany({
      data: questions.map((question) => ({ ...question, lessonId })),
    }),
  ]);
}
