import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CheckPaymentStatusButton from "@/components/CheckPaymentStatusButton";
import {
  CheckCircle,
  Clock,
  CreditCard,
  ArrowLeft,
  Smartphone,
  AlertCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    paymentId?: string;
  }>;
};

export default async function PaymentConfirmationPage({
  searchParams,
}: PageProps) {
  const query = await searchParams;
  const paymentId = query.paymentId;

  const payment = paymentId
    ? await prisma.payment.findUnique({
        where: {
          id: paymentId,
        },
        include: {
          user: true,
          course: true,
        },
      })
    : null;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 font-bold text-[#007F73]"
            >
              <ArrowLeft size={18} />
              Back to Pricing
            </Link>

            <div className="mt-8 max-w-4xl">
              <p className="font-bold text-[#007F73]">Payment Confirmation</p>

              <h1 className="mt-3 text-5xl font-bold">
                Payment Record Created
              </h1>

              <p className="mt-4 text-xl leading-8 text-gray-600">
                Your payment request has been saved. Once the admin confirms it,
                you can check the status here and continue to your course.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-12">
          {!payment ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertCircle size={34} />
              </div>

              <h2 className="text-3xl font-bold">Payment not found</h2>

              <p className="mt-3 text-gray-600">
                We could not find a payment record for this request.
              </p>

              <Link
                href="/pricing"
                className="mt-6 inline-flex rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
              >
                Back to Pricing
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <div
                className={`p-8 text-white ${
                  payment.status === "PAID"
                    ? "bg-[#007F73]"
                    : payment.status === "FAILED"
                    ? "bg-red-700"
                    : "bg-[#07122E]"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-bold text-white">
                      {payment.status === "PAID" ? (
                        <>
                          <CheckCircle size={18} />
                          Payment Confirmed
                        </>
                      ) : payment.status === "FAILED" ? (
                        <>
                          <AlertCircle size={18} />
                          Payment Failed
                        </>
                      ) : (
                        <>
                          <Clock size={18} />
                          Pending Payment
                        </>
                      )}
                    </div>

                    <h2 className="text-4xl font-extrabold">
                      {payment.status === "PAID"
                        ? "Premium Access Unlocked"
                        : payment.status === "FAILED"
                        ? "Payment Could Not Be Confirmed"
                        : "Payment Awaiting Confirmation"}
                    </h2>

                    <p className="mt-3 max-w-3xl leading-7 text-white/70">
                      {payment.status === "PAID"
                        ? "Your payment has been confirmed. You can now continue to the course and open premium lessons."
                        : payment.status === "FAILED"
                        ? "This payment was marked as failed. Please contact the admin or create a new payment request."
                        : "This record is currently marked as PENDING. After admin confirmation, click the status check button below to continue."}
                    </p>
                  </div>

                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                    <CreditCard size={42} />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 p-8 md:grid-cols-2">
                <InfoCard
                  label="Learner"
                  value={payment.user.name || payment.user.email}
                />

                <InfoCard label="Email" value={payment.user.email} />

                <InfoCard
                  label="Payment Type"
                  value={payment.paymentType.replaceAll("_", " ")}
                />

                <InfoCard
                  label="Amount"
                  value={`${payment.currency} ${payment.amount.toLocaleString()}`}
                />

                <InfoCard label="Status" value={payment.status} />

                <InfoCard label="Provider" value={payment.provider} />

                <InfoCard
                  label="Reference"
                  value={payment.providerRef || "Not available"}
                />

                <InfoCard
                  label="Course"
                  value={
                    payment.course?.title || "Subscription / General Access"
                  }
                />
              </div>

              <div className="border-t p-8">
                <div className="rounded-2xl bg-orange-50 p-6">
                  <div className="flex gap-3">
                    <Smartphone className="mt-1 text-[#D94A00]" size={24} />

                    <div>
                      <h3 className="text-xl font-bold">
                        Manual payment confirmation MVP
                      </h3>

                      <p className="mt-2 leading-7 text-gray-600">
                        For now, the admin can confirm payment from the Admin
                        Payments page. Once marked as PAID, click the button
                        below to refresh the payment status and continue.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-4">
                  <CheckPaymentStatusButton
                    paymentId={payment.id}
                    courseSlug={payment.course?.slug || null}
                  />

                  {payment.course?.slug && (
                    <Link
                      href={`/courses/${payment.course.slug}`}
                      className="rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
                    >
                      Back to Course
                    </Link>
                  )}

                  <Link
                    href="/pricing"
                    className="rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
                  >
                    Back to Pricing
                  </Link>

                  <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#07122E] px-6 py-3 font-bold text-white hover:bg-[#101b3d]"
                  >
                    <CheckCircle size={18} />
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-5">
      <p className="text-sm font-bold text-gray-500">{label}</p>
      <p className="mt-2 break-words text-xl font-bold">{value}</p>
    </div>
  );
}