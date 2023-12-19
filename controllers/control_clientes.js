const { where } = require('sequelize');
const models = require('../models');
const { Op } = require('sequelize');
// Función registrar cliente
function guardar(req, res) {
    const post = {
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        instagram: req.body.instagram,
        IdUsuario: req.body.IdUsuario
    };
    models.Clientes.findOne({where:{instagram:req.body.instagram, IdUsuario:req.body.IdUsuario}}).then(result=>{
        if(result){
            res.status(409).json({
                message:"Cliente existente"
            });
        }else{
            models.Clientes.create(post).then(result => {
                res.status(201).json({
                    message: "Cliente registrado exitosamente",
                    result: result
                });
            }).catch(error => {
                res.status(403).json({
                    message: "Error al registrar nuevo cliente",
                    error: error
                });
            });
        }
    }).catch(error=>{
        res.status(500).json({
            message:"Error conexión",
            error: error
        });
    });
}
function show(req, res){
    models.Clientes.findAll({where:{IdUsuario:req.params.IdUsuario}}).then(result =>{
        if(result){
            res.status(200).json(result);
        }else{
            res.status(404).json({
                message: "No encontrado"
            });
        }
    }).catch(error =>{
        res.status(500).json({
            message: "error",
            error: error
        });
    });
}
//Actualizamos cliente
function actualizar(req, res){
    const id = req.params.id;
    const ClienteActualizado = {
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        instagram: req.body.instagram
    }
    const Iduser = req.body.IdUsuario;
    models.Clientes.update(ClienteActualizado, {where:{id:id, IdUsuario: Iduser}}).then(result=>{
        res.status(200).json({
            message:"Reserva actualizada",
            post: ClienteActualizado,
            result:result
        });
    }).catch(error=>{
        res.status(500).json({
            message: "error",
            error: error
        });  
    });
}
function eliminar(req, res){
    const id = req.params.id;
       
    models.Clientes.destroy({where:{id:id}}).then(result =>{
        res.status(200).json({
            message:"Cliente eliminado",
            result: result
        });
    }).catch(error=>{
        res.status(500).json({
            message: "error",
            error: error
        });
    });
}
function buscar(req, res) {
    const términoBusqueda = req.params.nombres.trim(); // Elimina espacios en blanco alrededor del término de búsqueda

    models.Clientes.findAll({
        where: {
            [Op.or]: [
                {
                    nombres: {
                        [Op.like]: `%${términoBusqueda}%`,
                    },
                },
                {
                    apellidos: {
                        [Op.like]: `%${términoBusqueda}%`,
                    },
                },
                {
                    instagram: {
                        [Op.like]: `%${términoBusqueda}%`,
                    },
                },
            ],
        },
    })
        .then((result) => {
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({
                    message: "No encontrado",
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                message: "Error",
                error: error,
            });
        });
}


module.exports = {
    buscar: buscar,
    actualizar: actualizar,
    guardar: guardar,
    show: show,
    eliminar: eliminar
}