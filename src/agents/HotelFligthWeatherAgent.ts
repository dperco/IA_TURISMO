import { loadQAChain } from "langchain/chains";
import { RetrievalQAChain } from "langchain/chains";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import {  ChatPromptTemplate  } from "@langchain/core/prompts";
import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HumanMessage, SystemMessage, ChatMessage } from "@langchain/core/messages";
import { BaseChain, LLMChain } from "langchain/chains";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import {z} from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { DynamicStructuredTool } from "langchain/tools";

import { HotelTool } from "../tools/HotelTools.js";

import { Graph } from '@langchain/langgraph';
import path from 'path';
import dotenv from 'dotenv';

// Cargar el archivo .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// Cargar el archivo .env
dotenv.config();

const api_key_OpenAI = process.env.API_KEY_OPENAI || '';
const api_key_Weather = process.env.Api_weather_next || '';
const api_key_amadeus = process.env.AMADEUS_CLIENT_ID || '';
const api_key_secret_amadeus = process.env.AMADEUS_CLIENT_SECRET || '';




// Define el esquema de validación
const hotelSearchSchema = z.object({
  location: z.string(),
  checkInDate: z.string(),
  checkOutDate: z.string(),
});


const model = new ChatOpenAI({ temperature: 0 });


const searchHotels = new DynamicStructuredTool({
  name: "searchHotels",
  description: "Busca hoteles en una ubicación específica.",
  schema: hotelSearchSchema,
  func: async ({ location, checkInDate, checkOutDate }) => {
    const hotelTool = new HotelTool(api_key_amadeus, api_key_secret_amadeus);
    const hotels = await hotelTool._call({ location, checkInDate, checkOutDate, adults: 2 });
    return JSON.stringify(hotels);
  },
});


async function searchHotelsAPI(location: string, checkInDate: string, checkOutDate: string) {
  // Simula una llamada a una API
  return [
    { name: "Hotel A",chainCode:"AC ",iataCode:"PAR",dupeId: 700049063,hotelId:"ACPAR733"},
    { name: "Hotel B",chainCode:"AC ",iataCode:"PAR",dupeId: 700044776,hotelId:"ACPAR163"}
  ];
}


const hotelFlightAgent = await (async () => {
  return createReactAgent({
    llm: model,
    tools: [searchHotels],
  });
})();

export async function getHotelFlightInfo(userInput: any): Promise<string> {
  console.log('getHotelFlightInfo', userInput);
  const response = await hotelFlightAgent.invoke({
    messages: [{ 
      type: 'user',
       content: `Necesito buscar hoteles en ${userInput.city} con fecha de entrada ${userInput.checkInDate} y fecha de salida ${userInput.checkOutDate}.`
      },
      
      ],
  });
  const lastMessage = response.messages[response.messages.length - 1];
  const hotels = lastMessage.content;
  return JSON.stringify(hotels, null, 2); 
  //return typeof lastMessage.content === 'string' ? lastMessage.content : JSON.stringify(lastMessage.content);
}
