import { prisma } from "@/lib/prisma";

type PaymentRecord = {
  id: string;
  courseId: string | null;
  paymentType:
    | "PAY_PER_COURSE"
    | "MONTHLY_SUBSCRIPTION"
    | "ANNUAL_SUBSCRIPTION";
  status: "PENDING" | "PAID" | "FAILED";
};

/**
 * Works out whether a verified learner (by email) has paid for a course,
 * either directly or through a subscription. Shared by the check-premium
 * API and the premium lesson material API so both apply the same rule.
 */
export async function getPremiumAccess(email: string, courseId: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      payments: {
        where: {
          status: "PAID",
        },
        select: {
          id: true,
          courseId: true,
          paymentType: true,
          status: true,
        },
      },
    },
  });

  if (!user) {
    return {
      hasAccess: false,
      hasSubscriptionAccess: false,
      hasCourseAccess: false,
      paidPayments: [] as PaymentRecord[],
    };
  }

  const paidPayments = user.payments as PaymentRecord[];

  const hasSubscriptionAccess = paidPayments.some(
    (payment: PaymentRecord) =>
      payment.paymentType === "MONTHLY_SUBSCRIPTION" ||
      payment.paymentType === "ANNUAL_SUBSCRIPTION"
  );

  const hasCourseAccess = paidPayments.some(
    (payment: PaymentRecord) =>
      payment.paymentType === "PAY_PER_COURSE" &&
      payment.courseId === courseId
  );

  return {
    hasAccess: hasSubscriptionAccess || hasCourseAccess,
    hasSubscriptionAccess,
    hasCourseAccess,
    paidPayments,
  };
}
