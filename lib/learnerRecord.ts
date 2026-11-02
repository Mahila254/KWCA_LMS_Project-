import { prisma } from "@/lib/prisma";

type VerifiedLearner = {
  id: string;
  email: string;
  name: string | null;
};

/**
 * Finds the learner's database record, creating it on first use.
 *
 * The database is the trusted copy of a learner's name, because it goes on
 * their certificates. The name in their Supabase login details only fills in
 * a missing one: learners can change those details themselves, so copying
 * them over on every request would quietly bypass the rule in
 * PATCH /api/profile that a name is fixed once a certificate is issued.
 */
export async function ensureLearnerRecord(learner: VerifiedLearner) {
  const existing = await prisma.user.findUnique({
    where: { email: learner.email },
  });

  if (existing) {
    if (existing.name || !learner.name) return existing;

    return prisma.user.update({
      where: { id: existing.id },
      data: { name: learner.name },
    });
  }

  // upsert, not create: two first requests can arrive together.
  return prisma.user.upsert({
    where: { email: learner.email },
    update: {},
    create: {
      id: learner.id,
      email: learner.email,
      name: learner.name,
      role: "STUDENT",
    },
  });
}

const GENDERS = ["MALE", "FEMALE", "PREFER_NOT_TO_SAY"] as const;

export type LearnerGender = (typeof GENDERS)[number];

/** Checks the details a learner submits from their profile page. */
export function parseProfileUpdate(body: unknown) {
  const { name, gender } = (body ?? {}) as { name?: unknown; gender?: unknown };

  const cleanName =
    typeof name === "string" ? name.trim().replace(/\s+/g, " ") : "";

  if (cleanName.length < 2 || cleanName.length > 100) {
    return { error: "Please enter your full name (2 to 100 characters)." };
  }

  // Needs at least one letter in any language, and no angle brackets or
  // invisible control characters, since this is printed on certificates.
  if (!/\p{L}/u.test(cleanName) || /[<>\p{Cc}]/u.test(cleanName)) {
    return { error: "Please enter your name using letters." };
  }

  if (!GENDERS.includes(gender as LearnerGender)) {
    return { error: "Please choose a gender option." };
  }

  return { name: cleanName, gender: gender as LearnerGender };
}
