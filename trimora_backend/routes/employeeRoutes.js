const express = require("express")
const router = express.Router()
const employeeController = require("../controllers/employeeController")
const verifyAccess = require("../middleware/auth")
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Employee CRUD operations
router.post("/create", verifyAccess(["admin", "saloonUser"]), upload.single('profileImage'), employeeController.createEmployee)
router.get("/list", verifyAccess(["admin", "saloonUser", "user"]), employeeController.getAllEmployees)
router.get("/details/:id", verifyAccess(["admin", "saloonUser", "user"]), employeeController.getEmployeeById)
router.put("/update/:id", verifyAccess(["admin", "saloonUser"]), employeeController.updateEmployee)
router.delete("/delete/:id", verifyAccess(["admin", "saloonUser"]), employeeController.deleteEmployee)

// Employee status management
router.patch("/toggle-status/:id", verifyAccess(["admin", "saloonUser"]), employeeController.toggleEmployeeStatus)

// Employee search and filtering
router.get("/search", verifyAccess(["admin", "saloonUser", "user"]), employeeController.searchEmployees)

// Employee statistics
router.get("/statistics/:salonId", verifyAccess(["admin", "saloonUser"]), employeeController.getEmployeeStats)

// Employee statistics by salonUser
router.get("/statistics/salonUser/:salonUserId", verifyAccess(["admin", "saloonUser"]), employeeController.getEmployeeStatsBySalonUser)

// Get employees by salon
router.get("/by-salon/:salonId",employeeController.getEmployeesBySalon)

// Get employees by salonUser
router.get("/by-salonUser/:salonUserId", verifyAccess(["admin", "saloonUser", "user"]), employeeController.getEmployeesBySalonUser)

module.exports = router 