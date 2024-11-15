const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Adivina el Número',
      version: '1.0.0',
      description: 'Documentación de la API para el juego Adivina el Número'
    },
    servers: [
      {
        url: 'https://api-adivinanza.onrender.com'
      }
    ]
  },
  apis: ['./src/app/services/game-api.service.ts'], // Ruta para buscar los endpoints en el servicio
};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app, port) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Documentación disponible en http://localhost:${port}/api-docs`);
}

module.exports = swaggerDocs;
