const redis = require('redis');

let client;
let redisAvailable = false;

(async () => {
  try {
    client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    client.on('connect', () => {
      redisAvailable = true;
      console.log('Redis connected successfully!');
    });
    client.on('error', (err) => {
      redisAvailable = false;
      console.error('Redis error:', err);
    });
    await client.connect();
    redisAvailable = true;
  } catch (err) {
    redisAvailable = false;
    console.error('Redis initial connection error:', err);
  }
})();

module.exports = {
  get: async (key) => {
    if (!redisAvailable) return null;
    try {
      return await client.get(key);
    } catch (e) {
      console.warn('Redis get fallback:', e.message);
      return null;
    }
  },
  set: async (key, value, options) => {
    if (!redisAvailable) return false;
    try {
      if (options && options.EX) {
        await client.set(key, value, { EX: options.EX });
      } else {
        await client.set(key, value);
      }
      return true;
    } catch (e) {
      console.warn('Redis set fallback:', e.message);
      return false;
    }
  },
  del: async (key) => {
    if (!redisAvailable) return false;
    try {
      await client.del(key);
      return true;
    } catch (e) {
      console.warn('Redis del fallback:', e.message);
      return false;
    }
  },
  isAvailable: () => redisAvailable
}; 