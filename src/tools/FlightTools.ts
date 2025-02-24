import { Tool } from "@langchain/core/tools";
import Amadeus from 'amadeus';
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

const amadeusApiKey = process.env.AMADEUS_CLIENT_ID!;
const amadeusApiSecret = process.env.AMADEUS_API_SECRET!;


interface Flight {
  segments:string,
  departureAirport: string;
  departureTime: string;
  arrivalAirport: string;
  arrivalTime: string;
  price: number;
}

export class FlightTool extends Tool {
  name = "FlightTool";
  description = "Busca vuelos entre dos ubicaciones.";
  amadeus: Amadeus;

  

  constructor(amadeusApikey: string, apikeySecret:string) {
    super();
    this.amadeus = new Amadeus({
      clientId: amadeusApiKey,
     clientSecret: amadeusApiSecret,
    });
  }

async _call(input: string): Promise<any> {
  console.log('en flight', input);
  const match = input.match(/vuelos de ([A-Z]{3}) a ([A-Z]{3}) para (\d{4}-\d{2}-\d{2})/);
  if (!match) {
    return "Por favor, proporciona la información en el formato correcto: 'vuelos de [origen] a [destino] para [fecha]'.";
  }
  console.log('match', match);
  if (!match) {
    throw new Error("No se proporcionó información suficiente para buscar vuelos.");
  }
  const origin = match[1];
  const destination = match[2];
  const dates = match[3];

  try {
    const response = await this.amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: dates,
      adults: 1,
    });

    // Imprime la respuesta JSON completa en la consola del servidor
    console.log('Respuesta JSON completa:', JSON.stringify(response.data, null, 2));

    // Procesa la respuesta de Amadeus y formatea la información del vuelo
    const flights = response.data.map((flight: any) => {
      const segments = flight.itineraries[0].segments;
      const departureAirport = segments[0].departure.iataCode;
      const arrivalAirport = segments[segments.length - 1].arrival.iataCode;
      const departureTime = segments[0].departure.at;
      const arrivalTime = segments[segments.length - 1].arrival.at;
      const price = flight.price.total;

      return {
        departureAirport,
        arrivalAirport,
        departureTime,
        arrivalTime,
        price,
      };
    });

    // Formatea la respuesta para el usuario
    return `Aquí tienes algunos vuelos de ${origin} a ${destination} para ${dates}:\n` +
           flights.map((flight: any) => `- Salida: ${flight.departureAirport} a las ${flight.departureTime}, Llegada: ${flight.arrivalAirport} a las ${flight.arrivalTime}, Precio: ${flight.price} EUR`).join('\n');
  } catch (error) {
    console.error("Error al buscar vuelos:", error);
    return "No se pudieron encontrar vuelos para esa ruta.";
  }
}
}


