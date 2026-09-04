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
  RefreshCw,
  X,
} from "lucide-react";

import "./App.css";


// ================= WEATHER DESCRIPTION =================

const getWeatherDescription = (code) => {
  if (code === 0) return "Clear Sky";
  if (code === 1) return "Mainly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";

  if ([45, 48].includes(code)) {
    return "Fog";
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return "Drizzle";
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return "Rain";
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return "Snow";
  }

  if ([95, 96, 99].includes(code)) {
    return "Thunderstorm";
  }

  return "Unknown";
};


// ================= AQI STATUS =================

const getAQIStatus = (aqi) => {
  if (aqi === null || aqi === undefined) {
    return "Unknown";
  }

  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";

  return "Hazardous";
};


// ================= AQI SHORT STATUS =================

const getAQIShortStatus = (aqi) => {
  if (aqi === null || aqi === undefined) {
    return "Unknown";
  }

  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Sensitive";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";

  return "Hazardous";
};


// ================= AQI DESCRIPTION =================

const getAQIDescription = (aqi) => {
  if (aqi === null || aqi === undefined) {
    return "Air quality data is currently unavailable.";
  }

  if (aqi <= 50) {
    return "Air quality is good and poses little or no risk.";
  }

  if (aqi <= 100) {
    return "Air quality is acceptable, but some sensitive people may experience minor effects.";
  }

  if (aqi <= 150) {
    return "Sensitive people may experience health effects from the current air quality.";
  }

  if (aqi <= 200) {
    return "Everyone may begin to experience health effects from the current air quality.";
  }

  if (aqi <= 300) {
    return "Health alert: the risk of health effects is increased for everyone.";
  }

  return "Health warning: emergency conditions are expected. Avoid prolonged outdoor exposure.";
};


// ================= ALERT STATUS =================

const getAlertStatus = (aqi) => {
  if (aqi === null || aqi === undefined) {
    return "Unknown";
  }

  if (aqi <= 50) return "Safe";
  if (aqi <= 100) return "Low";
  if (aqi <= 150) return "Moderate";
  if (aqi <= 200) return "High";

  return "Critical";
};


// ================= ALERT COUNT =================

const getAlertCount = (aqi) => {
  if (aqi === null || aqi === undefined) {
    return "--";
  }

  if (aqi <= 50) return "00";
  if (aqi <= 100) return "01";
  if (aqi <= 150) return "02";
  if (aqi <= 200) return "03";

  return "04";
};


// ================= APP =================

function App() {

  // ================= STATE =================

  const [cities, setCities] = useState([]);

  const [selectedCity, setSelectedCity] = useState(null);

  const [search, setSearch] = useState("");

  const [weather, setWeather] = useState(null);

  const [loadingCities, setLoadingCities] = useState(true);

  const [loadingWeather, setLoadingWeather] = useState(false);

  const [error, setError] = useState("");

  const [lastUpdated, setLastUpdated] = useState(null);


  // ================= FETCH CITIES =================

  useEffect(() => {

    const fetchCities = async () => {

      try {

        setLoadingCities(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/cities"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cities");
        }

        const data = await response.json();

        setCities(data.cities || []);

        if (data.cities && data.cities.length > 0) {
          setSelectedCity(data.cities[0]);
        }

      } catch (error) {

        console.error("Error fetching cities:", error);

        setError(
          "Unable to load cities. Please make sure the backend server is running."
        );

      } finally {

        setLoadingCities(false);

      }

    };

    fetchCities();

  }, []);


  // ================= FETCH WEATHER =================

  const fetchWeather = async (city) => {

    if (!city) return;

    try {

      setLoadingWeather(true);
      setError("");

      setWeather(null);

      const response = await fetch(
        `http://localhost:5000/api/cities/${city._id}/weather`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather");
      }

      const data = await response.json();

      if (data.success) {

        setWeather(data.weather);

        setLastUpdated(new Date());

      } else {

        throw new Error(
          data.message || "Weather data unavailable"
        );

      }

    } catch (error) {

      console.error("Error fetching weather:", error);

      setWeather(null);

      setError(
        "Unable to load weather data for this city."
      );

    } finally {

      setLoadingWeather(false);

    }

  };


  // ================= WEATHER WHEN CITY CHANGES =================

  useEffect(() => {

    if (!selectedCity) return;

    fetchWeather(selectedCity);

  }, [selectedCity]);


  // ================= FILTER CITIES =================

  const filteredCities = cities.filter((city) =>
    city.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  // ================= SEARCH FUNCTION =================

  const handleSearch = () => {

    if (filteredCities.length === 0) {

      setError("City not found.");

      return;

    }

    setSelectedCity(filteredCities[0]);

    setSearch("");

    setError("");

  };


  // ================= ENTER KEY SEARCH =================

  const handleSearchKeyDown = (e) => {

    if (e.key === "Enter") {
      handleSearch();
    }

  };


  // ================= CLEAR SEARCH =================

  const clearSearch = () => {

    setSearch("");

    setError("");

  };


  // ================= SELECT CITY =================

  const handleCitySelect = (city) => {

    setSelectedCity(city);

    setSearch("");

    setError("");

  };


  // ================= REFRESH WEATHER =================

  const handleRefresh = () => {

    if (selectedCity) {
      fetchWeather(selectedCity);
    }

  };


  // ================= SCROLL TO SECTION =================

  const scrollToSection = (id) => {

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }

  };


  // ================= AQI VALUE =================

  const currentAQI = weather?.us_aqi ?? null;


  // ================= RENDER =================

  return (

    <div className="app">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="logo">

          <div className="logo-icon">
            CP
          </div>

          <span>
            CityPulse
          </span>

        </div>


        <div className="nav-links">

          <a
            href="#dashboard"
            onClick={() =>
              scrollToSection("dashboard")
            }
          >
            Dashboard
          </a>

          <a
            href="#explore"
            onClick={() =>
              scrollToSection("explore")
            }
          >
            Explore
          </a>

          <a
            href="#about"
            onClick={() =>
              scrollToSection("about")
            }
          >
            About
          </a>

        </div>


        <div className="nav-actions">

          <button
            className="icon-btn"
            title="Notifications"
          >
            <Bell size={19} />
          </button>


          <button
            className="menu-btn"
            title="Menu"
          >
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

              <span>
                Smart City Intelligence
              </span>

            </div>


            <h1>

              Understand Your

              <span>
                City Better.
              </span>

            </h1>


            <p>

              Explore real-time weather, air quality,
              city information and important insights —
              all in one place.

            </p>


            {/* ================= SEARCH ================= */}

            <div className="search-box">

              <Search size={21} />


              <input
                type="text"
                placeholder="Search for a city..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                onKeyDown={handleSearchKeyDown}
              />


              {search && (

                <button
                  className="clear-search"
                  onClick={clearSearch}
                  title="Clear search"
                >
                  <X size={17} />
                </button>

              )}


              <button
                className="search-btn"
                onClick={handleSearch}
              >
                Search
              </button>

            </div>


            {/* ================= SEARCH RESULTS ================= */}

            {search && filteredCities.length > 0 && (

              <div className="search-results">

                {filteredCities
                  .slice(0, 5)
                  .map((city) => (

                    <button
                      key={city._id}
                      onClick={() =>
                        handleCitySelect(city)
                      }
                    >

                      <MapPin size={15} />

                      <span>
                        {city.name}, {city.state}
                      </span>

                    </button>

                  ))}

              </div>

            )}


            {/* ================= ERROR ================= */}

            {error && (

              <div className="error-message">
                {error}
              </div>

            )}


            {/* ================= POPULAR CITIES ================= */}

            <div className="popular-cities">

              <span>
                Popular:
              </span>


              {loadingCities ? (

                <span>
                  Loading cities...
                </span>

              ) : (

                cities.map((city) => (

                  <button
                    key={city._id}
                    className={
                      selectedCity?._id === city._id
                        ? "active-city"
                        : ""
                    }
                    onClick={() =>
                      handleCitySelect(city)
                    }
                  >
                    {city.name}
                  </button>

                ))

              )}

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


            <div className="dashboard-status">

              {selectedCity && (

                <span>
                  <MapPin size={14} />

                  {selectedCity.name}
                </span>

              )}

              <button
                className="refresh-btn"
                onClick={handleRefresh}
                disabled={loadingWeather}
                title="Refresh weather"
              >

                <RefreshCw
                  size={16}
                  className={
                    loadingWeather
                      ? "spinning"
                      : ""
                  }
                />

              </button>

            </div>

          </div>


          {/* ================= INFO CARDS ================= */}

          <div className="cards">


            {/* ================= WEATHER ================= */}

            <div className="info-card weather-card">

              <div className="card-top">

                <div className="card-title">

                  <CloudSun size={19} />

                  <span>
                    Weather
                  </span>

                </div>

                <ArrowUpRight size={18} />

              </div>


              <div className="card-main">

                <h3>

                  {loadingWeather

                    ? "--"

                    : weather

                      ? `${Math.round(
                          weather.temperature_2m
                        )}°`

                      : "--"}

                </h3>


                <span>

                  {loadingWeather

                    ? "Loading..."

                    : weather

                      ? getWeatherDescription(
                          weather.weather_code
                        )

                      : "No data"}

                </span>


                <small>

                  {weather

                    ? `Feels like ${Math.round(
                        weather.apparent_temperature
                      )}°`

                    : "Temperature unavailable"}

                </small>

              </div>


              <div className="card-footer">

                <MapPin size={14} />

                <span>

                  {selectedCity?.name ||
                    "Select a city"}

                </span>

              </div>

            </div>


            {/* ================= AQI ================= */}

            <div className="info-card aqi-card">

              <div className="card-top">

                <div className="card-title">

                  <Wind size={19} />

                  <span>
                    Air Quality
                  </span>

                </div>

                <ArrowUpRight size={18} />

              </div>


              <div className="card-main">

                <h3>

                  {currentAQI ?? "--"}

                </h3>


                <div className="weather-info">

                  <span>

                    {currentAQI !== null

                      ? getAQIStatus(currentAQI)

                      : "Loading..."}

                  </span>


                  <small>
                    US AQI
                  </small>

                </div>

              </div>


              <div className="card-footer">

                PM2.5 ·{" "}

                {weather?.pm2_5 !== undefined

                  ? weather.pm2_5.toFixed(1)

                  : "--"}{" "}

                μg/m³

              </div>

            </div>


            {/* ================= POPULATION ================= */}

            <div className="info-card">

              <div className="card-top">

                <div className="card-title">

                  <Users size={19} />

                  <span>
                    Population
                  </span>

                </div>

                <ArrowUpRight size={18} />

              </div>


              <div className="card-main">

                <h3>

                  {selectedCity?.population

                    ? `${(
                        selectedCity.population /
                        1000000
                      ).toFixed(1)}M`

                    : "N/A"}

                </h3>


                <div className="weather-info">

                  <span>
                    Residents
                  </span>

                  <small>
                    City population
                  </small>

                </div>

              </div>


              <div className="card-footer">

                {selectedCity?.name ||
                  "Select a city"}

              </div>

            </div>


            {/* ================= ALERTS ================= */}

            <div className="info-card alert-card">

              <div className="card-top">

                <div className="card-title">

                  <AlertTriangle size={19} />

                  <span>
                    Alerts
                  </span>

                </div>

                <ArrowUpRight size={18} />

              </div>


              <div className="card-main">

                <h3>

                  {getAlertCount(currentAQI)}

                </h3>


                <div className="weather-info">

                  <span>

                    {getAlertStatus(currentAQI)}

                  </span>


                  <small>

                    {currentAQI !== null &&
                    currentAQI > 100

                      ? "Air quality alert"

                      : "City alerts"}

                  </small>

                </div>

              </div>


              <div className="card-footer">

                <span>
                  Wind ·{" "}
                  {weather?.wind_speed_10m ??
                    "--"}{" "}
                  km/h
                </span>

              </div>

            </div>

          </div>


          {/* ================= LOWER DASHBOARD ================= */}

          <div className="dashboard-grid">


            {/* ================= MAP ================= */}

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


                <button
                  className="small-btn"
                  onClick={() =>
                    scrollToSection("explore")
                  }
                >

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

                    {selectedCity?.name ||
                      "Select a city"}

                  </strong>


                  <span>

                    {selectedCity?.state ||
                      "Current city"}

                  </span>

                </div>


                {/* ================= COORDINATES ================= */}

                <div className="map-coordinates">

                  <span>

                    Lat:{" "}

                    {selectedCity?.latitude ??
                      "--"}

                  </span>


                  <span>

                    Long:{" "}

                    {selectedCity?.longitude ??
                      "--"}

                  </span>

                </div>

              </div>

            </div>


            {/* ================= AQI SUMMARY ================= */}

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

                  {currentAQI ?? "--"}

                </strong>


                <span>

                  {currentAQI !== null

                    ? getAQIStatus(currentAQI)

                    : "Loading..."}

                </span>

              </div>


              {/* ================= AQI BAR ================= */}

              <div className="aqi-bar">

                <div
                  className="aqi-progress"
                  style={{
                    width: `${
                      currentAQI !== null
                        ? Math.min(
                            (currentAQI /
                              300) *
                              100,
                            100
                          )
                        : 0
                    }%`,
                  }}
                ></div>

              </div>


              <div className="aqi-scale">

                <span>
                  Good
                </span>

                <span>
                  Moderate
                </span>

                <span>
                  Unhealthy
                </span>

              </div>


              {/* ================= AQI DESCRIPTION ================= */}

              <p className="aqi-description">

                {getAQIDescription(currentAQI)}

              </p>


              {/* ================= AQI DETAILS ================= */}

              <div className="aqi-details">

                <div>

                  <span>
                    PM2.5
                  </span>

                  <strong>

                    {weather?.pm2_5 !== undefined

                      ? `${weather.pm2_5.toFixed(
                          1
                        )} μg/m³`

                      : "--"}

                  </strong>

                </div>


                <div>

                  <span>
                    Wind
                  </span>

                  <strong>

                    {weather?.wind_speed_10m ??
                      "--"}{" "}
                    km/h

                  </strong>

                </div>

              </div>

            </div>

          </div>


          {/* ================= LAST UPDATED ================= */}

          <div className="last-updated">

            {lastUpdated

              ? `Last updated: ${lastUpdated.toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}`

              : "Waiting for live data..."}

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

            CityPulse brings important city
            information together into one simple
            and intelligent dashboard.

          </p>

        </section>

      </main>

    </div>
  );
}


export default App;
