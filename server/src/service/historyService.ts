import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface City {
  name: string;
  id: string;
}

class City {
  constructor(public name: string, public id: string) {}
}

class HistoryService {
  private filePath: string;

  constructor() {
    this.filePath = path.join(process.cwd(),'searchHistory.json');
  }

  private async read(): Promise<City[]> {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  private async write(cities: City[]): Promise<void> {
    await fs.promises.writeFile(this.filePath, JSON.stringify(cities, null, 2));
  }

  async getCities(): Promise<City[]> {
    return this.read();
  }

  async addCity(cityName: string): Promise<City> {
    const cities = await this.read();
    const newCity = new City(cityName, uuidv4());
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  async removeCity(id: string): Promise<void> {
    let cities = await this.read();
    cities = cities.filter(city => city.id !== id);
    await this.write(cities);
  }
}


export default new HistoryService();



// TODO: Define a City class with name and id properties
// // TODO: Complete the HistoryService class
// class HistoryService {
//   // TODO: Define a read method that reads from the searchHistory.json file
//   // private async read() {}
//   // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
//   // private async write(cities: City[]) {}
//   // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
//   // async getCities() {}
//   // TODO Define an addCity method that adds a city to the searchHistory.json file
//   // async addCity(city: string) {}
//   // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
//   // async removeCity(id: string) {}
// }

