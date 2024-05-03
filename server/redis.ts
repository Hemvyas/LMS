require("dotenv").config();
import { Redis } from "ioredis";

const redisClient = () => {
  const redisURL = process.env.REDIS_URL;
  if (redisURL) {
    console.log("Redis Connected");
    return redisURL;
  }
  throw new Error("Redis Connection failed");
};

export const redis = new Redis(redisClient());
