import z from "zod";

export const ZGetRecentActivities = z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(30).default(10),
});
export type TGetRecentActivities = z.infer<typeof ZGetRecentActivities>;
