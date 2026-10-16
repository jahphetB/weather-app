import test from "node:test";
import assert from "node:assert/strict";
import { AppController } from "./app-controller.js";

function deferred() {
  let resolve;
  const promise = new Promise((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

function createApp(getWeather) {
  const rendered = [];
  const clocks = [];
  const weatherError = { textContent: "" };
  const weatherLoading = { hidden: true };
  const unitToggle = { textContent: "Switch to °F", addEventListener() {} };
  const locationInput = {
    value: "",
    addEventListener() {},
    setCustomValidity() {},
    reportValidity() {},
  };
  const app = new AppController({
    weatherService: { getWeather },
    renderWeather: (weather, unit) => rendered.push({ weather, unit }),
    startCityClock: (weather) => clocks.push(weather),
    form: { addEventListener() {} },
    locationInput,
    unitToggle,
    weatherError,
    weatherLoading,
  });
  return { app, rendered, clocks, weatherError, weatherLoading, unitToggle };
}

test("a slower search cannot replace the most recent location", async () => {
  const paris = deferred();
  const tokyo = deferred();
  const fixture = createApp((location) => location === "Paris" ? paris.promise : tokyo.promise);

  const firstSearch = fixture.app.loadLocation("Paris");
  const secondSearch = fixture.app.loadLocation("Tokyo");
  assert.equal(fixture.weatherLoading.hidden, false);

  tokyo.resolve({ location: "Tokyo" });
  await secondSearch;
  paris.resolve({ location: "Paris" });
  await firstSearch;

  assert.deepEqual(fixture.rendered.map(({ weather }) => weather.location), ["Tokyo"]);
  assert.deepEqual(fixture.clocks.map((weather) => weather.location), ["Tokyo"]);
  assert.equal(fixture.weatherLoading.hidden, true);
});

test("a failed search reports the error and clears loading", async () => {
  const fixture = createApp(async () => { throw new Error("Weather unavailable"); });

  await fixture.app.loadLocation("Paris");

  assert.equal(fixture.weatherError.textContent, "Weather unavailable");
  assert.equal(fixture.weatherLoading.hidden, true);
  assert.equal(fixture.rendered.length, 0);
});

test("switching units rerenders loaded weather without another request", async () => {
  let requests = 0;
  const weather = { location: "Paris" };
  const fixture = createApp(async () => { requests++; return weather; });

  await fixture.app.loadLocation("Paris");
  fixture.app.toggleUnit();

  assert.equal(requests, 1);
  assert.deepEqual(fixture.rendered.map(({ unit }) => unit), ["C", "F"]);
  assert.equal(fixture.unitToggle.textContent, "Switch to °C");
});
