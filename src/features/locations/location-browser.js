import { continents, countriesForContinent } from "./location-catalog.js";

export class LocationBrowser {
  constructor({ continentList, countryPanel, countryList, countryStatus, onSelectCountry }) {
    this.continentList = continentList;
    this.countryPanel = countryPanel;
    this.countryList = countryList;
    this.countryStatus = countryStatus;
    this.onSelectCountry = onSelectCountry;
    this.document = continentList.ownerDocument;
    this.selectedCountryCode = null;
  }

  start() {
    const items = continents.map((continent) => {
      const item = this.document.createElement("li");
      const button = this.document.createElement("button");
      button.type = "button";
      button.textContent = continent.name;
      button.dataset.continent = continent.code;
      button.setAttribute("aria-pressed", "false");
      button.setAttribute("aria-controls", this.countryPanel.id);
      button.addEventListener("click", () => this.selectContinent(continent));
      item.append(button);
      return item;
    });
    this.continentList.replaceChildren(...items);
  }

  selectContinent(continent) {
    for (const button of this.continentList.querySelectorAll("button")) {
      button.setAttribute("aria-pressed", String(button.dataset.continent === continent.code));
    }

    const countries = countriesForContinent(continent.code);
    const items = countries.map((country) => {
      const item = this.document.createElement("li");
      const button = this.document.createElement("button");
      button.type = "button";
      button.className = "country-button";
      button.dataset.country = country.code;
      button.title = `${country.name} — ${country.capital}`;
      button.setAttribute("aria-pressed", String(country.code === this.selectedCountryCode));

      const name = this.document.createElement("span");
      name.className = "country-name";
      name.textContent = country.name;
      const capital = this.document.createElement("span");
      capital.className = "capital-name";
      capital.textContent = country.capital;
      button.append(name, capital);
      button.addEventListener("click", () => this.onSelectCountry(country));
      item.append(button);
      return item;
    });

    this.countryPanel.hidden = false;
    this.countryList.replaceChildren(...items);
    this.countryList.hidden = countries.length === 0;
    this.countryList.scrollTop = 0;
    this.countryList.setAttribute("aria-label", `${continent.name} countries and territories`);
    this.countryStatus.textContent = countries.length
      ? `${continent.name} · ${countries.length} countries and territories`
      : "Antarctica has no countries or national capitals.";
  }

  setSelectedCountry(code) {
    this.selectedCountryCode = code;
    for (const button of this.countryList.querySelectorAll("button")) {
      button.setAttribute("aria-pressed", String(button.dataset.country === code));
    }
  }
}
