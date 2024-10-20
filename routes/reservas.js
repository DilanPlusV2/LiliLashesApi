const express = require('express');
const reservacionController = require('../controllers/control_reservas');
const router = express.Router();
const checkAuthMiddleware = require('../Middleware/check-auth');
router.post("/", checkAuthMiddleware.checkAuth, reservacionController.guardar);
router.put("/:id", checkAuthMiddleware.checkAuth, reservacionController.actualizar);
router.delete("/:id", checkAuthMiddleware.checkAuth, reservacionController.cancelar);
router.get("/show/:IdCliente", checkAuthMiddleware.checkAuth, reservacionController.show);
router.get("/show1/:IdUsuario", checkAuthMiddleware.checkAuth, reservacionController.show1);
router.get("/servicios/", checkAuthMiddleware.checkAuth, reservacionController.servicios);
router.post("/factura/:ReservaId", checkAuthMiddleware.checkAuth, reservacionController.obtenerFactura);
router.get("/:IdUsuario", reservacionController.mostrarCitasAgrupadasPorLashista);
module.exports = router;