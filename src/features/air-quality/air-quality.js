function nonNegativeNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}

export function normalizeAirQuality(data = {}) {
  const aqi = nonNegativeNumber(data?.aqius);
  return {
    usAqi: aqi === null ? null : Math.round(aqi),
    pm25: nonNegativeNumber(data?.pm2p5),
    pm10: nonNegativeNumber(data?.pm10),
  };
}

// US EPA categories: https://www.airnow.gov/aqi/aqi-basics/
export function getAqiCategory(value) {
  if (nonNegativeNumber(value) === null) return { label: "Unavailable", tone: "unavailable" };
  const aqi = Math.round(value);
  if (aqi <= 50) return { label: "Good", tone: "good" };
  if (aqi <= 100) return { label: "Moderate", tone: "moderate" };
  if (aqi <= 150) return { label: "Unhealthy for sensitive groups", tone: "sensitive" };
  if (aqi <= 200) return { label: "Unhealthy", tone: "unhealthy" };
  if (aqi <= 300) return { label: "Very unhealthy", tone: "very-unhealthy" };
  return { label: "Hazardous", tone: "hazardous" };
}
