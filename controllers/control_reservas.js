const { where, literal } = require('sequelize');
const models = require('../models');
const moment = require('moment');

function calcularFechaRetoque(fechaDeEntrada) {
    // Usamos moment.js para manipular la fecha
    const fecha = moment(fechaDeEntrada);
    // Clonamos la fecha para evitar modificar la original
    const fechaClonada = fecha.clone();
    // Agregamos 15 días a la fecha clonada para obtener la fecha de retoque
    const fechaRetoque = fechaClonada.add(14, 'days');
    // Formateamos la fecha de retoque como una cadena en el formato deseado
    const fechaRetoqueFormateada = fechaRetoque.format('YYYY-MM-DD');
    return fechaRetoqueFormateada;
}

function guardar(req, res) {
    const fechaDeEntrada = req.body.Fecha; // Obtiene la fecha de entrada
    const fechaRetoque = calcularFechaRetoque(fechaDeEntrada);

    const post = {
        Fecha: fechaDeEntrada, // Utiliza la fecha de entrada sin cambios
        Hora: req.body.Hora,
        FechaRetoque: fechaRetoque, // Asigna la fecha de retoque calculada
        MontoAbonado: req.body.MontoAbonado,
        MedioDePago: req.body.MedioDePago,
        IdUsuario: req.body.IdUsuario,
        Nota: req.body.Nota,
        Tamanio: req.body.Tamanio,
        IdServicio: req.body.IdServicio,
        IdCliente: req.body.IdCliente
    };

    models.Reservas.create(post).then(result => {
        res.status(201).json({
            message: "Reservación exitosa",
            result: result
        });
    }).catch(error => {
        res.status(403).json({
            message: "Error al crear la reserva",
            error: error
        });
    });
}

//Muestra reserva del cliente por id
function show(req, res){
    models.Reservas.findAll({where:{IdCliente:req.params.IdCliente}}).then(result =>{
        if(result){
            res.status(200).json(result);
        }else{
            res.status(500).json({
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
//Muestra reserva del empleado por id
function show1(req, res){
    models.Reservas.findAll({where:{IdUsuario:req.params.IdUsuario}}).then(result =>{
        if(result){
            res.status(200).json(result);
        }else{
            res.status(500).json({
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
async function calcularFechaRetoque1(fechaDeEntrada1, idReserva) {
    // Usamos moment.js para manipular la fecha
    const fecha = moment(fechaDeEntrada1);

    try {
        // Consultamos la fecha de entrada actual en la base de datos
        const reservaActual = await models.Reservas.findOne({
            attributes: ['Fecha'],
            where: { id: idReserva }
        });

        if (reservaActual) {
            // Convertimos la fecha de entrada actual a un objeto Moment
            const fechaActual = moment(reservaActual.Fecha);

            // Verificamos si la fecha de entrada actual es igual a la fecha de entrada proporcionada
            const esFechaActual = fechaActual.isSame(fecha, 'day');

            // Determinamos la cantidad de días a agregar
            const diasAgregados = esFechaActual ? 15 : 14;

            // Agregamos los días correspondientes a la fecha de entrada
            const fechaRetoque = fecha.clone().add(diasAgregados, 'days');

            // Formateamos la fecha de retoque como una cadena en el formato deseado
            const fechaRetoqueFormateada = fechaRetoque.format('YYYY-MM-DD');

            return fechaRetoqueFormateada;
        } else {
            throw new Error('No se encontró la reserva');
        }
    } catch (error) {
        throw error;
    }
}

// Actualizamos reserva
async function actualizar(req, res) {
    const id = req.params.id;
    const fechaDeEntrada1 = req.body.Fecha; // Obtén la fecha de entrada del cuerpo de la solicitud

    try {
        const fechaRetoque1 = await calcularFechaRetoque1(fechaDeEntrada1, id); // Calcula la nueva fecha de retoque

        const ReservacionActualizada = {
            Fecha: req.body.Fecha,
            Hora: req.body.Hora,
            FechaRetoque: fechaRetoque1, // Asigna la nueva fecha de retoque
            MontoAbonado: req.body.MontoAbonado,
            MedioDePago: req.body.MedioDePago,
            IdUsuario: req.body.IdUsuario,
            Tamanio: req.body.Tamanio,
            Nota: req.body.Nota,
            IdServicio: req.body.IdServicio,
            IdCliente: req.body.IdCliente
        };

        const result = await models.Reservas.update(ReservacionActualizada, { where: { id: id } });

        res.status(200).json({
            message: "Reserva actualizada",
            post: ReservacionActualizada,
            result: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Error",
            error: error.message // Mostrar el mensaje de error en la respuesta
        });
    }
}

function cancelar(req, res){
    const id = req.params.id;
        //Cancela la reserva
    models.Reservas.destroy({where:{id:id}}).then(result =>{
        res.status(200).json({
            message:"Reserva cancelada",
            result: result
        });
    }).catch(error=>{
        res.status(500).json({
            message: "error",
            error: error
        });
    });
}
//Muestra servicios para que el usuario escoja alguno para la reserva
function servicios(req, res){
    models.Servicios.findAll().then(result =>{
        if(result){
            res.status(200).json(result);
        }else{
            res.status(500).json({
                message: "Error obteniendo servicios"
            });
        }
    }).catch(error =>{
        res.status(500).json({
            message: "error",
            error: error
        });
    });
}
function obtenerFactura(req, res) {
    const reservaId = req.params.ReservaId;
    const usuarioId = req.body.IdUsuario;
    const factura = { IdUsuario: usuarioId };

    models.Reservas.findByPk(reservaId).then((reserva) => {
        if (reserva) {
            factura.Fecha = reserva.Fecha;
            factura.Hora = reserva.Hora;
            factura.FechaRetoque = reserva.FechaRetoque;
            factura.MontoAbonado = reserva.MontoAbonado;
            factura.Nota = reserva.Nota;

            // Calcula el MontoRestante

            models.Clientes.findByPk(reserva.IdCliente).then((cliente) => {
                if (cliente) {
                    factura.NombreCliente = cliente.nombres;
                    factura.ApellidoCliente = cliente.apellidos;

                    models.Servicios.findByPk(reserva.IdServicio).then((servicio) => {
                        if (servicio) {
                            factura.NombreServicio = servicio.NombreServicio;
                            factura.CostoServicio = servicio.CostoServicio;
                            factura.MontoRestante = servicio.CostoServicio - reserva.MontoAbonado;
                            models.Usuarios.findByPk(usuarioId).then((usuario) => {
                                if (usuario) {
                                    factura.NombreUsuario = usuario.nombres;
                                    factura.ApellidoUsuario = usuario.apellidos;
                                    // Devuelve la factura como un objeto JSON
                                    res.status(200).json(factura);
                                } else {
                                    res.status(500).json({
                                        message: "Usuario no encontrado"
                                    });
                                }
                            }).catch((error) => {
                                res.status(500).json({
                                    message: "Error al consultar el usuario",
                                    error: error
                                });
                            });
                        } else {
                            res.status(500).json({
                                message: "Servicio no encontrado"
                            });
                        }
                    }).catch((error) => {
                        res.status(500).json({
                            message: "Error al consultar el servicio",
                            error: error
                        });
                    });
                } else {
                    res.status(500).json({
                        message: "Cliente no encontrado"
                    });
                }
            }).catch((error) => {
                res.status(500).json({
                    message: "Error al consultar el cliente",
                    error: error
                });
            });
        } else {
            res.status(500).json({
                message: "Reserva no encontrada"
            });
        }
    }).catch((error) => {
        res.status(500).json({
            message: "Error al consultar la reserva",
            error: error
        });
    });
}

module.exports = {
    show: show,
    show1: show1,
    guardar: guardar,
    actualizar: actualizar,
    cancelar: cancelar,
    servicios: servicios,
    obtenerFactura: obtenerFactura
}