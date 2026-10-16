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

test("country selection loads its capital and a later city search clears its selection", async () => {
  const requests = [];
  const selections = [];
  const fixture = createApp(async (location) => {
    requests.push(location);
    return { location };
  });
  fixture.app.onLocationChange = (code) => selections.push(code);
  fixture.app.locationInput.setCustomValidity = (value) => {
    fixture.app.locationInput.validityMessage = value;
  };

  await fixture.app.selectCountry({ code: "FR", name: "France", capital: "Paris" });
  assert.equal(fixture.app.locationInput.value, "Paris, France");
  assert.equal(fixture.app.locationInput.validityMessage, "");
  assert.equal(fixture.clocks[0].location, "Paris, France");

  fixture.app.locationInput.value = "  Tokyo  ";
  let prevented = false;
  await fixture.app.handleSearch({ preventDefault() { prevented = true; } });

  assert.equal(prevented, true);
  assert.deepEqual(requests, ["Paris, France", "Tokyo"]);
  assert.deepEqual(selections, ["FR", null]);
  assert.equal(fixture.rendered.at(-1).weather.location, "Tokyo");
});

test("a pending capital request cannot overwrite a subsequent city search", async () => {
  const paris = deferred();
  const fixture = createApp((location) => location === "Paris, France"
    ? paris.promise : Promise.resolve({ location }));

  const countrySearch = fixture.app.selectCountry({ code: "FR", name: "France", capital: "Paris" });
  await fixture.app.loadLocation("Tokyo");
  paris.resolve({ location: "Paris" });
  await countrySearch;

  assert.deepEqual(fixture.rendered.map(({ weather }) => weather.location), ["Tokyo"]);
  assert.equal(fixture.weatherLoading.hidden, true);
});
