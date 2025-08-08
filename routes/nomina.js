const express = require('express');
const clientesController = require('../controllers/control_nomina');
const checkAuthMiddleware = require('../Middleware/check-auth');
const router = express.Router();

router.post('/calcularnomina/:idUsuario', checkAuthMiddleware.checkAuth, clientesController.calcularNominaEmpleado);
router.get('/calcularabonos/', checkAuthMiddleware.checkAuth, clientesController.calcularMontoAbonado);
router.post('/crearservicio/', checkAuthMiddleware.checkAuth, clientesController.guardarservicio);
router.put('/editarservicio/:id', checkAuthMiddleware.checkAuth, clientesController.editarServicio);
router.delete('/borrarservicio/:id', checkAuthMiddleware.checkAuth, clientesController.eliminarServicio);
router.post('/guardar', checkAuthMiddleware.checkAuth, clientesController.guardarNomina);
router.delete('/eliminar/:id', checkAuthMiddleware.checkAuth, clientesController.eliminarNomina);
router.get('/consultar', checkAuthMiddleware.checkAuth, clientesController.consultarNominas);
router.post('/detallesnomina/:idUsuario', checkAuthMiddleware.checkAuth, clientesController.detallesNomina);


module.exports = router;