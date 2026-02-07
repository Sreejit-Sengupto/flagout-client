import Redis from "ioredis";

let redisInstance: Redis | null = null;

const getRedisClient = (): Redis => {
    if (!redisInstance) {
        const url = process.env.REDIS_URL;
        if (!url) {
            throw new Error("REDIS_URL is not defined");
        }
        redisInstance = new Redis(url);
    }
    return redisInstance;
};

// Lazy getter - only creates connection when accessed
export const redis = new Proxy({} as Redis, {
    get(_, prop) {
        const client = getRedisClient();
        const value = client[prop as keyof Redis];
        if (typeof value === "function") {
            return value.bind(client);
        }
        return value;
    },
});

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
