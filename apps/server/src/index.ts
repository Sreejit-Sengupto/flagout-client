import Fastify from "fastify";
import cors from "@fastify/cors";

async function main() {
    const server = Fastify({
        logger: true,
    });

    // Register CORS
    await server.register(cors, {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        credentials: true,
    });

    // Health check
    server.get("/health", async () => {
        return { status: "ok", timestamp: new Date().toISOString() };
    });

    // API v1 routes placeholder
    server.get("/api/v1", async () => {
        return {
            message: "Flagout API v1",
            version: "1.0.0",
            endpoints: [
                "/api/v1/flags",
                "/api/v1/flags/evaluate",
                "/api/v1/projects",
                "/api/v1/api-keys",
            ],
        };
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
