import { Router, Request, Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();


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

    const weatherData = await WeatherService.getWeatherData(cityCoordinates, cityName);
    await HistoryService.addCity(cityName);
    return res.json(weatherData);

  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await HistoryService.removeCity(id);
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove city from search history' });
  }
});

export default router;
