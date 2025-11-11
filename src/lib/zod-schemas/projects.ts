import z from "zod";

export const ZCreateProject = z.object({
    name: z.string(),
});
export type TCreateProject = z.infer<typeof ZCreateProject>;
