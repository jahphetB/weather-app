import test from "node:test";
import assert from "node:assert/strict";
import { formatLocation } from "./format-location.js";

test("city labels normalize capitalization and use city, region, country order", () => {
  assert.equal(formatLocation("  new york , new york, united states  "), "New York, New York, United States");
  assert.equal(formatLocation("caldwell, ID, United States"), "Caldwell, ID, United States");
  assert.equal(formatLocation("Paris, Île-de-France, France"), "Paris, Île-de-France, France");
  assert.equal(formatLocation("City, County, Region, Country"), "City, Region, Country");
  assert.equal(formatLocation("addis ababa, ethiopia"), "Addis Ababa, Ethiopia");
});
