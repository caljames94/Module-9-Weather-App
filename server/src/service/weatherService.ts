import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface ICoordinates {
  latitude: number;
  longitude: number;
}

// TODO: Define an interface for the Weather object
interface IWeather {
  date: string;
  icon: string;
  temp: number;
  wind: number;
  humidity: number;
}
// TODO: Define a class for the Weather object
class Weather implements IWeather {
  constructor(
    public date: string,
    public icon: string,
    public temp: number,
    public wind: number,
    public humidity: number
  ) {}
}

// TODO: Complete the WeatherService class
class WeatherService {

  private baseURL?: string;
  private apiKey?: string;

  constructor() {
    this.baseURL = process.env.OPEN_WEATHER_MAP_BASE_URL || 'https://api.openweathermap.org';
    this.apiKey = process.env.OPEN_WEATHER_MAP_API_KEY || '';
  }


  async getWeatherData(coordinates: ICoordinates): Promise<IWeather> {
    try {
      const weatherData = await fetch(`${this.baseURL}/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}&units=metric`);
      const weatherDataJson = await weatherData.json();
      if (weatherDataJson > 0) {
        return new Weather( //This will return the current weather, how do I get the forecast data for the other 5 days?
          weatherDataJson.list[0].dt_txt,
          weatherDataJson.list[0].weather.icon,
          weatherDataJson.list[0].main.temp,
          weatherDataJson.list[0].wind.speed,
          weatherDataJson.list[0].main.humidity
        )
      } else {
        throw new Error('Failed to fetch weather data');
      }
    } catch (error) {
      console.error('Failed to fetch weather data');
      throw new Error('Failed to fetch weather data');
    }
  }

  async convertCityToCoordinates(cityName: string): Promise<ICoordinates> {
    try {
      const cityData = await fetch(`${this.baseURL}/geo/1.0/direct?q=${cityName}&appid=${this.apiKey}`);
      const cityDataJson = await cityData.json();
      if (cityDataJson.length > 0) {
        return {
          latitude: cityDataJson[0].lat,
          longitude: cityDataJson[0].lon
        };
      } else {
        throw new Error('City not found');
      }
    } catch (error) {
      console.error('Failed to fetch city data');
      throw new Error('Failed to fetch city data');
    }
  }
}





  // TODO: Define the baseURL, API key, and city name properties
  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}


export default new WeatherService();
