"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/authFetch";
import { CheckCircle, RefreshCw } from "lucide-react";
import { notify } from "@/lib/notify";

type CheckPaymentStatusButtonProps = {
  paymentId: string;
  courseSlug?: string | null;
};

export default function CheckPaymentStatusButton({
  paymentId,
  courseSlug,
}: CheckPaymentStatusButtonProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  async function handleCheckStatus() {
    try {
      setChecking(true);

      const response = await authFetch(`/api/payments/status?paymentId=${paymentId}`);

      const data = await response.json();

      if (!response.ok) {
        notify(data.error || "Something went wrong while checking payment.");
        return;
      }

      if (data.payment.status !== "PAID") {
        notify(
          `Your payment is still ${data.payment.status}. Please wait for admin confirmation.`
        );
        router.refresh();
        return;
      }

      notify("Payment confirmed. Premium access is now unlocked.");

      if (courseSlug) {
        router.push(`/courses/${courseSlug}`);
      } else {
        router.push("/courses");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      notify("Something went wrong while checking payment.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCheckStatus}
      disabled={checking}
      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {checking ? <RefreshCw className="animate-spin" size={18} /> : <CheckCircle size={18} />}
      {checking ? "Checking Payment..." : "Check Payment Status & Continue"}
    </button>
  );
}