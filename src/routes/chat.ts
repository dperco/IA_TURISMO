import express from 'express';
import { planTrip } from '../agents/TravelPlannerAgent.js';
import { WeatherTool } from '../tools/WeatherTools.js';
import { getHotelFlightInfo } from '../agents/HotelFligthWeatherAgent.js';
import { ChatOpenAI } from '@langchain/openai';
import { OpenAI } from '@langchain/openai';
import { LLM } from '@langchain/core/language_models/llms';
import { LLMChain } from 'langchain/chains';
import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredTool, Tool } from '@langchain/core/tools';
import { convertToOpenAITool } from '@langchain/core/utils/function_calling';
import { RunnableSequence } from '@langchain/core/runnables';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { HumanMessagePromptTemplate, SystemMessagePromptTemplate } from '@langchain/core/prompts';
import { FlightTool } from '../tools/FlightTools.js';
import { HotelTool } from '../tools/HotelTools.js';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { deserializeStoredGeneration } from 'node_modules/@langchain/core/dist/caches/base.js';

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

const router = express.Router();
const chat = new ChatOpenAI({ temperature: 0 });

const api_key_amadeus = process.env.AMADEUS_CLIENT_ID || '';
const api_secret_amadeus = process.env.AMADEUS_API_SECRET || '';

const memory = {}; // Initialize memory variable

// Crea el modelo de lenguaje y las herramientas
const model = new ChatOpenAI({});

// Define las herramientas que usarás (sin SerpAPI)
const tools = [
  new WeatherTool(),
  new HotelTool(api_key_amadeus, api_secret_amadeus),
  new FlightTool(api_key_amadeus, api_secret_amadeus),
];

// Crea el agente ReAct
const travelPlannerAgent = await createReactAgent({
  llm: model,
  tools: tools, // Ahora `tools` está definida
});

// Define el flujo de trabajo usando RunnableSequence
const workflow = RunnableSequence.from([
  {
    weather: async (state: any) => {
      const result = await tools[0].invoke(state);
      return { ...state, weather: result };
    },
    hotel: async (state: any) => {
      const result = await tools[1].invoke(state);
      return { ...state, hotel: result };
    },
    flight: async (state: any) => {
      const result = await tools[2].invoke(state);
      return { ...state, flight: result };
    },
  },
  (state: any) => {
    // Combina los resultados
    return {
      plan: state.plan,
      weather: state.weather,
      hotel: state.hotel,
      flight: state.flight,
    };
  },
]);

// Rutas
router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post('/plan-trip', async (req, res) => {
  const userInput = req.body;
  console.log('userInput del post ', userInput);
  try {
    if (userInput.location && userInput.destino && userInput.checkInDate && userInput.checkOutDate) {
      // Si el input es un string (clima)
      //console.log('clima',userInput);
      const triPlan = await planTrip(userInput);
      res.json({ triPlan });
    } else if (userInput.originLocationCode && userInput.destinationLocationCode && userInput.departureDate) {
      // Si es un vuelo
      console.log('vuelo');
      const triPlan = await planTrip({
        location: `vuelo de ${userInput.originLocationCode} a ${userInput.destinationLocationCode}`,
        destino: userInput.destinationLocationCode,
        checkInDate: userInput.departureDate,
        checkOutDate: userInput.departureDate
      });
      res.json({ triPlan });
    } 
  } catch (e) {
    console.log('error');
    res.status(500).json({ error: 'Error al procesar solicitud' });
  }
});

export default router;

function createLocalReactAgent(arg0: { llm: ChatOpenAI<import("@langchain/openai").ChatOpenAICallOptions>; tools: (WeatherTool | HotelTool | FlightTool)[]; }) {
  throw new Error('Function not implemented.');
}
