import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
    prisma: PrismaClient;
};

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

// Re-export Prisma client and types
export { PrismaClient } from "@prisma/client";
export { withAccelerate } from "@prisma/extension-accelerate";
export type { Prisma } from "@prisma/client";

// Re-export all generated types
export type {
    FeatureFlags,
    RecentActivity,
    APIKey,
    FlagEnviroment,
    FlagEvaluationLogs,
    AISum,
    Projects,
} from "@prisma/client";

// Re-export enums
export { TargetUser, Environment } from "@prisma/client";
