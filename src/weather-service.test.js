import test from "node:test";
import assert from "node:assert/strict";
import { WeatherService } from "./weather-service.js";
import { VisualCrossingClient } from "./weather-api.js";

test("the default client calls native fetch with the global receiver", async (t) => {
  t.mock.method(globalThis, "fetch", function () {
    assert.equal(this, globalThis);
    return Promise.resolve({ ok: true, json: async () => ({ location: "Paris" }) });
  });

  const result = await new VisualCrossingClient().fetchWeather("Paris");
  assert.equal(result.location, "Paris");
});

test("the service returns normalized weather for a requested location", async () => {
  let requestedLocation;
  const service = new WeatherService({
    async fetchWeather(location) {
      requestedLocation = location;
      return {
        resolvedAddress: "Paris, France",
        timezone: "Europe/Paris",
        description: "Clear skies",
        currentConditions: {
          temp: 20,
          feelslike: 19,
          conditions: "Clear",
          icon: "clear-day",
        },
        days: [{
          datetime: "2026-10-16",
          sunriseEpoch: 1,
          sunsetEpoch: 2,
          tempmax: 23,
          tempmin: 12,
          conditions: "Clear",
          icon: "clear-day",
        }],
      };
    },
  });

  const weather = await service.getWeather("Paris, France");

  assert.equal(requestedLocation, "Paris, France");
  assert.equal(weather.current.temperature, 20);
  assert.equal(weather.forecast[0].high, 23);
  assert.equal(weather.timezone, "Europe/Paris");
});

test("the client requests current and daily metric weather", async () => {
  let requestedUrl;
  const client = new VisualCrossingClient(async (url) => {
    requestedUrl = url;
    return { ok: true, json: async () => ({ resolvedAddress: "Tokyo" }) };
  });

  const result = await client.fetchWeather("Tokyo, Japan");

  assert.equal(decodeURIComponent(requestedUrl.pathname).endsWith("/Tokyo, Japan"), true);
  assert.equal(requestedUrl.searchParams.get("include"), "current,days");
  assert.equal(requestedUrl.searchParams.get("unitGroup"), "metric");
  assert.equal(result.resolvedAddress, "Tokyo");
});
