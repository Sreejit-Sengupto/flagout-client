import { ApiError } from "../api-error";
import prisma from "../prisma";
import bcrypt from "bcrypt";

export const secureAPI = async (req: Request) => {
    const apiKey = req.headers.get("X-flagout-key");
    if (!apiKey) {
        throw new ApiError(
            401,
            "Unauthorized",
            "Missing x-api-key header. Please provide a valid API key.",
        );
    }

    if (!apiKey.startsWith("f0-")) {
        throw new ApiError(
            400,
            "Invalid API Key",
            "API Key format is incorrect. Expected prefix: f0-",
        );
    }

    const prefix = apiKey.slice(0, 10);
    const record = await prisma.aPIKey.findFirst({
        where: {
            prefix: {
                equals: prefix,
            },
        },
    });

    if (!record) {
        throw new ApiError(403, "Forbidden", "Invalid API key");
    }
    if (record.revoked) {
        throw new ApiError(403, "Revoked", "This API key has been revoked");
    }

    const isMatch = await bcrypt.compare(apiKey, record.key);
    if (!isMatch) {
        throw new ApiError(403, "Forbidden", "Invalid API key");
    }

    return Response.json(
        {
            success: true,
            message: "API Key is correct",
            data: { userId: record.clerk_user_id },
        },
        { status: 200 },
    );
};
