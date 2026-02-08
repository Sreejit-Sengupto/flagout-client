import crypto from "crypto";
export const getUserBucket = (userId: string, flagSlug: string) => {
    const hash = crypto
        .createHash("sha256")
        .update(`${userId}:${flagSlug}`)
        .digest("hex");

    const intVal = parseInt(hash.slice(0, 8), 16);
    return intVal % 100;
};
