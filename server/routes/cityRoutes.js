const express = require("express");

const {
  addCity,
  getCities,
  getCityById,
  getCityWeather,
} = require("../controllers/cityController");

const router = express.Router();

router.post("/", addCity);

router.get("/", getCities);

router.get("/:id/weather", getCityWeather);

router.get("/:id", getCityById);

module.exports = router;

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
