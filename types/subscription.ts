// types/subscription.ts
export const SUBSCRIPTION_TYPES = {
  ALL: "All",
  GBV: "gbv",
  SRHR: "srhr",
} as const;

export type SubscriptionType = typeof SUBSCRIPTION_TYPES[keyof typeof SUBSCRIPTION_TYPES] | "All";