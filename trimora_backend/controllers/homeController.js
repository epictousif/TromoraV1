const Salon = require('../models/Saloon');

// Get salons for homepage
const getHomeSalons = async (req, res) => {
  try {
    // Fetch salons with different categories
    const allSalons = await Salon.find()
      .select('name image location rating createdAt')
      .sort({ createdAt: -1 })
      .limit(20);

    // Create different sections
    const recommended = allSalons.slice(0, 8);
    const trending = allSalons.slice(2, 10);
    const newSalons = allSalons.slice(0, 6);
    const recent = allSalons.slice(4, 8);

    res.json({
      success: true,
      salons: recommended, // For backward compatibility
      sections: {
        recommended,
        trending,
        newSalons,
        recent
      }
    });
  } catch (error) {
    console.error('Error fetching home salons:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch salons'
    });
  }
};

module.exports = {
  getHomeSalons
};
