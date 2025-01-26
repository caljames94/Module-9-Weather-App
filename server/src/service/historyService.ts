// TODO: Define a City class with name and id properties
import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

class City {
  name: string;
  id: string;

  constructor(name: string) {
    this.name = name;
    this.id = uuidv4();
  }
}

// TODO: Complete the HistoryService class
class HistoryService {

  private async read() {
    return await fs.readFile('searchHistory.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
  }

  private async write(cities: City[]) {
    return await fs.writeFile('searchHistory.json', JSON.stringify(cities, null, '\t'));
  }

  async addCity(city: string) {
    const cities = await this.getCities();
    const newCity = new City(city);
    cities.push(newCity);
    await this.write(cities);
  }
  
  async getCities() {
    return await this.read().then((cities) => {
      let parsedCities: City[];

    try {
      parsedCities = [].concat(JSON.parse(cities));
    } catch (error) {
      parsedCities = [];
    }

    return parsedCities;
    })
  }
  async removeCity(id: string) {
    const cities = await this.getCities();
    const filteredCities = cities.filter((city) => city.id!== id);
    await this.write(filteredCities);
  }

}

export default new HistoryService();
