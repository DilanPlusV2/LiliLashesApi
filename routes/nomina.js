const express = require('express');
const clientesController = require('../controllers/control_nomina');
const checkAuthMiddleware = require('../Middleware/check-auth');
const router = express.Router();

router.get('/calcularnomina/:idUsuario', checkAuthMiddleware.checkAuth, clientesController.calcularNominaEmpleado);
router.post('/crearservicio/', checkAuthMiddleware.checkAuth, clientesController.guardarservicio);
router.put('/editarservicio/:id', checkAuthMiddleware.checkAuth, clientesController.editarServicio);
router.delete('/borrarservicio/:id', checkAuthMiddleware.checkAuth, clientesController.eliminarServicio);

module.exports = router;