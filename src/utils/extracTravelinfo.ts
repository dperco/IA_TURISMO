import nlp from 'compromise';
import { parse, format } from 'date-fns';
import { es } from 'date-fns/locale'; // Importa el locale en español

interface TravelInfo {
  city: string; // Código de la ciudad de origen (ej: "BAR")
  destino: string; // Código de la ciudad de destino (ej: "MAD")
  checkInDate: string; // Fecha en formato YYYY-MM-DD
  checkOutDate: string; // Fecha en formato YYYY-MM-DD
}

export async function extractTravelInfo(message: string): Promise<TravelInfo> {
  const doc = nlp(message);

  // Extraer lugares (ciudades)
  const places = doc.places().out('array');

  // Expresión regular para fechas en formato "dd de mes" o "dd/mm/yyyy"
  const dateRegex = /(\d{1,2} de [a-zA-Záéíóúñ]+)|(\d{1,2}\/\d{1,2}\/\d{4})/g;
  const dates = message.match(dateRegex) || [];

  // Lógica para obtener la ciudad de origen
  const city = extractCity(message, places, ['desde', 'de']);

  // Lógica para obtener la ciudad de destino
  const destino = extractCity(message, places, ['a', 'hacia']);

  // Lógica para obtener la fecha de check-in
  const checkInDate = dates[0] ? parseDate(dates[0]) : "2023-01-01"; // Valor por defecto si no se encuentra

  // Lógica para obtener la fecha de check-out
  const checkOutDate = dates[1] ? parseDate(dates[1]) : "2023-01-02"; // Valor por defecto si no se encuentra

  return {
    city,
    destino,
    checkInDate,
    checkOutDate,
  };
}

// Función para extraer una ciudad basada en palabras clave
function extractCity(message: string, places: string[], keywords: string[]): string {
  const doc = nlp(message);

  for (const place of places) {
    // Buscar la posición de la ciudad en el mensaje
    const placeIndex = message.toLowerCase().indexOf(place.toLowerCase());

    if (placeIndex === -1) continue;

    // Obtener las palabras anteriores a la ciudad
    const precedingText = message.substring(0, placeIndex).trim();
    const precedingWords = precedingText.split(' ');

    // Verificar si alguna de las palabras clave está antes de la ciudad
    const lastPrecedingWord = precedingWords[precedingWords.length - 1].toLowerCase();
    if (keywords.includes(lastPrecedingWord)) {
      // Convertir el nombre de la ciudad a su código correspondiente
      return getCityCode(place);
    }
  }

  // Si no se encuentra ninguna ciudad, devolver un valor por defecto
  return keywords.includes('desde') ? "MAD" : "NYC"; // Códigos por defecto
}

// Función para obtener el código de una ciudad
function getCityCode(cityName: string): string {
  const cityCodes: { [key: string]: string } = {
    barcelona: 'BAR',
    madrid: 'MAD',
    valencia: 'VAL',
    sevilla: 'SEV',
    // Agrega más ciudades y códigos según sea necesario
  };

  // Convertir el nombre de la ciudad a minúsculas para evitar problemas de mayúsculas/minúsculas
  const normalizedCityName = cityName.toLowerCase();

  // Devolver el código de la ciudad si existe en el mapeo, de lo contrario devolver un código por defecto
  return cityCodes[normalizedCityName] || "UNK"; // "UNK" para ciudades desconocidas
}

// Función para convertir fechas en formato "dd de mes" o "dd/mm/yyyy" a "YYYY-MM-DD"
function parseDate(dateString: string): string {
  try {
    // Intenta parsear la fecha en formato "dd de mes"
    const date = parse(dateString, 'd \'de\' MMMM', new Date(), { locale: es });
    if (!isNaN(date.getTime())) {
      return format(date, 'yyyy-MM-dd');
    }

    // Intenta parsear la fecha en formato "dd/MM/yyyy"
    const date2 = parse(dateString, 'dd/MM/yyyy', new Date());
    if (!isNaN(date2.getTime())) {
      return format(date2, 'yyyy-MM-dd');
    }

    // Si no se puede parsear, devuelve una fecha por defecto
    return "2023-01-01";
  } catch (error) {
    console.error('Error al parsear la fecha:', error);
    return "2023-01-01";
  }
}