





import { Tool } from "@langchain/core/tools";
import { getAmadeusAccessToken } from './amadeusUtils.js'; // Asegúrate de tener este archivo
import axios from 'axios';
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

const amadeus_key = process.env.AMADEUS_client_id || '';
const amadeus_secret = process.env.AMADEUS_client_secret || '';



interface Hotel {
  chainCode: string;
  iataCode: string;
  dupeId: number;
  name: string;
  hotelId: string;
  disponibilidad?: any; // Campo opcional para la disponibilidad
  error?: string; // Campo opcional para el error
}

export class HotelTool extends Tool {
  name = "HotelTool";
  description = "Busca hoteles en una ubicación específica con fechas de entrada y salida, incluyendo su disponibilidad.";
  accessToken: string | null = null;

  constructor(apiKey: string, apiSecret: string) {
    super();
    this.getAccessToken(apiKey, apiSecret);
  }

  async getAccessToken(clientId: string, clientSecret: string): Promise<string> {
    try {
      this.accessToken = await getAmadeusAccessToken(amadeus_key, amadeus_secret);
      console.log('Token de acceso de Amadeus obtenido:', this.accessToken);
      return this.accessToken;
    } catch (error) {
      console.error('Error al obtener el token de acceso de Amadeus:', error);
      throw error;
    }
  }

  async _call(input: { location: string; checkInDate: string; checkOutDate: string; adults: number; currency?: string }): Promise<any[]> {
    try {
      this.accessToken = await this.getAccessToken(amadeus_key, amadeus_secret); // Reemplaza con tus credenciales

      const location = input.location;
      const url = `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${location}&hotelSource=ALL`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      const data = await response.json();

      const hotelesRelevantes: Hotel[] = data.data.slice(0, 10).map((hotel: any) => ({
        chainCode: hotel.chainCode,
        iataCode: hotel.iataCode,
        dupeId: hotel.dupeId,
        name: hotel.name,
        hotelId: hotel.hotelId
      }));

      const resultadosHoteles: any[] = [];

      // Iterar sobre los 10 hotelId
      for (const hotel of hotelesRelevantes) {
        try {
          const disponibilidad = await this.obtenerDisponibilidad(hotel.hotelId, input.checkInDate, input.checkOutDate, input.adults, input.currency);
          resultadosHoteles.push({ ...hotel, disponibilidad });
        } catch (error: any) {
          console.error(`Error al obtener disponibilidad para hotel ${hotel.hotelId}:`, error);
          resultadosHoteles.push({ ...hotel, error: error.message }); 
        }
      }

      return resultadosHoteles;
    } catch (error) {
      console.error('Error al buscar hoteles:', error);
      return [];
    }
  }

  private async obtenerDisponibilidad(hotelId: string, checkInDate: string, checkOutDate: string, adults: number, currency?: string): Promise<any> {
    try {
      const url = `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelId}&adults=${adults}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&currency=${currency}`;

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error en HotelAvailabilityTool:', error);
      if (error.response?.status === 401) {
        throw new Error("Token de acceso no válido o expirado. Por favor, genera un nuevo token.");
      } else if (error.response?.status === 404) {
        throw new Error(`No se encontró información de disponibilidad para el hotel con ID "${hotelId}".`);
      } else {
        throw new Error(`Error al obtener la información de disponibilidad. Por favor, inténtalo de nuevo más tarde.`);
      }
    }
  }
}