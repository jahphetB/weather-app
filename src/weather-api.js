const API_KEY = "FMDPSA639NKBW9SYS5QHFXEDJ";
const BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

export async function fetchWeather(location) {
  const url = new URL(`${BASE_URL}/${encodeURIComponent(location)}`);

  url.search = new URLSearchParams({
    key: API_KEY,
    unitGroup: "metric",
    include: "current,days",
    contentType: "json",
  }).toString();

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Could not fetch weather. Status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

