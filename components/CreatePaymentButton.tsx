"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { authFetch } from "@/lib/authFetch";
import { CreditCard } from "lucide-react";
import type { PlanType } from "@/lib/pricing";
import { notify } from "@/lib/notify";

type CreatePaymentButtonProps = {
  paymentType: PlanType;
  label: string;
  courseId?: string | null;
};

export default function CreatePaymentButton({
  paymentType,
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
        notify("Please login before choosing a payment plan.");
        router.push("/login");
        return;
      }

      const response = await authFetch("/api/payments/create", {
        method: "POST",
        body: JSON.stringify({
          paymentType,
          courseId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        notify(data.error || "Something went wrong while creating payment.");
        return;
      }

      router.push(`/payment-confirmation?paymentId=${data.payment.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      notify("Something went wrong while creating payment.");
    } finally {
      setCreatingPayment(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCreatePayment}
      disabled={creatingPayment}
      className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-bold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      <CreditCard size={18} />
      {creatingPayment ? "Creating Payment..." : label}
    </button>
  );
}