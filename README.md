# Chatbot de Turismo

video ejemplo : https://drive.google.com/file/d/1lp0HJaODN1sKDiD8_uS9nj7GQVHIePji/view?usp=sharing

Este proyecto es  un chatbot de turismo desarrollado en TypeScript utilizando Express.js, LangChain y LangGraph y Vite.
 El chatbot interactúa con varias APIs externas para proporcionar información sobre el clima, hoteles, vuelos y
  actividades turísticas. Además, gestiona conversaciones con los usuarios mediante un sistema de hilos y memoria,
   utilizando agentes especializados para cada tarea.

   Observacion:  al utilizar Amadeus , hay localidades dond eno esta actualizada la base de datos de Holteles ,
   eso les  puede dar la seccion hoteles sin informacion

## Características Principales

-Consulta de clima: Obtiene información meteorológica utilizando la API de OpenWeatherMap.

-Disponibilidad de hoteles: Consulta la disponibilidad de hoteles utilizando la API de Amadeus.

-Búsqueda de vuelos: Busca vuelos utilizando la API de Amadeus.

-Actividades turísticas: Sugiere actividades turísticas basadas en la ciudad y el presupuesto, integrando enlaces
 a Civitatis para obtener opciones completas.

-Gestión de conversaciones: Mantiene un historial de conversaciones por usuario utilizando un sistema de hilos y
agentes de LangChain.

-Agentes especializados: Utiliza agentes de LangChain para manejar tareas específicas, como la búsqueda de vuelos,
hoteles y clima

-Frontend con Vite: El frontend está desarrollado con Vite, una herramienta moderna que ofrece un rendimiento
superior y una experiencia de desarrollo más rápida.

## APIs Utilizadas

OpenWeatherMap: Para obtener información meteorológica.

Documentación de OpenWeatherMap: [https://www.weatherapi.com/my/#](https://www.weatherapi.com/my/#)

Amadeus: Para consultar disponibilidad de hoteles y vuelos.

[Documentación de Amadeus](https://developers.amadeus.com/my-apps/PERCOVIAJERO?userId=danielperco4@gmail.com)

Civitatis: Para obtener actividades turísticas y tours.

Documentación de Civitatis: [https://www.civitatis.com/ar](https://www.civitatis.com/ar)

Open_AI: para generar herramientas de lenguaje natural.

Documentación de Open_AI: [https://platform.openai.com/docs/overview](https://platform.openai.com/docs/overview)

Makcorps: Para obtener códigos de ciudad.

Documentación de Makcorps: [https://docs.makcorps.com/](https://docs.makcorps.com/)
#############################################################################################################
Elección de Amadeus sobre Makcorps
La elección de Amadeus sobre Makcorps , se debe a que  Markcorps , ofrece una API más completa y robusta para
la búsqueda de vuelos y hoteles, solo permite unas 10 llamadas de pruebas en su version FREE .
Para mayores consultas  ya es paga , u$s 350 x mes 10k libres x mes.
Asi que este ejemplo,  se realiza con Amadeus ,que no tiene actualizada la lista de hoteles en algunas localidades.

#############################################################################################################

## Uso de LangChain y LangGraph

-LangChain

LangChain se utiliza para gestionar la lógica de los agentes y la interacción con las APIs externas.
 Los agentes son responsables de manejar tareas específicas, como la búsqueda de vuelos, hoteles y clima.
 Cada agente está diseñado para interactuar con una API específica y devolver resultados estructurados.

-LangGraph

LangGraph se utiliza para gestionar el flujo de conversaciones y la memoria de los usuarios. Permite mantener
 un historial de interacciones por usuario y gestionar hilos de conversación de manera eficiente.

-Agentes

Agente de Clima: Interactúa con OpenWeatherMap para obtener información meteorológica.

Agente de Hoteles: Interactúa con la API de Amadeus para consultar disponibilidad de hoteles.

Agente de Vuelos: Interactúa con la API de Amadeus para buscar vuelos.

Agente de Actividades: Sugiere actividades turísticas basadas en la ciudad y el presupuesto, integrando enlaces
 a Civitatis.

## Arquitectura

El proyecto sigue una arquitectura modular basada en capas:

Capa de Rutas: Define los endpoints de la API (index.ts y routes/chat.ts).

Capa de Controladores: Maneja la lógica de negocio y las interacciones con los agentes de LangChain.

Capa de Agentes: Contiene los agentes especializados que interactúan con las APIs externas
 (agents/WeatherAgent.ts, agents/HotelAgent.ts, etc.).

Capa de Utilidades: Funciones auxiliares para manejar datos y lógica adicional
(utils/extracTravelinfo.ts, utils/process_messages.ts).

Capa de Memoria: Gestiona el estado de las conversaciones mediante hilos y LangGraph
(utils/manejo_hilos.ts).

Diagrama de Arquitectura
plaintext
Copy
Frontend (Vite + React)
       |
       v
Backend (Express.js)
       |
       v
LangChain (Agentes)
       |
       v

## APIs Externas (OpenWeatherMap, Amadeus, Civitatis)

-Instalación

Sigue estos pasos para instalar y ejecutar el frontend y backend en tu entorno local.

-Requisitos Previos

Node.js (v16 o superior)

npm (v8 o superior)

Claves de API para OpenWeatherMap, Amadeus, y Makcorps.

## Pasos para la Instalación

Clona el repositorio:

git clone [https://github.com/tu-usuario/tu-repositorio.git](https://github.com/tu-usuario/tu-repositorio.git)
cd tu-repositorio

-Instala las dependencias:

npm install

-Crea un archivo .env en la raíz del proyecto y agrega tus claves de API:

.env

API_KEY_OPEN_AI= your_api_key_openai
Api_weather_next= your_api_key_openweather
id_weather_day= your_api_key_id_wather
AMADEUS_CLIENT_ID = your_api_key_Amadeus
AMADEUS_CLIENT_SECRET=your_api_key_secret_Amadeus

-Inicia los servidores de frontend y backend  en modo desarrollo:

abrimos 2 terminales

1. Terminal 1: Inicia el servidor de frontend con Vite:
   npx vite

2. Terminal 2: Inicia el servidor de backend con Express.js:
    npm i
    npm run build
    npm run dev

El chatboot estará disponible en <http://localhost:3000>.

## Endpoints

1. Chatbot
Método: POST

URL: /chatboot

Descripción: Maneja las interacciones del chatbot con los usuarios.

Input:{
  "city": "MAD",
  "destino": "BAR",
  "checkInDate": "2023-01-01",
  "checkOutDate": "2023-01-02"
}
Output:
   "Aquí tienes algunos vuelos de BAR a MAD para 2025-02-25:\n-
   Salida: BAR a las 2025-02-25T19:25:00, Llegada: MAD a las 2025-02-26T13:45:00, Precio: 564.78 EUR\n-
   Salida: BAR a las 2025-02-25T19:25:00, Llegada: MAD a las 2025-02-26T19:55:00, Precio: 564.78 EUR\n-
   Salida: BAR a las 2025-02-25T19:25:00, Llegada: MAD a las 2025-02-26T13:50:00, Precio: 666.12 EUR\n-
   Salida: BAR a las 2025-02-25T19:25:00, Llegada: MAD a las 2025-02-27T08:00:00, Precio: 781.22 EUR\n-
   Salida: BAR a las 2025-02-25T19:25:00, Llegada: MAD a las 2025-02-27T08:00:00, Precio: 781.22 EUR\n-
   Salida: BAR a las 2025-02-25T19:25:00, Llegada: MAD a las 2025-02-27T08:00:00, Precio: 781.22 EUR\n-
   Salida: BAR a las 2025-02-25T19:25:00, Llegada: MAD a las 2025-02-27T08:00:00, Precio: 781.22 EUR\n-
    ...............
hotels
:
"[{\"chainCode\":\"AR\",\"iataCode\":\"MAD\",\"dupeId\":700025872,\"name\":\"AC BY MARRIOTT ALCALA DE HENAR\",
\"hotelId\":\"ARMADALC\",\"disponibilidad\":{\"data\":[{\"type\":\"hotel-offers\",\"hotel\":{\"type\":\"hotel\",
\"hotelId\":\"ARMADALC\",\"chainCode\":\"AR\",\"dupeId\":\"700025872\",\"name\":\"AC by Marriott Hotel Alcala de
 Henares\",\"cityCode\":\"MAD\",\"latitude\":40.5028,\"longitude\":-3.36574},\"available\":true,\"offers\":[{\"id\
 ":\"G886SCREEZ\",\"checkInDate\":\"2025-02-25\",\"checkOutDate\":\"2025-03-04\",\"rateCode\":\"0EM\",
 \"rateFamilyEstimated\":{\"code\":\"PRO\",\"type\":\"P\"},\"room\":{\"type\":\"UKE\",\"typeEstimated\":
 {\"beds\":1,\"bedType\":\"QUEEN\"},\"description\":{\"text\":\"Stay Longer on Us, Save 10% or more as you
  stay longer\\n1 Queen, Wireless internet, complimentary\",\"lang\":\"EN\"}},\"guests\":{\"adults\":2},
  \"price\":..................
  ...............................

message
:
"Tu viaje de BAR a MAD del 2025-02-25 al 2025-03-04 ha sido registrado."
returnFlights
:
"Aquí tienes algunos vuelos de MAD a BAR para 2025-03-04:\n-
Salida: MAD a las 2025-03-04T05:50:00, Llegada: BAR a las 2025-03-05T18:35:00, Precio: 317.34 EUR\n-
Salida: MAD a las 2025-03-04T10:30:00, Llegada: BAR a las 2025-03-06T18:35:00, Precio: 685.63 EUR\n-
Salida: MAD a las 2025-03-04T10:30:00, Llegada: BAR a las 2025-03-06T18:35:00, Precio: 685.63 EUR\n-
Salida: MAD a las 2025-03-04T10:30:00, Llegada: BAR a las 2025-03-06T18:35:00, Precio: 685.63 EUR\n-
Salida: MAD a las 2025-03-04T10:30:00, Llegada: BAR a las 2025-03-06T18:35:00, Precio: 685.63 EUR\n-
Salida: MAD a las 2025-03-04T10:30:00, Llegada: BAR a las 2025-03-06T18:35:00, Precio: 685.63 EUR\n-
...........................................
weather
:
clima
:
{ubicación: 'Mád', temperatura: 1.09, descripción: 'overcast clouds', humedad: 79, viento: 1.39}
listaDeArticulos
:
"Ropa interior, Calcetines, Artículos de higiene personal, Cargador de teléfono, Adaptador de corriente
(si es necesario), Abrigo, Bufanda, Gorro, Guantes, Calzado cerrado"

1. Flujo Completo (Hoteles, Vuelos y Clima)
Método: POST

URL: /test-full-flow

Descripción: Obtiene información combinada sobre hoteles, vuelos y clima para una ciudad y fechas específicas.

Input:

{
  "city": "Paris",
  "destino": "Paris",
  "checkInDate": "2023-01-01",
  "checkOutDate": "2023-01-02"
}
Output:

{
  "weather": { ... },
  "flights": { ... },
  "hotels": { ... }
}

Pruebas
Puedes probar el chatbot y el flujo completo utilizando cURL o cualquier otra herramienta de prueba de API.
A continuación, se muestran ejemplos de cómo probar los endpoints:

curl -X POST <http://localhost:3000/chatboot> \
-H "Content-Type: application/json" \
-d '{"city": "Paris", "destino": "Paris", "checkInDate": "2023-01-01", "checkOutDate": "2023-01-02"}'

Prueba del Endpoint /test-full-flow

curl -X POST <http://localhost:3000/test-full-flow> \

-H "Content-Type: application/json" \
-d '{"city": "Paris", "destino": "Paris", "checkInDate": "2023-01-01", "checkOutDate": "2023-01-02"}'

Contribuciones
Si deseas contribuir a este proyecto, sigue estos pasos:

Haz un fork del repositorio.

Crea una rama para tu contribución (git checkout -b feature/nueva-funcionalidad).

Realiza tus cambios y haz commit (git commit -m "Añade nueva funcionalidad").

Sube tus cambios (git push origin feature/nueva-funcionalidad).

Abre un Pull Request en GitHub.

Frontend con Vite
El frontend de este proyecto está desarrollado con Vite, lo que permite una experiencia de desarrollo rápida y
 eficiente. A continuación, se describe el flujo de interacción con el chatbot desde el frontend:

Ingreso de Datos:

El usuario ingresa el origen, destino, fecha de inicio y fecha de regreso en la interfaz del chatbot.

Estos datos se envían al backend a través de una solicitud HTTP.

Procesamiento en el Backend:

El backend procesa la solicitud, consulta las APIs correspondientes (clima, vuelos, hoteles) y genera una respuesta
 estructurada.

Visualización de Resultados:

El frontend recibe la respuesta del backend y la muestra al usuario de manera clara y organizada.

Se muestran los datos del clima, consejos extras, vuelos de ida y vuelta, hoteles disponibles y un enlace a
 actividades turísticas en Civitatis.

Elección de Amadeus sobre Makcorps
La elección de Amadeus sobre Makcorps se debe a que Amadeus ofrece una API más completa y robusta para
la búsqueda de vuelos y hoteles, con una documentación más detallada y un soporte más amplio. Además,
Amadeus es una de las principales plataformas de reservas en la industria de viajes, lo que garantiza
una mayor precisión y disponibilidad de datos.
