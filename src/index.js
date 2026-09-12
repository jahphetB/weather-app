import "./styles.css";
import { fetchWeather } from "./weather-api.js";
import { processWeatherData } from "./weather-data.js";

async function testWeatherRequest() {
  try {
    const rawData = await fetchWeather("London");
    const weather = processWeatherData(rawData);

    console.log(weather);
  } catch (error) {
    console.error(error.message);
  }
}

testWeatherRequest();