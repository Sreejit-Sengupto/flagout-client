import { ApiError } from "@/lib/api-error";
import prisma from "@/lib/prisma";
import { ZCreateProject } from "@/lib/zod-schemas/projects";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const user = await currentUser();
        if (!user) {
            throw new ApiError(
                401,
                "Please login first",
                "You must be logged in to create flags",
            );
        }

        const userProjects = await prisma.projects.findMany({
            where: {
                clerk_user_id: {
                    equals: user.id,
                },
            },
        });

        return Response.json(
            {
                success: true,
                message: "Projects fetched",
                data: userProjects,
            },
            { status: 201 },
        );
    } catch (error) {
        if (error instanceof ApiError) {
            return Response.json(
                {
                    success: false,
                    message: error.message,
                    data: [error.details],
                },
                { status: error.status },
            );
        }

        // fallback for unhandled errors
        return Response.json(
            {
                success: false,
                message: "Internal Server Error",
                data: [],
            },
            { status: 500 },
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = ZCreateProject.safeParse(body);
        if (!result.success) {
            throw new ApiError(
                400,
                "Invalid request body",
                result.error.message,
            );
        }
        const data = result.data;

        const user = await currentUser();
        if (!user) {
            throw new ApiError(
                401,
                "Please login first",
                "You must be logged in to create flags",
            );
        }

        // add subscription check later
        const createdProject = await prisma.projects.create({
            data: {
                clerk_user_id: user.id,
                name: data.name,
            },
        });

        return Response.json(
            {
                success: true,
                message: "Project created",
                data: createdProject,
            },
            { status: 201 },
        );
    } catch (error) {
        if (error instanceof ApiError) {
            return Response.json(
                {
                    success: false,
                    message: error.message,
                    data: [error.details],
                },
                { status: error.status },
            );
        }

        // fallback for unhandled errors
        return Response.json(
            {
                success: false,
                message: "Internal Server Error",
                data: [],
            },
            { status: 500 },
        );
    }
}
