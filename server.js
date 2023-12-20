const http = require('http');
const app = require('./app');
const PORT = require('./config.js');


const server = http.createServer(app);

server.listen(PORT);
console.log('Server on port', PORT);