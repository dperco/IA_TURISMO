declare module 'amadeus' {
    export default class Amadeus {
      constructor(config: { clientId: string; clientSecret: string });
  
      // Ejemplo de métodos de la API
      shopping: {
        flightOffersSearch: {
          get(params: {
            originLocationCode: string;
            destinationLocationCode: string;
            departureDate: string;
            adults: number;
          }): Promise<any>;
        };
      };
    }
  }