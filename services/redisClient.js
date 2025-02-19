require('dotenv').config(); // Ensure it is loaded before creating Redis instance
const Redis = require("ioredis");
 // Ensure environment variables are loaded

 console.log("Redis URL:", process.env.UPSTASH_REDIS_REST_URL);
console.log("Redis Token:", process.env.UPSTASH_REDIS_REST_TOKEN);
const redis = new Redis("rediss://:AUIqAAIjcDE1YzA5YzkwM2EzMmQ0M2U4OThlMzVlMGMyOWY5MjI3ZnAxMA@good-oriole-16938.upstash.io:6379");

// const redis = new Redis(process.env.UPSTASH_REDIS_REST_URL, {
//   password: process.env.UPSTASH_REDIS_REST_TOKEN,
//   tls: {
//     rejectUnauthorized: false, // Required for some Upstash setups to avoid self-signed certificate errors
//   },
// });

redis.on('connect', () => {
  console.log('Connected to Redis successfully');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

module.exports = redis;
