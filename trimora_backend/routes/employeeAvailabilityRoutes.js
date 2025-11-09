const express = require("express")
const router = express.Router()
const employeeAvailabilityController = require("../controllers/employeeAvailabilityController")
const verifyAccess = require("../middleware/auth")

// Employee availability CRUD operations
router.post("/employee/:employeeId/create", verifyAccess(["admin", "saloonUser"]), employeeAvailabilityController.createAvailability)
router.get("/employee/:employeeId/list", verifyAccess(["admin", "saloonUser", "user"]), employeeAvailabilityController.getEmployeeAvailability)
router.get("/details/:id", verifyAccess(["admin", "saloonUser", "user"]), employeeAvailabilityController.getAvailabilityById)
router.put("/update/:id", verifyAccess(["admin", "saloonUser"]), employeeAvailabilityController.updateAvailability)
router.delete("/delete/:id", verifyAccess(["admin", "saloonUser"]), employeeAvailabilityController.deleteAvailability)

// Booking operations
router.post("/book/:id", verifyAccess(["admin", "saloonUser", "user"]), employeeAvailabilityController.bookSlot)
router.post("/cancel/:id", verifyAccess(["admin", "saloonUser", "user"]), employeeAvailabilityController.cancelBooking)

// Time slot generation
router.post("/generate-slots/:employeeId", verifyAccess(["admin", "saloonUser"]), employeeAvailabilityController.generateTimeSlots)

// Availability queries
router.get("/available-slots/:employeeId", verifyAccess(["admin", "saloonUser", "user"]), employeeAvailabilityController.getAvailableSlots)

// Booking statistics
router.get("/statistics/:employeeId", verifyAccess(["admin", "saloonUser"]), employeeAvailabilityController.getBookingStats)

module.exports = router 