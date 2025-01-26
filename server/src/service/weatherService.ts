// import fs from 'node:fs/promises';
// import { v4 as uuidv4 } from 'uuid';

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
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  cityName: string;
}
// TODO: Define a class for the Weather object
class Weather implements IWeather {
  constructor(
    public date: string,
    public icon: string,
    public iconDescription: string,
    public tempF: number,
    public windSpeed: number,
    public humidity: number,
    public cityName: string
  ) {}
}

// TODO: Complete the WeatherService class
class WeatherService {

  private baseURL?: string;
  private apiKey?: string;

  constructor() {
      this.baseURL = process.env.OPEN_WEATHER_MAP_BASE_URL || 'http://api.openweathermap.org';
      this.apiKey = process.env.OPEN_WEATHER_MAP_API_KEY || '';
  }

  private async weatherForecast(weatherData: any[], cityName: string): Promise<IWeather[]>  {
    console.log('City name in weatherForecast:', cityName); 
    const weatherForecastArray: IWeather[] = weatherData.map((weather) => {
      return new Weather(
        weather.dt_txt,
        weather.weather[0].icon,
        weather.weather[0].description,
        weather.main.temp,
        weather.wind.speed,
        weather.main.humidity,
        cityName // Add this line to include the city name
      );
    });

    const dailyForecast = weatherForecastArray.filter((forecast, index, fullArray) => 
      index === fullArray.findIndex((t) => t.date.split(' ')[0] === forecast.date.split(' ')[0])
    );
    return dailyForecast.slice(0, 6);
  };

  async getWeatherData(coordinates: ICoordinates, cityName: string): Promise<IWeather[]> {
    try {
      // Remove this line: this.cityName = cityName;
      const weatherData = await fetch(`${this.baseURL}/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}&units=imperial`);
      const weatherDataJson = await weatherData.json();
  
      const weatherForecast = await this.weatherForecast(weatherDataJson.list, cityName);
      return weatherForecast;
  
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

async convertCityToCoordinates(cityName: string): Promise<ICoordinates> {
  try {
    const encodedCityName = encodeURIComponent(cityName);
    const url = `${this.baseURL}/geo/1.0/direct?q=${encodedCityName}&limit=1&appid=${this.apiKey}`;
    
    console.log('Fetching from URL:', url); // Log the URL for debugging

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const cityDataJson = await response.json();
    
    if (cityDataJson.length > 0) {
      return {
        latitude: cityDataJson[0].lat,
        longitude: cityDataJson[0].lon
      };
    } else {
      throw new Error('City not found');
    }
  } catch (error) {
    console.error('Failed to fetch city data:', error);
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
