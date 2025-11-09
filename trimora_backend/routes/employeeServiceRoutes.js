const express = require("express")
const router = express.Router()
const employeeServiceController = require("../controllers/employeeServiceController")
const verifyAccess = require("../middleware/auth")

// Employee service CRUD operations
router.post("/employee/:employeeId/create", verifyAccess(["admin", "saloonUser"]), employeeServiceController.createEmployeeService)
router.get("/employee/:employeeId/list", verifyAccess(["admin", "saloonUser", "user"]), employeeServiceController.getEmployeeServices)
router.get("/details/:id", verifyAccess(["admin", "saloonUser", "user"]), employeeServiceController.getServiceById)
router.put("/update/:id", verifyAccess(["admin", "saloonUser"]), employeeServiceController.updateService)
router.delete("/delete/:id", verifyAccess(["admin", "saloonUser"]), employeeServiceController.deleteService)

// Service status management
router.patch("/toggle-status/:id", verifyAccess(["admin", "saloonUser"]), employeeServiceController.toggleServiceStatus)

// Service filtering and search
router.get("/category/:category", verifyAccess(["admin", "saloonUser", "user"]), employeeServiceController.getServicesByCategory)
router.get("/search", verifyAccess(["admin", "saloonUser", "user"]), employeeServiceController.searchServices)

// Service statistics
router.get("/statistics", verifyAccess(["admin", "saloonUser"]), employeeServiceController.getServiceStats)

// Get services by salon and salonUser (public endpoint - no auth required)
router.get("/salon/:salonId", employeeServiceController.getServicesBySalon)
router.get("/salonUser/:salonUserId", verifyAccess(["admin", "saloonUser"]), employeeServiceController.getServicesBySalonUser)

module.exports = router 