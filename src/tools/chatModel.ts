// src/models/chatModel.ts
import { OpenAI } from '@langchain/openai';

import path from 'path';
import dotenv from 'dotenv';

// Cargar el archivo .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// Cargar el archivo .env
dotenv.config();


// Configurar el modelo de OpenAI
export const chatModel = new OpenAI({
  openAIApiKey: process.env.API_KEY_OPEN_AI, // Reemplaza con tu API key
  temperature: 0.7, // Controla la creatividad de las respuestas
});