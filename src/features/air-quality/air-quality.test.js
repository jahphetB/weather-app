import test from "node:test";
import assert from "node:assert/strict";
import { normalizeAirQuality, getAqiCategory } from "./air-quality.js";
import { processWeatherData } from "../../weather-data.js";

test("missing and invalid pollutants stay unavailable while zero remains valid", () => {
  for (const value of [undefined, null, -1, NaN, Infinity, "20", ""]) {
    assert.deepEqual(normalizeAirQuality({ aqius: value, pm2p5: value, pm10: value }), {
      usAqi: null, pm25: null, pm10: null,
    });
    assert.equal(getAqiCategory(value).tone, "unavailable");
  }
  assert.deepEqual(normalizeAirQuality({ aqius: 0, pm2p5: 0, pm10: 0 }), {
    usAqi: 0, pm25: 0, pm10: 0,
  });
  assert.equal(getAqiCategory(0).label, "Good");
});

test("US AQI categories include their correct boundary values", () => {
  for (const [value, tone] of [
    [0, "good"], [50, "good"], [51, "moderate"], [100, "moderate"],
    [101, "sensitive"], [150, "sensitive"], [151, "unhealthy"], [200, "unhealthy"],
    [201, "very-unhealthy"], [300, "very-unhealthy"], [301, "hazardous"], [500, "hazardous"],
  ]) {
    assert.equal(getAqiCategory(value).tone, tone, `AQI ${value}`);
  }
});

test("weather normalization preserves partial air-quality data and dates", () => {
  const weather = processWeatherData({
    resolvedAddress: "Paris", timezone: "Europe/Paris",
    currentConditions: { temp: 20, datetimeEpoch: 123, aqius: 50.6, pm2p5: 7.5 },
    days: [
      { datetime: "2026-10-16", tempmax: 23, tempmin: 12, aqius: 60, pm10: 10 },
      { datetime: "2026-10-22", tempmax: 18, tempmin: 9, aqius: null },
    ],
  });
  assert.equal(weather.current.temperature, 20);
  assert.equal(weather.current.observedAt, 123);
  assert.deepEqual(weather.current.airQuality, { usAqi: 51, pm25: 7.5, pm10: null });
  assert.equal(weather.forecast[0].airQuality.usAqi, 60);
  assert.equal(weather.forecast[1].date, "2026-10-22");
  assert.equal(weather.forecast[1].high, 18);
  assert.deepEqual(weather.forecast[1].airQuality, { usAqi: null, pm25: null, pm10: null });
});
