import { countries } from "../../data/countries.js";

export const continents = [
  { code: "AF", name: "Africa" },
  { code: "AS", name: "Asia" },
  { code: "EU", name: "Europe" },
  { code: "NA", name: "North America" },
  { code: "SA", name: "South America" },
  { code: "OC", name: "Oceania" },
  { code: "AN", name: "Antarctica" },
];

export function countriesForContinent(code) {
  return countries
    .filter((country) => country.continent === code)
    .sort((first, second) => first.name.localeCompare(second.name, "en"));
}

export function capitalQuery(country) {
  return `${country.capital}, ${country.name}`;
}
