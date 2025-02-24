

  


import { loadQAStuffChain } from "langchain/chains";
import { RetrievalQAChain } from "langchain/chains";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HumanMessage, SystemMessage, ChatMessage } from "@langchain/core/messages";
import { BaseChain, LLMChain } from "langchain/chains";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { DynamicStructuredTool } from "@langchain/core/tools"; // Cambia la importación
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { WeatherTool } from "../tools/WeatherTools.js";
import { HotelTool } from "../tools/HotelTools.js";
import { FlightTool } from "../tools/FlightTools.js";
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

const api_key_OpenAI = process.env.API_KEY_OPENAI || '';
const api_key_Weather = process.env.Api_weather_next || '';
const api_key_amadeus = process.env.AMADEUS_CLIENT_ID || '';
const api_key_secret_amadeus = process.env.AMADEUS_CLIENT_SECRET || '';

// Define el esquema de entrada con Zod
const weatherSchema = z.object({
  location: z.string().describe("La ubicación."),
  destino: z.string().describe("El destino."),
  checkInDate: z.string().describe("La fecha de entrada."),
  checkOutDate: z.string().describe("La fecha de salida."),
});

const flightSchema = z.object({
  from: z.string().describe("La ubicación de origen."),
  to: z.string().describe("La ubicación de destino."),
  dates: z.string().describe("Las fechas de tu viaje."),
});

const model: ChatOpenAI = new ChatOpenAI({
  temperature: 0,
    openAIApiKey: api_key_OpenAI,
  });

// Usa DynamicStructuredTool en lugar de tool
const getWeather: DynamicStructuredTool<typeof weatherSchema> = new DynamicStructuredTool({
  name: "getWeather",
  description: "Obtén el clima de una ubicación específica.",
  schema: weatherSchema,
  func: async (input: { location: string; destino: string; checkInDate: string; checkOutDate: string }) => {
    const weatherTool = new WeatherTool();
    return await weatherTool._call(input);
  },
});

const searchFlights = new DynamicStructuredTool({
  name: "searchFlights",
  description: "Busca vuelos entre dos ubicaciones.",
  schema: flightSchema,
  func: async (input: { from: string; to: string; dates: string }) => {
    const flightTool = new FlightTool(api_key_amadeus, api_key_secret_amadeus);
    return await flightTool._call(`vuelos de ${input.from} a ${input.to} para ${input.dates}`);
  },
});

const travelPlannerAgent = await (async () => {
  return createReactAgent({
    llm: model,
    tools: [getWeather, searchFlights],
  });
})();

export async function planTrip(userInput: { location: string;destino:string; checkInDate: string; checkOutDate: string }): Promise<string> {
  console.log('userInput del trip', userInput);

  if (userInput.location.startsWith("clima en ")) {
    console.log('entrada a weathertool', userInput);
    const city = userInput.location.substring("clima en ".length); // Extrae la ciudad

    const weatherInfo = await getWeather.invoke({
      location: city,
      destino: userInput.destino, // Asegúrate de incluir el destino
      checkInDate: userInput.checkInDate, // Usa la fecha proporcionada por el usuario
      checkOutDate: userInput.checkOutDate, // Usa la fecha proporcionada por el usuario
    });

    return weatherInfo;
  } else if (userInput.location.startsWith("vuelo de ")) {
    console.log('vuelo');
    const flightInfo = userInput.location.substring("vuelo de ".length); // Corrige el acceso a la ubicación
    const flightResult = await searchFlights.invoke({
      from: flightInfo.split(' a ')[0].trim(),
      to: flightInfo.split(' a ')[1].split(' para ')[0].trim(),
      dates: flightInfo.split(' para ')[1].trim(),
    });

    if (!flightResult || flightResult.length === 0) {
      return "No se encontraron vuelos para la ruta y fechas especificadas.";
    }

    // Filtra los primeros 10 vuelos
    const first10Flights = flightResult.slice(0, 10);

    // Devuelve los primeros 10 vuelos
    return JSON.stringify(first10Flights, null, 2);
  } else {
    return "No entendí tu solicitud. Intenta de nuevo con el formato: 'clima en [ubicación]' o 'vuelo de [origen] a [destino] para [fechas]'.";
  }
}