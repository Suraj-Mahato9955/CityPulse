const City = require("../models/City");

// Get all cities
const getCities = async (req, res) => {
  try {
    const cities = await City.find().sort({ name: 1 });

    res.json({
      success: true,
      count: cities.length,
      data: cities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cities",
      error: error.message,
    });
  }
};

// Get city by name
const getCityByName = async (req, res) => {
  try {
    const city = await City.findOne({
      name: { $regex: `^${req.params.name}$`, $options: "i" },
    });

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    res.json({
      success: true,
      data: city,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch city",
      error: error.message,
    });
  }
};

// Add new city
const createCity = async (req, res) => {
  try {
    const { name, state, country, latitude, longitude, population } = req.body;

    if (!name || !state) {
      return res.status(400).json({
        success: false,
        message: "City name and state are required",
      });
    }

    const existingCity = await City.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
      state: { $regex: `^${state}$`, $options: "i" },
    });

    if (existingCity) {
      return res.status(409).json({
        success: false,
        message: "City already exists",
      });
    }

    const city = await City.create({
      name,
      state,
      country,
      latitude,
      longitude,
      population,
    });

    res.status(201).json({
      success: true,
      message: "City created successfully",
      data: city,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create city",
      error: error.message,
    });
  }
};

module.exports = {
  getCities,
  getCityByName,
  createCity,
};
