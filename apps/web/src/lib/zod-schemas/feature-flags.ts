import { z } from "zod";

export const ZFeatureFlags = z.object({
    name: z.string().max(25, "Should be less than 25 characters"),
    description: z.string().max(500, "Should be less than 500 characters"),
    enabled: z.boolean(),
    rolloutPercentage: z
        .number()
        .min(0, "Must be greater than 0")
        .max(100, "Must be less than equal to 100"),
    environment: z.enum(["DEVELOPMENT", "PRODUCTION", "STAGING"]),
    targeting: z.enum(["ALL", "INTERNAL", "BETA", "PREMIUM"]).array(),
    projectId: z.string(),
});
export type TFeatureFlags = z.infer<typeof ZFeatureFlags>;

export const ZGetAllFeatureFlags = z.object({
    projectId: z.string(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(30).default(10),
});
export type TGetAllFeatureFlags = z.infer<typeof ZGetAllFeatureFlags>;

export const ZUpdateFeatureFlags = ZFeatureFlags.partial();
export type TUpdateFeatureFlags = z.infer<typeof ZUpdateFeatureFlags>;
