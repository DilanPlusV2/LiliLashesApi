// Importa moment.js para manipular las fechas
const moment = require('moment-timezone'); // Asegúrate de utilizar moment-timezone
const { where } = require('sequelize');
const models = require('../models');
const { Op } = require('sequelize');

// Configura Moment.js para la zona horaria de Troncolombia
moment.tz.setDefault('America/Bogota');

// Función para calcular la nómina del empleado
function calcularNomina(idUsuario, fechaInicio, fechaFin) {
    // Obtén las reservas del usuario para el rango de fechas proporcionado
    return models.Reservas.findAll({
        attributes: ['MontoAbonado'],
        where: {
            IdUsuario: idUsuario,
            Fecha: {
                [models.Sequelize.Op.between]: [fechaInicio, fechaFin]
            }
        }
    }).then(reservas => {
        // Suma los MontoAbonado de las reservas
        const totalMontoAbonado = reservas.reduce((total, reserva) => total + reserva.MontoAbonado, 0);

        // Calcula la mitad del total (la empresa se queda con el 50%)
        const montoEmpleado = totalMontoAbonado * 0.5;

        // Devuelve el resultado
        return montoEmpleado;
    }).catch(error => {
        // Manejo de errores
        console.error("Error al calcular la nómina:", error);
        throw error;
    });
}

// Endpoint para calcular la nómina
function calcularNominaEmpleado(req, res) {
    const idUsuario = req.params.idUsuario;

    // Obtiene las fechas actuales y de hace 15 días
    const fechaFin = moment().format('YYYY-MM-DD');
    const fechaInicio = moment().subtract(15, 'days').format('YYYY-MM-DD');

    // Calcula la nómina llamando a la función
    calcularNomina(idUsuario, fechaInicio, fechaFin).then(montoEmpleado => {
        res.status(200).json({
            message: "Cálculo de nómina exitoso",
            montoEmpleado: montoEmpleado
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error al calcular la nómina",
            error: error
        });
    });
}

function guardarservicio(req, res) {

    const post = {
        NombreServicio: req.body.NombreServicio, // Utiliza la fecha de entrada sin cambios
        CostoServicio: req.body.CostoServicio
    };
    models.Servicios.create(post).then(result => {
        res.status(201).json({
            message: "Creación del servicio exitosa",
            result: result
        });
    }).catch(error => {
        res.status(403).json({
            message: "Error al crear el servicio",
            error: error
        });
    });
}

function editarServicio(req, res) {
    const idServicio = req.params.id;
    const updatedData = {
        NombreServicio: req.body.NombreServicio,
        CostoServicio: req.body.CostoServicio
        // Agrega aquí otros campos que puedas actualizar según tus requerimientos
    };

    models.Servicios.update(updatedData, {
        where: {
            id: idServicio
        }
    }).then(result => {
        if (result[0] === 1) {
            res.status(200).json({
                message: "Actualización del servicio exitosa",
                result: result
            });
        } else {
            res.status(404).json({
                message: "Servicio no encontrado",
                result: result
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Error al actualizar el servicio",
            error: error
        });
    });
}

function eliminarServicio(req, res) {
    const idServicio = req.params.id;

    models.Servicios.destroy({
        where: {
            id: idServicio
        }
    }).then(result => {
        if (result === 1) {
            res.status(200).json({
                message: "Eliminación del servicio exitosa",
                result: result
            });
        } else {
            res.status(404).json({
                message: "Servicio no encontrado",
                result: result
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Error al eliminar el servicio",
            error: error
        });
    });
}

// Agrega la nueva ruta al servidor
module.exports = {
    calcularNominaEmpleado: calcularNominaEmpleado,
    guardarservicio: guardarservicio,
    editarServicio: editarServicio,
    eliminarServicio: eliminarServicio
};
