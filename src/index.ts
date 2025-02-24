
import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import axios from 'axios';

import chatRoutes from './routes/chat.js';
import { WeatherTool } from './tools/WeatherTools.js';
import { HotelTool } from './tools/HotelTools.js';
import { FlightTool } from './tools/FlightTools.js';
import { HotelAvailabilityTool } from './tools/HotelAvailabilityTool.js';
//import { getTouristActivities } from './utils/activityUtils.js';
import { generateItinerary } from './utils/itineratyUtils.js';
import { MemoryManager } from './utils/manejo_hilos.js';
import { extractTravelInfo } from './utils/extracTravelinfo.js';
import { deserialize } from 'v8';
import * as dotenv from 'dotenv';
import { any } from 'zod';


interface TravelInfo {
  city: string;
  destino: string;
  checkInDate: string;
  checkOutDate: string;
}

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Cargar el archivo .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// Cargar el archivo .env
dotenv.config();


const apiKey_Amadeus = process.env.AMADEUS_CLIENT_ID as string;
const apiSecret_Amadeus = process.env.AMADEUS_CLIENT_SECRET as string;
// Habilitar CORS


// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'src')));

// Middleware para parsear JSON
app.use(express.json());
// Habilitar CORS
//app.use(cors());
app.use(cors({
  origin: 'http://127.0.0.1:3000', // O la URL de tu frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
// Rutas
app.use('/chat', chatRoutes);

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint para el flujo completo
app.post('/test-full-flow', async (req: any, res: any) => {
  try {
    console.log('Datos recibidos:', req.body);
    const { city, destino, checkInDate, checkOutDate } = req.body;
     
    // Validar los parámetros
    if (!city || !destino || !checkInDate || !checkOutDate) {
      return res.status(400).json({ error: 'Faltan campos requeridos: city, checkInDate, checkOutDate' });
    }

   

    // Generar las entradas para las demás herramientas
    const flightInput = {
      originLocationCode: city,
      destinationLocationCode: destino,
      departureDate: checkInDate,
      adults: 1,
    };

    const weatherInput = {
      location: city.toUpperCase(),
      destino: destino,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
    };

    // Invocar las herramientas directamente para verificar que funcionan
    const weatherTool = new WeatherTool();
    const weatherInfo = await weatherTool._call(weatherInput);

    const flightTool = new FlightTool(apiKey_Amadeus , apiSecret_Amadeus);
    const flightInfo = await flightTool._call(`vuelos de ${flightInput.originLocationCode} a ${flightInput.destinationLocationCode} para ${flightInput.departureDate}`);

    //buscar hotel
    const hotelTool = new HotelTool(apiKey_Amadeus, apiSecret_Amadeus);
    const hotelInfo = await hotelTool._call({
      location: destino,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      adults: 2, // Puedes hacer que esto sea configurable
      currency: 'USD', // Puedes hacer que esto sea configurable
    });

    // //buscar disponibilidad de hoteles
    // const hotelAvailabilityTool = new HotelAvailabilityTool('67b681afd82e7f5224b32122');
    // const hotelAvailabilityInfo = await hotelAvailabilityTool._call({
    //   hotelId: destino,
    //   checkInDate: checkInDate,
    //   checkOutDate: checkOutDate,
    //   adults: 2, // Puedes hacer que esto sea configurable
    //   currency: 'USD', // Puedes hacer que esto sea configurable
    // });


    

    // Respuesta combinada
    const result = {
      weather: weatherInfo,
      flights: flightInfo,
      hotels: hotelInfo,
    };

    console.log('Resultado del flujo completo:', result);
    res.json(result);
  } catch (error) {
    console.error('Error en el flujo completo:', error);
    res.status(500).json({ error: 'Error en el flujo completo' });
  }
});



app.post('/chatboot', async (req: any, res: any) => {
  try {
    console.log('Datos recibidos:', req.body);
    // Extraer los datos del cuerpo de la solicitud
    const { city, destino, checkInDate, checkOutDate } = req.body;

    // Verificar los datos recibidos
    console.log('Datos recibidos:', { city, destino, checkInDate, checkOutDate });

    // Validar los parámetros
    if (!city || !destino || !checkInDate || !checkOutDate) {
      return res.status(400).json({ error: 'Faltan campos requeridos: city, destino, checkInDate, checkOutDate' });
    }

    // Crear las herramientas necesarias
    const flightTool = new FlightTool(apiKey_Amadeus, apiSecret_Amadeus);
    const weatherTool = new WeatherTool();
    const hotelTool = new HotelTool(apiKey_Amadeus, apiSecret_Amadeus);

    // Variables para almacenar los resultados
    let flightInfo = "No se pudieron encontrar vuelos de ida.";
    let returnFlightInfo = "No se pudieron encontrar vuelos de regreso.";
    let weatherInfo: object = { error: "No se pudo obtener información del clima." };
    let hotelInfo = "No se pudo obtener información de hoteles.";
    //let itinerary = "No se pudo generar el itinerario.";

    // Buscar vuelos de ida
    try {
      console.log('Buscando vuelos de ida...');
      flightInfo = await flightTool._call(`vuelos de ${city} a ${destino} para ${checkInDate}`);
      console.log('Vuelos de ida:', flightInfo);
    } catch (error) {
      console.error('Error al buscar vuelos de ida:', error);
    }

    // Buscar vuelos de regreso
    try {
      console.log('Buscando vuelos de regreso...');
      returnFlightInfo = await flightTool._call(`vuelos de ${destino} a ${city} para ${checkOutDate}`);
      console.log('Vuelos de regreso:', returnFlightInfo);
    } catch (error) {
      console.error('Error al buscar vuelos de regreso:', error);
    }

    // Obtener información del clima
    try {
      console.log('Buscando información del clima...', city, destino, checkInDate, checkOutDate);
       weatherInfo = await weatherTool._call({
        location: city.toUpperCase(),
        destino: destino,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
      });
      console.log('Información del clima:', weatherInfo);
    } catch (error) {
      console.error('Error al buscar información del clima:', error);
    }

    // Obtener información de hoteles
    try {
      console.log('Buscando información de hoteles...', destino, checkInDate, checkOutDate);
       const hotelResult = await hotelTool._call({
        location: destino,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        adults: 2, // Puedes hacer que esto sea configurable
        currency: 'USD', // Puedes hacer que esto sea configurable
      });
      hotelInfo = JSON.stringify(hotelResult);
      console.log('Información de hoteles:', hotelInfo);
    } catch (error) {
      console.error('Error al buscar información de hoteles:', error);
    }

    

    // Construir la respuesta
    const response = {
      message: `Tu viaje de ${city} a ${destino} del ${checkInDate} al ${checkOutDate} ha sido registrado.`,
      flights: flightInfo, // Vuelos de ida
      returnFlights: returnFlightInfo, // Vuelos de regreso
      weather: weatherInfo,
      hotels: hotelInfo,
      //itinerary: itinerary,
    };

    console.log('Respuesta del backend:', response);
    res.json(response);
  } catch (error) {
    console.error('Error en el chat:', error);
    res.status(500).json({ error: 'Error en el chat' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});





