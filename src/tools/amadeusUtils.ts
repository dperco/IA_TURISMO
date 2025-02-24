import axios from 'axios';
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

const amadeusApiKey = process.env.AMADEUS_CLIENT_ID;
const amadeusApiSecret = process.env.AMADEUS_API_SECRET;


export async function getAmadeusAccessToken(amadeusApiKey:string, amadeusApiSecret:string): Promise<string> {
  try {
    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      'grant_type=client_credentials&client_id=' + amadeusApiKey + '&client_secret=' + amadeusApiSecret,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error al obtener el token de acceso de Amadeus:', error);
    throw error; 
  }
}