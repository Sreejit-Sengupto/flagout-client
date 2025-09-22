import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
    "/login(.*)",
    "/register(.*)",
    "/reset-password(.*)",
    "/",
    "/oauth-callback(.*)",
    "/api/v1/flags/evaluate",
    "/api/v1/flags/allowed-origins",
]);

const isApiRoute = createRouteMatcher(["/api/v1(.*)"]);

const corsHeaders = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-flagout-key",
};

export default clerkMiddleware(async (auth, req: NextRequest) => {
    // Handle CORS for API routes that require it
    if (isApiRoute(req)) {
        const origin = req.headers.get("Origin") ?? "";
        const isPreflighted = req.method === "OPTIONS";

        if (isPreflighted) {
            const preflightHeaders = {
                "Access-Control-Allow-Origin": origin ?? "*",
                ...corsHeaders,
            };
            return NextResponse.json({}, { headers: preflightHeaders });
        }

        const response = NextResponse.next();
        response.headers.set("Access-Control-Allow-Origin", origin ?? "*");
        Object.entries(corsHeaders).forEach(([key, value]) => {
            response.headers.set(key, value);
        });
        return response;
    }

    // Handle Clerk authentication for protected routes
    if (!isPublicRoute(req) && req.method !== "OPTIONS") {
        await auth.protect();
    }

    // For non-API routes or requests without origin header, proceed normally

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
