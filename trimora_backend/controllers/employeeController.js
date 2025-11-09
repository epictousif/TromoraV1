const Employee = require("../models/Employee")
const EmployeeService = require("../models/EmployeeService")
const EmployeeAvailability = require("../models/EmployeeAvailability")
const redisClient = require("../utils/redisClient")
const cloudinary = require("../utils/cloudConfig")

// Helper to upload a file buffer to Cloudinary
async function uploadToCloudinary(fileBuffer, filename) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ 
      resource_type: 'image', 
      public_id: filename 
    }, (error, result) => {
      if (error) return reject(error);
      resolve(result.secure_url);
    });
    stream.end(fileBuffer);
  });
}

// Create new employee
exports.createEmployee = async (req, res) => {
  try {
    console.log("📊 Received form data:", req.body)
    console.log("📁 Received file:", req.file)

    // Parse FormData fields
    const name = req.body.name
    const email = req.body.email
    const phoneNumber = req.body.phoneNumber
    const salon = req.body.salon
    const salonUser = req.body.salonUser || req.user.id // Get from body or from auth middleware
    const experience = parseInt(req.body.experience) || 0
    
    // Parse JSON strings back to objects
    let workingHours = {}
    let specialization = []
    
    try {
      if (req.body.workingHours) {
        workingHours = JSON.parse(req.body.workingHours)
        console.log("✅ Parsed workingHours:", workingHours)
      }
    } catch (e) {
      console.error("❌ Error parsing workingHours:", e)
    }
    
    try {
      if (req.body.specialization) {
        specialization = JSON.parse(req.body.specialization)
        console.log("✅ Parsed specialization:", specialization)
      }
    } catch (e) {
      console.error("❌ Error parsing specialization:", e)
    }

    // Validate phone number (must be 10 digits)
    if (phoneNumber && phoneNumber.length !== 10) {
      return res.status(400).json({
        status: "error",
        message: "Phone number must be exactly 10 digits"
      })
    }

    // Check if employee with same email already exists
    const existingEmployee = await Employee.findOne({ email })
    if (existingEmployee) {
      return res.status(400).json({
        status: "error",
        message: "Employee with this email already exists"
      })
    }

    // Handle profile image upload
    let profileImageUrl = ""
    if (req.file) {
      try {
        profileImageUrl = await uploadToCloudinary(req.file.buffer, `employee_${Date.now()}_${req.file.originalname}`)
        console.log("✅ Profile image uploaded to Cloudinary:", profileImageUrl)
      } catch (uploadError) {
        console.error("❌ Error uploading profile image:", uploadError)
        return res.status(500).json({
          status: "error",
          message: "Failed to upload profile image"
        })
      }
    }

    // Create new employee
    const employee = new Employee({
      name,
      email,
      phoneNumber,
      salon,
      salonUser,
      workingHours: workingHours || {},
      experience: experience || 0,
      specialization: specialization || [],
      profileImage: profileImageUrl
    })

    console.log("📝 Creating employee with data:", {
      name,
      email,
      phoneNumber,
      salon,
      salonUser,
      workingHours,
      experience,
      specialization,
      profileImage: profileImageUrl
    })

    await employee.save()

    // Clear caches: employee lists by salon/salonUser (all variants) and stats
    const createKeys = [
      `employee:salon:${salon}:all`,
      `employee:salon:${salon}:true`,
      `employee:salon:${salon}:false`,
      `employee:salonUser:${salonUser}:all`,
      `employee:salonUser:${salonUser}:true`,
      `employee:salonUser:${salonUser}:false`,
      `employee:stats:${salon}`,
      `employee:stats:salonUser:${salonUser}`,
      `employee:all`,
    ]
    await Promise.all(createKeys.map(k => redisClient.del(k).catch(console.error)))

    res.status(201).json({
      status: "success",
      message: "Employee created successfully",
      employee
    })
  } catch (error) {
    console.error("Error creating employee:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to create employee",
      error: error.message
    })
  }
}

// Get all employees with pagination and filtering
exports.getAllEmployees = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      salon,
      isActive,
      specialization,
      rating,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = req.query

    const cacheKey = `employees:${JSON.stringify(req.query)}`
    let employees = await redisClient.get(cacheKey)

    if (employees) {
      employees = JSON.parse(employees)
      return res.json({
        status: "success",
        source: "cache",
        ...employees
      })
    }

    // Build filter object
    const filter = {}
    if (salon) filter.salon = salon
    if (isActive !== undefined) filter.isActive = isActive === "true"
    if (specialization) filter.specialization = { $in: [specialization] }
    if (rating) filter.rating = { $gte: parseFloat(rating) }

    // Build sort object
    const sort = {}
    sort[sortBy] = sortOrder === "desc" ? -1 : 1

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [employeesData, total] = await Promise.all([
      Employee.find(filter)
        .populate("salon", "name location")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Employee.countDocuments(filter)
    ])

    const result = {
      employees: employeesData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }

    // Cache for 5 minutes
    await redisClient.set(cacheKey, JSON.stringify(result), { EX: 300 })

    res.json({
      status: "success",
      source: "database",
      ...result
    })
  } catch (error) {
    console.error("Error fetching employees:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to fetch employees",
      error: error.message
    })
  }
}

// Get employee by ID with services and availability
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params
    const cacheKey = `employee:${id}`

    let employee = await redisClient.get(cacheKey)
    if (employee) {
      employee = JSON.parse(employee)
      return res.json({
        status: "success",
        source: "cache",
        employee
      })
    }

    // Get employee with services and availability
    const [employeeData, services, availability] = await Promise.all([
      Employee.findById(id)
        .populate("salon", "name location address")
        .lean(),
      EmployeeService.find({ employee: id, isActive: true }).lean(),
      EmployeeAvailability.find({ employee: id })
        .sort({ date: 1 })
        .limit(7) // Last 7 days
        .lean()
    ])

    if (!employeeData) {
      return res.status(404).json({
        status: "error",
        message: "Employee not found"
      })
    }

    const employeeWithDetails = {
      ...employeeData,
      services,
      availability
    }

    // Cache for 10 minutes
    await redisClient.set(cacheKey, JSON.stringify(employeeWithDetails), { EX: 600 })

    res.json({
      status: "success",
      source: "database",
      employee: employeeWithDetails
    })
  } catch (error) {
    console.error("Error fetching employee:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to fetch employee",
      error: error.message
    })
  }
}

// Get employees by salon
exports.getEmployeesBySalon = async (req, res) => {
  try {
    const { salonId } = req.params
    const { isActive } = req.query

    const cacheKey = `employee:salon:${salonId}:${isActive || "all"}`
    let employees = await redisClient.get(cacheKey)

    if (employees) {
      employees = JSON.parse(employees)
      return res.json({
        status: "success",
        source: "cache",
        employees
      })
    }

    const filter = { salon: salonId }
    if (isActive !== undefined) {
      filter.isActive = isActive === "true"
    }

    employees = await Employee.find(filter)
      .populate("salon", "name location")
      .sort({ rating: -1, name: 1 })
      .lean()

    // Cache for 5 minutes
    await redisClient.set(cacheKey, JSON.stringify(employees), { EX: 300 })

    res.json({
      status: "success",
      source: "database",
      count: employees.length,
      employees
    })
  } catch (error) {
    console.error("Error fetching employees by salon:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to fetch employees",
      error: error.message
    })
  }
}

// Get employees by salonUser
exports.getEmployeesBySalonUser = async (req, res) => {
  try {
    const { salonUserId } = req.params
    const { isActive } = req.query

    const cacheKey = `employee:salonUser:${salonUserId}:${isActive || "all"}`
    let employees = await redisClient.get(cacheKey)

    if (employees) {
      employees = JSON.parse(employees)
      return res.json({
        status: "success",
        source: "cache",
        employees
      })
    }

    const filter = { salonUser: salonUserId }
    if (isActive !== undefined) {
      filter.isActive = isActive === "true"
    }

    employees = await Employee.find(filter)
      .populate("salon", "name location")
      .sort({ rating: -1, name: 1 })
      .lean()

    // Cache for 5 minutes
    await redisClient.set(cacheKey, JSON.stringify(employees), { EX: 300 })

    res.json({
      status: "success",
      source: "database",
      count: employees.length,
      employees
    })
  } catch (error) {
    console.error("Error fetching employees by salonUser:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to fetch employees",
      error: error.message
    })
  }
}

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Check if email is being updated and if it already exists
    if (updateData.email) {
      const existingEmployee = await Employee.findOne({ 
        email: updateData.email, 
        _id: { $ne: id } 
      })
      if (existingEmployee) {
        return res.status(400).json({
          status: "error",
          message: "Employee with this email already exists"
        })
      }
    }

    const employee = await Employee.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("salon", "name location")

    if (!employee) {
      return res.status(404).json({
        status: "error",
        message: "Employee not found"
      })
    }

    // Clear related caches: employee details, lists (all variants), and stats
    await redisClient.del(`employee:${id}`)
    const updSalon = employee.salon?._id || employee.salon
    const updSalonUser = employee.salonUser?._id || employee.salonUser
    const updateKeys = [
      `employee:salon:${updSalon}:all`,
      `employee:salon:${updSalon}:true`,
      `employee:salon:${updSalon}:false`,
      `employee:salonUser:${updSalonUser}:all`,
      `employee:salonUser:${updSalonUser}:true`,
      `employee:salonUser:${updSalonUser}:false`,
      `employee:stats:${updSalon}`,
      `employee:stats:salonUser:${updSalonUser}`,
      `employee:all`,
    ]
    await Promise.all(updateKeys.map(k => redisClient.del(k).catch(console.error)))

    res.json({
      status: "success",
      message: "Employee updated successfully",
      employee
    })
  } catch (error) {
    console.error("Error updating employee:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to update employee",
      error: error.message
    })
  }
}

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params

    const employee = await Employee.findByIdAndDelete(id)
    if (!employee) {
      return res.status(404).json({
        status: "error",
        message: "Employee not found"
      })
    }

    // Delete related services and availability
    await Promise.all([
      EmployeeService.deleteMany({ employee: id }),
      EmployeeAvailability.deleteMany({ employee: id })
    ])

    // Clear related caches: employee details, lists (all variants), and stats
    await redisClient.del(`employee:${id}`)
    const delSalon = employee.salon
    const delSalonUser = employee.salonUser
    const delKeys = [
      `employee:salon:${delSalon}:all`,
      `employee:salon:${delSalon}:true`,
      `employee:salon:${delSalon}:false`,
      `employee:salonUser:${delSalonUser}:all`,
      `employee:salonUser:${delSalonUser}:true`,
      `employee:salonUser:${delSalonUser}:false`,
      `employee:stats:${delSalon}`,
      `employee:stats:salonUser:${delSalonUser}`,
      `employee:all`,
    ]
    await Promise.all(delKeys.map(k => redisClient.del(k).catch(console.error)))

    res.json({
      status: "success",
      message: "Employee deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting employee:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to delete employee",
      error: error.message
    })
  }
}

// Toggle employee active status
exports.toggleEmployeeStatus = async (req, res) => {
  try {
    const { id } = req.params

    const employee = await Employee.findById(id)
    if (!employee) {
      return res.status(404).json({
        status: "error",
        message: "Employee not found"
      })
    }

    employee.isActive = !employee.isActive
    await employee.save()

    // Clear related caches
    await redisClient.del(`employee:${id}`)
    await redisClient.del(`employee:salon:${employee.salon}`)
    await redisClient.del("employee:all")

    res.json({
      status: "success",
      message: `Employee ${employee.isActive ? "activated" : "deactivated"} successfully`,
      employee
    })
  } catch (error) {
    console.error("Error toggling employee status:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to toggle employee status",
      error: error.message
    })
  }
}

// Search employees
exports.searchEmployees = async (req, res) => {
  try {
    const { q, salon } = req.query
    const cacheKey = `employee:search:${q}:${salon || "all"}`

    let results = await redisClient.get(cacheKey)
    if (results) {
      results = JSON.parse(results)
      return res.json({
        status: "success",
        source: "cache",
        ...results
      })
    }

    const filter = {}
    if (salon) filter.salon = salon

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phoneNumber: { $regex: q, $options: "i" } },
        { specialization: { $regex: q, $options: "i" } }
      ]
    }

    const employees = await Employee.find(filter)
      .populate("salon", "name location")
      .sort({ rating: -1, name: 1 })
      .limit(20)
      .lean()

    const result = {
      employees,
      count: employees.length,
      query: q
    }

    // Cache for 5 minutes
    await redisClient.set(cacheKey, JSON.stringify(result), { EX: 300 })

    res.json({
      status: "success",
      source: "database",
      ...result
    })
  } catch (error) {
    console.error("Error searching employees:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to search employees",
      error: error.message
    })
  }
}

// Get employee statistics
exports.getEmployeeStats = async (req, res) => {
  try {
    const { salonId } = req.params
    const cacheKey = `employee:stats:${salonId || "all"}`

    let cachedStats = await redisClient.get(cacheKey)
    if (cachedStats) {
      cachedStats = JSON.parse(cachedStats)
      return res.json({
        status: "success",
        source: "cache",
        statistics: cachedStats
      })
    }

    const filter = {}
    if (salonId) filter.salon = salonId

    const [
      totalEmployees,
      activeEmployees,
      avgRating,
      topEmployees
    ] = await Promise.all([
      Employee.countDocuments(filter),
      Employee.countDocuments({ ...filter, isActive: true }),
      Employee.aggregate([
        { $match: filter },
        { $group: { _id: null, avgRating: { $avg: "$rating" } } }
      ]),
      Employee.find(filter)
        .sort({ rating: -1, totalBookings: -1 })
        .limit(5)
        .select("name rating totalBookings")
        .lean()
    ])

    const statistics = {
      totalEmployees,
      activeEmployees,
      inactiveEmployees: totalEmployees - activeEmployees,
      averageRating: avgRating[0]?.avgRating || 0,
      totalServices: 0, // This will be calculated from EmployeeService model
      topEmployees,
      activePercentage: totalEmployees > 0 ? (activeEmployees / totalEmployees) * 100 : 0
    }

    // Cache for 10 minutes
    await redisClient.set(cacheKey, JSON.stringify(statistics), { EX: 600 })

    res.json({
      status: "success",
      source: "database",
      statistics
    })
  } catch (error) {
    console.error("Error fetching employee stats:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to fetch employee statistics",
      error: error.message
    })
  }
}

// Get employee statistics by salonUser
exports.getEmployeeStatsBySalonUser = async (req, res) => {
  try {
    const { salonUserId } = req.params
    const cacheKey = `employee:stats:salonUser:${salonUserId}`

    let cachedStats = await redisClient.get(cacheKey)
    if (cachedStats) {
      cachedStats = JSON.parse(cachedStats)
      return res.json({
        status: "success",
        source: "cache",
        statistics: cachedStats
      })
    }

    const filter = { salonUser: salonUserId }

    const [
      totalEmployees,
      activeEmployees,
      avgRating,
      topEmployees
    ] = await Promise.all([
      Employee.countDocuments(filter),
      Employee.countDocuments({ ...filter, isActive: true }),
      Employee.aggregate([
        { $match: filter },
        { $group: { _id: null, avgRating: { $avg: "$rating" } } }
      ]),
      Employee.find(filter)
        .sort({ rating: -1, totalBookings: -1 })
        .limit(5)
        .select("name rating totalBookings")
        .lean()
    ])

    const statistics = {
      totalEmployees,
      activeEmployees,
      inactiveEmployees: totalEmployees - activeEmployees,
      averageRating: avgRating[0]?.avgRating || 0,
      totalServices: 0, // This will be calculated from EmployeeService model
      topEmployees,
      activePercentage: totalEmployees > 0 ? (activeEmployees / totalEmployees) * 100 : 0
    }

    // Cache for 10 minutes
    await redisClient.set(cacheKey, JSON.stringify(statistics), { EX: 600 })

    res.json({
      status: "success",
      source: "database",
      statistics
    })
  } catch (error) {
    console.error("Error fetching employee stats by salonUser:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to fetch employee statistics",
      error: error.message
    })
  }
} 