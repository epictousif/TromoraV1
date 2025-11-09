const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // ✅ Import CORS

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// ✅ Use CORS before all routes
app.use(cors({
  origin:[ 'http://localhost:5173','http://localhost:5174','https://trimora.netlify.app'] ,// allow your frontend origin
  credentials: true               // allow cookies to be sent
}));

// Security headers
app.use(helmet());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/v1/admin', adminRoutes);

const saloonUserRoutes = require('./routes/saloonUserRoutes');
app.use('/api/v1/saloonUser', saloonUserRoutes);

const saloonRoutes = require('./routes/saloonRoutes');
app.use('/api/v1/saloon', saloonRoutes);

const employeeRoutes = require('./routes/employeeRoutes');
app.use('/api/v1/employee', employeeRoutes);

const employeeServiceRoutes = require('./routes/employeeServiceRoutes');
app.use('/api/v1/employee-service', employeeServiceRoutes);

const employeeAvailabilityRoutes = require('./routes/employeeAvailabilityRoutes');
app.use('/api/v1/employee-availability', employeeAvailabilityRoutes);

const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/v1/bookings', bookingRoutes);

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/v1/payments', paymentRoutes);

// New: customer user routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/v1/user', userRoutes);

// New: owner booking routes
const ownerBookingRoutes = require('./routes/ownerBookingRoutes');
app.use('/api/v1/owner', ownerBookingRoutes);

// Fresha-style booking routes
const freshaBookingRoutes = require('./routes/freshaBookingRoutes');
app.use('/api/v1/fresha', freshaBookingRoutes);

// Home routes
const homeRoutes = require('./routes/homeRoutes');
app.use('/api', homeRoutes);

module.exports = app;
