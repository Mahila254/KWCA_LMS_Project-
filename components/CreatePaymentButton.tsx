"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CreditCard } from "lucide-react";

type PaymentType =
  | "PAY_PER_COURSE"
  | "MONTHLY_SUBSCRIPTION"
  | "ANNUAL_SUBSCRIPTION";

type CreatePaymentButtonProps = {
  paymentType: PaymentType;
  amount: number;
  label: string;
  courseId?: string | null;
};

type SupabaseLearner = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
};

export default function CreatePaymentButton({
  paymentType,
  amount,
  label,
  courseId = null,
}: CreatePaymentButtonProps) {
  const router = useRouter();
  const [creatingPayment, setCreatingPayment] = useState(false);

  async function handleCreatePayment() {
    try {
      setCreatingPayment(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        alert("Please login before choosing a payment plan.");
        router.push("/login");
        return;
      }

      const learner = user as SupabaseLearner;

      if (!learner.email) {
        alert("Your account email could not be found. Please login again.");
        router.push("/login");
        return;
      }

      const learnerName =
        learner.user_metadata?.full_name || learner.email || "Learner";

      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: learner.id,
          email: learner.email,
          name: learnerName,
          paymentType,
          amount,
          courseId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong while creating payment.");
        return;
      }

      router.push(`/payment-confirmation?paymentId=${data.payment.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while creating payment.");
    } finally {
      setCreatingPayment(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCreatePayment}
      disabled={creatingPayment}
      className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#007F73] px-6 py-4 font-bold text-white hover:bg-[#00665d] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <CreditCard size={18} />
      {creatingPayment ? "Creating Payment..." : label}
    </button>
  );
}