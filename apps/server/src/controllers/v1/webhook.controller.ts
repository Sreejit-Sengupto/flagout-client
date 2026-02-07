import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "@flagout/database";
import { Webhook } from "svix";

interface WebhookEvent {
    type: string;
    data: {
        id: string;
        email_addresses?: { email_address: string }[];
    };
}

/**
 * Handle Clerk webhook events
 */
export async function handleClerkWebhook(request: FastifyRequest, reply: FastifyReply) {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
        return reply.status(500).send({
            success: false,
            message: "Webhook secret not configured",
            data: [],
        });
    }

    const headers = request.headers;
    const svixId = headers["svix-id"] as string;
    const svixTimestamp = headers["svix-timestamp"] as string;
    const svixSignature = headers["svix-signature"] as string;

    if (!svixId || !svixTimestamp || !svixSignature) {
        return reply.status(400).send({
            success: false,
            message: "Missing svix headers",
            data: [],
        });
    }

    const body = JSON.stringify(request.body);
    const wh = new Webhook(webhookSecret);
    let event: WebhookEvent;

    try {
        event = wh.verify(body, {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature,
        }) as WebhookEvent;
    } catch (err) {
        return reply.status(400).send({
            success: false,
            message: "Invalid webhook signature",
            data: [],
        });
    }

    // Handle events
    if (event.type === "user.created") {
        await prisma.projects.create({
            data: {
                clerk_user_id: event.data.id,
                name: "Default Project",
            },
        });
    } else if (event.type === "user.deleted") {
        await Promise.all([
            prisma.projects.deleteMany({
                where: { clerk_user_id: event.data.id },
            }),
            prisma.aPIKey.deleteMany({
                where: { clerk_user_id: event.data.id },
            }),
        ]);
    }

    return reply.send({
        success: true,
        message: "Webhook processed",
        data: [],
    });
}
