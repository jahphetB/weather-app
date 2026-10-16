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

The continent buttons and Air quality control are currently disabled placeholders.
Country/capital navigation is the next milestone, followed by air-quality data.

## Application Structure

- `src/index.js` connects the UI elements and starts the app.
- `src/app-controller.js` coordinates searches, loading/errors, and temperature units.
- `src/weather-api.js` requests Visual Crossing data using the configured API key.
- `src/weather-service.js` returns normalized weather through `src/weather-data.js`.
- `src/weather-view.js` renders current conditions and the forecast grid.
- `src/weather-clock.js` updates the selected city's local clock and emojis.
- `src/template.html` and `src/styles.css` define the responsive dashboard layout.

## Verification

Run the focused regression tests with `npm test` and the production build with
`npm run build`. The layout milestone was also checked in a browser at desktop
and mobile sizes using a live city search, temperature switching, and sidebar
collapse. Browser verification caught and fixed the API client's native-fetch
receiver binding.

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
