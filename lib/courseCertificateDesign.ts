import { prisma } from "@/lib/prisma";
import {
  certificateDesignFor,
  type CertificateDesign,
} from "@/lib/certificateDesigns";

/** Which savanna scene a course's certificates use (see certificateDesigns). */
export async function getCourseCertificateDesign(course: {
  createdAt: Date;
}): Promise<CertificateDesign> {
  const earlierCourses = await prisma.course.count({
    where: { createdAt: { lt: course.createdAt } },
  });

  return certificateDesignFor(earlierCourses);
}
