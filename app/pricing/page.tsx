import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import CreatePaymentButton from "@/components/CreatePaymentButton";
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Smartphone,
  Building2,
  Crown,
  BookOpen,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function PricingPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 font-bold text-[#007F73]"
            >
              <ArrowLeft size={18} />
              Back to Courses
            </Link>

            <div className="mt-8 max-w-4xl">
              <p className="font-bold text-[#007F73]">Premium Access</p>

              <h1 className="mt-3 text-5xl font-bold">
                Unlock KWCA LMS Learning
              </h1>

              <p className="mt-4 text-xl leading-8 text-gray-600">
                Choose a payment option to access premium lessons, final
                quizzes, downloadable resources, and certificates.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                <BookOpen size={34} />
              </div>

              <p className="font-bold text-[#007F73]">Pay Per Course</p>

              <h2 className="mt-3 text-3xl font-bold">Single Course</h2>

              <p className="mt-4 leading-7 text-gray-600">
                Best for learners who want access to one specific course and its
                certificate.
              </p>

              <div className="mt-6">
                <p className="text-5xl font-extrabold">KES 1,500</p>
                <p className="mt-1 text-sm text-gray-500">per course</p>
              </div>

              <div className="mt-8 space-y-3">
                <Feature text="Access to one premium course" />
                <Feature text="All lessons unlocked" />
                <Feature text="Practice and final quiz" />
                <Feature text="Certificate after completion" />
              </div>

              <CreatePaymentButton
                paymentType="PAY_PER_COURSE"
                amount={1500}
                label="Create Pay Per Course Payment"
              />
            </div>

            <div className="relative rounded-3xl border-2 border-[#007F73] bg-white p-8 shadow-sm">
              <div className="absolute right-6 top-6 rounded-full bg-[#007F73] px-4 py-2 text-sm font-bold text-white">
                Recommended
              </div>

              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                <Crown size={34} />
              </div>

              <p className="font-bold text-[#007F73]">Monthly Subscription</p>

              <h2 className="mt-3 text-3xl font-bold">Monthly Access</h2>

              <p className="mt-4 leading-7 text-gray-600">
                Best for active learners who want access to several KWCA LMS
                courses.
              </p>

              <div className="mt-6">
                <p className="text-5xl font-extrabold">KES 3,000</p>
                <p className="mt-1 text-sm text-gray-500">per month</p>
              </div>

              <div className="mt-8 space-y-3">
                <Feature text="Access to all premium courses" />
                <Feature text="All lessons and readings unlocked" />
                <Feature text="Unlimited quizzes" />
                <Feature text="Certificates for completed courses" />
              </div>

              <CreatePaymentButton
                paymentType="MONTHLY_SUBSCRIPTION"
                amount={3000}
                label="Create Monthly Payment"
              />
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                <CalendarDays size={34} />
              </div>

              <p className="font-bold text-[#007F73]">Annual Subscription</p>

              <h2 className="mt-3 text-3xl font-bold">Annual Access</h2>

              <p className="mt-4 leading-7 text-gray-600">
                Best for organizations, staff teams, or long-term learners.
              </p>

              <div className="mt-6">
                <p className="text-5xl font-extrabold">KES 25,000</p>
                <p className="mt-1 text-sm text-gray-500">per year</p>
              </div>

              <div className="mt-8 space-y-3">
                <Feature text="Full-year access" />
                <Feature text="All premium courses included" />
                <Feature text="Certificates included" />
                <Feature text="Best value for long-term learning" />
              </div>

              <CreatePaymentButton
                paymentType="ANNUAL_SUBSCRIPTION"
                amount={25000}
                label="Create Annual Payment"
              />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <CreditCard className="text-[#007F73]" size={30} />

                <div>
                  <h2 className="text-3xl font-bold">Payment Methods</h2>
                  <p className="mt-1 text-gray-600">
                    Planned payment options for the KWCA LMS.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <PaymentOption
                  icon={<Smartphone size={24} />}
                  title="M-PESA"
                  description="Mobile money payment option for learners in Kenya."
                />

                <PaymentOption
                  icon={<CreditCard size={24} />}
                  title="Paystack"
                  description="Card, mobile money, and payment reference support."
                />

                <PaymentOption
                  icon={<Building2 size={24} />}
                  title="Institutional Payment"
                  description="Partner or organization-sponsored access for groups."
                />
              </div>
            </div>

            <div className="rounded-3xl bg-[#07122E] p-8 text-white shadow-sm">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white">
                <ShieldCheck size={34} />
              </div>

              <h2 className="text-3xl font-bold">Premium Access Notice</h2>

              <p className="mt-4 leading-8 text-white/70">
                This page now creates pending payment records in the LMS
                database. The next upgrade is connecting these records to a real
                payment gateway such as Paystack or M-PESA.
              </p>

              <div className="mt-8 rounded-2xl bg-white/10 p-5">
                <p className="font-bold">Current MVP Flow</p>
                <p className="mt-2 text-white/70">
                  Learner selects a plan, the LMS creates a PENDING payment
                  record, and the learner is redirected to a payment confirmation
                  page.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex gap-3">
      <CheckCircle className="mt-1 shrink-0 text-[#007F73]" size={20} />
      <p className="text-gray-600">{text}</p>
    </div>
  );
}

function PaymentOption({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border p-5">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
          {icon}
        </div>

        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="mt-1 leading-7 text-gray-600">{description}</p>

          <span className="mt-3 inline-flex rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-[#D94A00]">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
}