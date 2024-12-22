// URL del backend
const backendUrl = 'http://localhost:3000';

// Obtener el parámetro 'id' de la URL
const urlParams = new URLSearchParams(window.location.search);
const imageId = urlParams.get('id');

// Elementos del DOM
const imageElement = document.getElementById('image');
const messageElement = document.getElementById('message');

// Función para obtener la imagen desde el backend
async function fetchImageById(id) {
  try {
    const response = await fetch(`${backendUrl}/images/${id}`);

    if (!response.ok) {
      // Si la imagen no se encuentra
      throw new Error('Imagen no encontrada');
    }

    const image = await response.json();

    // Actualizar la imagen y mensaje
    imageElement.src = image.url;
    imageElement.alt = `Imagen ID: ${id}`;
    //messageElement.textContent = `Imagen cargada con ID: ${id}`;
  } catch (error) {
    // Mostrar error en el mensaje
    imageElement.src = '';
    messageElement.textContent = error.message;
  }
}

// Verificar si se proporcionó un ID y obtener la imagen
if (imageId) {
  fetchImageById(imageId);
} else {
  messageElement.textContent = 'No se proporcionó un ID en la URL.';
}
