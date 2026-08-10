"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { authFetch } from "@/lib/authFetch";
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

      const response = await authFetch("/api/payments/create", {
        method: "POST",
        body: JSON.stringify({
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
      className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E1D59] px-6 py-4 font-bold text-white hover:bg-[#14123D] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <CreditCard size={18} />
      {creatingPayment ? "Creating Payment..." : label}
    </button>
  );
}