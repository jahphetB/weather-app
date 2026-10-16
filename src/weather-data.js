import { normalizeAirQuality } from "./features/air-quality/air-quality.js";

export function processWeatherData(data) {
  const current = data.currentConditions;

  return {
    location: data.resolvedAddress,
    timezone: data.timezone,
    description: data.description,
    current: {
      observedAt: current.datetimeEpoch,
      airQuality: normalizeAirQuality(current),
      temperature: current.temp,
      feelsLike: current.feelslike,
      conditions: current.conditions,
      icon: current.icon,
    },
    forecast: data.days.map((day) => ({
      airQuality: normalizeAirQuality(day),
      date: day.datetime,
      sunrise: day.sunriseEpoch,
			sunset: day.sunsetEpoch,
      high: day.tempmax,
      low: day.tempmin,
      conditions: day.conditions,
      icon: day.icon,
    })),
  };
}
