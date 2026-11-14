

const tempF = document.querySelector('#tempF');
const windS = document.querySelector('#speed');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');
const windch = document.querySelector('#windchill');
const forecastContainer = document.querySelector('#forecast');

const currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=Buenos Aires,AR&appid=5bc1660a21ac63b45bdbdb20b541d94d&units=imperial';
const forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?q=Buenos Aires,AR&appid=5bc1660a21ac63b45bdbdb20b541d94d&units=imperial';

async function apiFetch() {
  try {
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentWeatherURL),
      fetch(forecastURL)
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error('Unable to load weather data.');
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();
    displayResults(currentData, forecastData);
  } catch (error) {
    console.error(error);
    if (tempF) tempF.textContent = 'N/A';
    if (windS) windS.textContent = 'N/A';
    if (windch) windch.textContent = 'N/A';
    if (captionDesc) captionDesc.textContent = 'Weather unavailable';
    if (forecastContainer) forecastContainer.innerHTML = '<p>Forecast unavailable.</p>';
  }
}

apiFetch();

function displayResults(weatherData, forecastData) {
  const temp = Number(weatherData.main?.temp ?? 0);
  const speed = Number(weatherData.wind?.speed ?? 0);
  const description = weatherData.weather?.[0]?.description || 'Weather unavailable';
  const iconCode = weatherData.weather?.[0]?.icon || '01d';

  if (tempF) {
    tempF.innerHTML = `<strong>${temp.toFixed(0)}</strong>`;
  }

  if (windS) {
    windS.textContent = speed.toFixed(0);
  }

  if (weatherIcon) {
    weatherIcon.setAttribute('src', `https://openweathermap.org/img/wn/${iconCode}.png`);
    weatherIcon.setAttribute('alt', description);
  }

  if (captionDesc) {
    captionDesc.textContent = description.toUpperCase();
  }

  if (windch) {
    windch.textContent = windChill(temp, speed);
  }

  renderForecast(forecastData);
}

function windChill(temp, speed) {
  if (temp <= 50 && speed > 3) {
    const chill = 35.74 + 0.6215 * temp - 35.75 * (speed ** 0.16) + 0.4275 * temp * (speed ** 0.16);
    return `${chill.toFixed(1)}°F`;
  }

  return 'N/A';
}

function renderForecast(forecastData) {
  if (!forecastContainer || !Array.isArray(forecastData.list)) {
    return;
  }

  const dailyForecasts = [];
  const seenDates = new Set();

  forecastData.list.forEach((entry) => {
    const date = new Date(entry.dt * 1000);
    const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (seenDates.has(dateKey)) {
      return;
    }

    const time = date.getHours();
    if (time >= 10 && time <= 14) {
      dailyForecasts.push({
        dateKey,
        temp: Number(entry.main?.temp ?? 0),
        description: entry.weather?.[0]?.description || 'Forecast'
      });
      seenDates.add(dateKey);
    }
  });

  const upcomingDays = dailyForecasts.slice(0, 3);

  forecastContainer.innerHTML = upcomingDays
    .map((day) => `<div class="forecast-day"><strong>${day.dateKey}</strong><span>${day.temp.toFixed(0)}°F</span><small>${day.description}</small></div>`)
    .join('');
}

