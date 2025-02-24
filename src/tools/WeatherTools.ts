

import { Tool } from "@langchain/core/tools";
import axios from 'axios';
import { PackingListTool } from '../tools/PackingListTool.js';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

// Obtener __dirname y __filename en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Cargar el archivo .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// Cargar el archivo .env
dotenv.config();

export class WeatherTool extends Tool {
  name = "WeatherTool";
  description = "Obtén el clima de una ubicación específica.";

  async _call(input: { location: string; destino: string; checkInDate: string; checkOutDate: string; destinationType?: string }): Promise<object> {
    try {
      console.log('Ubicación y fechas recibidas:', input.checkInDate, input.checkOutDate, input.location, input.destino);
      const { location, destino, checkInDate, checkOutDate } = input;
      const id_weather = process.env.id_weather_day;
      if (!location || !checkInDate || !checkOutDate || !destino) {
        throw new Error("No se proporcionó una ubicación o fechas.");
      }

      // Convertir las fechas a objetos Date
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);
      console.log('Fechas:', startDate, endDate);

      // Calcular la diferencia en días
      const timeDifference = endDate.getTime() - startDate.getTime();
      let daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

      if (daysDifference < 0) {
        throw new Error("La fecha de vuelta debe ser posterior a la fecha de ida.");
      }

      console.log('Antes del axios del clima:', destino, daysDifference, checkInDate);

      // Realizar la solicitud a la API de OpenWeatherMap
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${destino}&appid=${id_weather}&units=metric`
      );

      console.log('Respuesta de la API:', response.data);

      // Extraer los datos relevantes de la respuesta
      const weatherData = {
        ubicación: response.data.name, // Nombre de la ciudad
        temperatura: response.data.main.temp, // Temperatura actual
        descripción: response.data.weather[0].description, // Descripción del clima
        humedad: response.data.main.humidity, // Humedad
        viento: response.data.wind.speed, // Velocidad del viento
      };

      console.log('Datos del clima:', JSON.stringify(weatherData, null, 2));

      // Generar la lista de artículos recomendados usando PackingListTool
      const packingListTool = new PackingListTool();
      const packingList = await packingListTool._call({ weatherData });
      console.log('Lista de artículos recomendados:', packingList);

      // Devolver tanto los datos del clima como la lista de artículos
      return {
        clima: weatherData,
        listaDeArticulos: packingList,
      };
    } catch (error: any) {
      console.error('Error en WeatherTool:', error);
      if (error.response?.status === 404) {
        return { error: `No se encontró información del clima para la ubicación "${input.location}".` };
      } else {
        return { error: `Error al obtener la información del clima. Por favor, inténtalo de nuevo más tarde.` };
      }
    }
  }
}