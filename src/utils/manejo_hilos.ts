import { WeatherTool } from '../tools/WeatherTools.js';
import { FlightTool } from '../tools/FlightTools.js';
import { HotelTool } from '../tools/HotelTools.js';
//import { getTouristActivities } from './activityUtils.js';
import { generateItinerary } from './itineratyUtils.js';

// Define la interfaz TravelInfo 
interface TravelInfo {
  city: string;
  destino: string;
  checkInDate: string;
  checkOutDate: string;
}

export class MemoryManager {
  private threads: Map<string, any>;

  constructor() {
    this.threads = new Map();
  }

  createThread(userId: string): string {
    const threadId = `thread_${Date.now()}`;
    this.threads.set(threadId, { userId, messages: [] });
    return threadId;
  }

  getThread(threadId: string): any {
    return this.threads.get(threadId);
  }

  async executeThread(
    userId: string,
    threadId: string,
    message: string,
    travelInfo: TravelInfo
  ): Promise<string> {
    const thread = this.getThread(threadId);
    if (!thread) {
      throw new Error(`Hilo no encontrado: ${threadId}`);
    }

    thread.messages.push({ role: 'user', content: message });

    const response = await this.processMessage(thread.messages, travelInfo);

    thread.messages.push({ role: 'assistant', content: response });

    return response;
  }

  private async processMessage(messages: any[], travelInfo: TravelInfo): Promise<string> {
    const lastMessage = messages[messages.length - 1].content;

    if (lastMessage.includes("clima")) {
      return await this.handleWeatherRequest(lastMessage, travelInfo);
    } else if (lastMessage.includes("vuelo")) {
      return await this.handleFlightRequest(lastMessage, travelInfo);
    } else if (lastMessage.includes("hotel")) {
      return await this.handleHotelRequest(lastMessage, travelInfo);
    }else {
      if (travelInfo.city && travelInfo.destino) {
        return `Tu viaje de ${travelInfo.city} a ${travelInfo.destino} del ${travelInfo.checkInDate} al ${travelInfo.checkOutDate} ha sido registrado.`;
      } else {
        return "No entiendo tu solicitud. ¿Puedes ser más específico?";
      }
    }
  }

  private async handleWeatherRequest(message: string, travelInfo: TravelInfo): Promise<string> {
    const weatherTool = new WeatherTool();
    const weatherInfo = await weatherTool._call({
      location: travelInfo.destino,
      destino: "defaultDestino",
      checkInDate: travelInfo.checkInDate,
      checkOutDate: travelInfo.checkOutDate
    });
    return `El clima en ${travelInfo.destino} es: ${weatherInfo}`;
  }

  private async handleFlightRequest(message: string, travelInfo: TravelInfo): Promise<string> {
    const flightTool = new FlightTool('62NgglYHPAgXBZ095bGvemA0e2Acab95', '08grGUQqahfQXUNB');
    const flightInfo = await flightTool._call(`vuelos de ${travelInfo.city} a ${travelInfo.destino} para ${travelInfo.checkInDate}`); // Pasar travelInfo
    return `Opciones de vuelo de ${travelInfo.city} a ${travelInfo.destino}: ${flightInfo}`;
  }

  private async handleHotelRequest(message: string, travelInfo: TravelInfo): Promise<string> {
    const hotelTool = new HotelTool('62NgglYHPAgXBZ095bGvemA0e2Acab95', '08grGUQqahfQXUNB');
    const hotelInfo = await hotelTool._call({
      location: travelInfo.destino,
      checkInDate: travelInfo.checkInDate,
      checkOutDate: travelInfo.checkOutDate,
      adults: 2 // Add the number of adults as required
    });
    return `Opciones de hoteles en ${travelInfo.destino}: ${hotelInfo}`;
  }

 
   
}