// types/subscription.ts
export const SUBSCRIPTION_TYPES = {
  ALL: "All",
  SECURITY: "security",
  HEALTH: "health",
  INFRASTRUCTURE: "infrastructure",
} as const;

export type SubscriptionType = typeof SUBSCRIPTION_TYPES[keyof typeof SUBSCRIPTION_TYPES] | "All";
