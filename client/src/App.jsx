import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Bell,
  Menu,
  Wind,
  CloudSun,
  Users,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";

import "./App.css";

const getWeatherDescription = (code) => {
  if (code === 0) return "Clear Sky";
  if (code === 1) return "Mainly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";

  return "Unknown";
};

function App() {

  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState(null);

  // Fetch cities from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/cities")
      .then((response) => response.json())
      .then((data) => {
        setCities(data.cities);

        if (data.cities.length > 0) {
          setSelectedCity(data.cities[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
      });
  }, []);
  useEffect(() => {
    if (!selectedCity) return;

    fetch(`http://localhost:5000/api/cities/${selectedCity._id}/weather`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setWeather(data.weather);
        }
      })
      .catch((error) => {
        console.error("Error fetching weather:", error);
      });
  }, [selectedCity]);

  // Search cities
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}
      <nav className="navbar">

        <div className="logo">
          <div className="logo-icon">CP</div>
          <span>CityPulse</span>
        </div>

        <div className="nav-links">
          <a href="#dashboard">Dashboard</a>
          <a href="#explore">Explore</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">
          <button className="icon-btn" title="Notifications">
            <Bell size={19} />
          </button>

          <button className="menu-btn" title="Menu">
            <Menu size={21} />
          </button>
        </div>

      </nav>

      {/* ================= HERO ================= */}
      <main>

        <section className="hero">

          <div className="hero-content">

            <div className="location-badge">
              <MapPin size={16} />
              <span>Smart City Intelligence</span>
            </div>

            <h1>
              Understand Your
              <span>City Better.</span>
            </h1>

            <p>
              Explore real-time weather, air quality, city news,
              events and important information — all in one place.
            </p>

            {/* SEARCH */}
            <div className="search-box">

              <Search size={21} />

              <input
                type="text"
                placeholder="Search for a city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                className="search-btn"
                onClick={() => {
                  if (filteredCities.length > 0) {
                    setSelectedCity(filteredCities[0]);
                  }
                }}
              >
                Search
              </button>

            </div>

            {/* POPULAR CITIES */}
            <div className="popular-cities">

              <span>Popular:</span>

              {cities.map((city) => (<button
                key={city._id}
                onClick={() => {
                  setSelectedCity(city);
                  setSearch("");
                }}
              >
                {city.name}
              </button>
              ))}

            </div>

          </div>

        </section>

        {/* ================= DASHBOARD ================= */}
        <section
          className="dashboard-preview"
          id="dashboard"
        >

          <div className="section-heading">

            <div>
              <span className="section-label">
                LIVE DATA
              </span>

              <h2>
                City Overview
              </h2>
            </div>

            <p>
              Real-time city intelligence
            </p>

          </div>

          {/* ================= INFO CARDS ================= */}
          <div className="cards">

            {/* WEATHER */}
            <div className="info-card weather-card">

              <div className="card-top">

                <div className="card-title">
                  <CloudSun size={19} />
                  <span>Weather</span>
                </div>

                <ArrowUpRight size={18} />

              </div>

              <div className="card-main">

                <h3>
                  {weather ? `${Math.round(weather.temperature_2m)}°` : "--"}
                </h3>

                <span>
                  {weather
                    ? getWeatherDescription(weather.weather_code)
                    : "Loading..."}
                </span>

                <small>
                  {weather
                    ? `Feels like ${Math.round(weather.apparent_temperature)}°`
                    : "Loading..."}
                </small>

              </div>

              <div className="card-footer">

                <MapPin size={14} />

                {selectedCity?.name || "Select a city"}

              </div>

            </div>

            {/* AQI */}
            <div className="info-card aqi-card">

              <div className="card-top">

                <div className="card-title">
                  <Wind size={19} />
                  <span>Air Quality</span>
                </div>

                <ArrowUpRight size={18} />

              </div>

              <div className="card-main">

                <h3>
                  {weather?.us_aqi ?? "--"}
                </h3>

                <div className="weather-info">
                  <span>
                    {weather
                      ? weather.us_aqi <= 50
                        ? "Good"
                        : weather.us_aqi <= 100
                          ? "Moderate"
                          : weather.us_aqi <= 150
                            ? "Unhealthy for Sensitive Groups"
                            : "Unhealthy"
                      : "Loading..."}
                  </span>

                  <small>AQI Index</small>
                </div>

              </div>

              <div className="card-footer">
                PM2.5 · {weather?.pm2_5?.toFixed(1) ?? "--"} μg/m³
              </div>

            </div>

            {/* POPULATION */}
            <div className="info-card">
              <div className="card-top">
                <div className="card-title">
                  <Users size={19} />
                  <span>Population</span>
                </div>

                <ArrowUpRight size={18} />
              </div>

              <div className="card-main">
                <h3>
                  {selectedCity?.population
                    ? `${(selectedCity.population / 1000000).toFixed(1)}M`
                    : "N/A"}
                </h3>

                <div className="weather-info">
                  <span>Residents</span>
                  <small>City population</small>
                </div>
              </div>

              <div className="card-footer">
                {selectedCity?.name || "Select a city"}
              </div>
            </div>

            {/* ALERTS */}
            <div className="info-card alert-card">

              <div className="card-top">

                <div className="card-title">
                  <AlertTriangle size={19} />
                  <span>Alerts</span>
                </div>

                <ArrowUpRight size={18} />

              </div>

              <div className="card-main">

                <h3>
                  {weather
                    ? weather.us_aqi > 150
                      ? "03"
                      : weather.us_aqi > 100
                        ? "02"
                        : weather.us_aqi > 50
                          ? "01"
                          : "00"
                    : "--"}
                </h3>

                <div className="weather-info">
                  <span>
                    {weather
                      ? weather.us_aqi > 150
                        ? "High"
                        : weather.us_aqi > 100
                          ? "Moderate"
                          : weather.us_aqi > 50
                            ? "Low"
                            : "Safe"
                      : "Loading..."}
                  </span>

                  <small>City alerts</small>
                </div>

              </div>

              <div className="card-footer">
                View all alerts
              </div>

            </div>

          </div>

          {/* ================= LOWER DASHBOARD ================= */}
          <div className="dashboard-grid">

            {/* MAP */}
            <div
              className="large-card map-card"
              id="explore"
            >

              <div className="large-card-header">

                <div>
                  <span className="section-label">
                    LOCATION
                  </span>

                  <h3>
                    City Map
                  </h3>
                </div>

                <button className="small-btn">

                  Explore

                  <ArrowUpRight size={15} />

                </button>

              </div>

              <div className="map-placeholder">

                <div className="map-grid"></div>

                <div className="map-pin">
                  <MapPin size={28} />
                </div>

                <div className="map-location">

                  <strong>
                    {selectedCity?.name || "Select a city"}
                  </strong>

                  <span>
                    {selectedCity?.state || "Current city"}
                  </span>

                </div>

              </div>

            </div>

            {/* AQI SUMMARY */}
            <div className="large-card">

              <div className="large-card-header">

                <div>

                  <span className="section-label">
                    AIR QUALITY
                  </span>

                  <h3>
                    Today's AQI
                  </h3>

                </div>

                <Wind size={21} />

              </div>

              <div className="aqi-score">

                <strong>
                  {weather?.us_aqi ?? "--"}
                </strong>

                <span>
                  {weather
                    ? weather.us_aqi <= 50
                      ? "Good"
                      : weather.us_aqi <= 100
                        ? "Moderate"
                        : weather.us_aqi <= 150
                          ? "Unhealthy for Sensitive Groups"
                          : "Unhealthy"
                    : "Loading..."}
                </span>

              </div>

              <div className="aqi-bar">
                <div
                  className="aqi-progress"
                  style={{
                    width: `${Math.min(((weather?.us_aqi || 0) / 300) * 100, 100)}%`,
                  }}
                ></div>
              </div>

              <div className="aqi-scale">

                <span>Good</span>
                <span>Moderate</span>
                <span>Unhealthy</span>

              </div>

              <p className="aqi-description">
                {weather
                  ? weather.us_aqi <= 50
                    ? "Air quality is good and poses little or no risk."
                    : weather.us_aqi <= 100
                      ? "Air quality is acceptable, but some sensitive people may experience minor effects."
                      : weather.us_aqi <= 150
                        ? "Sensitive people may experience health effects from the current air quality."
                        : "Everyone may begin to experience health effects from the current air quality."
                  : "Loading air quality data..."}
              </p>

            </div>

          </div>

        </section>

        {/* ================= ABOUT ================= */}
        <section
          className="about-section"
          id="about"
        >

          <span className="section-label">
            ABOUT CITYPULSE
          </span>

          <h2>

            One place to understand

            <span>
              {" "}your city.
            </span>

          </h2>

          <p>

            CityPulse brings important city information together
            into one simple and intelligent dashboard.

          </p>

        </section>

      </main>

    </div>
  );
}

export default App;
