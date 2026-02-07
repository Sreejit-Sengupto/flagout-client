"use server";

import prisma from "@flagout/database";

export const getFlagIdFromSlug = async (slug: string) => {
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
};
