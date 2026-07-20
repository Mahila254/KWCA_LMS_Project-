import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding KWCA LMS database...");

  const course = await prisma.course.upsert({
    where: {
      slug: "what-is-a-conservancy",
    },
    update: {
      title: "What is a Conservancy?",
      description:
        "An introductory course explaining conservancies and their role in conservation and community livelihoods.",
      category: "Governance",
      learningOutcomes:
        "Learners will understand what conservancies are, why they matter, and how they support wildlife and communities.",
      numberOfLessons: 4,
      status: "PUBLISHED",
      accessType: "FREE_PREVIEW",
    },
    create: {
      title: "What is a Conservancy?",
      slug: "what-is-a-conservancy",
      description:
        "An introductory course explaining conservancies and their role in conservation and community livelihoods.",
      category: "Governance",
      imageUrl: "",
      introVideoUrl: "",
      learningOutcomes:
        "Learners will understand what conservancies are, why they matter, and how they support wildlife and communities.",
      numberOfLessons: 4,
      status: "PUBLISHED",
      accessType: "FREE_PREVIEW",
    },
  });

  await prisma.lesson.deleteMany({
    where: {
      courseId: course.id,
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        courseId: course.id,
        title: "Definition of a wildlife conservancy",
        slug: "lesson-1",
        order: 1,
        accessType: "PREVIEW",
        content:
          "This lesson introduces what a wildlife conservancy is and how it supports conservation and community livelihoods.",
        videoUrl: "",
        readingUrl: "",
        notes:
          "A conservancy is both a conservation area and a community governance structure.",
      },
      {
        courseId: course.id,
        title: "Why conservancies matter in Kenya",
        slug: "lesson-2",
        order: 2,
        accessType: "PREMIUM",
        content:
          "This lesson explains the role conservancies play in wildlife protection, land management, and community benefits.",
        videoUrl: "",
        readingUrl: "",
        notes:
          "Conservancies help connect wildlife conservation with local livelihoods.",
      },
      {
        courseId: course.id,
        title: "Types of conservancies",
        slug: "lesson-3",
        order: 3,
        accessType: "PREMIUM",
        content:
          "This lesson introduces different types of conservancies and how they are structured.",
        videoUrl: "",
        readingUrl: "",
        notes:
          "Different conservancy models may exist depending on ownership, governance, and land use.",
      },
      {
        courseId: course.id,
        title: "Conservancies as institutions",
        slug: "lesson-4",
        order: 4,
        accessType: "PREMIUM",
        content:
          "This lesson explains conservancies as institutions with governance, leadership, and accountability systems.",
        videoUrl: "",
        readingUrl: "",
        notes:
          "A strong conservancy needs clear leadership, management systems, and community participation.",
      },
    ],
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });