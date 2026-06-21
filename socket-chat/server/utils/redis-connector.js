// redis-connector.js

import { createClient } from "redis";

// Connect to Redis 
async function connectToRedis() {
    try {
        // Create a redis client for all users to share
        const redis = createClient({
            url: "redis://localhost:6379"
        });
        await redis.connect();
        console.log("Connected to Redis successfully");
        return redis;
    } catch (err) {
        console.error("Redis error: ", err);
    }
}

export { connectToRedis }; 