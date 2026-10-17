import test from "node:test";
import assert from "node:assert/strict";
import { getTimeOfDay } from "./time-theme.js";
import { getWeatherTheme } from "./weather-theme.js";

test("page themes follow city time and sunrise/sunset boundaries", () => {
  const at = (hour) => new Date(`2026-10-16T${hour}:00:00Z`);
  assert.equal(getTimeOfDay(at("05"), "UTC"), "night");
  assert.equal(getTimeOfDay(at("06"), "UTC"), "morning");
  assert.equal(getTimeOfDay(at("12"), "UTC"), "day");
  assert.equal(getTimeOfDay(at("18"), "UTC"), "night");
  assert.equal(getTimeOfDay(at("12"), "America/Denver"), "morning");
  const sun = { sunrise: at("08").getTime() / 1000, sunset: at("17").getTime() / 1000 };
  assert.equal(getTimeOfDay(at("07"), "UTC", sun), "night");
  assert.equal(getTimeOfDay(at("08"), "UTC", sun), "morning");
  assert.equal(getTimeOfDay(at("17"), "UTC", sun), "night");
});

test("forecast themes follow each day's weather including mixed conditions", () => {
  for (const [icon, theme] of [
    ["snow-showers-day", "snowy"], ["thunder-rain", "stormy"], ["rain", "rainy"],
    ["partly-cloudy-day", "partly-cloudy"], ["clear-day", "sunny"],
    ["fog", "foggy"], ["wind", "windy"], ["cloudy", "cloudy"],
  ]) assert.equal(getWeatherTheme(icon), theme);
});
