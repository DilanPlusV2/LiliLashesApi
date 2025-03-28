const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Configuración CORS actualizada con tu dominio de Netlify
const corsOptions = {
    origin: [
      'https://fanciful-alpaca-0f5f67.netlify.app', // Nuevo dominio
      'http://localhost:4200' // Para desarrollo local
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  };
  
  app.use(cors(corsOptions));
  
const reservacionesRoute = require('./routes/reservas');
const clientesRoute = require('./routes/clientes');
const nominaRoute  = require('./routes/nomina');
const usuarioRoute = require('./routes/usuarios');
app.use(bodyParser.json());
app.use("/reservas",reservacionesRoute);
app.use('/usuarios', usuarioRoute);
app.use('/clientes', clientesRoute);
app.use('/nomina', nominaRoute);
module.exports = app;