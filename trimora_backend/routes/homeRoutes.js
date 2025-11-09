const express = require('express');
const { getHomeSalons } = require('../controllers/homeController');

const router = express.Router();

// GET /api/home-salons
router.get('/home-salons', getHomeSalons);

module.exports = router;
