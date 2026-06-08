import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import UpdatePaymentStatusButton from "@/components/UpdatePaymentStatusButton";
import {
  ArrowLeft,
  CreditCard,
  User,
  Mail,
  CalendarDays,
  CheckCircle,
  Clock,
  XCircle,
  BookOpen,
  Hash,
  RefreshCw,
} from "lucide-react";

export const dynamic = "force-dynamic";

type PaymentRecord = {
  id: string;
  userId: string;
  courseId: string | null;
  paymentType:
    | "PAY_PER_COURSE"
    | "MONTHLY_SUBSCRIPTION"
    | "ANNUAL_SUBSCRIPTION";
  amount: number;
  currency: string;
  status: "PENDING" | "PAID" | "FAILED";
  provider: string;
  providerRef: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string | null;
    email: string;
  };
  course: {
    title: string;
    slug: string;
  } | null;
};

export default async function AdminPaymentsPage() {
  const payments: PaymentRecord[] = await prisma.payment.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      course: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
  });

  const totalPayments = payments.length;

  const pendingPayments = payments.filter(
    (payment: PaymentRecord) => payment.status === "PENDING"
  ).length;

  const paidPayments = payments.filter(
    (payment: PaymentRecord) => payment.status === "PAID"
  ).length;

  const failedPayments = payments.filter(
    (payment: PaymentRecord) => payment.status === "FAILED"
  ).length;

  const totalPendingAmount = payments
    .filter((payment: PaymentRecord) => payment.status === "PENDING")
    .reduce(
      (total: number, payment: PaymentRecord) => total + payment.amount,
      0
    );

  const totalPaidAmount = payments
    .filter((payment: PaymentRecord) => payment.status === "PAID")
    .reduce(
      (total: number, payment: PaymentRecord) => total + payment.amount,
      0
    );

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
              <p className="font-bold text-[#007F73]">Payment Management</p>

              <h1 className="mt-3 text-5xl font-bold">Payment Records</h1>

              <p className="mt-4 max-w-3xl text-xl text-gray-600">
                View learner payment requests, payment types, amounts, statuses,
                provider references, and linked courses or subscriptions.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8 grid gap-6 md:grid-cols-4">
            <SummaryCard
              icon={<CreditCard size={28} />}
              label="Total Payments"
              value={totalPayments.toString()}
              tone="green"
            />

            <SummaryCard
              icon={<Clock size={28} />}
              label="Pending"
              value={pendingPayments.toString()}
              tone="orange"
            />

            <SummaryCard
              icon={<CheckCircle size={28} />}
              label="Paid"
              value={paidPayments.toString()}
              tone="green"
            />

            <SummaryCard
              icon={<XCircle size={28} />}
              label="Failed"
              value={failedPayments.toString()}
              tone="red"
            />
          </div>

          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-gray-500">
                Pending Payment Value
              </p>

              <p className="mt-2 text-4xl font-extrabold text-[#D94A00]">
                KES {totalPendingAmount.toLocaleString()}
              </p>

              <p className="mt-2 text-gray-600">
                Total value of payment records awaiting confirmation.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-gray-500">
                Confirmed Payment Value
              </p>

              <p className="mt-2 text-4xl font-extrabold text-[#007F73]">
                KES {totalPaidAmount.toLocaleString()}
              </p>

              <p className="mt-2 text-gray-600">
                Total value of payment records marked as paid.
              </p>
            </div>
          </div>

          {payments.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
                <CreditCard size={34} />
              </div>

              <h2 className="text-3xl font-bold">No payments yet</h2>

              <p className="mt-3 text-gray-600">
                Payment records will appear here when learners choose a pricing
                plan.
              </p>

              <Link
                href="/pricing"
                className="mt-6 inline-flex rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
              >
                View Pricing Page
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <div className="border-b p-6">
                <h2 className="text-2xl font-bold">All Payment Records</h2>

                <p className="mt-2 text-gray-600">
                  Showing {payments.length} payment records from the database.
                </p>
              </div>

              <div className="divide-y">
                {payments.map((payment: PaymentRecord) => {
                  const createdDate = new Date(
                    payment.createdAt
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  });

                  const createdTime = new Date(
                    payment.createdAt
                  ).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div key={payment.id} className="p-6">
                      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr_1fr_230px]">
                        <div>
                          <div className="flex gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                              <User size={28} />
                            </div>

                            <div>
                              <h3 className="text-xl font-bold">
                                {payment.user.name || "Unnamed Learner"}
                              </h3>

                              <p className="mt-2 flex items-center gap-2 text-gray-600">
                                <Mail size={16} />
                                {payment.user.email}
                              </p>

                              <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                <CalendarDays size={15} />
                                {createdDate} at {createdTime}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-bold text-gray-500">
                            Payment Type
                          </p>

                          <p className="mt-2 font-bold">
                            {payment.paymentType.replaceAll("_", " ")}
                          </p>

                          <p className="mt-5 text-sm font-bold text-gray-500">
                            Course / Access
                          </p>

                          <p className="mt-2 flex items-center gap-2 font-bold">
                            <BookOpen size={16} className="text-[#007F73]" />
                            {payment.course?.title ||
                              "Subscription / General Access"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-bold text-gray-500">
                            Amount
                          </p>

                          <p className="mt-2 text-2xl font-extrabold">
                            {payment.currency}{" "}
                            {payment.amount.toLocaleString()}
                          </p>

                          <p className="mt-5 text-sm font-bold text-gray-500">
                            Provider Reference
                          </p>

                          <p className="mt-2 flex items-center gap-2 break-words text-sm font-bold text-gray-700">
                            <Hash size={15} className="text-[#007F73]" />
                            {payment.providerRef || "Not available"}
                          </p>
                        </div>

                        <div className="lg:text-right">
                          <span
                            className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${
                              payment.status === "PAID"
                                ? "bg-green-100 text-green-700"
                                : payment.status === "FAILED"
                                ? "bg-red-100 text-red-700"
                                : "bg-orange-100 text-[#D94A00]"
                            }`}
                          >
                            {payment.status}
                          </span>

                          <p className="mt-5 text-sm font-bold text-gray-500">
                            Provider
                          </p>

                          <p className="mt-2 font-bold">{payment.provider}</p>

                          <div className="mt-5 rounded-2xl bg-gray-50 p-4 text-left">
                            <div className="mb-3 flex items-center gap-2">
                              <RefreshCw size={16} className="text-[#007F73]" />

                              <p className="text-sm font-bold text-gray-600">
                                Update Status
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <UpdatePaymentStatusButton
                                paymentId={payment.id}
                                status="PENDING"
                                label="Pending"
                              />

                              <UpdatePaymentStatusButton
                                paymentId={payment.id}
                                status="PAID"
                                label="Paid"
                              />

                              <UpdatePaymentStatusButton
                                paymentId={payment.id}
                                status="FAILED"
                                label="Failed"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
  icon: React.ReactNode;
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