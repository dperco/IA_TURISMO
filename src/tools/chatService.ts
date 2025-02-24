
// src/services/chatService.ts
import { ConversationChain } from 'langchain/chains';
import { chatModel } from '../tools/chatModel.js';
import { chatMemory } from '../tools/chatMemory.js';

// Crear una cadena de conversación
const conversationChain = new ConversationChain({
  llm: chatModel,
  memory: chatMemory,
});

// Función para procesar mensajes del usuario
export async function processMessage(userMessage: string): Promise<string> {
  try {
    // Procesar el mensaje del usuario
    const response = await conversationChain.call({ input: userMessage });

    // Retornar la respuesta generada
    return response.response;
  } catch (error) {
    console.error('Error al procesar el mensaje:', error);
    return "Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.";
  }
}