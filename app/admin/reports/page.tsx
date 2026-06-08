import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  CheckCircle,
  BarChart3,
  GraduationCap,
  CreditCard,
  Clock,
  XCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

type CourseRecord = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  status: "DRAFT" | "PUBLISHED";
  lessons: {
    id: string;
  }[];
  quizQuestions: {
    id: string;
  }[];
};

type LearnerRecord = {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
};

type EnrollmentRecord = {
  id: string;
  progress: number;
  completed: boolean;
  createdAt: Date;
  course: {
    id: string;
    title: string;
    slug: string;
  };
  user: {
    id: string;
    name: string | null;
    email: string;
  };
};

type QuizResultRecord = {
  id: string;
  quizType: string;
  score: number;
  passed: boolean;
  createdAt: Date;
  course: {
    id: string;
    title: string;
    slug: string;
  };
  user: {
    id: string;
    name: string | null;
    email: string;
  };
};

type CertificateRecord = {
  id: string;
  certificateCode: string;
  issuedAt: Date;
  course: {
    id: string;
    title: string;
    slug: string;
  };
  user: {
    id: string;
    name: string | null;
    email: string;
  };
};

type PaymentRecord = {
  id: string;
  paymentType:
    | "PAY_PER_COURSE"
    | "MONTHLY_SUBSCRIPTION"
    | "ANNUAL_SUBSCRIPTION";
  amount: number;
  currency: string;
  status: "PENDING" | "PAID" | "FAILED";
  createdAt: Date;
  course: {
    id: string;
    title: string;
    slug: string;
  } | null;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
};

export default async function AdminReportsPage() {
  const [
    courses,
    learners,
    enrollments,
    quizResults,
    certificates,
    payments,
  ] = await Promise.all([
    prisma.course.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        status: true,
        lessons: {
          select: {
            id: true,
          },
        },
        quizQuestions: {
          select: {
            id: true,
          },
        },
      },
    }) as Promise<CourseRecord[]>,

    prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    }) as Promise<LearnerRecord[]>,

    prisma.enrollment.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        progress: true,
        completed: true,
        createdAt: true,
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }) as Promise<EnrollmentRecord[]>,

    prisma.quizResult.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        quizType: true,
        score: true,
        passed: true,
        createdAt: true,
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }) as Promise<QuizResultRecord[]>,

    prisma.certificate.findMany({
      orderBy: {
        issuedAt: "desc",
      },
      select: {
        id: true,
        certificateCode: true,
        issuedAt: true,
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }) as Promise<CertificateRecord[]>,

    prisma.payment.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        paymentType: true,
        amount: true,
        currency: true,
        status: true,
        createdAt: true,
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }) as Promise<PaymentRecord[]>,
  ]);

  const completedEnrollments = enrollments.filter(
    (item: EnrollmentRecord) => item.completed
  ).length;

  const passedQuizResults = quizResults.filter(
    (item: QuizResultRecord) => item.passed
  ).length;

  const averageQuizScore =
    quizResults.length > 0
      ? Math.round(
          quizResults.reduce(
            (total: number, item: QuizResultRecord) => total + item.score,
            0
          ) / quizResults.length
        )
      : 0;

  const quizPassRate =
    quizResults.length > 0
      ? Math.round((passedQuizResults / quizResults.length) * 100)
      : 0;

  const courseCompletionRate =
    enrollments.length > 0
      ? Math.round((completedEnrollments / enrollments.length) * 100)
      : 0;

  const publishedCourses = courses.filter(
    (course: CourseRecord) => course.status === "PUBLISHED"
  ).length;

  const draftCourses = courses.filter(
    (course: CourseRecord) => course.status === "DRAFT"
  ).length;

  const totalLessons = courses.reduce(
    (total: number, course: CourseRecord) => total + course.lessons.length,
    0
  );

  const totalQuizQuestions = courses.reduce(
    (total: number, course: CourseRecord) =>
      total + course.quizQuestions.length,
    0
  );

  const pendingPayments = payments.filter(
    (payment: PaymentRecord) => payment.status === "PENDING"
  ).length;

  const paidPayments = payments.filter(
    (payment: PaymentRecord) => payment.status === "PAID"
  ).length;

  const failedPayments = payments.filter(
    (payment: PaymentRecord) => payment.status === "FAILED"
  ).length;

  const totalPendingPaymentValue = payments
    .filter((payment: PaymentRecord) => payment.status === "PENDING")
    .reduce(
      (total: number, payment: PaymentRecord) => total + payment.amount,
      0
    );

  const totalPaidPaymentValue = payments
    .filter((payment: PaymentRecord) => payment.status === "PAID")
    .reduce(
      (total: number, payment: PaymentRecord) => total + payment.amount,
      0
    );

  const totalPaymentValue = payments.reduce(
    (total: number, payment: PaymentRecord) => total + payment.amount,
    0
  );

  const recentQuizResults = quizResults.slice(0, 5);
  const recentCertificates = certificates.slice(0, 5);
  const recentPayments = payments.slice(0, 5);

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 font-bold text-[#007F73]"
            >
              <ArrowLeft size={18} />
              Back to Admin Dashboard
            </Link>

            <div className="mt-8">
              <p className="font-bold text-[#007F73]">Platform Reports</p>

              <h1 className="mt-3 text-5xl font-bold">KWCA LMS Reports</h1>

              <p className="mt-4 max-w-3xl text-xl text-gray-600">
                Monitor platform activity, learner progress, quiz performance,
                certificates, payments, and course engagement.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8 grid gap-6 md:grid-cols-4">
            <SummaryCard
              icon={<BookOpen size={28} />}
              label="Total Courses"
              value={courses.length.toString()}
              tone="green"
            />

            <SummaryCard
              icon={<Users size={28} />}
              label="Total Learners"
              value={learners.length.toString()}
              tone="green"
            />

            <SummaryCard
              icon={<GraduationCap size={28} />}
              label="Enrollments"
              value={enrollments.length.toString()}
              tone="orange"
            />

            <SummaryCard
              icon={<Award size={28} />}
              label="Certificates"
              value={certificates.length.toString()}
              tone="green"
            />
          </div>

          <div className="mb-8 grid gap-6 md:grid-cols-4">
            <SummaryCard
              icon={<CreditCard size={28} />}
              label="Total Payments"
              value={payments.length.toString()}
              tone="green"
            />

            <SummaryCard
              icon={<Clock size={28} />}
              label="Pending Payments"
              value={pendingPayments.toString()}
              tone="orange"
            />

            <SummaryCard
              icon={<CheckCircle size={28} />}
              label="Paid Payments"
              value={paidPayments.toString()}
              tone="green"
            />

            <SummaryCard
              icon={<XCircle size={28} />}
              label="Failed Payments"
              value={failedPayments.toString()}
              tone="red"
            />
          </div>

          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <MetricCard
              icon={<TrendingUp size={30} />}
              title="Average Quiz Score"
              value={`${averageQuizScore}%`}
              description={`Based on ${quizResults.length} submitted quiz results.`}
              tone="green"
            />

            <MetricCard
              icon={<CheckCircle size={30} />}
              title="Quiz Pass Rate"
              value={`${quizPassRate}%`}
              description={`${passedQuizResults} out of ${quizResults.length} quiz results are marked as passed.`}
              tone="green"
            />

            <MetricCard
              icon={<BarChart3 size={30} />}
              title="Completion Rate"
              value={`${courseCompletionRate}%`}
              description={`${completedEnrollments} out of ${enrollments.length} enrollments are completed.`}
              tone="orange"
            />
          </div>

          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <PaymentValueCard
              label="Total Payment Value"
              value={`KES ${totalPaymentValue.toLocaleString()}`}
              description="Combined value of all payment records."
              tone="dark"
            />

            <PaymentValueCard
              label="Pending Payment Value"
              value={`KES ${totalPendingPaymentValue.toLocaleString()}`}
              description="Payment value awaiting admin confirmation."
              tone="orange"
            />

            <PaymentValueCard
              label="Confirmed Payment Value"
              value={`KES ${totalPaidPaymentValue.toLocaleString()}`}
              description="Payment value marked as paid."
              tone="green"
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-3xl font-bold">Course Overview</h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <SmallStat label="Published Courses" value={publishedCourses} />
                <SmallStat label="Draft Courses" value={draftCourses} />
                <SmallStat label="Total Lessons" value={totalLessons} />
                <SmallStat label="Quiz Questions" value={totalQuizQuestions} />
              </div>

              <div className="mt-8 space-y-4">
                {courses.length === 0 ? (
                  <p className="rounded-2xl bg-gray-50 p-5 text-gray-600">
                    No courses available yet.
                  </p>
                ) : (
                  courses.map((course: CourseRecord) => (
                    <Link
                      key={course.id}
                      href={`/admin/courses/${course.slug}/lessons`}
                      className="block rounded-2xl border p-5 hover:bg-gray-50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold">
                            {course.title}
                          </h3>

                          <p className="mt-1 text-sm text-gray-600">
                            {course.category || "General"}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <span className="rounded-full bg-[#F2FBF8] px-3 py-1 text-sm font-bold text-[#007F73]">
                            {course.lessons.length} Lessons
                          </span>

                          <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-[#D94A00]">
                            {course.quizQuestions.length} Questions
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-8">
              <RecentPayments payments={recentPayments} />
              <RecentQuizResults quizResults={recentQuizResults} />
              <RecentCertificates certificates={recentCertificates} />
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-[#07122E] p-8 text-white">
            <h2 className="text-3xl font-bold">Report Summary</h2>

            <p className="mt-3 max-w-4xl leading-7 text-white/70">
              This page provides a live database summary of learner activity,
              course content, quiz performance, enrollments, certificates, and
              payment activity. It gives KWCA administrators a quick picture of
              how the learning platform is being used.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "green" | "orange" | "red";
}) {
  const toneClass =
    tone === "green"
      ? "text-[#007F73]"
      : tone === "orange"
      ? "text-[#D94A00]"
      : "text-red-600";

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className={toneClass}>{icon}</div>
        <p className="text-sm font-bold text-gray-500">{label}</p>
      </div>

      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
}

function MetricCard({
  icon,
  title,
  value,
  description,
  tone,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  description: string;
  tone: "green" | "orange";
}) {
  const toneClass = tone === "green" ? "text-[#007F73]" : "text-[#D94A00]";

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className={toneClass}>{icon}</div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      <p className={`text-5xl font-extrabold ${toneClass}`}>{value}</p>

      <p className="mt-3 text-gray-600">{description}</p>
    </div>
  );
}

function PaymentValueCard({
  label,
  value,
  description,
  tone,
}: {
  label: string;
  value: string;
  description: string;
  tone: "dark" | "green" | "orange";
}) {
  const toneClass =
    tone === "green"
      ? "text-[#007F73]"
      : tone === "orange"
      ? "text-[#D94A00]"
      : "text-[#07122E]";

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <p className="text-sm font-bold text-gray-500">{label}</p>

      <p className={`mt-2 text-4xl font-extrabold ${toneClass}`}>{value}</p>

      <p className="mt-3 text-gray-600">{description}</p>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-5">
      <p className="text-sm font-bold text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-[#007F73]">{value}</p>
    </div>
  );
}

function RecentPayments({ payments }: { payments: PaymentRecord[] }) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold">Recent Payments</h2>

        <Link
          href="/admin/payments"
          className="rounded-xl bg-[#007F73] px-4 py-2 text-sm font-bold text-white hover:bg-[#00665d]"
        >
          View All Payments
        </Link>
      </div>

      {payments.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-gray-50 p-5 text-gray-600">
          No payment records yet.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {payments.map((payment: PaymentRecord) => {
            const paymentDate = new Date(payment.createdAt).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            );

            return (
              <div key={payment.id} className="rounded-2xl border p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold">
                      {payment.user.name || payment.user.email}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      {payment.paymentType.replaceAll("_", " ")} •{" "}
                      {payment.course?.title ||
                        "Subscription / General Access"}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {paymentDate}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-extrabold">
                      {payment.currency} {payment.amount.toLocaleString()}
                    </p>

                    <p
                      className={`text-sm font-bold ${
                        payment.status === "PAID"
                          ? "text-green-700"
                          : payment.status === "FAILED"
                          ? "text-red-600"
                          : "text-[#D94A00]"
                      }`}
                    >
                      {payment.status}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RecentQuizResults({
  quizResults,
}: {
  quizResults: QuizResultRecord[];
}) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="text-3xl font-bold">Recent Quiz Results</h2>

      {quizResults.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-gray-50 p-5 text-gray-600">
          No quiz results yet.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {quizResults.map((result: QuizResultRecord) => {
            const resultDate = new Date(result.createdAt).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            );

            return (
              <div key={result.id} className="rounded-2xl border p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold">
                      {result.user.name || result.user.email}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      {result.course.title} • {result.quizType} Quiz
                    </p>

                    <p className="mt-1 text-sm text-gray-500">{resultDate}</p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-2xl font-extrabold ${
                        result.passed ? "text-[#007F73]" : "text-red-600"
                      }`}
                    >
                      {result.score}%
                    </p>

                    <p
                      className={`text-sm font-bold ${
                        result.passed ? "text-green-700" : "text-red-600"
                      }`}
                    >
                      {result.passed ? "Passed" : "Not Passed"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RecentCertificates({
  certificates,
}: {
  certificates: CertificateRecord[];
}) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="text-3xl font-bold">Recent Certificates</h2>

      {certificates.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-gray-50 p-5 text-gray-600">
          No certificates issued yet.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {certificates.map((certificate: CertificateRecord) => {
            const issuedDate = new Date(
              certificate.issuedAt
            ).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });

            return (
              <div key={certificate.id} className="rounded-2xl border p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold">
                      {certificate.user.name || certificate.user.email}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      {certificate.course.title}
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#007F73]">
                      {certificate.certificateCode}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">{issuedDate}</p>
                  </div>

                  <Link
                    href={`/courses/${certificate.course.slug}/certificate`}
                    className="rounded-xl bg-[#007F73] px-4 py-2 text-sm font-bold text-white hover:bg-[#00665d]"
                  >
                    View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}