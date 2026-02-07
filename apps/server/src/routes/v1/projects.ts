import { FastifyInstance } from "fastify";
import prisma from "@flagout/database";
import { authMiddleware } from "../../plugins/auth.js";
import { z } from "zod";

// Validation schema for creating a project
const ZCreateProject = z.object({
    name: z.string().min(1, "Project name is required"),
});

/**
 * Projects routes
 * All routes require JWT authentication
 */
export async function projectsRoutes(fastify: FastifyInstance): Promise<void> {
    // Apply auth middleware to all routes in this plugin
    fastify.addHook("preHandler", authMiddleware);

    /**
     * GET /api/v1/projects
     * List all projects for the authenticated user
     */
    fastify.get("/", async (request, reply) => {
        const userId = request.userId;

        const projects = await prisma.projects.findMany({
            where: {
                clerk_user_id: {
                    equals: userId,
                },
            },
        });

        return reply.send({
            success: true,
            message: "Projects fetched",
            data: projects,
        });
    });

    /**
     * POST /api/v1/projects
     * Create a new project for the authenticated user
     */
    fastify.post("/", async (request, reply) => {
        const userId = request.userId;
        const body = request.body;

        const result = ZCreateProject.safeParse(body);
        if (!result.success) {
            return reply.status(400).send({
                success: false,
                message: "Invalid request body",
                data: [result.error.message],
            });
        }

        const createdProject = await prisma.projects.create({
            data: {
                clerk_user_id: userId,
                name: result.data.name,
            },
        });

        return reply.status(201).send({
            success: true,
            message: "Project created",
            data: createdProject,
        });
    });
}
