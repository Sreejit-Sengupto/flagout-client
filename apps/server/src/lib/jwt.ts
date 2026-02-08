import jwt from "jsonwebtoken";

export interface ClerkJwtPayload {
    sub: string; // User ID (clerk_user_id)
    exp: number; // Expiration timestamp
    nbf: number; // Not before timestamp
    iat: number; // Issued at timestamp
    azp?: string; // Authorized party (origin)
    sts?: string; // Status (for organizations)
}

/**
 * Manually verify a Clerk session token using the PEM public key.
 * Follows Clerk's manual JWT verification guide.
 *
 * @param token - The JWT session token from Authorization header
 * @returns Decoded payload with user information
 * @throws Error if token is invalid, expired, or verification fails
 */
export function verifyClerkToken(token: string): ClerkJwtPayload {
    const publicKey = process.env.CLERK_PEM_PUBLIC_KEY;
    if (!publicKey) {
        throw new Error(
            "CLERK_PEM_PUBLIC_KEY environment variable is not set",
        );
    }

    // Verify token signature using RS256 algorithm
    const decoded = jwt.verify(token, publicKey, {
        algorithms: ["RS256"],
    }) as ClerkJwtPayload;

    // Validate expiration (exp) and not before (nbf) claims
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
        throw new Error("Token has expired");
    }
    if (decoded.nbf > currentTime) {
        throw new Error("Token is not yet valid");
    }

    // Validate authorized party (azp) claim if present
    if (decoded.azp) {
        const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
        const permittedOrigins = corsOrigin.split(",").map((o) => o.trim());

        if (!permittedOrigins.includes(decoded.azp)) {
            throw new Error(
                `Invalid 'azp' claim. Origin '${decoded.azp}' is not permitted`,
            );
        }
    }

    return decoded;
}

/**
 * Extract bearer token from Authorization header
 */
export function extractBearerToken(
    authHeader: string | undefined,
): string | null {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }
    return authHeader.slice(7);
}
