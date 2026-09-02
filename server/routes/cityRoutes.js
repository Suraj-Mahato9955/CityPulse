const express = require("express");

const {
  addCity,
  getCities,
  getCityById,
} = require("../controllers/cityController");

const getWeather = require("../services/weatherService");

const router = express.Router();

router.post("/", addCity);

router.get("/", getCities);

router.get("/:id", getCityById);

// Get Weather
router.get("/:id/weather", async (req, res) => {
  try {
    const city = await getCityById(req, res);

    if (!city) {
      return;
    }

    const weather = await getWeather(
      city.latitude,
      city.longitude
    );

    res.json({
      success: true,
      city: city.name,
      weather,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
