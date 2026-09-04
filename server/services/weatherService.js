const API_KEY = "YOUR_OPENWEATHER_API_KEY";

const WeatherService = {
  async getWeather(city) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("Weather data not found");
      }

      const data = await response.json();

      return {
        city: data.name,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      };
    } catch (error) {
      console.error("Weather API Error:", error);
      throw error;
    }
  },
};

module.exports = WeatherService;
