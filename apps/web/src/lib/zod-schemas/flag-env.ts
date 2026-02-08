import z from "zod";

export const ZAddFlagEnv = z.object({
    prod: z.string().optional(),
    dev: z.string().optional(),
    stage: z.string().optional(),
});
export type TAddFlagEnv = z.infer<typeof ZAddFlagEnv>;
