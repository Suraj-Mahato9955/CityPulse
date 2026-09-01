const City = require("../models/City");

// Add City / Multiple Cities
const addCity = async (req, res) => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];

    const cities = await City.insertMany(data);

    res.status(201).json({
      success: true,
      message: `${cities.length} city/cities added successfully`,
      cities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Cities
const getCities = async (req, res) => {
  try {
    const cities = await City.find().sort({ name: 1 });

    res.json({
      success: true,
      count: cities.length,
      cities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get City By ID
const getCityById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    res.json({
      success: true,
      city,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addCity,
  getCities,
  getCityById,
};
