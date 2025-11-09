const EmployeeService = require("../models/EmployeeService")
const Employee = require("../models/Employee")
const redisClient = require("../utils/redisClient")

// Create new employee service
exports.createEmployeeService = async (req, res) => {
  try {
    const { employeeId } = req.params
    const { name, duration, price, description, category } = req.body

    // Check if employee exists
    const employee = await Employee.findById(employeeId)
    if (!employee) {
      return res.status(404).json({
        status: "error",
        message: "Employee not found"
      })
    }

    // Check if service already exists for this employee
    const existingService = await EmployeeService.findOne({
      employee: employeeId,
      name: name
    })

    if (existingService) {
      return res.status(400).json({
        status: "error",
        message: "Service already exists for this employee"
      })
    }

    // Create new service with salon and salonUser references
    const service = new EmployeeService({
      employee: employeeId,
      salon: employee.salon, // Get salon from employee
      salonUser: employee.salonUser, // Get salonUser from employee
      name,
      duration,
      price,
      description: description || "",
      category
    })

    await service.save()

    // Clear related caches: employee details and service lists (all variants)
    await redisClient.del(`employee:${employeeId}`)
    const employeeServiceKeys = [
      `employeeService:${employeeId}:all`,
      `employeeService:${employeeId}:true`,
      `employeeService:${employeeId}:false`,
      `employeeService:salon:${employee.salon}:all`,
      `employeeService:salon:${employee.salon}:true`,
      `employeeService:salon:${employee.salon}:false`,
      `employeeService:salonUser:${employee.salonUser}:all`,
      `employeeService:salonUser:${employee.salonUser}:true`,
      `employeeService:salonUser:${employee.salonUser}:false`,
    ]
    await Promise.all(employeeServiceKeys.map(k => redisClient.del(k).catch(console.error)))

    res.status(201).json({
      status: "success",
      message: "Service created successfully",
      service
    })
  } catch (error) {
    console.error("Error creating employee service:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to create service",
      error: error.message
    })
  }
}

// Get all services for an employee
exports.getEmployeeServices = async (req, res) => {
  try {
    const { employeeId } = req.params
    const { isActive } = req.query

    const cacheKey = `employeeService:${employeeId}:${isActive || "all"}`
    let services = await redisClient.get(cacheKey)

    if (services) {
      services = JSON.parse(services)
      return res.json({
        status: "success",
        source: "cache",
        services
      })
    }

    const filter = { employee: employeeId }
    if (isActive !== undefined) {
      filter.isActive = isActive === "true"
    }

    services = await EmployeeService.find(filter)
      .populate("employee", "name email")
      .populate("salon", "name")
      .sort({ name: 1 })
      .lean()

    // Cache for 5 minutes
    await redisClient.set(cacheKey, JSON.stringify(services), { EX: 300 })

    res.json({
      status: "success",
      source: "database",
      count: services.length,
      services
    })
  } catch (error) {
    console.error("Error fetching employee services:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to fetch services",
      error: error.message
    })
  }
}

// Get service by ID
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params

    const service = await EmployeeService.findById(id)
      .populate("employee", "name email")
      .lean()

    if (!service) {
      return res.status(404).json({
        status: "error",
        message: "Service not found"
      })
    }

    res.json({
      status: "success",
      service
    })
  } catch (error) {
    console.error("Error fetching service:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to fetch service",
      error: error.message
    })
  }
}

// Update service
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const service = await EmployeeService.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("employee", "name email")

    if (!service) {
      return res.status(404).json({
        status: "error",
        message: "Service not found"
      })
    }

    // Clear related caches: employee details and service lists (all variants)
    await redisClient.del(`employee:${service.employee._id}`)
    const svcOwner = service.employee._id
    const svcSalon = service.salon?._id || service.salon
    const svcSalonUser = service.salonUser?._id || service.salonUser
    const keys = [
      `employeeService:${svcOwner}:all`,
      `employeeService:${svcOwner}:true`,
      `employeeService:${svcOwner}:false`,
      `employeeService:salon:${svcSalon}:all`,
      `employeeService:salon:${svcSalon}:true`,
      `employeeService:salon:${svcSalon}:false`,
      `employeeService:salonUser:${svcSalonUser}:all`,
      `employeeService:salonUser:${svcSalonUser}:true`,
      `employeeService:salonUser:${svcSalonUser}:false`,
    ]
    await Promise.all(keys.map(k => redisClient.del(k).catch(console.error)))

    res.json({
      status: "success",
      message: "Service updated successfully",
      service
    })
  } catch (error) {
    console.error("Error updating service:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to update service",
      error: error.message
    })
  }
}

// Delete service
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params

    const service = await EmployeeService.findByIdAndDelete(id)
    if (!service) {
      return res.status(404).json({
        status: "error",
        message: "Service not found"
      })
    }

    // Clear related caches: employee details and service lists (all variants)
    await redisClient.del(`employee:${service.employee}`)
    const delKeys = [
      `employeeService:${service.employee}:all`,
      `employeeService:${service.employee}:true`,
      `employeeService:${service.employee}:false`,
      `employeeService:salon:${service.salon}:all`,
      `employeeService:salon:${service.salon}:true`,
      `employeeService:salon:${service.salon}:false`,
      `employeeService:salonUser:${service.salonUser}:all`,
      `employeeService:salonUser:${service.salonUser}:true`,
      `employeeService:salonUser:${service.salonUser}:false`,
    ]
    await Promise.all(delKeys.map(k => redisClient.del(k).catch(console.error)))

    res.json({
      status: "success",
      message: "Service deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting service:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to delete service",
      error: error.message
    })
  }
}

// Toggle service active status
exports.toggleServiceStatus = async (req, res) => {
  try {
    const { id } = req.params

    const service = await EmployeeService.findById(id)
    if (!service) {
      return res.status(404).json({
        status: "error",
        message: "Service not found"
      })
    }

    service.isActive = !service.isActive
    await service.save()

    // Clear related caches: employee details and service lists (all variants)
    await redisClient.del(`employee:${service.employee}`)
    const toggleKeys = [
      `employeeService:${service.employee}:all`,
      `employeeService:${service.employee}:true`,
      `employeeService:${service.employee}:false`,
      `employeeService:salon:${service.salon}:all`,
      `employeeService:salon:${service.salon}:true`,
      `employeeService:salon:${service.salon}:false`,
      `employeeService:salonUser:${service.salonUser}:all`,
      `employeeService:salonUser:${service.salonUser}:true`,
      `employeeService:salonUser:${service.salonUser}:false`,
    ]
    await Promise.all(toggleKeys.map(k => redisClient.del(k).catch(console.error)))

    res.json({
      status: "success",
      message: `Service ${service.isActive ? "activated" : "deactivated"} successfully`,
      service
    })
  } catch (error) {
    console.error("Error toggling service status:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to toggle service status",
      error: error.message
    })
  }
}

// Get services by category
exports.getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params
    const { employeeId } = req.query

    const filter = { category }
    if (employeeId) filter.employee = employeeId

    const services = await EmployeeService.find(filter)
      .populate("employee", "name email")
      .sort({ price: 1 })
      .lean()

    res.json({
      status: "success",
      count: services.length,
      services
    })
  } catch (error) {
    console.error("Error fetching services by category:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to fetch services",
      error: error.message
    })
  }
}

// Search services
exports.searchServices = async (req, res) => {
  try {
    const { q, employeeId, category } = req.query

    const filter = {}
    if (employeeId) filter.employee = employeeId
    if (category) filter.category = category

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ]
    }

    const services = await EmployeeService.find(filter)
      .populate("employee", "name email")
      .sort({ price: 1 })
      .limit(20)
      .lean()

    res.json({
      status: "success",
      count: services.length,
      services
    })
  } catch (error) {
    console.error("Error searching services:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to search services",
      error: error.message
    })
  }
}

// Get service statistics
exports.getServiceStats = async (req, res) => {
  try {
    const { employeeId } = req.query

    const filter = {}
    if (employeeId) filter.employee = employeeId

    const [
      totalServices,
      activeServices,
      avgPrice,
      categoryStats
    ] = await Promise.all([
      EmployeeService.countDocuments(filter),
      EmployeeService.countDocuments({ ...filter, isActive: true }),
      EmployeeService.aggregate([
        { $match: filter },
        { $group: { _id: null, avgPrice: { $avg: "$price" } } }
      ]),
      EmployeeService.aggregate([
        { $match: filter },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ])

    const stats = {
      totalServices,
      activeServices,
      inactiveServices: totalServices - activeServices,
      avgPrice: avgPrice[0]?.avgPrice || 0,
      categoryStats,
      activePercentage: totalServices > 0 ? (activeServices / totalServices) * 100 : 0
    }

    res.json({
      status: "success",
      stats
    })
  } catch (error) {
    console.error("Error fetching service stats:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to fetch service statistics",
      error: error.message
    })
  }
}

// Get all services for a salon
exports.getServicesBySalon = async (req, res) => {
  try {
    const { salonId } = req.params
    const { isActive } = req.query

    console.log(`Getting services for salon: ${salonId}`)

    const cacheKey = `employeeService:salon:${salonId}:${isActive || "all"}`
    let services = null
    
    try {
      services = await redisClient.get(cacheKey)
      if (services) {
        services = JSON.parse(services)
        console.log(`Found ${services.length} services in cache`)
        return res.json({
          status: "success",
          source: "cache",
          services
        })
      }
    } catch (cacheError) {
      console.log("Cache error, proceeding with database query:", cacheError.message)
    }

    const filter = { salon: salonId }
    if (isActive !== undefined) {
      filter.isActive = isActive === "true"
    }

    console.log("Database filter:", filter)

    services = await EmployeeService.find(filter)
      .populate("employee", "name email profileImage")
      .populate("salon", "name")
      .sort({ name: 1 })
      .lean()

    console.log(`Found ${services.length} services in database`)

    // Cache for 5 minutes (only if Redis is working)
    try {
      await redisClient.set(cacheKey, JSON.stringify(services), { EX: 300 })
    } catch (cacheError) {
      console.log("Failed to cache services:", cacheError.message)
    }

    res.json({
      status: "success",
      source: "database",
      count: services.length,
      services
    })
  } catch (error) {
    console.error("Error getting salon services:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to get salon services",
      error: error.message
    })
  }
}

// Get all services for a salonUser
exports.getServicesBySalonUser = async (req, res) => {
  try {
    const { salonUserId } = req.params
    const { isActive } = req.query

    const cacheKey = `employeeService:salonUser:${salonUserId}:${isActive || "all"}`
    let services = await redisClient.get(cacheKey)

    if (services) {
      services = JSON.parse(services)
      return res.json({
        status: "success",
        source: "cache",
        services
      })
    }

    const filter = { salonUser: salonUserId }
    if (isActive !== undefined) {
      filter.isActive = isActive === "true"
    }

    services = await EmployeeService.find(filter)
      .populate("employee", "name email profileImage")
      .populate("salon", "name")
      .sort({ name: 1 })
      .lean()

    // Cache for 5 minutes
    await redisClient.set(cacheKey, JSON.stringify(services), { EX: 300 })

    res.json({
      status: "success",
      source: "database",
      count: services.length,
      services
    })
  } catch (error) {
    console.error("Error getting salonUser services:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to get salonUser services",
      error: error.message
    })
  }
} 