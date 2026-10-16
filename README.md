# Weather App
https://jahphetb.github.io/weather-app/

A weather forecast app built using the Visual Crossing API.

## Features

- Search weather by location.
- View current conditions and daily forecasts.
- Toggle temperatures between Celsius and Fahrenheit.
- Change the background based on the weather.
- Display the city’s local time with day/night and weather emojis.
- Show loading indicators and error messages.
- Use a responsive dashboard with a centered search, continent sidebar, and forecast controls.
- Collapse the continent sidebar to make room for weather on smaller screens.
- Show copyright and developer credits for Yaphet Bashahider with GitHub links.
- Browse continents and an alphabetical country list with seven visible rows.
- Select a country to load its capital's current weather, forecast, and local time.

- Toggle current and daily air quality alongside weather, including US AQI,
  category labels, PM2.5, and PM10 in µg/m³.

## Air Quality

Visual Crossing provides weather and air quality in the same request. The app
adds `+aqius,+pm2p5,+pm10` to the default fields; each field must have its own
`+` prefix to retain the existing weather fields. No additional API key is needed.

Air quality is hidden initially. The toggle shows a current summary, the provider's
current-conditions time in the city's timezone, and daily values on forecast cards.
The selection persists across city/country searches and temperature changes.
Toggling does not make another request, and switching °C/°F does not change AQI
or pollutant units.

Missing or invalid values display as unavailable, while zero is a valid reading.
Air-quality availability can end before the weather forecast; later weather cards
remain visible with an unavailable AQ message. Current and daily values are kept
separate. Category names use the US AQI scale everywhere, including outside the US.

Sources: [Visual Crossing AQ fields](https://www.visualcrossing.com/resources/documentation/weather-api/air-quality-elements-in-the-weather-api/),
[measurement units](https://www.visualcrossing.com/resources/documentation/weather-api/unit-groups-and-measurement-units/),
and [US AQI categories](https://www.airnow.gov/aqi/aqi-basics/).

Next milestone: final integration and accessibility checks, then release preparation.

## Application Structure

- `src/index.js` connects the UI elements and starts the app.
- `src/app-controller.js` coordinates searches, loading/errors, and temperature units.
- `src/weather-api.js` requests Visual Crossing data using the configured API key.
- `src/weather-service.js` returns normalized weather through `src/weather-data.js`.
- `src/weather-view.js` renders current conditions and the forecast grid.
- `src/weather-clock.js` updates the selected city's local clock and emojis.
- `src/features/locations/` contains the continent/country browser and catalog queries.
- `src/features/air-quality/` normalizes AQ data, classifies US AQI, and renders the summary/cards.
- `src/data/countries.js` bundles 245 country/territory capital locations; see
  [the data notes](src/data/README.md) for source, license, and geographic conventions.
- `src/template.html` and `src/styles.css` define the responsive dashboard layout.

## Verification

Run the focused regression tests with `npm test` and the production build with
`npm run build`. The layout milestone was also checked in a browser at desktop
and mobile sizes using a live city search, temperature switching, and sidebar
collapse. Browser verification caught and fixed the API client's native-fetch
receiver binding.

The country navigation milestone was checked with live Paris, Berlin, and Addis Ababa results,
keyboard selection, the Antarctica empty state, and country-list scrolling. A city
search clears the country highlight; country and city searches share stale-response
protection. The country list stays inside its own scrolling box on mobile too.

The air-quality milestone includes category-boundary and missing/invalid/zero-value
tests, toggle/state tests, live Paris checks on desktop and mobile, and a controlled
browser response with missing current AQ, zero values, and partial daily pollutants.

## Built With

- HTML, CSS, and JavaScript
- Webpack
- Visual Crossing API
- GitHub Pages

## Run Locally

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/jahphetB/weather-app.git
   cd weather-app
   npm install
   ```

2. Set your Visual Crossing API key in `src/weather-api.js`.

3. Start the development server:

   ```bash
   npm run dev
   ```

## Build and Deploy

```bash
npm run build
npm run deploy
```
