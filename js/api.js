const API_KEY = "40e7ee4a6de50f10ca31c0283e5c0132";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const getWeatherData = async (city, units = "metric") => {
  const url = `${BASE_URL}?q=${city},GB&appid=${API_KEY}&units=${units}&lang=en`;

  const res = await fetch(url);

  const data = await res.json(); // json ====> js

  console.log(data);

  return data;
};

export const getWeatherByCoords = async (lat, lon, units = "metric") => {
  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;

  const res = await fetch(url);

  return res.json();
};

export const getFlagUrl = (countryCode) =>
  `https://flagcdn.com/108x81/${countryCode.toLowerCase()}.png`;
