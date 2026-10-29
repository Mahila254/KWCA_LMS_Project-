// The one place plan prices live. The pricing page shows these and
// /api/payments/create charges these; the browser never sends an amount,
// so a learner can't create a cheaper payment than the plan costs.
export const PLAN_PRICES_KES = {
  PAY_PER_COURSE: 500,
  MONTHLY_SUBSCRIPTION: 1200,
  ANNUAL_SUBSCRIPTION: 5000,
} as const;

export type PlanType = keyof typeof PLAN_PRICES_KES;

export function isPlanType(value: unknown): value is PlanType {
  return typeof value === "string" && value in PLAN_PRICES_KES;
}

export function formatKes(amount: number) {
  return `KES ${amount.toLocaleString("en-KE")}`;
}
