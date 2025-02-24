import { extractTravelInfo } from './tools/entityExtractor.js'; // Importa la función

// Elementos del DOM
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const actividadesLink = document.getElementById('actividades-link');
// Estado del chatbot
let currentStep = 'welcome'; // Estado inicial
let travelInfo = {
  city: '',
  destino: '',
  checkInDate: '',
  checkOutDate: ''
};

// Función para agregar un mensaje al chat
function addMessage(message, isUser) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
  messageElement.textContent = message;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Desplazar al final
}

// Función para actualizar el placeholder del input
function updatePlaceholder(step) {
  switch (step) {
    case 'origin':
      userInput.placeholder = 'Ingresa la ciudad de origen en formato de 3 dígitos (ej: Madrid = MAD)';
      break;
    case 'destination':
      userInput.placeholder = 'Ingresa la ciudad de destino en formato de 3 dígitos (ej: Barcelona = BAR)';
      break;
    case 'checkInDate':
      userInput.placeholder = 'Ingresa la fecha de salida (Formato: YYYY-MM-DD)';
      break;
    case 'checkOutDate':
      userInput.placeholder = 'Ingresa la fecha de regreso (Formato: YYYY-MM-DD)';
      break;
    default:
      userInput.placeholder = 'Escribe tu mensaje...';
  }
}

// Función para enviar un mensaje al backend
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(`Tú: ${message}`, true);
  userInput.value = ''; // Limpiar el input

  try {
    if (currentStep === 'welcome') {
      addMessage(`Chatbot: ¿Desde qué ciudad quieres partir? (Escribe el código de la ciudad en 3 letras, ej: MAD)`, false);
      currentStep = 'origin';
      updatePlaceholder('origin'); // Actualizar placeholder
    } else if (currentStep === 'origin') {
      travelInfo.city = message.toUpperCase();
      addMessage(`Chatbot: ¿Cuál es tu ciudad de destino? (Escribe el código de la ciudad en 3 letras, ej: BAR)`, false);
      currentStep = 'destination';
      updatePlaceholder('destination'); // Actualizar placeholder
    } else if (currentStep === 'destination') {
      travelInfo.destino = message.toUpperCase();
      addMessage(`Chatbot: ¿Cuál es la fecha de salida? (Formato: YYYY-MM-DD)`, false);
      currentStep = 'checkInDate';
      updatePlaceholder('checkInDate'); // Actualizar placeholder
    } else if (currentStep === 'checkInDate') {
      travelInfo.checkInDate = message;
      addMessage(`Chatbot: ¿Cuál es la fecha de regreso? (Formato: YYYY-MM-DD)`, false);
      currentStep = 'checkOutDate';
      updatePlaceholder('checkOutDate'); // Actualizar placeholder
    } else if (currentStep === 'checkOutDate') {
      travelInfo.checkOutDate = message;

      // Enviar el mensaje al backend con la información del viaje
      const response = await fetch('/api/chatboot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user123', ...travelInfo }),
      });

      if (!response.ok) {
        throw new Error('Error al obtener la respuesta del servidor');
      }

      // Parsear la respuesta JSON
      const data = await response.json();
      console.log('Respuesta del backend:', data);

      // Mostrar la respuesta del chatbot
      addMessage(`Chatbot: ${data.message}`, false);

      // Mostrar los datos adicionales (clima, vuelos, hoteles, itinerario)
      mostrarDatosAdicionales(data);

       // Generar el enlace a Civitatis
       const civitatisLink = `https://www.civitatis.com/ar/${travelInfo.destino}/`;
       actividadesLink.href = civitatisLink;
       actividadesLink.textContent = `Ver actividades en ${travelInfo.destino}`;

      // Reiniciar el estado del chatbot
      currentStep = 'welcome';
      travelInfo = {
        city: '',
        destino: '',
        checkInDate: '',
        checkOutDate: ''
      };
      updatePlaceholder('welcome'); // Restaurar placeholder inicial
    }
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
    addMessage('Lo siento, hubo un error. Por favor, inténtalo de nuevo.', false);
  }
}


// Función para mostrar los hoteles
function mostrarHoteles(hotelesDiv, hotels) {
  try {
    // Parsear el string JSON a un array de objetos
    const hotelesData = JSON.parse(hotels);

    if (Array.isArray(hotelesData) && hotelesData.length > 0) {
      hotelesDiv.innerHTML = `
        <h2>Hoteles Disponibles</h2>
        ${hotelesData.map((hotel, index) => `
          <div class="hotel-item">
            <p><strong>Hotel ${index + 1}:</strong> ${hotel.name || 'Nombre no disponible'}</p>
            <p><strong>Precio:</strong> ${hotel.disponibilidad?.data[0]?.offers[0]?.price?.total || 'Precio no disponible'} ${hotel.disponibilidad?.data[0]?.offers[0]?.price?.currency || ''}</p>
            <p><strong>Disponibilidad:</strong> ${hotel.disponibilidad?.data[0]?.available ? 'Disponible' : 'No disponible'}</p>
          </div>
        `).join('')}
      `;
    } else {
      hotelesDiv.innerHTML = `<h2>Hoteles</h2><p>No hay información disponible.</p>`;
    }
  } catch (error) {
    console.error('Error al parsear hoteles:', error);
    hotelesDiv.innerHTML = `<h2>Hoteles</h2><p>Error al cargar la información de hoteles.</p>`;
  }
}


// Función para mostrar los datos adicionales
// Función para mostrar los datos adicionales
function mostrarDatosAdicionales(data) {
  const climaDiv = document.getElementById('clima');
  const vuelosDiv = document.getElementById('vuelos');
  const vuelosRegresoDiv = document.getElementById('vuelos-regreso');
  const hotelesDiv = document.getElementById('hoteles');

  // Mostrar el clima
  if (data.weather && data.weather.clima) {
    const ubicacion = data.weather.clima.ubicación || 'Ubicación no disponible';
    const temperatura = data.weather.clima.temperatura || 'N/A';
    const descripcion = data.weather.listaDeArticulos || 'Descripción no disponible';

    climaDiv.innerHTML = `
      <h2>Clima</h2>
      <p>Ubicación: ${ubicacion}</p>
      <p>Temperatura: ${temperatura} °C</p>
      <p>Consejos: ${descripcion}</p>
    `;
  } else {
    climaDiv.innerHTML = `<h2>Clima</h2><p>No hay información disponible.</p>`;
  }

  // Mostrar los vuelos de ida y regreso
  if (data.flights) {
    const vuelosIda = data.flights.split('\n').slice(0, 10).join('<br>'); // Mostrar solo 10 vuelos de ida
    const vuelosRegreso = data.returnFlights.split('\n').slice(0, 10).join('<br>'); // Mostrar solo 10 vuelos de regreso

    vuelosDiv.innerHTML = `
      <h2>Vuelos de Ida</h2>
      <p>${vuelosIda}</p>
    `;

    vuelosRegresoDiv.innerHTML = `
      <h2>Vuelos de Regreso</h2>
      <p>${vuelosRegreso}</p>
    `;
  } else {
    vuelosDiv.innerHTML = `<h2>Vuelos de Ida</h2><p>No hay información disponible.</p>`;
    vuelosRegresoDiv.innerHTML = `<h2>Vuelos de Regreso</h2><p>No hay información disponible.</p>`;
  }

  // Mostrar los hoteles
  if (data.hotels) {
    mostrarHoteles(hotelesDiv, data.hotels);
  } else {
    hotelesDiv.innerHTML = `<h2>Hoteles</h2><p>No hay información disponible.</p>`;
  }
}
// Evento para enviar mensaje al hacer clic en el botón
sendBtn.addEventListener('click', sendMessage);

// Evento para enviar mensaje al presionar Enter
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Inicializar el placeholder
updatePlaceholder('welcome');




