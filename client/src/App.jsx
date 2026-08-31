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

function App() {
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

      {/* ================= HERO SECTION ================= */}
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

            {/* SEARCH BOX */}
            <div className="search-box">
              <Search size={21} />

              <input
                type="text"
                placeholder="Search for a city..."
              />

              <button className="search-btn">
                Search
              </button>
            </div>

            {/* Popular Cities */}
            <div className="popular-cities">
              <span>Popular:</span>

              <button>Delhi</button>
              <button>Mumbai</button>
              <button>Bangalore</button>
              <button>Chandigarh</button>
            </div>
          </div>
        </section>

        {/* ================= DASHBOARD ================= */}
        <section className="dashboard-preview" id="dashboard">
          <div className="section-heading">
            <div>
              <span className="section-label">LIVE DATA</span>
              <h2>City Overview</h2>
            </div>

            <p>Real-time city intelligence</p>
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
                <h3>28°</h3>

                <div className="weather-info">
                  <span>Clear Sky</span>
                  <small>Feels like 29°</small>
                </div>
              </div>

              <div className="card-footer">
                <MapPin size={14} />
                Chandigarh
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
                <h3>142</h3>

                <div className="weather-info">
                  <span>Moderate</span>
                  <small>AQI Index</small>
                </div>
              </div>

              <div className="card-footer">
                PM2.5 · 68 μg/m³
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
                <h3>1.2M</h3>

                <div className="weather-info">
                  <span>Residents</span>
                  <small>City population</small>
                </div>
              </div>

              <div className="card-footer">
                Updated recently
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
                <h3>03</h3>

                <div className="weather-info">
                  <span>Active</span>
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

            {/* MAP PLACEHOLDER */}
            <div className="large-card map-card" id="explore">
              <div className="large-card-header">
                <div>
                  <span className="section-label">LOCATION</span>
                  <h3>City Map</h3>
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
                  <strong>Chandigarh</strong>
                  <span>Current city</span>
                </div>
              </div>
            </div>

            {/* AQI SUMMARY */}
            <div className="large-card">
              <div className="large-card-header">
                <div>
                  <span className="section-label">AIR QUALITY</span>
                  <h3>Today's AQI</h3>
                </div>

                <Wind size={21} />
              </div>

              <div className="aqi-score">
                <strong>142</strong>
                <span>Moderate</span>
              </div>

              <div className="aqi-bar">
                <div className="aqi-progress"></div>
              </div>

              <div className="aqi-scale">
                <span>Good</span>
                <span>Moderate</span>
                <span>Unhealthy</span>
              </div>

              <p className="aqi-description">
                Air quality is acceptable, but sensitive people
                may experience minor health effects.
              </p>
            </div>

          </div>
        </section>

        {/* ================= ABOUT ================= */}
        <section className="about-section" id="about">
          <span className="section-label">ABOUT CITYPULSE</span>

          <h2>
            One place to understand
            <span> your city.</span>
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