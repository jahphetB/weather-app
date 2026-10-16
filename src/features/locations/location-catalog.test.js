import test from "node:test";
import assert from "node:assert/strict";
import { countries } from "../../data/countries.js";
import { continents, countriesForContinent, capitalQuery } from "./location-catalog.js";

test("all bundled capital locations have unique codes and a supported continent", () => {
  assert.ok(countries.length > 190);
  assert.equal(new Set(countries.map(({ code }) => code)).size, countries.length);
  for (const country of countries) {
    assert.match(country.code, /^[A-Z]{2}$/);
    assert.ok(country.name && country.capital);
    assert.ok(continents.some(({ code }) => code === country.continent));
  }
});

test("every populated continent returns its full alphabetical country list", () => {
  for (const { code } of continents.filter(({ code }) => code !== "AN")) {
    const result = countriesForContinent(code);
    assert.ok(result.length > 7);
    assert.ok(result.every((country) => country.continent === code));
    for (let index = 1; index < result.length; index++) {
      assert.ok(result[index - 1].name.localeCompare(result[index].name, "en") <= 0);
    }
  }
  assert.deepEqual(countriesForContinent("AN"), []);
});

test("capital queries include the country to disambiguate location searches", () => {
  const france = countries.find(({ code }) => code === "FR");
  const japan = countries.find(({ code }) => code === "JP");
  assert.equal(capitalQuery(france), "Paris, France");
  assert.equal(capitalQuery(japan), "Tokyo, Japan");
});
