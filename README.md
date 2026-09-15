# 🌍 CityPulse

### Smart City Weather & Air Quality Monitoring Dashboard

CityPulse is a full-stack web application that helps users monitor **weather conditions, air quality, forecasts, and smart city alerts** for different cities from one simple dashboard.

The project combines real-time weather and air-quality data with a clean and responsive interface to make environmental information easier to understand.

---

## 🚀 Live Demo

🔗 Live Demo: Coming Soon

🔗 GitHub Repository:
https://github.com/Suraj-Mahato9955/CityPulse

---

## ✨ Features

### 🌤️ Weather Monitoring
- Current temperature
- Feels-like temperature
- Humidity
- Atmospheric pressure
- Wind speed
- Weather condition
- Weather description

### 🌫️ Air Quality Monitoring
- US AQI
- PM2.5 level
- AQI status
- Easy-to-understand AQI explanation

### 📅 5-Day Forecast
- 5-day weather forecast
- Daily weather conditions
- Temperature information
- Today / Tomorrow / weekday labels

### 🚨 Smart City Alerts
CityPulse automatically checks weather and air-quality conditions and generates alerts.

Examples:
- Extreme Heat Alert
- High Temperature Warning
- Strong Wind Alert
- Poor Air Quality Alert
- Air Quality Warning
- All Clear status

### ❤️ Favorite Cities
- Add cities to favorites
- Remove cities from favorites
- Favorites are stored using browser localStorage
- Quick access to frequently checked cities

### 🔎 City Search
- Search for available cities
- Select a city to view its weather information
- Popular cities are displayed for quick access

### 🔄 Refresh Weather
Users can manually refresh weather information whenever required.

### 📱 Responsive Design
CityPulse is designed to work across:
- Desktop
- Laptop
- Tablet
- Mobile devices

### 🧭 Multiple Pages
The application includes:
- Dashboard
- Explore Cities
- About

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- Lucide React

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB

### APIs
- OpenWeather API
- Open-Meteo Air Quality API

### Development Tools
- VS Code
- Git
- GitHub
- npm
- Nodemon

---

## 🏗️ Project Structure

```text
CityPulse/
│
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── README.md
