import crypto from "crypto";

/**
 * Calculate user bucket for rollout percentage
 * Uses SHA256 hash of userId + flagSlug to deterministically assign users to buckets
 */
export function getUserBucket(userId: string, flagSlug: string): number {
    const hash = crypto.createHash("sha256").update(userId + flagSlug).digest("hex");
    const bucket = parseInt(hash.substring(0, 8), 16) % 100;
    return bucket;
}
