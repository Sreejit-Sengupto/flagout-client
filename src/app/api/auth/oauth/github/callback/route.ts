import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

interface GitHubUser {
    id: number;
    login: string;
    name: string | null;
    email: string | null;
    avatar_url: string;
}

interface GitHubEmail {
    email: string;
    primary: boolean;
    verified: boolean;
    visibility: string | null;
}

/**
 * Handles GitHub OAuth callback:
 * 1. Exchanges code for access token
 * 2. Fetches user profile from GitHub
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
            new URL("/login?error=invalid_state", req.url),
        );
    }

    if (!code) {
        return NextResponse.redirect(new URL("/login?error=no_code", req.url));
    }

    try {
        const clientId = process.env.GITHUB_CLIENT_ID!;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET!;
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/oauth/github/callback`;

        // Exchange code for access token
        const tokenResponse = await fetch(
            "https://github.com/login/oauth/access_token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    code,
                    client_id: clientId,
                    client_secret: clientSecret,
                    redirect_uri: redirectUri,
                }),
            },
        );

        const tokenData = await tokenResponse.json();

        if (!tokenData.access_token) {
            console.error("Token exchange failed:", tokenData);
            return NextResponse.redirect(
                new URL("/login?error=token_exchange_failed", req.url),
            );
        }

        // Fetch user profile from GitHub
        const userResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

        const githubUser: GitHubUser = await userResponse.json();

        // Fetch user's email (might be private)
        let email = githubUser.email;
        if (!email) {
            const emailsResponse = await fetch(
                "https://api.github.com/user/emails",
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.access_token}`,
                        Accept: "application/vnd.github.v3+json",
                    },
                },
            );
            const emails: GitHubEmail[] = await emailsResponse.json();
            const primaryEmail = emails.find((e) => e.primary && e.verified);
            email = primaryEmail?.email || emails[0]?.email;
        }

        if (!email) {
            return NextResponse.redirect(
                new URL("/login?error=no_email", req.url),
            );
        }

        // Parse name into first/last
        const nameParts = (githubUser.name || githubUser.login).split(" ");
        const firstName = nameParts[0] || githubUser.login;
        const lastName = nameParts.slice(1).join(" ") || "";

        const clerk = await clerkClient();

        // Check if user already exists in Clerk
        const existingUsers = await clerk.users.getUserList({
            emailAddress: [email],
        });

        let clerkUserId: string;

        if (existingUsers.data.length > 0) {
            // User exists - use their ID
            clerkUserId = existingUsers.data[0].id;
        } else {
            // Create new user in Clerk
            const newUser = await clerk.users.createUser({
                emailAddress: [email],
                firstName,
                lastName: lastName || undefined,
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
            new URL(
                `/oauth-callback?__clerk_ticket=${signInToken.token}`,
                req.url,
            ),
        );
        response.cookies.delete("oauth_state");

        return response;
    } catch (error) {
        console.error("GitHub OAuth error:", error);
        return NextResponse.redirect(
            new URL("/login?error=oauth_failed", req.url),
        );
    }
}
