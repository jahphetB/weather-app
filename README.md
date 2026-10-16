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

The Air quality control is currently a disabled placeholder; air-quality data is
the next milestone.

## Application Structure

- `src/index.js` connects the UI elements and starts the app.
- `src/app-controller.js` coordinates searches, loading/errors, and temperature units.
- `src/weather-api.js` requests Visual Crossing data using the configured API key.
- `src/weather-service.js` returns normalized weather through `src/weather-data.js`.
- `src/weather-view.js` renders current conditions and the forecast grid.
- `src/weather-clock.js` updates the selected city's local clock and emojis.
- `src/features/locations/` contains the continent/country browser and catalog queries.
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
