const jwt = require('../utils/jwt');
const Admin = require('../models/Admin');
const SaloonUser = require('../models/SaloonUser');
const User = require('../models/User');
const redisClient = require('../utils/redisClient');

// Cache prefixes
const ADMIN_CACHE_PREFIX = 'admin:';
const SALOON_USER_CACHE_PREFIX = 'saloonUser:';
const USER_CACHE_PREFIX = 'user:';
const REFRESH_TOKEN_PREFIX = 'refreshToken:';

function verifyAccess(allowedRoles = []) {
  return async function (req, res, next) {
    // Extract token from Authorization header
    let token;
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      console.warn('No authentication token provided');
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required. Please log in.'
      });
    }
    try {
      // Verify and decode the JWT token
      let payload;
      try {
        console.log('Verifying access token...');
        payload = jwt.verifyAccessToken(token);
        console.log('JWT Payload verified:', {
          userId: payload.id,
          roles: payload.roles,
          iat: payload.iat ? new Date(payload.iat * 1000).toISOString() : null,
          exp: payload.exp ? new Date(payload.exp * 1000).toISOString() : null
        });
      } catch (jwtError) {
        console.error('JWT Verification Failed:', {
          error: jwtError.message,
          tokenPrefix: token ? `${token.substring(0, 10)}...` : 'undefined',
          timestamp: new Date().toISOString(),
          stack: jwtError.stack
        });
        return res.status(401).json({ 
          success: false,
          message: 'Session expired or invalid. Please log in again.',
          error: 'INVALID_TOKEN'
        });
      }
      
      let user = null;
      let roles = [];
      
      // Try admin first
      try {
        const cacheKey = `${ADMIN_CACHE_PREFIX}${payload.id}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          user = JSON.parse(cached);
          roles = Array.isArray(user.roles) ? user.roles : [];
          console.log(`Found admin user in cache: ${user._id}`, { roles });
        }
      } catch (cacheError) {
        console.error('Redis cache error (admin):', cacheError.message);
      }
      
      if (!user) {
        console.log(`Admin not found in cache, checking database for ID: ${payload.id}`);
        try {
          user = await Admin.findById(payload.id);
          if (user) {
            roles = Array.isArray(user.roles) ? user.roles : [];
            console.log(`Found admin in database: ${user._id}`, { roles });
            
            // Cache the user
            try {
              await redisClient.set(
                `${ADMIN_CACHE_PREFIX}${user._id}`,
                JSON.stringify(user),
                { EX: 900 } // 15 minutes
              );
            } catch (cacheError) {
              console.error('Failed to cache admin user:', cacheError.message);
            }
          }
        } catch (dbError) {
          console.error('Database error (admin lookup):', dbError.message);
        }
      }
      
      // If not admin, try saloonUser
      if (!user) {
        try {
          const cacheKey = `${SALOON_USER_CACHE_PREFIX}${payload.id}`;
          const cached = await redisClient.get(cacheKey);
          if (cached) {
            user = JSON.parse(cached);
            roles = Array.isArray(user.roles) ? user.roles : [];
            console.log(`Found saloon user in cache: ${user._id}`, { roles });
          }
        } catch (cacheError) {
          console.error('Redis cache error (saloon user):', cacheError.message);
        }
        
        if (!user) {
          console.log(`Saloon user not found in cache, checking database for ID: ${payload.id}`);
          try {
            user = await SaloonUser.findById(payload.id);
            if (user) {
              roles = Array.isArray(user.roles) ? user.roles : [];
              console.log(`Found saloon user in database: ${user._id}`, { roles });
              
              // Cache the user
              try {
                await redisClient.set(
                  `${SALOON_USER_CACHE_PREFIX}${user._id}`,
                  JSON.stringify(user),
                  { EX: 900 } // 15 minutes
                );
              } catch (cacheError) {
                console.error('Failed to cache saloon user:', cacheError.message);
              }
            }
          } catch (dbError) {
            console.error('Database error (saloon user lookup):', dbError.message);
          }
        }
      }
      
      // If still not found, try regular User
      if (!user) {
        try {
          const cacheKey = `${USER_CACHE_PREFIX}${payload.id}`;
          const cached = await redisClient.get(cacheKey);
          if (cached) {
            user = JSON.parse(cached);
            roles = Array.isArray(user.roles) ? user.roles : [];
            console.log(`Found regular user in cache: ${user._id}`, { roles });
          }
        } catch (cacheError) {
          console.error('Redis cache error (regular user):', cacheError.message);
        }
        
        if (!user) {
          console.log(`Regular user not found in cache, checking database for ID: ${payload.id}`);
          try {
            user = await User.findById(payload.id);
            if (user) {
              roles = Array.isArray(user.roles) ? user.roles : [];
              console.log(`Found regular user in database: ${user._id}`, { roles });
              
              // Cache the user
              try {
                await redisClient.set(
                  `${USER_CACHE_PREFIX}${user._id}`,
                  JSON.stringify(user),
                  { EX: 900 } // 15 minutes
                );
              } catch (cacheError) {
                console.error('Failed to cache regular user:', cacheError.message);
              }
            }
          } catch (dbError) {
            console.error('Database error (regular user lookup):', dbError.message);
          }
        }
      }
      
      // Validate user and roles
      if (!user) {
        console.error('User not found in any database', { 
          userId: payload.id,
          timestamp: new Date().toISOString()
        });
        return res.status(401).json({ 
          success: false,
          message: 'User account not found or deactivated',
          error: 'USER_NOT_FOUND'
        });
      }
      
      // Ensure roles is an array and not empty
      if (!Array.isArray(roles) || roles.length === 0) {
        console.error('No valid roles found for user', { 
          userId: user._id,
          userRoles: user.roles,
          rolesFromToken: payload.roles
        });
        return res.status(403).json({ 
          success: false,
          message: 'Insufficient permissions',
          error: 'INSUFFICIENT_PERMISSIONS',
          requiredRoles: allowedRoles
        });
      }
      
      // Check role-based access
      const hasRequiredRole = allowedRoles.length === 0 || 
                            allowedRoles.some(role => roles.includes(role));
                              
      if (!hasRequiredRole) {
        console.warn('Access denied - insufficient permissions', {
          userId: user._id,
          userRoles: roles,
          requiredRoles: allowedRoles,
          path: req.path,
          method: req.method
        });
        
        return res.status(403).json({ 
          success: false,
          message: 'You do not have permission to access this resource',
          error: 'FORBIDDEN',
          requiredRoles: allowedRoles,
          userRoles: roles
        });
      }
      
      // Attach user to request object
      req.user = { 
        id: user._id.toString(),
        roles: roles,
        ...(user.email && { email: user.email }),
        ...(user.name && { name: user.name })
      };
      
      console.log('User authenticated successfully:', {
        userId: req.user.id,
        roles: req.user.roles,
        path: req.path
      });
      next();
    } catch (e) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
}

module.exports = verifyAccess; 