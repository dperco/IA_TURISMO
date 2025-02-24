import nlp from 'compromise';

interface TravelInfo {
  city: string;
  destino: string;
  checkInDate: string;
  checkOutDate: string;
  // ... otras entidades
}

export async function extractTravelInfo(message: string): Promise<TravelInfo> {
  const doc = nlp(message);

  const places = doc.places().out('array');

  // Expresión regular para fechas en formato "dd de mes" o "dd/mm/yyyy"
  const dateRegex = /(\d{1,2} de [a-zA-Záéíóúñ]+)|(\d{1,2}\/\d{1,2}\/\d{4})/g;
  const dates = message.match(dateRegex) || []; // Obtener las fechas con RegExp

  // Lógica para obtener la ciudad de origen
interface Place {
    text: string;
    index: number;
}

const city: string = places.find((place: Place) => {
    // Buscar palabras clave como "desde", "partiendo de", etc. antes del lugar
    const precedingWords: string[] = doc.text().substring(0, place.index).split(' ');
    const lastPrecedingWord: string = precedingWords[precedingWords.length - 1].toLowerCase();
    return lastPrecedingWord === 'desde' || lastPrecedingWord === 'de';
})?.text || "MAD"; // Valor por defecto si no se encuentra

  // Lógica para obtener la ciudad de destino
interface Place {
    text: string;
    index: number;
}

const destino: string = places.find((place: Place) => {
    // Buscar palabras clave como "a", "hacia", etc. antes del lugar
    const precedingWords: string[] = doc.text().substring(0, place.index).split(' ');
    const lastPrecedingWord: string = precedingWords[precedingWords.length - 1].toLowerCase();
    return lastPrecedingWord === 'a' || lastPrecedingWord === 'hacia';
})?.text || "NYC"; // Valor por defecto si no se encuentra

  // Lógica para obtener la fecha de check-in
  const checkInDate = dates[0] || "2025-02-22"; // Valor por defecto si no se encuentra

  // Lógica para obtener la fecha de check-out
  const checkOutDate = dates[1] || "2025-03-03"; // Valor por defecto si no se encuentra

  // ... lógica para extraer otras entidades ...

  return {
    city,
    destino,
    checkInDate,
    checkOutDate,
    // ... otras entidades
  };
}