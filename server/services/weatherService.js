const getWeather = async (latitude, longitude) => {
  try {
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!API_KEY) {
      throw new Error("OpenWeather API key is missing");
    }

    // =========================
    // CURRENT WEATHER
    // =========================

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );

    if (!weatherResponse.ok) {
      throw new Error(`Weather API Error: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();

    // =========================
    // AIR QUALITY
    // =========================

    const airQualityResponse = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm2_5`
    );

    if (!airQualityResponse.ok) {
      throw new Error(
        `Air Quality API Error: ${airQualityResponse.status}`
      );
    }

    const airQualityData = await airQualityResponse.json();

    // =========================
    // 5 DAY FORECAST
    // =========================

    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );

    if (!forecastResponse.ok) {
      throw new Error(`Forecast API Error: ${forecastResponse.status}`);
    }

    const forecastData = await forecastResponse.json();

    // Take one forecast for each day
    const dailyForecast = [];

    forecastData.list.forEach((item) => {
      const date = new Date(item.dt * 1000)
        .toISOString()
        .split("T")[0];

      const alreadyExists = dailyForecast.find(
        (day) => day.date === date
      );

      if (!alreadyExists && dailyForecast.length < 5) {
        dailyForecast.push({
          date: date,
          temperature: Math.round(item.main.temp),
          condition: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        });
      }
    });

    // =========================
    // SMART CITY ALERTS
    // =========================

    const alerts = [];

    const temperature = Math.round(weatherData.main.temp);

    const windSpeed = Number(
      (weatherData.wind.speed * 3.6).toFixed(1)
    );

    const aqi = airQualityData.current.us_aqi;

    // Extreme Heat
    if (temperature >= 40) {
      alerts.push({
        type: "danger",
        title: "Extreme Heat Alert",
        message: "Temperature is extremely high. Stay hydrated and avoid direct sunlight.",
      });
    }

    // High Temperature
    else if (temperature >= 35) {
      alerts.push({
        type: "warning",
        title: "High Temperature Warning",
        message: "High temperature detected. Stay hydrated and limit outdoor activities.",
      });
    }

    // Strong Wind
    if (windSpeed >= 40) {
      alerts.push({
        type: "warning",
        title: "Strong Wind Alert",
        message: "Strong winds detected. Take care while travelling outdoors.",
      });
    }

    // Poor Air Quality
    if (aqi >= 151) {
      alerts.push({
        type: "danger",
        title: "Poor Air Quality Alert",
        message: "Air quality is unhealthy. Avoid prolonged outdoor activities.",
      });
    }

    // Moderate Air Quality
    else if (aqi >= 101) {
      alerts.push({
        type: "warning",
        title: "Air Quality Warning",
        message: "Air quality is unhealthy for sensitive groups.",
      });
    }

    // No alerts
    if (alerts.length === 0) {
      alerts.push({
        type: "safe",
        title: "All Clear",
        message: "No major weather or air quality alerts for this city.",
      });
    }

    // =========================
    // RETURN DATA
    // =========================

    return {
      // Current Weather
      temperature: temperature,
      feelsLike: Math.round(weatherData.main.feels_like),
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,

      windSpeed: windSpeed,

      condition: weatherData.weather[0].main,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,

      // Air Quality
      us_aqi: airQualityData.current.us_aqi,
      pm2_5: airQualityData.current.pm2_5,

      // 5 Day Forecast
      forecast: dailyForecast,

      // Smart City Alerts
      alerts: alerts,
    };
  } catch (error) {
    console.error("Weather Service Error:", error.message);
    throw error;
  }
};

module.exports = getWeather;
