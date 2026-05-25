import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  ArrowLeft,
  Settings,
  CreditCard,
  ShieldCheck,
  Award,
  Lock,
  Globe,
  CheckCircle,
  AlertCircle,
  Smartphone,
  CalendarDays,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <>
      <Navbar />

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
              <p className="font-bold text-[#007F73]">Platform Settings</p>

              <h1 className="mt-3 text-5xl font-bold">LMS Settings</h1>

              <p className="mt-4 max-w-3xl text-xl text-gray-600">
                Manage platform access rules, payment setup, certificates,
                subscriptions, and system configuration.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8 grid gap-6 md:grid-cols-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Settings className="text-[#007F73]" size={28} />
                <p className="text-sm font-bold text-gray-500">
                  Platform Mode
                </p>
              </div>

              <p className="text-2xl font-bold">Active</p>

              <p className="mt-2 text-sm text-gray-600">
                LMS is ready for course testing.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <CreditCard className="text-[#D94A00]" size={28} />
                <p className="text-sm font-bold text-gray-500">Payments</p>
              </div>

              <p className="text-2xl font-bold">Planned</p>

              <p className="mt-2 text-sm text-gray-600">
                Paystack/M-PESA setup can be added next.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <ShieldCheck className="text-[#007F73]" size={28} />
                <p className="text-sm font-bold text-gray-500">
                  Access Rules
                </p>
              </div>

              <p className="text-2xl font-bold">Enabled</p>

              <p className="mt-2 text-sm text-gray-600">
                Preview and premium lesson rules are active.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Award className="text-[#007F73]" size={28} />
                <p className="text-sm font-bold text-gray-500">
                  Certificates
                </p>
              </div>

              <p className="text-2xl font-bold">Enabled</p>

              <p className="mt-2 text-sm text-gray-600">
                Certificates are generated after course completion.
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <CreditCard className="text-[#007F73]" size={30} />

                <div>
                  <h2 className="text-3xl font-bold">Payment Setup</h2>

                  <p className="mt-1 text-gray-600">
                    Planned payment methods for Kenya-based learners and
                    institutional users.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                        <Smartphone size={24} />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold">M-PESA</h3>

                        <p className="mt-1 text-gray-600">
                          Best for Kenyan mobile money payments.
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-[#D94A00]">
                      Coming Soon
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                        <CreditCard size={24} />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold">Paystack</h3>

                        <p className="mt-1 text-gray-600">
                          Useful for card payments, mobile money, and automated
                          payment references.
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-[#D94A00]">
                      Coming Soon
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                        <Globe size={24} />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold">
                          Institutional Access
                        </h3>

                        <p className="mt-1 text-gray-600">
                          Allows KWCA or partner organizations to sponsor course
                          access for groups.
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-[#D94A00]">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <Lock className="text-[#007F73]" size={30} />

                <div>
                  <h2 className="text-3xl font-bold">Course Access Rules</h2>

                  <p className="mt-1 text-gray-600">
                    Current rules controlling free previews and premium content.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-[#F2FBF8] p-5">
                  <div className="flex gap-3">
                    <CheckCircle className="mt-1 text-[#007F73]" size={22} />

                    <div>
                      <h3 className="font-bold">Free Preview Lessons</h3>

                      <p className="mt-1 text-gray-600">
                        Lessons marked as PREVIEW are visible to learners before
                        payment.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F2FBF8] p-5">
                  <div className="flex gap-3">
                    <CheckCircle className="mt-1 text-[#007F73]" size={22} />

                    <div>
                      <h3 className="font-bold">Premium Lessons</h3>

                      <p className="mt-1 text-gray-600">
                        Lessons marked as PREMIUM redirect learners to pricing
                        until access is unlocked.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F2FBF8] p-5">
                  <div className="flex gap-3">
                    <CheckCircle className="mt-1 text-[#007F73]" size={22} />

                    <div>
                      <h3 className="font-bold">Certificates</h3>

                      <p className="mt-1 text-gray-600">
                        Certificates are connected to learners, courses, and
                        certificate codes in the database.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-orange-50 p-5">
                  <div className="flex gap-3">
                    <AlertCircle className="mt-1 text-[#D94A00]" size={22} />

                    <div>
                      <h3 className="font-bold">Next Upgrade</h3>

                      <p className="mt-1 text-gray-600">
                        Add real payment confirmation so premium access unlocks
                        automatically after successful payment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <Award className="text-[#007F73]" size={30} />

                <div>
                  <h2 className="text-3xl font-bold">
                    Certificate Settings
                  </h2>

                  <p className="mt-1 text-gray-600">
                    Current certificate generation and verification rules.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border p-5">
                  <p className="text-sm font-bold text-gray-500">
                    Certificate Trigger
                  </p>

                  <h3 className="mt-2 text-xl font-bold">
                    Course Completion + Final Quiz Pass
                  </h3>

                  <p className="mt-2 text-gray-600">
                    Learners should complete course lessons and pass the final
                    quiz before receiving a certificate.
                  </p>
                </div>

                <div className="rounded-2xl border p-5">
                  <p className="text-sm font-bold text-gray-500">
                    Certificate Code
                  </p>

                  <h3 className="mt-2 text-xl font-bold">
                    Auto-generated Unique Code
                  </h3>

                  <p className="mt-2 text-gray-600">
                    Each certificate is saved with a unique code for tracking
                    and verification.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F2FBF8] p-5">
                  <p className="text-sm font-bold text-gray-500">
                    Public Verification
                  </p>

                  <h3 className="mt-2 text-xl font-bold">
                    Verify Certificates Online
                  </h3>

                  <p className="mt-2 text-gray-600">
                    Anyone can verify whether a certificate code exists in the
                    KWCA LMS database.
                  </p>

                  <Link
                    href="/verify-certificate"
                    className="mt-5 inline-flex rounded-xl bg-[#007F73] px-5 py-3 font-bold text-white hover:bg-[#00665d]"
                  >
                    Open Certificate Verification
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <CalendarDays className="text-[#007F73]" size={30} />

                <div>
                  <h2 className="text-3xl font-bold">Development Roadmap</h2>

                  <p className="mt-1 text-gray-600">
                    Recommended next features for the KWCA LMS.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-gray-50 p-5">
                  <p className="font-bold">1. Payment integration</p>
                  <p className="mt-1 text-gray-600">
                    Connect Paystack or M-PESA to activate real premium access.
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-5">
                  <p className="font-bold">2. Admin access protection</p>
                  <p className="mt-1 text-gray-600">
                    Restrict admin pages so only approved admins can access
                    management tools.
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-5">
                  <p className="font-bold">3. Certificate verification page</p>
                  <p className="mt-1 text-gray-600">
                    Let anyone verify a certificate using the certificate code.
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-5">
                  <p className="font-bold">4. Better lesson progress table</p>
                  <p className="mt-1 text-gray-600">
                    Track each completed lesson individually instead of only
                    using a course progress percentage.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-[#07122E] p-8 text-white">
            <h2 className="text-3xl font-bold">Settings Summary</h2>

            <p className="mt-3 max-w-4xl leading-7 text-white/70">
              This page gives KWCA a clear view of the platform configuration.
              It also prepares the system for the next major upgrade: real
              payment-based premium access, certificate verification, and
              stronger admin protection.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}