// TODO: Define a City class with name and id properties
import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

class City {
  name: string;
  id: string;

  constructor(name: string) {
    this.name = name;
    this.id = id;
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

}

export default new HistoryService();

  // DONE: Define a read method that reads from the searchHistory.json file
  // DONE: Define a write method that writes the updated cities array to the searchHistory.json file
  // DONE: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}