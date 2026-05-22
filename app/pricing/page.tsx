"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  CheckCircle,
  CreditCard,
  Calendar,
  Crown,
  ArrowLeft,
} from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      title: "Pay Per Course",
      price: "KES 1,500",
      period: "one-time payment",
      description: "Best for learners who only want access to one course.",
      icon: CreditCard,
      features: [
        "Access one selected course",
        "Unlock all premium lessons",
        "Course resources included",
        "Practice and final quiz access",
        "Certificate after completion",
      ],
      button: "Unlock One Course",
      highlight: false,
    },
    {
      title: "Monthly Subscription",
      price: "KES 2,500",
      period: "per month",
      description: "Best for learners who want access to several courses.",
      icon: Calendar,
      features: [
        "Access all premium courses",
        "Unlimited lessons while subscribed",
        "Downloadable resources",
        "Practice and final quizzes",
        "Certificates for completed courses",
      ],
      button: "Subscribe Monthly",
      highlight: true,
    },
    {
      title: "Annual Subscription",
      price: "KES 20,000",
      period: "per year",
      description: "Best value for conservancy teams and serious learners.",
      icon: Crown,
      features: [
        "Full platform access for one year",
        "All current and future courses",
        "All premium lessons unlocked",
        "All resources and templates",
        "Certificates for all completed courses",
      ],
      button: "Subscribe Annually",
      highlight: false,
    },
  ];

  function handlePaymentClick(planTitle: string) {
    alert(
      `${planTitle} selected. Payment integration will be connected later.`
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#F2FBF8] px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/courses/what-is-a-conservancy"
              className="mb-6 inline-flex items-center gap-2 font-bold text-[#007F73]"
            >
              <ArrowLeft size={18} />
              Back to Course
            </Link>

            <p className="font-bold text-[#007F73]">
              Premium Access
            </p>

            <h1 className="mt-3 max-w-4xl text-5xl font-extrabold">
              Unlock premium lessons and continue learning.
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
              Choose how you want to access KWCA Learning Hub courses. You can
              unlock one course, subscribe monthly, or subscribe annually for
              full platform access.
            </p>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
            {plans.map((plan) => {
              const Icon = plan.icon;

              return (
                <div
                  key={plan.title}
                  className={`rounded-3xl border bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                    plan.highlight
                      ? "border-[#007F73] ring-2 ring-[#007F73]/20"
                      : "border-gray-200"
                  }`}
                >
                  {plan.highlight && (
                    <p className="mb-5 inline-block rounded-full bg-[#007F73] px-4 py-2 text-sm font-bold text-white">
                      Recommended
                    </p>
                  )}

                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#007F73] text-white">
                    <Icon size={30} />
                  </div>

                  <h2 className="text-3xl font-extrabold">
                    {plan.title}
                  </h2>

                  <p className="mt-3 text-gray-600">
                    {plan.description}
                  </p>

                  <div className="mt-7">
                    <p className="text-4xl font-extrabold">
                      {plan.price}
                    </p>

                    <p className="mt-1 text-gray-500">
                      {plan.period}
                    </p>
                  </div>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-3 text-gray-700"
                      >
                        <CheckCircle
                          className="mt-1 shrink-0 text-[#007F73]"
                          size={18}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => handlePaymentClick(plan.title)}
                    className={`mt-8 w-full rounded-xl px-6 py-4 font-bold transition-all duration-300 ${
                      plan.highlight
                        ? "bg-[#007F73] text-white hover:bg-[#00665d]"
                        : "border border-[#007F73] text-[#007F73] hover:bg-[#007F73] hover:text-white"
                    }`}
                  >
                    {plan.button}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold">
              What happens after payment?
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl bg-gray-50 p-6">
                <p className="text-2xl font-bold text-[#007F73]">1</p>
                <h3 className="mt-3 font-bold">Unlock lessons</h3>
                <p className="mt-2 text-gray-600">
                  Premium lessons become available inside the course.
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-6">
                <p className="text-2xl font-bold text-[#007F73]">2</p>
                <h3 className="mt-3 font-bold">Complete quizzes</h3>
                <p className="mt-2 text-gray-600">
                  Learners complete practice and final graded quizzes.
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-6">
                <p className="text-2xl font-bold text-[#007F73]">3</p>
                <h3 className="mt-3 font-bold">Earn certificate</h3>
                <p className="mt-2 text-gray-600">
                  Certificates unlock after course completion and passing.
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