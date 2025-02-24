
import { Tool } from "@langchain/core/tools";
import axios from 'axios';

export class HotelAvailabilityTool extends Tool {
  name = "HotelAvailabilityTool";
  description = "Verifica la disponibilidad de un hotel en Amadeus.";

   private accessToken: string;

  constructor(accessToken: string) {
    super();
    this.accessToken = accessToken; // Recibe el token de acceso
   }

  async _call(input: { hotelId: string; checkInDate: string; checkOutDate: string; adults: number; currency?: string }): Promise<any> {
    try {
      let { hotelId, checkInDate, checkOutDate, adults, currency = 'USD' } = input;

      if (!hotelId || !checkInDate || !checkOutDate || !adults) {
        throw new Error("Faltan campos requeridos: hotelId, checkInDate, checkOutDate, adults.");
      }
     hotelId="ALLON591";
      const url = `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelId}&adults=${adults}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&currency=${currency}`;

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`, // Usa el token de acceso
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error en HotelAvailabilityTool:', error);
      if (error.response?.status === 401) {
        return { error: "Token de acceso no válido o expirado. Por favor, genera un nuevo token." };
      } else if (error.response?.status === 404) {
        return { error: `No se encontró información de disponibilidad para el hotel con ID "${input.hotelId}".` };
      } else {
        return { error: `Error al obtener la información de disponibilidad. Por favor, inténtalo de nuevo más tarde.` };
      }
    }
  }
}


// solucion   con Api Makcorps
// import { Tool } from "@langchain/core/tools";
// import axios from 'axios';

// export class HotelAvailabilityTool extends Tool {
//   name = "HotelAvailabilityTool";
//   description = "Verifica la disponibilidad de hoteles en una ciudad usando la API de Makcorps.";

//   private apiKey: '67b681afd82e7f5224b32122';

//   constructor(apiKey: string) {
//     super();
//     this.apiKey = ; // Recibe la API key de Makcorps
//   }

//   async _call(input: {
//     cityId: string;
//     checkInDate: string;
//     checkOutDate: string;
//     adults: number;
//     rooms: number;
//     currency?: string;
//   }): Promise<any> {
//     try {
//       const { cityId, checkInDate, checkOutDate, adults, rooms, currency = 'USD' } = input;

//       if (!cityId || !checkInDate || !checkOutDate || !adults || !rooms) {
//         throw new Error("Faltan campos requeridos: cityId, checkInDate, checkOutDate, adults, rooms.");
//       }

//       // Construir la URL para la API de Makcorps
//       const url = `https://api.makcorps.com/city?cityid=${cityId}&pagination=0&cur=${currency}&rooms=${rooms}&adults=${adults}&checkin=${checkInDate}&checkout=${checkOutDate}&api_key=${this.apiKey}`;

//       // Hacer la solicitud a la API
//       const response = await axios.get(url);

//       // Retornar la lista de hoteles
//       return response.data;
//     } catch (error: any) {
//       console.error('Error en HotelAvailabilityTool:', error);
//       if (error.response?.status === 401) {
//         return { error: "API key no válida o expirada. Por favor, verifica tu API key." };
//       } else if (error.response?.status === 404) {
//         return { error: `No se encontró información de hoteles para la ciudad con ID "${input.cityId}".` };
//       } else {
//         return { error: `Error al obtener la información de hoteles. Por favor, inténtalo de nuevo más tarde.` };
//       }
//     }
//   }
// }