"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock, XCircle } from "lucide-react";

type PaymentStatus = "PENDING" | "PAID" | "FAILED";

type UpdatePaymentStatusButtonProps = {
  paymentId: string;
  status: PaymentStatus;
  label: string;
};

export default function UpdatePaymentStatusButton({
  paymentId,
  status,
  label,
}: UpdatePaymentStatusButtonProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function handleUpdateStatus() {
    try {
      setUpdating(true);

      const response = await fetch("/api/admin/payments/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong while updating payment.");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while updating payment.");
    } finally {
      setUpdating(false);
    }
  }

  const icon =
    status === "PAID" ? (
      <CheckCircle size={16} />
    ) : status === "FAILED" ? (
      <XCircle size={16} />
    ) : (
      <Clock size={16} />
    );

  const className =
    status === "PAID"
      ? "border-green-200 text-green-700 hover:bg-green-50"
      : status === "FAILED"
      ? "border-red-200 text-red-700 hover:bg-red-50"
      : "border-orange-200 text-[#D94A00] hover:bg-orange-50";

  return (
    <button
      type="button"
      onClick={handleUpdateStatus}
      disabled={updating}
      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {icon}
      {updating ? "Updating..." : label}
    </button>
  );
}