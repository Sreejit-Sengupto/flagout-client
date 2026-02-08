import z from "zod";

export const ZRevokeAPIKey = z.object({
    revoke: z.boolean(),
});
export type TRevokeAPIKey = z.infer<typeof ZRevokeAPIKey>;

export const ZDeleteAPIKey = z.object({
    id: z.string(),
});
export type TDeleteAPIKey = z.infer<typeof ZDeleteAPIKey>;
