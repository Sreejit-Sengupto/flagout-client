import Redis from "ioredis";

const getRedisUrl = () => {
    if (process.env.REDIS_URL) {
        return process.env.REDIS_URL;
    }
    throw new Error("REDIS_URL is not defined");
};

export const redis = new Redis(getRedisUrl());

export const cache = {
    get: async <T>(key: string): Promise<T | null> => {
        const data = await redis.get(key);
        if (!data) return null;
        return JSON.parse(data) as T;
    },
    set: async <T>(key: string, value: T, ttlSeconds: number = 3600) => {
        await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
    },
    del: async (key: string) => {
        await redis.del(key);
    },
    invalidate: async (pattern: string) => {
        const stream = redis.scanStream({
            match: pattern,
        });

        stream.on("data", (keys) => {
            if (keys.length) {
                const pipeline = redis.pipeline();
                keys.forEach((key: string) => {
                    pipeline.del(key);
                });
                pipeline.exec();
            }
        });
    },
};
