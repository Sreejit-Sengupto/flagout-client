import { FastifyRequest, FastifyReply } from "fastify";
import prisma, { Environment } from "@flagout/database";
import { getUserBucket } from "../../lib/user-bucket.js";

type EvaluateRequest = FastifyRequest<{
    Querystring: {
        flag_slug: string;
        user_id: string;
        user_type?: string;
        environment?: string;
    };
}>;

const checkEnvironment = async (
    clerkUserId: string,
    requestEnv: Environment | undefined,
    requestOrigin: string | undefined,
): Promise<boolean> => {
    if (!requestEnv || !requestOrigin) return true;

    const envSettings = await prisma.flagEnviroment.findFirst({
        where: { clerk_user_id: clerkUserId },
    });

    if (!envSettings) return true;

    let expectedOrigin: string | null = null;
    if (requestEnv === "DEVELOPMENT") expectedOrigin = envSettings.dev;
    else if (requestEnv === "PRODUCTION") expectedOrigin = envSettings.prod;
    else if (requestEnv === "STAGING") expectedOrigin = envSettings.stage;

    if (!expectedOrigin) return true;

    return requestOrigin === expectedOrigin;
};

/**
 * Evaluate a feature flag for a user (SDK endpoint)
 */
export async function evaluateFlag(request: EvaluateRequest, reply: FastifyReply) {
    const userId = request.apiKeyUserId!;
    const { flag_slug, user_id, user_type, environment } = request.query;
    const origin = request.headers.origin;

    if (!flag_slug || !user_id) {
        return reply.status(400).send({
            success: false,
            message: "Missing required parameters",
            data: ["flag_slug and user_id are required"],
        });
    }

    // Find the flag
    const flag = await prisma.featureFlags.findFirst({
        where: {
            slug: flag_slug,
            clerk_user_id: userId,
        },
    });

    if (!flag) {
        return reply.status(404).send({
            success: false,
            message: "Flag not found",
            data: [],
        });
    }

    // Check environment match
    const envMatch = await checkEnvironment(
        userId,
        environment as Environment | undefined,
        origin,
    );

    if (!envMatch) {
        await prisma.flagEvaluationLogs.create({
            data: {
                clerk_user_id: userId,
                flag_id: flag.id,
                visited_user_id: user_id,
                enabled: false,
            },
        });

        return reply.send({
            success: true,
            message: "Environment mismatch",
            data: { showFeature: false },
        });
    }

    // Check if flag is enabled
    if (!flag.enabled) {
        await prisma.flagEvaluationLogs.create({
            data: {
                clerk_user_id: userId,
                flag_id: flag.id,
                visited_user_id: user_id,
                enabled: false,
            },
        });

        return reply.send({
            success: true,
            message: "Flag is disabled",
            data: { showFeature: false },
        });
    }

    // Check targeting
    const targeting = flag.targeting;
    if (user_type && !targeting.includes("ALL") && !targeting.includes(user_type as never)) {
        await prisma.flagEvaluationLogs.create({
            data: {
                clerk_user_id: userId,
                flag_id: flag.id,
                visited_user_id: user_id,
                enabled: false,
            },
        });

        return reply.send({
            success: true,
            message: "User not in target audience",
            data: { showFeature: false },
        });
    }

    // Check rollout percentage
    const userBucket = getUserBucket(user_id, flag_slug);
    const showFeature = userBucket < flag.rollout_percentage;

    // Log the evaluation
    await prisma.flagEvaluationLogs.create({
        data: {
            clerk_user_id: userId,
            flag_id: flag.id,
            visited_user_id: user_id,
            enabled: showFeature,
        },
    });

    return reply.send({
        success: true,
        message: showFeature ? "Feature enabled" : "Feature disabled by rollout",
        data: { showFeature },
    });
}

/**
 * Get allowed origins for CORS (SDK endpoint)
 */
export async function getAllowedOrigins(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.apiKeyUserId!;

    const envSettings = await prisma.flagEnviroment.findFirst({
        where: { clerk_user_id: userId },
    });

    if (!envSettings) {
        return reply.send({
            success: true,
            message: "No environment settings found",
            data: [],
        });
    }

    const origins: string[] = [];
    if (envSettings.dev) origins.push(envSettings.dev);
    if (envSettings.prod) origins.push(envSettings.prod);
    if (envSettings.stage) origins.push(envSettings.stage);

    return reply.send({
        success: true,
        message: "Allowed origins fetched",
        data: origins,
    });
}
