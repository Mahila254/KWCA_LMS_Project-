import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
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
                Your payment request has been saved. The next step will be
                connecting this flow to Paystack or M-PESA for real payment
                confirmation.
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
              <div className="bg-[#07122E] p-8 text-white">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-bold text-white">
                      <Clock size={18} />
                      Pending Payment
                    </div>

                    <h2 className="text-4xl font-extrabold">
                      Payment Awaiting Confirmation
                    </h2>

                    <p className="mt-3 max-w-3xl leading-7 text-white/70">
                      This record is currently marked as PENDING. Once Paystack
                      or M-PESA is connected, successful payments will
                      automatically update to PAID.
                    </p>
                  </div>

                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                    <CreditCard size={42} />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 p-8 md:grid-cols-2">
                <InfoCard label="Learner" value={payment.user.name || payment.user.email} />
                <InfoCard label="Email" value={payment.user.email} />
                <InfoCard label="Payment Type" value={payment.paymentType.replaceAll("_", " ")} />
                <InfoCard label="Amount" value={`${payment.currency} ${payment.amount.toLocaleString()}`} />
                <InfoCard label="Status" value={payment.status} />
                <InfoCard label="Provider" value={payment.provider} />
                <InfoCard label="Reference" value={payment.providerRef || "Not available"} />
                <InfoCard
                  label="Course"
                  value={payment.course?.title || "Subscription / General Access"}
                />
              </div>

              <div className="border-t p-8">
                <div className="rounded-2xl bg-orange-50 p-6">
                  <div className="flex gap-3">
                    <Smartphone className="mt-1 text-[#D94A00]" size={24} />

                    <div>
                      <h3 className="text-xl font-bold">
                        Real payment gateway coming next
                      </h3>

                      <p className="mt-2 leading-7 text-gray-600">
                        This confirms that your database payment flow is working.
                        The next upgrade is connecting this payment record to
                        Paystack or M-PESA so the LMS can automatically unlock
                        premium access after payment.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    href="/pricing"
                    className="rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
                  >
                    Back to Pricing
                  </Link>

                  <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
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