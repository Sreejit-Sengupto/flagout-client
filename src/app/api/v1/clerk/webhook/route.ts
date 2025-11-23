import { NextRequest, NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/webhooks";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const payload: WebhookEvent = await req.json();
        console.log(payload);

        if (payload.type === "user.created") {
            // create a default project for the user
            const user = payload.data.id;
            await prisma.projects.create({
                data: {
                    name: "default",
                    clerk_user_id: user,
                },
            });
            return NextResponse.json(
                { message: "Webhook received successfully" },
                { status: 200 },
            );
        }

        if (payload.type === "user.deleted") {
            // Delete all project, that will automatically remove all flags
            // Delete all api keys
            // Delete all flag environment

            const user_clerk_id = payload.data.id;
            const deleteProjectPrms = prisma.projects.deleteMany({
                where: {
                    clerk_user_id: user_clerk_id,
                },
            });

            const deleteApiKeyPrms = prisma.aPIKey.deleteMany({
                where: {
                    clerk_user_id: user_clerk_id,
                },
            });

            const deleteFlagEnvironmentPrms = prisma.flagEnviroment.deleteMany({
                where: {
                    clerk_user_id: user_clerk_id,
                },
            });

            await Promise.all([
                deleteProjectPrms,
                deleteApiKeyPrms,
                deleteFlagEnvironmentPrms,
            ]);
            return NextResponse.json(
                { message: "Webhook received successfully" },
                { status: 200 },
            );
        }
        return NextResponse.json(
            { message: "Webhook received successfully" },
            { status: 200 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
