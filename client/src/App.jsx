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
  Heart,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

// =====================================================
// LEAFLET MARKER FIX
// =====================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// =====================================================
// WEATHER DESCRIPTION
// =====================================================

const getWeatherDescription = (code) => {
  if (code === 0) return "Clear Sky";
  if ([1, 2, 3].includes(code)) return "Partly Cloudy";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55].includes(code)) return "Drizzle";
  if ([61, 63, 65].includes(code)) return "Rain";
  if ([71, 73, 75].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain Showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";

  return "Unknown";
};

// =====================================================
// FORECAST DAY
// =====================================================

const getForecastDay = (date) => {
  if (!date) return "--";

  const today = new Date();
  const forecastDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  forecastDate.setHours(0, 0, 0, 0);

  const difference = Math.round(
    (forecastDate - today) / (1000 * 60 * 60 * 24)
  );

  if (difference <= 0) return "Today";
  if (difference === 1) return "Tomorrow";

  return forecastDate.toLocaleDateString("en-US", {
    weekday: "short",
  });
};

// =====================================================
// AQI STATUS
// =====================================================

const getAQIStatus = (aqi) => {
  if (aqi === null || aqi === undefined) return "Unknown";

  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Sensitive";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";

  return "Hazardous";
};

// =====================================================
// AQI DESCRIPTION
// =====================================================

const getAQIDescription = (aqi) => {
  if (aqi === null || aqi === undefined) {
    return "AQI data unavailable";
  }

  if (aqi <= 50) return "Air quality is good";
  if (aqi <= 100) return "Air quality is acceptable";
  if (aqi <= 150) return "Sensitive people should take care";
  if (aqi <= 200) return "Everyone may experience effects";
  if (aqi <= 300) return "Health alert for everyone";

  return "Health emergency conditions";
};

// =====================================================
// ALERT STATUS
// =====================================================

const getAlertStatus = (alerts) => {
  if (!alerts || alerts.length === 0) {
    return "Safe";
  }

  if (alerts.some((alert) => alert.type === "danger")) {
    return "Critical";
  }

  return "Warning";
};

// =====================================================
// CITY COORDINATES
// =====================================================

// If your MongoDB city has latitude/longitude,
// those values will be used first.
//
// These are fallback coordinates for common Indian cities.

const cityCoordinates = {
  dhanbad: [23.7957, 86.4304],
  ranchi: [23.3441, 85.3096],
  jamshedpur: [22.8046, 86.2029],
  bokaro: [23.6693, 86.1511],
  kolkata: [22.5726, 88.3639],
  patna: [25.5941, 85.1376],
  delhi: [28.6139, 77.209],
  "new delhi": [28.6139, 77.209],
  mumbai: [19.076, 72.8777],
  pune: [18.5204, 73.8567],
  bangalore: [12.9716, 77.5946],
  bengaluru: [12.9716, 77.5946],
  hyderabad: [17.385, 78.4867],
  chennai: [13.0827, 80.2707],
  jaipur: [26.9124, 75.7873],
  lucknow: [26.8467, 80.9462],
  kanpur: [26.4499, 80.3319],
  bhubaneswar: [20.2961, 85.8245],
  rourkela: [22.2604, 84.8536],
  varanasi: [25.3176, 82.9739],
  agra: [27.1767, 78.0081],
  amritsar: [31.634, 74.8723],
  ludhiana: [30.901, 75.8573],
  chandigarh: [30.7333, 76.7794],
  gurgaon: [28.4595, 77.0266],
  gurugram: [28.4595, 77.0266],
  noida: [28.5355, 77.391],
  ghaziabad: [28.6692, 77.4538],
  surat: [21.1702, 72.8311],
  ahmedabad: [23.0225, 72.5714],
  nagpur: [21.1458, 79.0882],
  indore: [22.7196, 75.8577],
  bhopal: [23.2599, 77.4126],
  dehradun: [30.3165, 78.0322],
  shimla: [31.1048, 77.1734],
  guwahati: [26.1445, 91.7362],
  visakhapatnam: [17.6868, 83.2185],
  vijayawada: [16.5062, 80.648],
  kochi: [9.9312, 76.2673],
  thiruvananthapuram: [8.5241, 76.9366],
};

// =====================================================
// GET CITY COORDINATES
// =====================================================

const getCityCoordinates = (city) => {
  if (!city) {
    return [20.5937, 78.9629];
  }

  // Different possible database field names
  const latitude =
    city.latitude ??
    city.lat ??
    city.coordinates?.latitude ??
    city.coordinates?.lat;

  const longitude =
    city.longitude ??
    city.lng ??
    city.lon ??
    city.coordinates?.longitude ??
    city.coordinates?.lng ??
    city.coordinates?.lon;

  if (
    latitude !== undefined &&
    longitude !== undefined &&
    !Number.isNaN(Number(latitude)) &&
    !Number.isNaN(Number(longitude))
  ) {
    return [Number(latitude), Number(longitude)];
  }

  const cityName = (city.name || "").toLowerCase().trim();

  if (cityCoordinates[cityName]) {
    return cityCoordinates[cityName];
  }

  // India center as final fallback
  return [20.5937, 78.9629];
};

// =====================================================
// MAP COMPONENT
// =====================================================

const CityMap = ({ city }) => {
  if (!city) {
    return (
      <div className="map-empty">
        <MapPin size={36} />
        <h4>Select a city</h4>
        <p>City location will appear here.</p>
      </div>
    );
  }

  const position = getCityCoordinates(city);

  return (
    <div className="city-map">
      <MapContainer
        key={city._id || city.name}
        center={position}
        zoom={12}
        scrollWheelZoom={true}
        className="leaflet-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position}>
          <Popup>
            <strong>{city.name}</strong>
            <br />
            {city.state || city.country || "India"}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

// =====================================================
// APP
// =====================================================

function App() {
  // ===================================================
  // STATES
  // ===================================================

  const [currentPage, setCurrentPage] = useState("dashboard");

  const [cities, setCities] = useState([]);

  const [favorites, setFavorites] = useState([]);

  const [selectedCity, setSelectedCity] = useState(null);

  const [search, setSearch] = useState("");

  const [weather, setWeather] = useState(null);

  const [loadingCities, setLoadingCities] = useState(true);

  const [loadingWeather, setLoadingWeather] = useState(false);

  const [error, setError] = useState("");

  const [lastUpdated, setLastUpdated] = useState(null);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  // ===================================================
  // LOAD FAVORITES
  // ===================================================

  useEffect(() => {
    try {
      const savedFavorites =
        JSON.parse(
          localStorage.getItem("citypulse-favorites")
        ) || [];

      setFavorites(savedFavorites);
    } catch (error) {
      console.error(
        "Error loading favorites:",
        error
      );

      setFavorites([]);
    }
  }, []);

  // ===================================================
  // FETCH CITIES
  // ===================================================

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/cities"
        );

        if (!response.ok) {
          throw new Error("Failed to load cities");
        }

        const data = await response.json();

        const cityList = data.cities || [];

        setCities(cityList);

        if (cityList.length > 0) {
          setSelectedCity(cityList[0]);
        }
      } catch (error) {
        console.error("City Error:", error);

        setError(
          "Unable to load cities. Please check the backend."
        );
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  // ===================================================
  // FETCH WEATHER
  // ===================================================

  useEffect(() => {
    const fetchWeather = async () => {
      if (!selectedCity?._id) return;

      try {
        setLoadingWeather(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/cities/" +
            selectedCity._id +
            "/weather"
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load weather data"
          );
        }

        const data = await response.json();

        setWeather(data.weather || data);

        setLastUpdated(new Date());
      } catch (error) {
        console.error("Weather Error:", error);

        setError(
          "Unable to load weather data for this city"
        );

        setWeather(null);
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
  }, [selectedCity]);

  // ===================================================
  // CLOSE MOBILE MENU
  // ===================================================

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPage]);

  // ===================================================
  // SELECT CITY
  // ===================================================

  const selectCity = (city) => {
    if (!city) return;

    setSelectedCity(city);

    setSearch("");

    setCurrentPage("dashboard");

    setMobileMenuOpen(false);
  };

  // ===================================================
  // NAVIGATION
  // ===================================================

  const navigateTo = (page) => {
    setCurrentPage(page);

    setMobileMenuOpen(false);
  };

  // ===================================================
  // TOGGLE FAVORITE
  // ===================================================

  const toggleFavorite = (city) => {
    if (!city) return;

    const isFavorite = favorites.some(
      (favorite) => favorite._id === city._id
    );

    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter(
        (favorite) => favorite._id !== city._id
      );
    } else {
      updatedFavorites = [
        ...favorites,
        city,
      ];
    }

    setFavorites(updatedFavorites);

    localStorage.setItem(
      "citypulse-favorites",
      JSON.stringify(updatedFavorites)
    );
  };

  // ===================================================
  // REFRESH WEATHER
  // ===================================================

  const refreshWeather = async () => {
    if (!selectedCity?._id) return;

    try {
      setLoadingWeather(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/cities/" +
          selectedCity._id +
          "/weather"
      );

      if (!response.ok) {
        throw new Error(
          "Unable to refresh weather"
        );
      }

      const data = await response.json();

      setWeather(data.weather || data);

      setLastUpdated(new Date());
    } catch (error) {
      console.error(
        "Refresh Weather Error:",
        error
      );

      setError(
        "Unable to refresh weather data"
      );
    } finally {
      setLoadingWeather(false);
    }
  };

  // ===================================================
  // FILTER CITIES
  // ===================================================

  const filteredCities = cities.filter((city) => {
    const cityName = city.name || "";

    return cityName
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  // ===================================================
  // CURRENT DATA
  // ===================================================

  const currentAQI =
    weather?.us_aqi ?? null;

  const currentPM25 =
    weather?.pm2_5 ?? null;

  const currentTemperature =
    weather?.temperature ?? null;

  const currentWind =
    weather?.windSpeed ?? null;

  const currentCondition =
    weather?.condition ||
    getWeatherDescription(
      weather?.weather_code
    );

  const alerts =
    weather?.alerts || [];

  const alertStatus =
    getAlertStatus(alerts);

  const alertCount =
    alerts.length;

  const isSelectedFavorite =
    selectedCity &&
    favorites.some(
      (favorite) =>
        favorite._id ===
        selectedCity._id
    );

  // ===================================================
  // DASHBOARD
  // ===================================================

  const renderDashboard = () => {
    return (
      <main className="main-content">

        {/* HERO */}

        <section className="hero-section">
          <div className="hero-content">

            <span className="section-label">
              SMART CITY MONITORING
            </span>

            <h1>
              Monitor Your City.
              <br />
              <span>
                Understand Your Air.
              </span>
            </h1>

            <p>
              Get real-time weather, air quality,
              forecasts and smart city alerts
              in one place.
            </p>

            {/* SEARCH */}

            <div className="search-box">
              <Search size={20} />

              <input
                type="text"
                placeholder="Search for a city..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {search && (
                <button
                  className="search-clear"
                  onClick={() =>
                    setSearch("")
                  }
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* SEARCH RESULTS */}

            {search &&
              filteredCities.length > 0 && (
                <div className="search-results">
                  {filteredCities
                    .slice(0, 5)
                    .map((city) => (
                      <button
                        key={city._id}
                        className="search-result-item"
                        onClick={() =>
                          selectCity(city)
                        }
                      >
                        <MapPin size={16} />

                        <span>
                          {city.name}
                          {city.state
                            ? `, ${city.state}`
                            : ""}
                        </span>
                      </button>
                    ))}
                </div>
              )}

            {search &&
              filteredCities.length === 0 && (
                <div className="search-results">
                  <div className="no-results">
                    No cities found
                  </div>
                </div>
              )}

          </div>
        </section>

        {/* ERROR */}

        {error && (
          <div className="error-message">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* POPULAR CITIES */}

        <section className="content-section">

          <div className="section-heading">
            <div>
              <span className="section-label">
                QUICK ACCESS
              </span>

              <h2>
                Popular Cities
              </h2>
            </div>

            <button
              className="text-button"
              onClick={() =>
                navigateTo("explore")
              }
            >
              Explore all
              <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="city-pills">

            {loadingCities ? (
              <div className="loading-text">
                Loading cities...
              </div>
            ) : cities.length > 0 ? (
              cities
                .slice(0, 6)
                .map((city) => (
                  <button
                    key={city._id}
                    className={`city-pill ${
                      selectedCity?._id ===
                      city._id
                        ? "active-city"
                        : ""
                    }`}
                    onClick={() =>
                      selectCity(city)
                    }
                  >
                    <MapPin size={15} />
                    {city.name}
                  </button>
                ))
            ) : (
              <div className="loading-text">
                No cities available
              </div>
            )}

          </div>
        </section>

        {/* CURRENT CITY */}

        {selectedCity ? (
          <section className="dashboard-grid">

            {/* WEATHER */}

            <div className="large-card weather-card">

              <div className="large-card-header">

                <div>
                  <span className="section-label">
                    CURRENT WEATHER
                  </span>

                  <h3>
                    {selectedCity.name}
                  </h3>
                </div>

                <div className="card-actions">

                  <button
                    className={`favorite-btn ${
                      isSelectedFavorite
                        ? "favorite-active"
                        : ""
                    }`}
                    onClick={() =>
                      toggleFavorite(
                        selectedCity
                      )
                    }
                    title={
                      isSelectedFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <Heart
                      size={17}
                      fill={
                        isSelectedFavorite
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>

                  <button
                    className="refresh-btn"
                    onClick={
                      refreshWeather
                    }
                    disabled={
                      loadingWeather
                    }
                    title="Refresh weather"
                  >
                    <RefreshCw
                      size={17}
                      className={
                        loadingWeather
                          ? "spin"
                          : ""
                      }
                    />
                  </button>

                </div>
              </div>

              {loadingWeather ? (
                <div className="card-loading">
                  Loading weather...
                </div>
              ) : weather ? (
                <div className="weather-main">

                  <div className="temperature">
                    {currentTemperature !== null
                      ? `${Math.round(
                          currentTemperature
                        )}°`
                      : "--"}
                  </div>

                  <div className="weather-condition">

                    <CloudSun size={32} />

                    <div>
                      <strong>
                        {currentCondition ||
                          "Unknown"}
                      </strong>

                      <span>
                        Feels like{" "}
                        {weather.feelsLike !==
                        undefined
                          ? `${Math.round(
                              weather.feelsLike
                            )}°C`
                          : "--"}
                      </span>
                    </div>

                  </div>
                </div>
              ) : (
                <div className="card-loading">
                  Weather data unavailable
                </div>
              )}

              <div className="weather-details">

                <div className="weather-detail">
                  <Wind size={18} />

                  <div>
                    <span>Wind</span>

                    <strong>
                      {currentWind !== null
                        ? `${Math.round(
                            currentWind
                          )} km/h`
                        : "--"}
                    </strong>
                  </div>
                </div>

                <div className="weather-detail">
                  <CloudSun size={18} />

                  <div>
                    <span>Humidity</span>

                    <strong>
                      {weather?.humidity !==
                      undefined
                        ? `${weather.humidity}%`
                        : "--"}
                    </strong>
                  </div>
                </div>

                <div className="weather-detail">
                  <span className="detail-symbol">
                    P
                  </span>

                  <div>
                    <span>Pressure</span>

                    <strong>
                      {weather?.pressure !==
                      undefined
                        ? `${weather.pressure} hPa`
                        : "--"}
                    </strong>
                  </div>
                </div>

              </div>
            </div>

            {/* AQI */}

            <div className="large-card aqi-card">

              <div className="large-card-header">

                <div>
                  <span className="section-label">
                    AIR QUALITY
                  </span>

                  <h3>US AQI</h3>
                </div>

                <div className="aqi-status">
                  {getAQIStatus(
                    currentAQI
                  )}
                </div>

              </div>

              {loadingWeather ? (
                <div className="card-loading">
                  Loading AQI...
                </div>
              ) : (
                <>
                  <div className="aqi-value">
                    {currentAQI !== null
                      ? Math.round(
                          currentAQI
                        )
                      : "--"}
                  </div>

                  <p className="aqi-description">
                    {getAQIDescription(
                      currentAQI
                    )}
                  </p>

                  <div className="aqi-bar">
                    <div
                      className="aqi-bar-fill"
                      style={{
                        width: `${Math.min(
                          currentAQI || 0,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="aqi-meta">
                    <span>
                      PM2.5
                    </span>

                    <strong>
                      {currentPM25 !== null
                        ? `${currentPM25.toFixed(
                            1
                          )} µg/m³`
                        : "--"}
                    </strong>
                  </div>
                </>
              )}
            </div>

            {/* POPULATION */}

            <div className="small-card">

              <div className="small-card-icon">
                <Users size={20} />
              </div>

              <span>POPULATION</span>

              <h3>
                {selectedCity.population
                  ? Number(
                      selectedCity.population
                    ).toLocaleString()
                  : "N/A"}
              </h3>

              <p>
                {selectedCity.state ||
                  "City population"}
              </p>

            </div>

            {/* ALERT */}

            <div className="small-card">

              <div className="small-card-icon">
                <Bell size={20} />
              </div>

              <span>CITY ALERTS</span>

              <h3>
                {alertCount}
              </h3>

              <p>
                Status:{" "}
                <strong>
                  {alertStatus}
                </strong>
              </p>

            </div>

          </section>
        ) : (
          <section className="large-card">
            <div className="card-loading">
              Select a city to view dashboard data.
            </div>
          </section>
        )}

        {/* =================================================
            REAL CITY MAP
        ================================================= */}

        <section className="large-card map-card">

          <div className="large-card-header">

            <div>
              <span className="section-label">
                CITY LOCATION
              </span>

              <h3>
                {selectedCity?.name ||
                  "City Map"}
              </h3>
            </div>

            <MapPin size={21} />

          </div>

          <CityMap city={selectedCity} />

          {selectedCity && (
            <div className="map-info">

              <div>
                <MapPin size={16} />

                <span>
                  {selectedCity.name}
                  {selectedCity.state
                    ? `, ${selectedCity.state}`
                    : ""}
                </span>
              </div>

              <span className="map-info-text">
                Interactive city map
              </span>

            </div>
          )}

        </section>

        {/* AQI SUMMARY */}

        <section className="large-card">

          <div className="large-card-header">

            <div>
              <span className="section-label">
                AIR QUALITY SUMMARY
              </span>

              <h3>
                How is the air today?
              </h3>
            </div>

          </div>

          <div className="aqi-summary">

            <div className="aqi-summary-score">

              <span>AQI</span>

              <strong>
                {currentAQI !== null
                  ? Math.round(
                      currentAQI
                    )
                  : "--"}
              </strong>

            </div>

            <div className="aqi-summary-info">

              <h4>
                {getAQIStatus(
                  currentAQI
                )}
              </h4>

              <p>
                {getAQIDescription(
                  currentAQI
                )}
              </p>

              <div className="aqi-scale">
                <span>Good</span>
                <span>Moderate</span>
                <span>Unhealthy</span>
                <span>Hazardous</span>
              </div>

            </div>
          </div>
        </section>

        {/* 5 DAY FORECAST */}

        <section className="large-card forecast-card">

          <div className="large-card-header">

            <div>
              <span className="section-label">
                WEATHER FORECAST
              </span>

              <h3>
                5-Day Forecast
              </h3>
            </div>

            <CloudSun size={21} />

          </div>

          {loadingWeather ? (
            <div className="card-loading">
              Loading forecast...
            </div>
          ) : weather?.forecast?.length >
            0 ? (
            <div className="forecast-grid">

              {weather.forecast
                .slice(0, 5)
                .map((day, index) => (
                  <div
                    className="forecast-item"
                    key={
                      day.date || index
                    }
                  >

                    <span className="forecast-day">
                      {getForecastDay(
                        day.date
                      )}
                    </span>

                    {day.icon ? (
                      <img
                        src={
                          "https://openweathermap.org/img/wn/" +
                          day.icon +
                          "@2x.png"
                        }
                        alt={
                          day.description ||
                          "Weather"
                        }
                      />
                    ) : (
                      <CloudSun size={34} />
                    )}

                    <strong>
                      {day.temperature !==
                      undefined
                        ? `${Math.round(
                            day.temperature
                          )}°C`
                        : day.temp !==
                          undefined
                        ? `${Math.round(
                            day.temp
                          )}°C`
                        : "--"}
                    </strong>

                    <span>
                      {day.description ||
                        day.condition ||
                        "Weather"}
                    </span>

                  </div>
                ))}

            </div>
          ) : (
            <div className="card-loading">
              Forecast data unavailable
            </div>
          )}

        </section>

        {/* SMART CITY ALERTS */}

        <section className="large-card alerts-card">

          <div className="large-card-header">

            <div>
              <span className="section-label">
                CITY ALERTS
              </span>

              <h3>
                Smart City Alerts
              </h3>
            </div>

            <Bell size={21} />

          </div>

          {loadingWeather ? (
            <div className="alerts-loading">
              Checking city alerts...
            </div>
          ) : weather?.alerts?.length >
            0 ? (
            <div className="alerts-list">

              {weather.alerts.map(
                (alert, index) => (
                  <div
                    className={`alert-item ${alert.type}`}
                    key={index}
                  >

                    <div className="alert-icon">

                      {alert.type ===
                      "danger" ? (
                        <AlertTriangle
                          size={20}
                        />
                      ) : alert.type ===
                        "warning" ? (
                        <Bell size={20} />
                      ) : (
                        <span>✓</span>
                      )}

                    </div>

                    <div className="alert-content">

                      <h4>
                        {alert.title}
                      </h4>

                      <p>
                        {alert.message}
                      </p>

                    </div>

                  </div>
                )
              )}

            </div>
          ) : (
            <div className="alert-item safe">

              <div className="alert-icon">
                <span>✓</span>
              </div>

              <div className="alert-content">

                <h4>
                  No Active Alerts
                </h4>

                <p>
                  Weather and air quality
                  conditions are currently
                  within normal levels.
                </p>

              </div>

            </div>
          )}

        </section>

        {/* LAST UPDATED */}

        <div className="last-updated">

          <span>
            Last updated:{" "}
            {lastUpdated
              ? lastUpdated.toLocaleTimeString(
                  "en-IN",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )
              : "Not available"}
          </span>

          <button
            onClick={refreshWeather}
            disabled={loadingWeather}
          >
            <RefreshCw size={14} />
            Refresh
          </button>

        </div>

      </main>
    );
  };

  // =====================================================
  // EXPLORE PAGE
  // =====================================================

  const renderExplore = () => {
    return (
      <main className="main-content">

        <section className="page-header">

          <span className="section-label">
            CITY DIRECTORY
          </span>

          <h1>
            Explore Cities
          </h1>

          <p>
            Browse available cities and check
            their real-time environmental data.
          </p>

        </section>

        <section className="explore-search">

          <Search size={20} />

          <input
            type="text"
            placeholder="Search cities..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              onClick={() =>
                setSearch("")
              }
            >
              <X size={18} />
            </button>
          )}

        </section>

        {/* FAVORITES */}

        {favorites.length > 0 && (
          <section className="content-section">

            <div className="section-heading">

              <div>
                <span className="section-label">
                  SAVED CITIES
                </span>

                <h2>
                  Favorites
                </h2>
              </div>

              <Heart size={20} />

            </div>

            <div className="city-grid">

              {favorites.map((city) => (
                <div
                  className="city-card favorite-city-card"
                  key={city._id}
                >

                  <div className="city-card-top">

                    <div className="city-card-icon">
                      <MapPin size={20} />
                    </div>

                    <button
                      className="favorite-btn favorite-active"
                      onClick={() =>
                        toggleFavorite(
                          city
                        )
                      }
                      title="Remove from favorites"
                    >
                      <Heart
                        size={17}
                        fill="currentColor"
                      />
                    </button>

                  </div>

                  <h3>
                    {city.name}
                  </h3>

                  <p>
                    {city.state ||
                      "India"}
                  </p>

                  <button
                    className="city-card-button"
                    onClick={() =>
                      selectCity(city)
                    }
                  >
                    View Dashboard
                    <ArrowUpRight
                      size={16}
                    />
                  </button>

                </div>
              ))}

            </div>
          </section>
        )}

        {/* ALL CITIES */}

        <section className="content-section">

          <div className="section-heading">

            <div>
              <span className="section-label">
                ALL CITIES
              </span>

              <h2>
                {filteredCities.length}{" "}
                Cities Available
              </h2>
            </div>

          </div>

          {loadingCities ? (
            <div className="loading-text">
              Loading cities...
            </div>
          ) : filteredCities.length >
            0 ? (
            <div className="city-grid">

              {filteredCities.map(
                (city) => {

                  const isFavorite =
                    favorites.some(
                      (favorite) =>
                        favorite._id ===
                        city._id
                    );

                  return (
                    <div
                      className="city-card"
                      key={city._id}
                    >

                      <div className="city-card-top">

                        <div className="city-card-icon">
                          <MapPin size={20} />
                        </div>

                        <button
                          className={`favorite-btn ${
                            isFavorite
                              ? "favorite-active"
                              : ""
                          }`}
                          onClick={() =>
                            toggleFavorite(
                              city
                            )
                          }
                          title={
                            isFavorite
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          <Heart
                            size={17}
                            fill={
                              isFavorite
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>

                      </div>

                      <h3>
                        {city.name}
                      </h3>

                      <p>
                        {city.state ||
                          city.country ||
                          "India"}
                      </p>

                      {city.population && (
                        <div className="city-population">

                          <Users size={15} />

                          <span>
                            {Number(
                              city.population
                            ).toLocaleString()}
                          </span>

                        </div>
                      )}

                      <button
                        className="city-card-button"
                        onClick={() =>
                          selectCity(city)
                        }
                      >
                        View Dashboard
                        <ArrowUpRight
                          size={16}
                        />
                      </button>

                    </div>
                  );
                }
              )}

            </div>
          ) : (
            <div className="no-results-box">

              <Search size={28} />

              <h3>
                No cities found
              </h3>

              <p>
                Try searching for another
                city.
              </p>

            </div>
          )}

        </section>

      </main>
    );
  };

  // =====================================================
  // ABOUT PAGE
  // =====================================================

  const renderAbout = () => {
    return (
      <main className="main-content">

        <section className="page-header about-header">

          <span className="section-label">
            ABOUT CITYPULSE
          </span>

          <h1>
            Understand Your City.
          </h1>

          <p>
            CityPulse is a smart city monitoring
            dashboard designed to make weather
            and air quality information simple
            and accessible.
          </p>

        </section>

        <section className="about-grid">

          <div className="about-card">

            <div className="about-card-icon">
              <Wind size={24} />
            </div>

            <h3>
              Real-Time Weather
            </h3>

            <p>
              Get current temperature, humidity,
              wind speed and other weather
              information for your selected city.
            </p>

          </div>

          <div className="about-card">

            <div className="about-card-icon">
              <CloudSun size={24} />
            </div>

            <h3>
              Air Quality
            </h3>

            <p>
              Monitor US AQI and PM2.5 levels
              to better understand the air
              quality around you.
            </p>

          </div>

          <div className="about-card">

            <div className="about-card-icon">
              <Bell size={24} />
            </div>

            <h3>
              Smart Alerts
            </h3>

            <p>
              Receive simple alerts when
              temperature, wind or air quality
              reaches concerning levels.
            </p>

          </div>

          <div className="about-card">

            <div className="about-card-icon">
              <Heart size={24} />
            </div>

            <h3>
              Favorite Cities
            </h3>

            <p>
              Save the cities you check most
              often for quick access from the
              Explore page.
            </p>

          </div>

        </section>

        <section className="large-card about-tech-card">

          <div className="large-card-header">

            <div>
              <span className="section-label">
                TECHNOLOGY
              </span>

              <h3>
                Built With Modern Web Technologies
              </h3>
            </div>

          </div>

          <div className="tech-list">

            <div className="tech-item">
              <strong>
                React + Vite
              </strong>
              <span>
                Frontend interface
              </span>
            </div>

            <div className="tech-item">
              <strong>
                Node.js + Express
              </strong>
              <span>
                Backend API
              </span>
            </div>

            <div className="tech-item">
              <strong>
                MongoDB
              </strong>
              <span>
                City data storage
              </span>
            </div>

            <div className="tech-item">
              <strong>
                OpenWeather
              </strong>
              <span>
                Weather and forecast data
              </span>
            </div>

            <div className="tech-item">
              <strong>
                Open-Meteo
              </strong>
              <span>
                Air quality data
              </span>
            </div>

            <div className="tech-item">
              <strong>
                Leaflet + OpenStreetMap
              </strong>
              <span>
                Interactive city maps
              </span>
            </div>

            <div className="tech-item">
              <strong>
                Lucide React
              </strong>
              <span>
                Interface icons
              </span>
            </div>

          </div>
        </section>

        <section className="large-card developer-card">

          <div className="large-card-header">

            <div>
              <span className="section-label">
                DEVELOPER
              </span>

              <h3>
                Built as a Full-Stack Project
              </h3>
            </div>

          </div>

          <p>
            CityPulse was created as a practical
            full-stack web application combining
            frontend development, backend APIs,
            database integration and external APIs.
          </p>

          <div className="developer-links">

            <a
              href="https://github.com/Suraj-Mahato9955"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
              <ArrowUpRight size={16} />
            </a>

            <a
              href="https://www.linkedin.com/in/suraj-mahato9603"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
              <ArrowUpRight size={16} />
            </a>

          </div>

        </section>

      </main>
    );
  };

  // =====================================================
  // MAIN RETURN
  // =====================================================

  return (
    <div className="app">

      {/* NAVBAR */}

      <header className="navbar">

        <div
          className="logo"
          onClick={() =>
            navigateTo("dashboard")
          }
        >

          <div className="logo-icon">
            <Wind size={19} />
          </div>

          <span>
            City
            <span>Pulse</span>
          </span>

        </div>

        {/* DESKTOP NAV */}

        <nav className="nav-links">

          <button
            className={
              currentPage === "dashboard"
                ? "nav-active"
                : ""
            }
            onClick={() =>
              navigateTo("dashboard")
            }
          >
            Dashboard
          </button>

          <button
            className={
              currentPage === "explore"
                ? "nav-active"
                : ""
            }
            onClick={() =>
              navigateTo("explore")
            }
          >
            Explore Cities
          </button>

          <button
            className={
              currentPage === "about"
                ? "nav-active"
                : ""
            }
            onClick={() =>
              navigateTo("about")
            }
          >
            About
          </button>

        </nav>

        <div className="navbar-actions">

          {/* FAVORITES */}

          <button
            className="nav-icon-button"
            onClick={() =>
              navigateTo("explore")
            }
            title="Favorites"
          >

            <Heart
              size={18}
              fill={
                favorites.length > 0
                  ? "currentColor"
                  : "none"
              }
            />

            {favorites.length > 0 && (
              <span className="favorite-count">
                {favorites.length}
              </span>
            )}

          </button>

          {/* MOBILE MENU */}

          <button
            className="nav-menu-button"
            onClick={() =>
              setMobileMenuOpen(
                (prev) => !prev
              )
            }
            title="Menu"
            aria-label="Toggle navigation menu"
            aria-expanded={
              mobileMenuOpen
            }
          >
            {mobileMenuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>

        </div>

      </header>

      {/* MOBILE MENU */}

      {mobileMenuOpen && (
        <div className="mobile-menu">

          <button
            className={
              currentPage === "dashboard"
                ? "mobile-nav-active"
                : ""
            }
            onClick={() =>
              navigateTo("dashboard")
            }
          >
            <Wind size={18} />
            Dashboard
          </button>

          <button
            className={
              currentPage === "explore"
                ? "mobile-nav-active"
                : ""
            }
            onClick={() =>
              navigateTo("explore")
            }
          >
            <MapPin size={18} />
            Explore Cities
          </button>

          <button
            className={
              currentPage === "about"
                ? "mobile-nav-active"
                : ""
            }
            onClick={() =>
              navigateTo("about")
            }
          >
            <Bell size={18} />
            About
          </button>

        </div>
      )}

      {/* PAGE */}

      {currentPage === "dashboard" &&
        renderDashboard()}

      {currentPage === "explore" &&
        renderExplore()}

      {currentPage === "about" &&
        renderAbout()}

      {/* FOOTER */}

      <footer className="footer">

        <div>
          <strong>
            CityPulse
          </strong>

          <span>
            Smart city monitoring made simple.
          </span>
        </div>

        <span>
          © {new Date().getFullYear()} CityPulse
        </span>

      </footer>

    </div>
  );
}

export default App;
