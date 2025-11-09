# Redis Implementation Guide for Trimora Backend

## 🚀 Overview

This guide explains the complete Redis caching implementation for the Trimora Backend project. The implementation provides ultra-fast query performance with intelligent caching strategies.

## 📁 File Structure

```
utils/
├── redisClient.js          # Core Redis client with optimizations
├── cacheService.js         # High-level cache operations
├── cacheKeys.js           # Cache key generators
└── redisMonitor.js        # Performance monitoring

middleware/
└── cacheMiddleware.js     # Express middleware for caching

controllers/
└── optimizedSalonController.js  # Example optimized controller
```

## 🔧 Setup & Configuration

### 1. Environment Variables

Add these to your `.env` file:

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
REDIS_DB=0
REDIS_URL=redis://username:password@host:port/db  # For production

# Cache Configuration
CACHE_TTL_SHORT=300      # 5 minutes
CACHE_TTL_MEDIUM=1800    # 30 minutes
CACHE_TTL_LONG=3600      # 1 hour
CACHE_TTL_VERY_LONG=86400 # 24 hours
```

### 2. Redis Installation

**Local Development:**
```bash
# Windows (using WSL or Docker)
docker run -d -p 6379:6379 redis:alpine

# macOS
brew install redis
brew services start redis

# Linux
sudo apt-get install redis-server
sudo systemctl start redis
```

**Production:**
- Use Redis Cloud, AWS ElastiCache, or Azure Cache for Redis
- Configure with TLS and authentication

## 🎯 Key Features

### 1. Intelligent Caching Strategies

- **Cache-First Approach**: Always check cache before database
- **Automatic Invalidation**: Smart cache invalidation on data changes
- **TTL Management**: Different TTLs for different data types
- **Bulk Operations**: Efficient bulk caching for better performance

### 2. Performance Optimizations

- **Connection Pooling**: Optimized Redis connections
- **Pipeline Operations**: Batch Redis commands
- **Error Handling**: Graceful fallbacks when Redis is unavailable
- **Memory Management**: Efficient memory usage with compression

### 3. Monitoring & Analytics

- **Hit Ratio Tracking**: Monitor cache effectiveness
- **Performance Metrics**: Track response times
- **Memory Analysis**: Monitor Redis memory usage
- **Health Checks**: Real-time Redis health monitoring

## 📊 Usage Examples

### 1. Basic Caching

```javascript
const CacheService = require('./utils/cacheService');

// Cache data
await CacheService.set('user:123', userData, 1800);

// Get cached data
const user = await CacheService.get('user:123');

// Delete cache
await CacheService.del('user:123');
```

### 2. Entity-Specific Caching

```javascript
// Cache user
await CacheService.cacheUser(user);

// Get user from cache
const cachedUser = await CacheService.getUserFromCache(userId);

// Invalidate user cache
await CacheService.invalidateUser(userId, user.email);
```

### 3. Using Cache Middleware

```javascript
const CacheMiddleware = require('./middleware/cacheMiddleware');

// Apply to routes
router.get('/salons', 
  CacheMiddleware.cacheList('salon', 300),  // 5 minutes TTL
  salonController.getAllSalons
);

router.get('/salons/:id',
  CacheMiddleware.cacheEntity('salon', 1800),  // 30 minutes TTL
  salonController.getSalon
);
```

### 4. Rate Limiting

```javascript
// Apply rate limiting middleware
router.use('/api/v1/auth', 
  CacheMiddleware.rateLimit(100, 3600)  // 100 requests per hour
);
```

## 🔄 Cache Invalidation Strategies

### 1. Automatic Invalidation

```javascript
// When creating new salon
const newSalon = await Salon.create(req.body);
await CacheService.cacheSalon(newSalon);
await CacheService.invalidateSalon(newSalon._id);
```

### 2. Pattern-Based Invalidation

```javascript
// Invalidate all salon-related caches
await CacheService.delPattern('salons:list:*');
await CacheService.delPattern('salons:nearby:*');
```

### 3. Manual Invalidation

```javascript
// Clear specific cache
await CacheService.del(CacheKeys.salon(salonId));

// Clear all cache (admin only)
await CacheService.clearAllCache();
```

## 📈 Performance Monitoring

### 1. Get Cache Statistics

```javascript
const RedisMonitor = require('./utils/redisMonitor');

// Get comprehensive stats
const stats = await RedisMonitor.getComprehensiveStats();
console.log('Hit Ratio:', stats.performance.hitRatio);
console.log('Total Requests:', stats.performance.totalRequests);
```

### 2. Performance Report

```javascript
// Generate detailed performance report
const report = await RedisMonitor.generatePerformanceReport();
console.log('Status:', report.summary.status);
console.log('Recommendations:', report.recommendations);
```

### 3. Health Check

```javascript
// Check Redis health
const health = await CacheService.healthCheck();
if (!health.healthy) {
  console.warn('Redis is not healthy:', health);
}
```

## 🛠️ API Endpoints

### Cache Management

```javascript
// Get cache status
GET /api/v1/cache/status

// Clear all cache (admin only)
DELETE /api/v1/cache/clear

// Warm up cache (admin only)
POST /api/v1/cache/warmup

// Health check
GET /api/v1/health
```

### Example Response

```json
{
  "status": "success",
  "data": {
    "redis": {
      "connected": true,
      "client": true,
      "ping": true,
      "info": "Available",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

## 🎨 Best Practices

### 1. Cache Key Naming

```javascript
// Use consistent naming patterns
const CacheKeys = {
  user: (id) => `user:${id}`,
  userByEmail: (email) => `user:email:${email}`,
  salonsList: (query) => `salons:list:${Buffer.from(JSON.stringify(query)).toString('base64')}`,
  searchResults: (query) => `search:${Buffer.from(JSON.stringify(query)).toString('base64')}`
};
```

### 2. TTL Selection

```javascript
// Short TTL for frequently changing data
const SHORT_TTL = 300;  // 5 minutes

// Medium TTL for moderately changing data
const MEDIUM_TTL = 1800;  // 30 minutes

// Long TTL for static data
const LONG_TTL = 3600;  // 1 hour

// Very long TTL for rarely changing data
const VERY_LONG_TTL = 86400;  // 24 hours
```

### 3. Error Handling

```javascript
try {
  const data = await CacheService.get(key);
  if (data) {
    return data;  // Return cached data
  }
} catch (error) {
  console.error('Cache error:', error);
  // Continue without cache
}

// Fetch from database
const data = await fetchFromDatabase();
```

### 4. Cache Warming

```javascript
// Warm cache on startup
const warmCache = async () => {
  try {
    await CacheService.warmCache();
    console.log('Cache warmed successfully');
  } catch (error) {
    console.error('Cache warming failed:', error);
  }
};
```

## 🔍 Debugging

### 1. Enable Debug Logging

```javascript
// Add to your app.js
if (process.env.NODE_ENV === 'development') {
  console.log('🔴 Redis Debug Mode Enabled');
}
```

### 2. Monitor Cache Performance

```javascript
// Track cache operations
const startTime = Date.now();
const data = await CacheService.get(key);
const duration = Date.now() - startTime;

if (duration > 100) {
  console.warn(`Slow cache operation: ${duration}ms for key ${key}`);
}
```

### 3. Common Issues

**Redis Connection Failed:**
- Check Redis server is running
- Verify connection settings
- Check firewall/network issues

**High Memory Usage:**
- Implement key expiration
- Use compression for large objects
- Monitor memory fragmentation

**Low Hit Ratio:**
- Increase TTL for frequently accessed data
- Implement cache warming
- Review cache invalidation strategy

## 🚀 Production Deployment

### 1. Redis Configuration

```javascript
// Production Redis config
const redisConfig = {
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false,
    connectTimeout: 10000,
    keepAlive: 30000
  },
  retry_strategy: (options) => {
    if (options.attempt > 3) {
      return new Error('Max retry attempts reached');
    }
    return Math.min(options.attempt * 100, 3000);
  }
};
```

### 2. Monitoring Setup

```javascript
// Set up monitoring
setInterval(async () => {
  const health = await CacheService.healthCheck();
  if (!health.healthy) {
    // Send alert to monitoring service
    console.error('Redis health check failed');
  }
}, 60000);  // Check every minute
```

### 3. Backup Strategy

```javascript
// Implement cache backup
const backupCache = async () => {
  try {
    // Export cache data
    const data = await redisClient.getStats();
    // Store backup
    await saveBackup(data);
  } catch (error) {
    console.error('Cache backup failed:', error);
  }
};
```

## 📚 Additional Resources

- [Redis Documentation](https://redis.io/documentation)
- [Node.js Redis Client](https://github.com/redis/node-redis)
- [Redis Best Practices](https://redis.io/topics/memory-optimization)
- [Cache Patterns](https://redis.io/topics/patterns)

## 🤝 Support

For questions or issues with the Redis implementation:

1. Check the logs for error messages
2. Verify Redis connection settings
3. Monitor cache performance metrics
4. Review this documentation

---

**Happy Caching! 🚀** 