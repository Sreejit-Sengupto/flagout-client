import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "@flagout/database";
import { z } from "zod";

const ZCreateProject = z.object({
    name: z.string().min(1, "Project name is required"),
});

/**
 * List all projects for the authenticated user
 */
export async function listProjects(request: FastifyRequest, reply: FastifyReply) {
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
}

/**
 * Create a new project for the authenticated user
 */
export async function createProject(request: FastifyRequest, reply: FastifyReply) {
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
}
