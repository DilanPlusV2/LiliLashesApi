const express = require('express');
const usuarioController = require ('../controllers/control_usuarios');
const checkAuthMiddleware = require('../Middleware/check-auth');
const router = express.Router();

router.get('/ver/:IdRol', checkAuthMiddleware.checkAuth, usuarioController.index);
router.post('/sign-up', usuarioController.signUp);
router.post('/login', usuarioController.login);
router.post('/view/:Email', checkAuthMiddleware.checkAuth, usuarioController.Mostrar);
router.get('/mostrarf/:id', checkAuthMiddleware.checkAuth, usuarioController.Mostrarf);
router.get('/mostrartodo/', checkAuthMiddleware.checkAuth, usuarioController.MostrarTodos);
router.put('/actualizarusuario/:id', checkAuthMiddleware.checkAuth, usuarioController.actualizarUsuario);
router.put('/update/:IdUsuario', checkAuthMiddleware.checkAuth, usuarioController.cambiarContrasenaYDatos);
router.delete('/delete/:id', checkAuthMiddleware.checkAuth, usuarioController.borrarUsuario);

module.exports = router;