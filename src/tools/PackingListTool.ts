



import { Tool } from "@langchain/core/tools";

export class PackingListTool extends Tool {
  name = "PackingListTool";
  description = "Genera una lista personalizada de artículos según el destino, clima y duración del viaje.";

  async _call(input: { destinationType?: string; weatherData: any; tripDuration?: number }): Promise<string> {
    try {
      const { destinationType = "general", weatherData, tripDuration = 1 } = input;

      if (!weatherData) {
        throw new Error("No se proporcionaron datos del clima.");
      }

      const { ubicación, temperatura, descripción, humedad, viento } = weatherData;

      let packingList: string[] = [];

      // Artículos básicos para cualquier viaje
      packingList.push("Ropa interior", "Calcetines", "Artículos de higiene personal", "Cargador de teléfono", "Adaptador de corriente (si es necesario)");

      // Ajustes según la duración del viaje
      if (tripDuration > 3) {
        packingList.push("Detergente para ropa", "Botiquín de primeros auxilios");
      }
      if (tripDuration > 7) {
        packingList.push("Toalla de microfibra", "Almohada de viaje");
      }

      // Ajustes según el tipo de destino y el clima
      if (destinationType.toLowerCase() === "playa") {
        packingList.push("Traje de baño");
        if (temperatura >= 30) {
          packingList.push("Protector solar alto FPS 50+", "Sombrero de ala ancha", "Ropa ligera de algodón o lino", "Chanclas");
        } else if (temperatura >= 25) {
          packingList.push("Protector solar FPS 30", "Toalla de playa", "Ropa de verano: camisetas, shorts, vestidos", "Sandalias");
        } else if (temperatura >= 20) {
          packingList.push("Sudadera ligera para las noches", "Pantalones largos", "Calzado cerrado", "Gafas de sol");
        } else {
          packingList.push("Ropa de entretiempo: pantalones largos, camisas de manga larga", "Chaqueta ligera", "Calzado cerrado");
        }
      } else if (destinationType.toLowerCase() === "montaña") {
        if (temperatura < 5) {
          packingList.push("Abrigo grueso impermeable y cortavientos", "Guantes térmicos impermeables", "Gorro de lana", "Bufanda", "Botas de nieve impermeables", "Capas térmicas");
        } else if (temperatura < 15) {
          packingList.push("Chaqueta impermeable", "Pantalones de senderismo", "Calcetines de senderismo", "Botas de montaña", "Sudadera");
        } else {
          packingList.push("Ropa de senderismo ligera", "Chaqueta ligera", "Calzado cómodo para caminar");
        }
      } else { // Destino general
        if (temperatura >= 25) {
          packingList.push("Ropa de verano: camisetas, shorts, vestidos", "Sandalias", "Gafas de sol", "Sombrero");
        } else if (temperatura >= 15) {
          packingList.push("Ropa de entretiempo: pantalones largos, camisas de manga larga", "Chaqueta ligera", "Calzado cerrado");
        } else {
          packingList.push("Abrigo", "Bufanda", "Gorro", "Guantes", "Calzado cerrado");
        }
      }

      // Ajustes por lluvia (usa 'descripción' para detectar lluvia)
      if (descripción.toLowerCase().includes("lluvia") || descripción.toLowerCase().includes("rain")) {
        packingList.push("Paraguas o impermeable");
        // Puedes ajustar la lógica para ser más específica si es necesario
      }

      return packingList.join(", "); 
    } catch (error: any) {
      return `Error: ${error.message}`;
    }
  }
}