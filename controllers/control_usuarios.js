const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Funcion registrarse
function signUp(req, res){
models.Usuarios.findOne({where:{identificacion:req.body.identificacion}}).then(result=>{
    if(result){
        res.status(409).json({
            message:"Usuario existente"
        });
    }else{
        bcryptjs.genSalt(12, function(err, salt){
            bcryptjs.hash(req.body.password, salt, function(err, hash){
                const user = {
                    nombres: req.body.nombres,
                    apellidos: req.body.apellidos,
                    telefono: req.body.telefono,
                    identificacion: req.body.identificacion,
                    email: req.body.email,
                    password: hash,
                    IdRol: req.body.IdRol
                }
                models.Usuarios.create(user).then(result=>{
                    res.status(201).json({
                        message:"Usuario agregado",
                        result:result
                    });
                }).catch(error =>{
                    res.status(500).json({
                        message:"Error",
                        error: error
                    });
                });
            });
        });
    }
}).catch(error=>{
    res.status(500).json({
        message:"Error",
        error: error
    });
});
}
//Función iniciar sesión
function login(req, res){
    models.Usuarios.findOne({where:{identificacion:req.body.identificacion}}).then(user =>{
        if(user == null){
            res.status(401).json({
                message:"Invalido"
            });
        }else{
            bcryptjs.compare(req.body.password, user.password, function(err, result){
                if(result){
                    const token = jwt.sign({
                        identificacion: user.identificacion,
                        IdUsuario: user.id,
                        IdRoll: user.IdRol
                    },process.env.JWT_KEY, function(err, token){
                        res.status(200).json({
                            message:"Authentication succesfull",
                            token: token,
                            IdUsuario: user.id,
                            IdRoll: user.IdRol
                        });
                    });
                }else{
                    res.status(401).json({
                        message:"Authentication failed"
                    });
                }
            });
        }
    }).catch(error=>{
        res.status(500).json({
            message:"Error",
            error: error
        });
    });
}
function Mostrar(req, res){
    models.Usuarios.findOne({where:{identificacion:req.params.identificacion}}).then(user =>{
        if(user){
            res.status(200).json([user]);
        }else{
            res.status(404).json({
                message:"Usuario inexistente"
            });
        }
    }).catch(error=>{
        res.status(500).json({
            message:"Error",
            error: error
        });
    });
}
//Obtener todos los usuarios sin importar nada
function MostrarTodos(req, res) {
    models.Usuarios.findAll().then(users => {
        if (users.length > 0) {
            res.status(200).json(users);
        } else {
            res.status(404).json({
                message: "No se encontraron usuarios"
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Error",
            error: error
        });
    });
}

// Función para cambiar la contraseña y actualizar otros datos del usuario
function cambiarContrasenaYDatos(req, res) {
    const usuarioId = req.params.IdUsuario;
    const antiguaContraseña = req.body.antiguaContraseña;
    const nuevaContraseña = req.body.nuevaContraseña;

    // Verificar la antigua contraseña
    models.Usuarios.findOne({ where: { id: usuarioId } }).then(user => {
        if (user) {
            bcryptjs.compare(antiguaContraseña, user.password, function (err, result) {
                if (result) {
                    // Antigua contraseña válida, ahora actualizamos los datos
                    bcryptjs.genSalt(12, function (err, salt) {
                        bcryptjs.hash(nuevaContraseña, salt, function (err, hash) {
                            const nuevosDatos = {
                                nombres: req.body.nuevosNombres,
                                apellidos: req.body.nuevosApellidos,
                                email: req.body.nuevoEmail,
                                identificacion: req.body.nuevaIdentificacion,
                                telefono: req.body.nuevoTelefono, // Agregado el campo telefono
                                password: hash  // Nueva contraseña hasheada
                            };

                            models.Usuarios.update(nuevosDatos, { where: { id: usuarioId } }).then(result => {
                                res.status(200).json({
                                    message: "Datos actualizados correctamente",
                                    result: result
                                });
                            }).catch(error => {
                                res.status(500).json({
                                    message: "Error al actualizar datos",
                                    error: error
                                });
                            });
                        });
                    });
                } else {
                    res.status(401).json({
                        message: "Contraseña antigua incorrecta"
                    });
                }
            });
        } else {
            res.status(404).json({
                message: "Usuario no encontrado"
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Error al consultar el usuario",
            error: error
        });
    });
}

function Mostrarf(req, res){
    models.Usuarios.findOne({where:{id:req.params.id}}).then(user =>{
        if(user){
            res.status(200).json(user);
        }else{
            res.status(404).json({
                message:"User existente"
            });
        }
    }).catch(error=>{
        res.status(500).json({
            message:"Error",
            error: error
        });
    });
}
function actualizarUsuario(req, res) {
    const id = req.params.id;
    const UsuarioActualizado = {
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        email: req.body.email,
        telefono: req.body.telefono,
        identificacion: req.body.identificacion,
        IdRol: req.body.IdRol
    };

    // Obtiene el usuario existente para no cambiar la contraseña
    models.Usuarios.findByPk(id)
        .then(usuarioExistente => {
            if (!usuarioExistente) {
                return res.status(404).json({
                    message: "Usuario no encontrado"
                });
            }

            // Asigna la contraseña existente al objeto UsuarioActualizado
            UsuarioActualizado.password = usuarioExistente.password;

            // Actualiza el usuario sin cambiar la contraseña
            models.Usuarios.update(UsuarioActualizado, { where: { id: id } })
                .then(result => {
                    res.status(200).json({
                        message: "Usuario actualizado",
                        post: UsuarioActualizado,
                        result: result
                    });
                })
                .catch(error => {
                    res.status(500).json({
                        message: "Error al actualizar el usuario",
                        error: error
                    });
                });
        })
        .catch(error => {
            res.status(500).json({
                message: "Error al buscar el usuario",
                error: error
            });
        });
}

function borrarUsuario(req, res){
    const id = req.params.id;
    models.Usuarios.destroy({where:{id:id}}).then(result =>{
        res.status(200).json({
            message:"Eliminado",
            result: result
        });
    }).catch(error=>{
        res.status(500).json({
            message: "error",
            error: error
        });
    });
}
//Este index es donde el agendador se le muestran las lashistas
function index(req, res){
    models.Usuarios.findAll({where:{IdRol:req.params.IdRol}}).then(usuarios =>{
        if(usuarios){
            res.status(200).json(usuarios);
        }else{
            res.status(404).json({
                message:"F"
            });
        }
    }).catch(error=>{
        res.status(500).json({
            message:"Error",
            error: error
        });
    });
}

module.exports = {
    signUp: signUp,
    login: login,
    Mostrar: Mostrar,
    MostrarTodos: MostrarTodos,
    actualizarUsuario: actualizarUsuario,
    borrarUsuario: borrarUsuario,
    Mostrarf: Mostrarf, 
    cambiarContrasenaYDatos: cambiarContrasenaYDatos,
    index: index
}