const express = require("express");

const {
  addCity,
  getCities,
  getCityById,
} = require("../controllers/cityController");

const router = express.Router();

router.post("/", addCity);

router.get("/", getCities);

router.get("/:id", getCityById);

module.exports = router;
