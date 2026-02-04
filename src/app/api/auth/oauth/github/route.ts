import { NextResponse } from "next/server";

/**
 * Initiates GitHub OAuth flow by redirecting to GitHub's authorization URL
 */
export async function GET() {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/oauth/github/callback`;

    if (!clientId) {
        return NextResponse.json(
            { error: "GitHub OAuth not configured" },
            { status: 500 }
        );
    }

    const scope = "read:user user:email";
    const state = crypto.randomUUID(); // CSRF protection

    const authUrl = new URL("https://github.com/login/oauth/authorize");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", scope);
    authUrl.searchParams.set("state", state);

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
