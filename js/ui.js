import { ukCities as cities } from "./constants.js";
// interfaces elements
const uiElement = {
  themeBtn: document.querySelector(".theme-btn"),
  locateBtn: document.querySelector("#locate-btn"),
  dataList: document.querySelector("#city-list"),
  searchForm: document.querySelector("#search-form"),
  searchInput: document.querySelector("#city-input"),
  errorContainer: document.querySelector("#error-message"),
  loader: document.querySelector("#loader"),
  weatherContainer: document.querySelector(".weather-container"),
  recentChips: document.querySelector("#recent-chips"),
  unitToggle: document.querySelector(".unit-toggle"),
};

const updateThemeIcon = (theme) => {
  const icon = uiElement.themeBtn.querySelector("i");
  icon.className = theme === "light" ? "bi bi-moon-fill" : "bi bi-sun-fill";
};

const renderCityList = () => {
  cities.forEach((city) => {
    const opt = document.createElement("option");
    opt.value = city;
    uiElement.dataList.appendChild(opt);
  });
};

const renderError = (message) => {
  uiElement.errorContainer.textContent = message;
  uiElement.errorContainer.classList.add("show");
};

const clearError = () => {
  uiElement.errorContainer.textContent = "";
  uiElement.errorContainer.classList.remove("show");
};

const setLoader = (visible) => {
  uiElement.loader.classList.toggle("show", visible);
};

const formatTime = (unixTime, units) => {
  const d = new Date(unixTime * 1000);

  return d.toLocaleTimeString(units === "imperial" ? "en" : "tr", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const renderWeatherData = (data, flagUrl, units = "metric") => {
  clearError();

  const tempUnit = units === "imperial" ? "°F" : "°C";

  const speedUnit = units === "imperial" ? "mph" : "m/s";

  uiElement.weatherContainer.innerHTML = `
      <article class="weather-card">
            <!-- header -->
            <div class="weather-header">
              <div class="location-info">
                <h2>${data.name}, ${data.sys.country}</h2>
                <div> <img src="${flagUrl}" alt="flag" /> </div>
              </div>
              <p id="date">${new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}</p>
            </div>

            <!--weather forecast data -->
            <div class="weather-info">
              <div class="temperature">
                <h3>${data.main.temp} ${tempUnit}</h3>
                <p>Feels Like <span>${data.main.feels_like} ${tempUnit}</span></p>
              </div>

              <div class="weather-icon">
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" />
                <p>${data.weather[0].description}</p>
              </div>
            </div>

            <!-- details -->
            <div class="weather-details">
              <!-- detay -->
              <div class="details">
                <i class="bi bi-arrow-down"></i>
                <div>
                  <p>Min</p>
                  <b>${data.main.temp_min} ${tempUnit}</b>
                </div>
              </div>
              <!-- detay -->
              <div class="details">
                <i class="bi bi-arrow-up"></i>
                <div>
                  <p>Max</p>
                  <b>${data.main.temp_max} ${tempUnit}</b>
                </div>
              </div>
              <!-- detay -->
              <div class="details">
                <i class="bi bi-wind"></i>
                <div>
                  <p>Wind Speed</p>
                  <b>${data.wind.speed} ${speedUnit}</b>
                </div>
              </div>
              <!-- detay -->
              <div class="details">
                <i class="bi bi-wind"></i>
                <div>
                  <p>Wind Direction</p>
                  <b>${data.wind.deg}°</b>
                </div>
              </div>
              <!-- detay -->
              <div class="details">
                <i class="bi bi-droplet"></i>
                <div>
                  <p>Humidity</p>
                  <b>${data.main.humidity} %</b>
                </div>
              </div>
              <!-- detay -->
              <div class="details">
                <i class="bi bi-speedometer2"></i>
                <div>
                  <p>Pressure</p>
                  <b>${data.main.pressure} hPa</b>
                </div>
              </div>
              <!-- detay -->
              <div class="details">
                <i class="bi bi-eye"></i>
                <div>
                  <p>Visibility</p>
                  <b>${data.visibility / 1000} ${speedUnit}</b>
                </div>
              </div>
              <!-- detay -->
              <div class="details">
                <i class="bi bi-cloud"></i>
                <div>
                  <p>Cloud</p>
                  <b>${data.clouds.all} %</b>
                </div>
              </div>
              <!-- detay -->
              <div class="details">
                <i class="bi bi-sun"></i>
                <div>
                  <p>Sunrise</p>
                  <b>${formatTime(data.sys.sunrise, units)}</b>
                </div>
              </div>
              <!-- detay -->
              <div class="details">
                <i class="bi bi-moon"></i>
                <div>
                  <p>Sunset</p>
                  <b>${formatTime(data.sys.sunset, units)}</b>
                </div>
              </div>
            </div>
          </article>
  `;
};

const renderRecentChips = (recentCities, onSelect) => {
  uiElement.recentChips.innerHTML = "";

  recentCities.forEach((city) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.textContent = city;
    btn.addEventListener("click", () => onSelect(city));
    uiElement.recentChips.appendChild(btn);
  });
};

const updateUnitToggle = (units) => {
  uiElement.unitToggle.querySelectorAll("button").forEach((btn) => {
    const isActive = btn.value === units;
    btn.classList.toggle("active", isActive);
  });
};

export {
  uiElement,
  updateThemeIcon,
  renderCityList,
  renderError,
  clearError,
  setLoader,
  renderWeatherData,
  renderRecentChips,
  updateUnitToggle,
};
