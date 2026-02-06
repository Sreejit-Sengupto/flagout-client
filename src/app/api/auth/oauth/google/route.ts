import { NextResponse } from "next/server";

/**
 * Initiates Google OAuth flow by redirecting to Google's authorization URL
 */
export async function GET() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/oauth/google/callback`;

    if (!clientId) {
        return NextResponse.json(
            { error: "Google OAuth not configured" },
            { status: 500 },
        );
    }

    const scope = "openid email profile";
    const state = crypto.randomUUID(); // CSRF protection

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", scope);
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");

    // Store state in cookie for CSRF validation
    const response = NextResponse.redirect(authUrl.toString());
    response.cookies.set("oauth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 10, // 10 minutes
    });

    return response;
}
