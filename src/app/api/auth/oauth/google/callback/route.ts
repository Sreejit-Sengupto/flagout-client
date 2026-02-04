import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

interface GoogleUserInfo {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
}

/**
 * Handles Google OAuth callback:
 * 1. Exchanges code for access token
 * 2. Fetches user profile from Google
 * 3. Creates/finds user in Clerk
 * 4. Creates a sign-in token and redirects with session
 */
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const storedState = req.cookies.get("oauth_state")?.value;

    // CSRF validation
    if (!state || state !== storedState) {
        return NextResponse.redirect(
            new URL("/login?error=invalid_state", req.url)
        );
    }

    if (!code) {
        return NextResponse.redirect(
            new URL("/login?error=no_code", req.url)
        );
    }

    try {
        const clientId = process.env.GOOGLE_CLIENT_ID!;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/oauth/google/callback`;

        // Exchange code for access token
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenData.access_token) {
            console.error("Token exchange failed:", tokenData);
            return NextResponse.redirect(
                new URL("/login?error=token_exchange_failed", req.url)
            );
        }

        // Fetch user profile from Google
        const userResponse = await fetch(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            {
                headers: { Authorization: `Bearer ${tokenData.access_token}` },
            }
        );

        const googleUser: GoogleUserInfo = await userResponse.json();

        if (!googleUser.email) {
            return NextResponse.redirect(
                new URL("/login?error=no_email", req.url)
            );
        }

        const clerk = await clerkClient();

        // Check if user already exists in Clerk
        const existingUsers = await clerk.users.getUserList({
            emailAddress: [googleUser.email],
        });

        let clerkUserId: string;

        if (existingUsers.data.length > 0) {
            // User exists - use their ID
            clerkUserId = existingUsers.data[0].id;
        } else {
            // Create new user in Clerk
            const newUser = await clerk.users.createUser({
                emailAddress: [googleUser.email],
                firstName: googleUser.given_name,
                lastName: googleUser.family_name,
                skipPasswordRequirement: true,
            });
            clerkUserId = newUser.id;
        }

        // Create a sign-in token for the user
        const signInToken = await clerk.signInTokens.createSignInToken({
            userId: clerkUserId,
            expiresInSeconds: 60,
        });

        // Clear the state cookie
        const response = NextResponse.redirect(
            new URL(`/oauth-callback?__clerk_ticket=${signInToken.token}`, req.url)
        );
        response.cookies.delete("oauth_state");

        return response;
    } catch (error) {
        console.error("Google OAuth error:", error);
        return NextResponse.redirect(
            new URL("/login?error=oauth_failed", req.url)
        );
    }
}
