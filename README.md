# Chatbot de Turismo


This project is a tourism chatbot developed in TypeScript using Express.js, LangChain, LangGraph, and Vite. The chatbot interacts with various external APIs to provide information on weather, hotels, flights, and tourist activities. Additionally, it manages user conversations through a thread and memory system, utilizing specialized agents for each task.

Note: When using Amadeus, there are locations where the hotel database is not up-to-date, which may result in the hotel section being empty.

Key Features
Weather Query: Retrieves weather information using the OpenWeatherMap API.

Hotel Availability: Checks hotel availability using the Amadeus API.

Flight Search: Searches for flights using the Amadeus API.

Tourist Activities: Suggests tourist activities based on the city and budget, integrating links to Civitatis for complete options.

Conversation Management: Maintains a conversation history per user using a thread system and LangChain agents.

Specialized Agents: Utilizes LangChain agents to handle specific tasks such as flight search, hotel search, and weather queries.

Frontend with Vite: The frontend is developed with Vite, a modern tool that offers superior performance and a faster development experience.

APIs Used
OpenWeatherMap: For obtaining weather information.

Documentation: OpenWeatherMap

Amadeus: For checking hotel availability and flight searches.

Documentation: Amadeus

Civitatis: For obtaining tourist activities and tours.

Documentation: Civitatis

OpenAI: For generating natural language tools.

Documentation: OpenAI

Makcorps: For obtaining city codes.

Documentation: Makcorps

Choice of Amadeus over Makcorps
The choice of Amadeus over Makcorps is due to Amadeus offering a more complete and robust API for flight and hotel searches. Makcorps only allows about 10 test calls in its FREE version. For more extensive queries, it becomes a paid service at $350 per month for 10k free calls per month. Therefore, this example is implemented using Amadeus, which, although not updated in some locations, is more accessible for this project.

Use of LangChain and LangGraph
LangChain
LangChain is used to manage the logic of the agents and the interaction with external APIs. The agents are responsible for handling specific tasks such as flight search, hotel search, and weather queries. Each agent is designed to interact with a specific API and return structured results.

LangGraph
LangGraph is used to manage the flow of conversations and user memory. It allows maintaining a history of interactions per user and efficiently managing conversation threads.

Agents
Weather Agent: Interacts with OpenWeatherMap to obtain weather information.

Hotel Agent: Interacts with the Amadeus API to check hotel availability.

Flight Agent: Interacts with the Amadeus API to search for flights.

Activity Agent: Suggests tourist activities based on the city and budget, integrating links to Civitatis.

Architecture
The project follows a modular, layered architecture:

Routing Layer: Defines the API endpoints (index.ts and routes/chat.ts).

Controller Layer: Handles business logic and interactions with LangChain agents.

Agent Layer: Contains specialized agents that interact with external APIs (agents/WeatherAgent.ts, agents/HotelAgent.ts, etc.).

Utility Layer: Helper functions for handling data and additional logic (utils/extracTravelinfo.ts, utils/process_messages.ts).

Memory Layer: Manages conversation state through threads and LangGraph (utils/manejo_hilos.ts).

Architecture Diagram
Copy
Frontend (Vite + React)
|
v
Backend (Express.js)
|
v
LangChain (Agents)
|
v
External APIs (OpenWeatherMap, Amadeus, Civitatis)
Installation
Follow these steps to install and run the frontend and backend in your local environment.

Prerequisites
Node.js (v16 or higher)

npm (v8 or higher)

API keys for OpenWeatherMap, Amadeus, and Makcorps.

Installation Steps
Clone the repository:

sh
Copy
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
Install dependencies:

sh
Copy
npm install
Create a .env file in the root of the project and add your API keys:

env
Copy
API_KEY_OPEN_AI=your_api_key_openai
Api_weather_next=your_api_key_openweather
id_weather_day=your_api_key_id_wather
AMADEUS_CLIENT_ID=your_api_key_Amadeus
AMADEUS_CLIENT_SECRET=your_api_key_secret_Amadeus
Start the frontend and backend servers in development mode:

Open two terminals:

Terminal 1: Start the frontend server with Vite:

sh
Copy
npx vite
Terminal 2: Start the backend server with Express.js:

sh
Copy
npm i
npm run build
npm run dev
The chatbot will be available at http://localhost:3000.

Endpoints
Chatbot
Method: POST

URL: /chatboot

Description: Handles chatbot interactions with users.

Input:

json
Copy
{
  "city": "MAD",
  "destino": "BAR",
  "checkInDate": "2023-01-01",
  "checkOutDate": "2023-01-02"
}
Output:

json
Copy
"Here are some flights from BAR to MAD for 2025-02-25:\n- Departure: BAR at 2025-02-25T19:25:00, Arrival: MAD at 2025-02-26T13:45:00, Price: 564.78 EUR\n- Departure: BAR at 2025-02-25T19:25:00, Arrival: MAD at 2025-02-26T19:55:00, Price: 564.78 EUR\n- Departure: BAR at 2025-02-25T19:25:00, Arrival: MAD at 2025-02-26T13:50:00, Price: 666.12 EUR\n- Departure: BAR at 2025-02-25T19:25:00, Arrival: MAD at 2025-02-27T08:00:00, Price: 781.22 EUR\n- Departure: BAR at 2025-02-25T19:25:00, Arrival: MAD at 2025-02-27T08:00:00, Price: 781.22 EUR\n- Departure: BAR at 2025-02-25T19:25:00, Arrival: MAD at 2025-02-27T08:00:00, Price: 781.22 EUR\n- Departure: BAR at 2025-02-25T19:25:00, Arrival: MAD at 2025-02-27T08:00:00, Price: 781.22 EUR\n- ............... hotels : "[{\"chainCode\":\"AR\",\"iataCode\":\"MAD\",\"dupeId\":700025872,\"name\":\"AC BY MARRIOTT ALCALA DE HENAR\", \"hotelId\":\"ARMADALC\",\"disponibilidad\":{\"data\":[{\"type\":\"hotel-offers\",\"hotel\":{\"type\":\"hotel\", \"hotelId\":\"ARMADALC\",\"chainCode\":\"AR\",\"dupeId\":\"700025872\",\"name\":\"AC by Marriott Hotel Alcala de Henares\",\"cityCode\":\"MAD\",\"latitude\":40.5028,\"longitude\":-3.36574},\"available\":true,\"offers\":[{\"id\":\"G886SCREEZ\",\"checkInDate\":\"2025-02-25\",\"checkOutDate\":\"2025-03-04\",\"rateCode\":\"0EM\", \"rateFamilyEstimated\":{\"code\":\"PRO\",\"type\":\"P\"},\"room\":{\"type\":\"UKE\",\"typeEstimated\": {\"beds\":1,\"bedType\":\"QUEEN\"},\"description\":{\"text\":\"Stay Longer on Us, Save 10% or more as you stay longer\n1 Queen, Wireless internet, complimentary\",\"lang\":\"EN\"}},\"guests\":{\"adults\":2}, \"price\":.................. ...............................\n\nmessage : \"Your trip from BAR to MAD from 2025-02-25 to 2025-03-04 has been registered.\" returnFlights : \"Here are some flights from MAD to BAR for 2025-03-04:\n- Departure: MAD at 2025-03-04T05:50:00, Arrival: BAR at 2025-03-05T18:35:00, Price: 317.34 EUR\n- Departure: MAD at 2025-03-04T10:30:00, Arrival: BAR at 2025-03-06T18:35:00, Price: 685.63 EUR\n- Departure: MAD at 2025-03-04T10:30:00, Arrival: BAR at 2025-03-06T18:35:00, Price: 685.63 EUR\n- Departure: MAD at 2025-03-04T10:30:00, Arrival: BAR at 2025-03-06T18:35:00, Price: 685.63 EUR\n- Departure: MAD at 2025-03-04T10:30:00, Arrival: BAR at 2025-03-06T18:35:00, Price: 685.63 EUR\n- Departure: MAD at 2025-03-04T10:30:00, Arrival: BAR at 2025-03-06T18:35:00, Price: 685.63 EUR\n- ........................................... weather : clima : {location: 'Mád', temperature: 1.09, description: 'overcast clouds', humidity: 79, wind: 1.39} listaDeArticulos : \"Underwear, Socks, Personal hygiene items, Phone charger, Power adapter (if necessary), Coat, Scarf, Hat, Gloves, Closed shoes\""
Full Flow (Hotels, Flights, and Weather)
Method: POST

URL: /test-full-flow

Description: Retrieves combined information about hotels, flights, and weather for a specific city and dates.

Input:

json
Copy
{
  "city": "Paris",
  "destino": "Paris",
  "checkInDate": "2023-01-01",
  "checkOutDate": "2023-01-02"
}
Output:

json
Copy
{
  "weather": { ... },
  "flights": { ... },
  "hotels": { ... }
}
Testing
You can test the chatbot and the full flow using cURL or any other API testing tool. Below are examples of how to test the endpoints:

Test the /chatboot Endpoint
sh
Copy
curl -X POST http://localhost:3000/chatboot \
-H "Content-Type: application/json" \
-d '{"city": "Paris", "destino": "Paris", "checkInDate": "2023-01-01", "checkOutDate": "2023-01-02"}'
Test the /test-full-flow Endpoint
sh
Copy
curl -X POST http://localhost:3000/test-full-flow \
-H "Content-Type: application/json" \
-d '{"city": "Paris", "destino": "Paris", "checkInDate": "2023-01-01", "checkOutDate": "2023-01-02"}'
Contributions
If you wish to contribute to this project, follow these steps:

Fork the repository.

Create a branch for your contribution (git checkout -b feature/new-feature).

Make your changes and commit them (git commit -m "Add new feature").

Push your changes (git push origin feature/new-feature).

Open a Pull Request on GitHub.

Frontend with Vite
The frontend of this project is developed with Vite, allowing for a fast and efficient development experience. Below is the interaction flow with the chatbot from the frontend:

Data Input:

The user enters the origin, destination, start date, and return date in the chatbot interface.

This data is sent to the backend via an HTTP request.

Backend Processing:

The backend processes the request, queries the corresponding APIs (weather, flights, hotels), and generates a structured response.

Result Display:

The frontend receives the response from the backend and displays it to the user in a clear and organized manner.

Weather data, extra tips, outbound and return flights, available hotels, and a link to tourist activities on Civitatis are shown.

Choice of Amadeus over Makcorps
The choice of Amadeus over Makcorps is due to Amadeus offering a more complete and robust API for flight and hotel searches, with more detailed documentation and broader support. Additionally, Amadeus is one of the leading booking platforms in the travel industry, ensuring greater accuracy and data availability.

