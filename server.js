const http = require('http');
const app = require('./app');
import {PORT} from './config.js';


const server = http.createServer(app);

server.listen(PORT);
console.log('Server on port', PORT);