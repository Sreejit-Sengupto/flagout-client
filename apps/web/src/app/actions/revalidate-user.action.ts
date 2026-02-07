"use server";

import { auth, reverificationError } from "@clerk/nextjs/server";

export const reverifyUser = async () => {
    const { has } = await auth.protect();
    const shouldUserRevalidate = !has({ reverification: "strict" });
    if (shouldUserRevalidate) {
        return reverificationError("strict");
    }
    return { success: true };
};
