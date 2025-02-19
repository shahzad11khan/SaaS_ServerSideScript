const redis = require('../services/redisClient'); // Import the redis client

const cacheMiddleware = (keyPrefix) => async (req, res, next) => {
  try {
    const cacheKey = `${keyPrefix}:${req.originalUrl}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log(`Serving from Redis cache for ${cacheKey}`);
      return res.status(200).json(JSON.parse(cachedData));
    }

    res.locals.cacheKey = cacheKey; // Store cache key for later use
    next(); // Continue to the next middleware or controller
  } catch (error) {
    console.error("Error accessing Redis:", error);
    next(); // Continue without cache on error
  }
};

module.exports = cacheMiddleware;
