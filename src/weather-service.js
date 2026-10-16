import { processWeatherData } from "./weather-data.js";

export class WeatherService {
  constructor(weatherClient) {
    this.weatherClient = weatherClient;
  }

  async getWeather(location) {
    const rawData = await this.weatherClient.fetchWeather(location);
    return processWeatherData(rawData);
  }
}
