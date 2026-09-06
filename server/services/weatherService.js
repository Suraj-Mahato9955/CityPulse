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
      const date = new Date(item.dt * 1000).toISOString().split("T")[0];

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
    // RETURN DATA
    // =========================

    return {
      // Current Weather
      temperature: Math.round(weatherData.main.temp),
      feelsLike: Math.round(weatherData.main.feels_like),
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      windSpeed: Number(
        (weatherData.wind.speed * 3.6).toFixed(1)
      ),

      condition: weatherData.weather[0].main,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,

      // Air Quality
      us_aqi: airQualityData.current.us_aqi,
      pm2_5: airQualityData.current.pm2_5,

      // 5 Day Forecast
      forecast: dailyForecast,
    };
  } catch (error) {
    console.error("Weather Service Error:", error.message);
    throw error;
  }
};

module.exports = getWeather;
