"use server";

import prisma from "@/lib/prisma";

export const getFlagIdFromSlug = async (slug: string) => {
    try {
        const flag = await prisma.featureFlags.findFirst({
            where: {
                slug: {
                    equals: slug,
                },
            },
        });
        if (!flag) {
            throw new Error("No flag found with this ID");
        }

        return flag.id;
    } catch (error) {
        throw error;
    }
};
