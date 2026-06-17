import { ukCities } from "./constants.js";

import { getWeatherData, getWeatherByCoords, getFlagUrl } from "./api.js";
import {
  uiElement,
  updateThemeIcon,
  renderCityList,
  renderError,
  clearError,
  setLoader,
  renderWeatherData,
  renderRecentChips,
  updateUnitToggle,
} from "./ui.js";

const STATE = {
  theme: localStorage.getItem("theme") || "dark",
  recent: JSON.parse(localStorage.getItem("recent") || "[]"),
  units: localStorage.getItem("units") || "metric",
};

const body = document.body;

body.setAttribute("data-theme", STATE.theme);

updateThemeIcon(STATE.theme);

const persist = () => {
  localStorage.setItem("theme", STATE.theme);
  localStorage.setItem("recent", JSON.stringify(STATE.recent));
  localStorage.setItem("units", STATE.units);
};

const pushRecent = (city) => {
  if (!ukCities.some((c) => c.toLowerCase() === city.toLowerCase())) return;

  const updated = [
    city,
    ...STATE.recent.filter((c) => c.toLowerCase() !== city.toLowerCase()),
  ].slice(0, 6);

  STATE.recent = updated;
  renderRecentChips(STATE.recent, (city) => {
    uiElement.searchInput.value = city;
    handleSearch(city);
  });
  persist();
};

const handleSearch = async (city) => {
  const name = city.trim();

  if (!name) {
    renderError("City name is required.");
    return;
  }

  clearError();

  setLoader(true);

  try {
    const data = await getWeatherData(city, STATE.units);

    if (data.cod === "404") {
      return renderError("City not found");
    }

    const flagUrl = getFlagUrl(data.sys.country);

    pushRecent(name);

    renderWeatherData(data, flagUrl, STATE.units);
  } catch (error) {
    renderError(error.message || "City not found");
  } finally {
    setLoader(false);
  }
};

const handleGeoSearch = () => {
  window.navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      setLoader(true);

      const data = await getWeatherByCoords(latitude, longitude, STATE.units);

      setLoader(false);

      const flagUrl = getFlagUrl(data.sys.country);

      renderWeatherData(data, flagUrl, STATE.units);

      pushRecent(data.name);
    },

    () => {
      renderError("Location information could not be retrieved.");
    },
  );
};

//! events

document.addEventListener("DOMContentLoaded", () => {
  // handleGeoSearch();

  renderCityList();

  renderRecentChips(STATE.recent, (city) => {
    uiElement.searchInput.value = city;
    handleSearch(city);
  });

  updateUnitToggle(STATE.units);
});

uiElement.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const city = uiElement.searchInput.value;

  handleSearch(city);
});

uiElement.themeBtn.addEventListener("click", () => {
  STATE.theme = STATE.theme === "light" ? "dark" : "light";

  body.setAttribute("data-theme", STATE.theme);

  persist();

  updateThemeIcon(STATE.theme);
});

uiElement.locateBtn.addEventListener("click", handleGeoSearch);

uiElement.unitToggle.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const nextUnits = btn.value;

    if (STATE.units === nextUnits) return;

    STATE.units = nextUnits;

    persist();

    updateUnitToggle(nextUnits);

    handleSearch(STATE.recent[0]);
  });
});
