const Salon = require('../models/Saloon');
const redisClient = require('../utils/redisClient');
const cloudinary = require('../utils/cloudConfig');

const SALOON_CACHE_PREFIX = 'saloon:';
const SALOON_LIST_CACHE_KEY = 'saloon:list';

// Helper to upload a file buffer to Cloudinary with retry logic
async function uploadToCloudinary(fileBuffer, filename, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Upload attempt ${attempt}/${maxRetries} for ${filename}`);
      
      return await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ 
          resource_type: 'image', 
          public_id: `salon_${Date.now()}_${filename}`,
          timeout: 60000 // 60 second timeout
        }, (error, result) => {
          if (error) {
            console.error(`Cloudinary upload error (attempt ${attempt}):`, error);
            return reject(error);
          }
          resolve(result.secure_url);
        });
        
        // Set timeout for the stream
        const timeout = setTimeout(() => {
          reject(new Error(`Upload timeout for ${filename} after 60 seconds`));
        }, 60000);
        
        stream.on('error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
        
        stream.on('end', () => {
          clearTimeout(timeout);
        });
        
        stream.end(fileBuffer);
      });
    } catch (error) {
      console.error(`Upload attempt ${attempt} failed for ${filename}:`, error.message);
      
      if (attempt === maxRetries) {
        throw new Error(`Failed to upload ${filename} after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Wait before retry (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
      console.log(`Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Helper to cache a single salon
async function cacheSalon(salon) {
  try {
    await redisClient.set(SALOON_CACHE_PREFIX + salon._id, JSON.stringify(salon), { EX: 900 });
  } catch (e) {
    console.error('Redis cache error:', e);
  }
}

// Helper to get salon from cache
async function getCachedSalon(id) {
  try {
    const data = await redisClient.get(SALOON_CACHE_PREFIX + id);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Redis cache error:', e);
    return null;
  }
}

// Helper to cache salon list
async function cacheSalonList(salons) {
  try {
    await redisClient.set(SALOON_LIST_CACHE_KEY, JSON.stringify(salons), { EX: 300 });
  } catch (e) {
    console.error('Redis cache error:', e);
  }
}

// Helper to get salon list from cache
async function getCachedSalonList() {
  try {
    const data = await redisClient.get(SALOON_LIST_CACHE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Redis cache error:', e);
    return null;
  }
}

// Create a new salon
exports.create = async (req, res) => {
  try {
    console.log('=== SALON CREATE REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Files:', req.files ? req.files.length : 0);
    console.log('Headers:', req.headers);
    // Validate required timing fields
    console.log('Step 1: Validating timing fields...');
    if (!req.body.openTime || !req.body.closingTime) {
      console.log('ERROR: Missing timing fields');
      return res.status(400).json({ message: 'Both openTime and closingTime are required' });
    }
    console.log('Step 1: ✓ Timing fields validated');

    let imageUrls = [];
    console.log('Step 2: Processing images...');
    if (req.files && req.files.length > 0) {
      console.log(`Step 2a: Uploading ${req.files.length} files to Cloudinary...`);
      // Upload new images to Cloudinary with better error handling
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        try {
          console.log(`Uploading file ${i + 1}/${req.files.length}: ${file.originalname}`);
          const url = await uploadToCloudinary(file.buffer, file.originalname);
          console.log(`✓ Uploaded successfully: ${url}`);
          imageUrls.push(url);
        } catch (uploadError) {
          console.error(`✗ Failed to upload ${file.originalname}:`, uploadError.message);
          // Continue with other files, but log the error
          // You can decide whether to fail the entire request or continue
          throw new Error(`Image upload failed for ${file.originalname}: ${uploadError.message}`);
        }
      }
    } else if (Array.isArray(req.body.image)) {
      console.log('Step 2b: Using provided image URLs');
      imageUrls = req.body.image;
    }
    console.log('Step 2: ✓ Images processed, URLs:', imageUrls);

    console.log('Step 3: Validating images...');
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      console.log('ERROR: No images provided');
      return res.status(400).json({ message: 'At least one image is required' });
    }
    console.log('Step 3: ✓ Images validated');

    // Validate required location fields
    console.log('Step 4: Validating location fields...');
    const requiredLocationFields = ['address', 'city', 'state', 'pincode', 'latitude', 'longitude', 'mapUrl'];
    const missingFields = requiredLocationFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log('ERROR: Missing location fields:', missingFields);
      return res.status(400).json({ 
        message: `Missing required location fields: ${missingFields.join(', ')}` 
      });
    }
    console.log('Step 4: ✓ Location fields validated');

    // Validate coordinates are numbers
    console.log('Step 5: Validating coordinates...');
    const latitude = parseFloat(req.body.latitude);
    const longitude = parseFloat(req.body.longitude);
    console.log('Parsed coordinates:', { latitude, longitude });
    
    if (isNaN(latitude) || isNaN(longitude)) {
      console.log('ERROR: Invalid coordinates');
      return res.status(400).json({ 
        message: 'Latitude and longitude must be valid numbers' 
      });
    }
    console.log('Step 5: ✓ Coordinates validated');

    // Validate coordinate ranges
    console.log('Step 6: Validating coordinate ranges...');
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      console.log('ERROR: Coordinates out of range');
      return res.status(400).json({ 
        message: 'Invalid coordinate values. Latitude: -90 to 90, Longitude: -180 to 180' 
      });
    }
    console.log('Step 6: ✓ Coordinate ranges validated');

    console.log('Step 7: Preparing data object...');
    
    // Get owner from request body (frontend will send user ID)
    if (!req.body.owner) {
      console.log('ERROR: Owner field is required');
      return res.status(400).json({ message: 'Owner is required. Please provide owner ID.' });
    }
    console.log('Owner ID from request:', req.body.owner);
    
    const data = { 
      ...req.body,
      image: imageUrls,
      owner: req.body.owner, // Owner ID from frontend
      // rating and reviews will use default values from model if not provided
      location: {
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        coordinates: {
          latitude: latitude,
          longitude: longitude
        },
        geolocation: {
          type: 'Point',
          coordinates: [longitude, latitude] // GeoJSON format: [lng, lat]
        },
        mapUrl: req.body.mapUrl
      }
    };
    console.log('Step 7: ✓ Data object prepared:', JSON.stringify(data, null, 2));

    console.log('Step 8: Creating salon in database...');
    const salon = await Salon.create(data);
    console.log('Step 8: ✓ Salon created successfully:', salon._id);
    
    console.log('Step 9: Caching salon...');
    await cacheSalon(salon);
    console.log('Step 9: ✓ Salon cached');
    
    console.log('Step 10: Clearing cache...');
    await redisClient.del(SALOON_LIST_CACHE_KEY).catch(console.error);
    // Also clear user-specific caches so lists/details reflect latest data immediately
    const ownerIdCreate = String(salon.owner || '');
    if (ownerIdCreate) {
      await Promise.all([
        redisClient.del(`salons:user:${ownerIdCreate}`).catch(console.error),
        redisClient.del(`salons:user:${ownerIdCreate}:details`).catch(console.error),
        redisClient.del(`salons:user:${ownerIdCreate}:count`).catch(console.error),
      ]);
    }
    console.log('Step 10: ✓ Cache cleared (including user caches)');
    
    console.log('=== SALON CREATE SUCCESS ===');
    res.status(201).json({ status: 'success', salon });
  } catch (e) {
    console.error('=== SALON CREATE ERROR ===');
    console.error('Error:', e);
    console.error('Stack:', e.stack);
    res.status(500).json({ message: 'Failed to create salon', error: e.message });
  }
};

// Get all salons
exports.getAll = async (req, res) => {
  try {
    let salons = await getCachedSalonList();
    if (!salons) {
      salons = await Salon.find().lean();
      await cacheSalonList(salons);
    }
    res.json({ status: 'success', salons });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch salons', error: e.message });
  }
};

// Get salon by ID
exports.getById = async (req, res) => {
  try {
    let salon = await getCachedSalon(req.params.id);
    if (!salon) {
      salon = await Salon.findById(req.params.id).lean();
      if (salon) await cacheSalon(salon);
    }
    if (!salon) return res.status(404).json({ message: 'Salon not found' });
    res.json({ status: 'success', salon });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch salon', error: e.message });
  }
};

// Get all salons by ID (finds all salons that match the given ID)
exports.getAllById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check cache first
    const cacheKey = `saloon:allById:${id}`;
    let salons = await redisClient.get(cacheKey);
    
    if (salons) {
      salons = JSON.parse(salons);
    } else {
      // Find all salons that match the ID (using regex for partial matching)
      salons = await Salon.find({
        $or: [
          { _id: id },
          { owner: id }, // Search by owner field
          { name: { $regex: id, $options: 'i' } },
          { 'location.address': { $regex: id, $options: 'i' } }
        ]
      }).lean();
      
      // Cache the results for 5 minutes
      if (salons.length > 0) {
        await redisClient.set(cacheKey, JSON.stringify(salons), { EX: 300 });
      }
    }
    
    res.json({ 
      status: 'success', 
      count: salons.length,
      salons 
    });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch salons by ID', error: e.message });
  }
};



// Update salon
exports.update = async (req, res) => {
  try {
    // Validate timing fields if provided
    if (req.body.openTime && !req.body.closingTime || 
        !req.body.openTime && req.body.closingTime) {
      return res.status(400).json({ 
        message: 'Both openTime and closingTime must be provided together' 
      });
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer, file.originalname);
        imageUrls.push(url);
      }
    } else if (Array.isArray(req.body.image)) {
      imageUrls = req.body.image;
    }

    const data = { ...req.body };
    if (imageUrls.length > 0) {
      data.image = imageUrls;
    }

    // Handle location update
    const locationFields = ['address', 'city', 'state', 'pincode', 'latitude', 'longitude', 'mapUrl'];
    const hasLocationUpdate = locationFields.some(field => req.body[field]);
    
    if (hasLocationUpdate) {
      // Get existing salon to merge location data
      const existingSalon = await Salon.findById(req.params.id).lean();
      if (!existingSalon) {
        return res.status(404).json({ message: 'Salon not found' });
      }

      // Validate coordinates if provided
      let latitude = req.body.latitude ? parseFloat(req.body.latitude) : existingSalon.location?.coordinates?.latitude;
      let longitude = req.body.longitude ? parseFloat(req.body.longitude) : existingSalon.location?.coordinates?.longitude;
      
      if (req.body.latitude && isNaN(latitude)) {
        return res.status(400).json({ message: 'Latitude must be a valid number' });
      }
      if (req.body.longitude && isNaN(longitude)) {
        return res.status(400).json({ message: 'Longitude must be a valid number' });
      }
      
      // Validate coordinate ranges if provided
      if (latitude && (latitude < -90 || latitude > 90)) {
        return res.status(400).json({ message: 'Latitude must be between -90 and 90' });
      }
      if (longitude && (longitude < -180 || longitude > 180)) {
        return res.status(400).json({ message: 'Longitude must be between -180 and 180' });
      }

      data.location = {
        address: req.body.address || existingSalon.location?.address,
        city: req.body.city || existingSalon.location?.city,
        state: req.body.state || existingSalon.location?.state,
        pincode: req.body.pincode || existingSalon.location?.pincode,
        coordinates: {
          latitude: latitude,
          longitude: longitude
        },
        geolocation: {
          type: 'Point',
          coordinates: [longitude, latitude] // GeoJSON format: [lng, lat]
        },
        mapUrl: req.body.mapUrl || existingSalon.location?.mapUrl
      };
    }

    if (data.image && (!Array.isArray(data.image) || data.image.length === 0)) {
      return res.status(400).json({ message: 'Image must be a non-empty array of URLs' });
    }

    const salon = await Salon.findByIdAndUpdate(
      req.params.id, 
      data, 
      { new: true, lean: true }
    );

    if (!salon) return res.status(404).json({ message: 'Salon not found' });
    
    // Update cache
    await cacheSalon(salon);
    await redisClient.del(SALOON_LIST_CACHE_KEY).catch(console.error);
    // Invalidate user-specific caches for this salon's owner
    const ownerId = String(salon.owner || '');
    if (ownerId) {
      await Promise.all([
        redisClient.del(`salons:user:${ownerId}`).catch(console.error),
        redisClient.del(`salons:user:${ownerId}:details`).catch(console.error),
        redisClient.del(`salons:user:${ownerId}:count`).catch(console.error),
      ]);
    }
    
    res.json({ status: 'success', salon });
  } catch (e) {
    res.status(500).json({ message: 'Failed to update salon', error: e.message });
  }
};

// Delete salon
exports.delete = async (req, res) => {
  try {
    const salon = await Salon.findByIdAndDelete(req.params.id);
    if (!salon) return res.status(404).json({ message: 'Salon not found' });
    
    // Invalidate cache
    await redisClient.del(SALOON_CACHE_PREFIX + req.params.id).catch(console.error);
    await redisClient.del(SALOON_LIST_CACHE_KEY).catch(console.error);
    
    res.json({ status: 'success', message: 'Salon deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete salon', error: e.message });
  }
};

// Get all salons by SaloonUser ID (name and ID only)
exports.getSalonsByUserId = async (req, res) => {
  try {
    const { userId } = req.params

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required"
      })
    }

    // Cache key for this specific user's salons
    const cacheKey = `salons:user:${userId}`
    let salons = await redisClient.get(cacheKey)

    if (salons) {
      salons = JSON.parse(salons)
      return res.json({
        status: "success",
        source: "cache",
        count: salons.length,
        salons
      })
    }

    // Find all salons owned by this user
    salons = await Salon.find({ owner: userId })
      .select("name _id") // Only get name and ID
      .sort({ name: 1 }) // Sort by name alphabetically
      .lean()

    // Cache for 10 minutes
    await redisClient.set(cacheKey, JSON.stringify(salons), { EX: 600 })

    res.json({
      status: "success",
      source: "database",
      count: salons.length,
      salons
    })
  } catch (error) {
    console.error("Error fetching salons by user ID:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to fetch salons",
      error: error.message
    })
  }
}

// Get all salons by SaloonUser ID with full details
exports.getSalonsByUserIdWithDetails = async (req, res) => {
  try {
    const { userId } = req.params

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required"
      })
    }

    // Cache key for this specific user's salons with details
    const cacheKey = `salons:user:${userId}:details`
    let salons = await redisClient.get(cacheKey)

    if (salons) {
      salons = JSON.parse(salons)
      return res.json({
        status: "success",
        source: "cache",
        count: salons.length,
        salons
      })
    }

    // Find all salons owned by this user with full details
    salons = await Salon.find({ owner: userId })
      .sort({ createdAt: -1 }) // Sort by creation date (newest first)
      .lean()

    // Cache for 5 minutes
    await redisClient.set(cacheKey, JSON.stringify(salons), { EX: 300 })

    res.json({
      status: "success",
      source: "database",
      count: salons.length,
      salons
    })
  } catch (error) {
    console.error("Error fetching salons by user ID with details:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to fetch salons",
      error: error.message
    })
  }
}

// Get salon count by SaloonUser ID
exports.getSalonCountByUserId = async (req, res) => {
  try {
    const { userId } = req.params

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required"
      })
    }

    // Cache key for salon count
    const cacheKey = `salons:user:${userId}:count`
    let count = await redisClient.get(cacheKey)

    if (count) {
      count = JSON.parse(count)
      return res.json({
        status: "success",
        source: "cache",
        count: count
      })
    }

    // Count salons owned by this user
    count = await Salon.countDocuments({ owner: userId })

    // Cache for 15 minutes
    await redisClient.set(cacheKey, JSON.stringify(count), { EX: 900 })

    res.json({
      status: "success",
      source: "database",
      count: count
    })
  } catch (error) {
    console.error("Error counting salons by user ID:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to count salons",
      error: error.message
    })
  }
}

// Search salons by location (city, state, pincode)
exports.searchByLocation = async (req, res) => {
  try {
    const { city, state, pincode, page = 1, limit = 10 } = req.query;
    
    if (!city && !state && !pincode) {
      return res.status(400).json({
        status: 'error',
        message: 'At least one location parameter (city, state, or pincode) is required'
      });
    }

    const query = {};
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (state) query['location.state'] = new RegExp(state, 'i');
    if (pincode) query['location.pincode'] = pincode;

    const skip = (page - 1) * limit;
    const salons = await Salon.find(query)
      .sort({ rating: -1, featured: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Salon.countDocuments(query);

    res.json({
      status: 'success',
      salons,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error searching salons by location:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to search salons',
      error: error.message
    });
  }
};

// Search salons near coordinates (geospatial search)
exports.searchNearby = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 5000, page = 1, limit = 10 } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        status: 'error',
        message: 'Latitude and longitude are required'
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid latitude or longitude values'
      });
    }

    const skip = (page - 1) * limit;
    
    const salons = await Salon.find({
      'location.geolocation': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: parseInt(maxDistance) // in meters
        }
      }
    })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

    res.json({
      status: 'success',
      salons,
      searchParams: {
        latitude: lat,
        longitude: lng,
        maxDistance: parseInt(maxDistance),
        page: parseInt(page),
        limit: parseInt(limit)
      },
      count: salons.length
    });
  } catch (error) {
    console.error('Error searching nearby salons:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to search nearby salons',
      error: error.message
    });
  }
};

// Search salons by services
exports.searchByServices = async (req, res) => {
  try {
    const { services, city, state, page = 1, limit = 10 } = req.query;
    
    if (!services) {
      return res.status(400).json({
        status: 'error',
        message: 'Services parameter is required'
      });
    }

    const serviceArray = Array.isArray(services) ? services : services.split(',');
    const query = {
      services: { $in: serviceArray }
    };

    // Add location filters if provided
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (state) query['location.state'] = new RegExp(state, 'i');

    const skip = (page - 1) * limit;
    const salons = await Salon.find(query)
      .sort({ rating: -1, featured: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Salon.countDocuments(query);

    res.json({
      status: 'success',
      salons,
      searchParams: {
        services: serviceArray,
        city,
        state
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error searching salons by services:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to search salons by services',
      error: error.message
    });
  }
};