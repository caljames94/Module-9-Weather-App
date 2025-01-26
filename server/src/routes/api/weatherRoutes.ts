import { Router, Request, Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();


// TODO: POST Request with city name to retrieve weather data

router.get('/', async (req: Request, res: Response) => {
  try {
    const cityName = req.query.city as string;
    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
    }

    const cityCoordinates = await WeatherService.convertCityToCoordinates(cityName);
    if (!cityCoordinates) {
      return res.status(404).json({ error: 'City not found' });
    }

    const weatherData = await WeatherService.getWeatherData(cityCoordinates);
    await HistoryService.saveCity(cityName);
    res.json(weatherData);

  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});
// router.get('/', (req, res) => {


//   // TODO: GET weather data from city name
//   // TODO: save city to search history

// });

// DONE: GET search history
router.get('/history', async (req: Request, res: Response) => {
try {
  const cities = await HistoryService.getCities();
  res.json(cities);
} catch (error) {
  console.log(error);
  res.status(500).json(error);
}});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {});

export default router;
