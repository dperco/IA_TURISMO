import axios from 'axios';
import { getAmadeusAccessToken } from './amadeusUtils.js';
import path from 'path';
import dotenv from 'dotenv';

// Cargar el archivo .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// Cargar el archivo .env
dotenv.config();

let amadeusToken: string | null = null;
const apiKeyAmadeus = process.env.AMADEUS_CLIENT_ID as string;
const apiSecretAmadeus = process.env.AMADEUS_API_SECRET as string;

// Verificar que las variables de entorno no sean undefined
if (!apiKeyAmadeus || !apiSecretAmadeus) {
  throw new Error('Las credenciales de Amadeus no están definidas en las variables de entorno.');
}

// Obtener el token al iniciar el servidor
getAmadeusAccessToken(apiKeyAmadeus, apiSecretAmadeus)
  .then(token => {
    amadeusToken = token;
    console.log('Token de acceso de Amadeus obtenido:', token);
  })
  .catch(error => {
    console.error('Error al obtener el token de acceso de Amadeus:', error);
  });



async function searchHotels(cityCode: string, checkInDate: string, checkOutDate: string): Promise<any> {
    try {
      if (!amadeusToken) {
        throw new Error('Token de acceso de Amadeus no disponible.');
      }
  
      const url = 'https://test.api.amadeus.com/v2/shopping/hotel-offers';
      const params = {
        cityCode,       // Código de ciudad (por ejemplo, "PAR" para París)
        checkInDate,    // Fecha de check-in (formato: "YYYY-MM-DD")
        checkOutDate,   // Fecha de check-out (formato: "YYYY-MM-DD")
        adults: 2,      // Número de adultos
        roomQuantity: 1, // Cantidad de habitaciones
      };
  
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${amadeusToken}` },
        params,
      });
  
      return response.data;
    } catch (error) {
      console.error('Error al buscar hoteles:', error);
      throw error;
    }
  }