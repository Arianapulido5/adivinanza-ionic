const express = require('express');
const swaggerDocs = require('./swagger');
const app = express();
const PORT = process.env.PORT || 3000;

swaggerDocs(app, PORT);

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
