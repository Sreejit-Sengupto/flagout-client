import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";

// Route imports
import { projectsRoutes } from "./routes/v1/projects.js";
import { flagsRoutes } from "./routes/v1/flags.js";
import { flagsIdRoutes } from "./routes/v1/flags-id.js";
import { metricsRoutes } from "./routes/v1/metrics.js";
import { metricsIdRoutes } from "./routes/v1/metrics-id.js";
import { apiKeysRoutes } from "./routes/v1/api-keys.js";
import { apiKeysIdRoutes } from "./routes/v1/api-keys-id.js";
import { environmentRoutes } from "./routes/v1/environment.js";
import { recentActivityRoutes } from "./routes/v1/recent-activity.js";
import { evaluateRoutes } from "./routes/v1/evaluate.js";
import { allowedOriginsRoutes } from "./routes/v1/allowed-origins.js";
import { clerkWebhookRoutes } from "./routes/v1/clerk-webhook.js";

async function main() {
    const server = Fastify({
        logger: true,
    });

    // Register CORS
    await server.register(cors, {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    });

    // Health check
    server.get("/health", async () => {
        return { status: "ok", timestamp: new Date().toISOString() };
    });

    // API v1 info
    server.get("/api/v1", async () => {
        return {
            message: "Flagout API v1",
            version: "1.0.0",
        };
    });

    // ===== JWT Authenticated Routes (Dashboard) =====
    await server.register(projectsRoutes, { prefix: "/api/v1/projects" });
    await server.register(flagsRoutes, { prefix: "/api/v1/flags" });
    await server.register(flagsIdRoutes, { prefix: "/api/v1/flags/:id" });
    await server.register(metricsRoutes, { prefix: "/api/v1/flags/metrics" });
    await server.register(metricsIdRoutes, { prefix: "/api/v1/flags/metrics/:id" });
    await server.register(apiKeysRoutes, { prefix: "/api/v1/api-keys" });
    await server.register(apiKeysIdRoutes, { prefix: "/api/v1/api-keys/:id" });
    await server.register(environmentRoutes, { prefix: "/api/v1/environment" });
    await server.register(recentActivityRoutes, { prefix: "/api/v1/recent-activity" });

    // ===== API Key Authenticated Routes (SDK) =====
    await server.register(evaluateRoutes, { prefix: "/api/v1/flags/evaluate" });
    await server.register(allowedOriginsRoutes, { prefix: "/api/v1/allowed-origins" });

    // ===== Webhook Routes (Svix verified) =====
    await server.register(clerkWebhookRoutes, { prefix: "/api/v1/clerk/webhook" });

    // Global error handler
    server.setErrorHandler((error, request, reply) => {
        server.log.error(error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return reply.status(500).send({
            success: false,
            message: "Internal Server Error",
            data: [message],
        });
    });

    // Start server
    try {
        const port = parseInt(process.env.PORT || "3001");
        const host = process.env.HOST || "0.0.0.0";

        await server.listen({ port, host });
        console.log(`🚀 Server running at http://${host}:${port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}

main();
