const City = require("../models/City");

// Add City
const addCity = async (req, res) => {
  try {
    const city = await City.create(req.body);

    res.status(201).json({
      success: true,
      message: "City added successfully",
      city,
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
